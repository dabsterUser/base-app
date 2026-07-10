import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Plus,
  Trash2,
  Type,
  FileText,
  CheckSquare,
  List,
  Save,
  Wand2,
  GripVertical,
  ChevronDown,
  Layers
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'multiselect';
  label: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

const SortableItem = ({ field, onRemove, onUpdate }: {
  field: FormField,
  onRemove: (id: string) => void,
  onUpdate: (id: string, updates: Partial<FormField>) => void
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div ref={setNodeRef} style={style} className="group relative border rounded-lg p-4 bg-slate-50/50 hover:bg-white transition-colors border-dashed border-slate-300">
      <div className="flex items-start gap-4">
        <div {...attributes} {...listeners} className="mt-2 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
          <GripVertical className="h-4 w-4" />
        </div>

        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-muted-foreground">Field Label</Label>
              <Input
                value={field.label}
                onChange={(e) => onUpdate(field.id, { label: e.target.value })}
                className="bg-white h-8"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-muted-foreground">Type</Label>
              <div className="h-8 flex items-center px-3 border rounded-md bg-slate-100 text-xs font-medium capitalize">
                {field.type}
              </div>
            </div>
          </div>

          {(field.type === 'text' || field.type === 'textarea') && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Placeholder</Label>
              <Input
                placeholder="Ex: Enter your name..."
                value={field.placeholder}
                onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
                className="bg-white h-8"
              />
            </div>
          )}

          {(field.type === 'select' || field.type === 'multiselect') && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Options (Comma separated)</Label>
              <Input
                placeholder="Option 1, Option 2, Option 3"
                value={field.options?.join(', ')}
                onChange={(e) => onUpdate(field.id, { options: e.target.value.split(',').map(s => s.trim()) })}
                className="bg-white h-8"
              />
            </div>
          )}

          {field.type === 'checkbox' && (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border border-slate-300 bg-white" />
              <span className="text-sm text-muted-foreground italic">User will see a checkbox for this label</span>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-destructive/10"
          onClick={() => onRemove(field.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const FormBuilderPage = () => {
  const [formId, setFormId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('Untitled Application Form');
  const [fields, setFields] = useState<FormField[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load first existing form if available for demo purposes
    fetchForm();
  }, []);

  const fetchForm = async () => {
    try {
      const session = await supabase.auth.getSession();
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/forms`, {
        headers: { Authorization: `Bearer ${session.data.session?.access_token}` }
      });
      const data = Array.isArray(res.data) ? res.data[0] : res.data.data?.[0];
      if (data) {
        setFormId(data.id);
        setFormTitle(data.title);
        // Map backend fields to frontend structure if necessary
        setFields(data.fields || []);
      }
    } catch (err) {
      console.error('Error fetching form:', err);
    }
  };

  const saveForm = async (status: 'draft' | 'published' = 'draft') => {
    setIsSaving(true);
    try {
      const session = await supabase.auth.getSession();
      const payload = {
        title: formTitle,
        fields: fields,
        status: status
      };

      if (formId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/forms/${formId}`, payload, {
          headers: { Authorization: `Bearer ${session.data.session?.access_token}` }
        });
      } else {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/forms`, payload, {
          headers: { Authorization: `Bearer ${session.data.session?.access_token}` }
        });
        setFormId(res.data.id);
      }
      alert('Form saved successfully!');
    } catch (err) {
      console.error('Error saving form:', err);
      alert('Failed to save form.');
    } finally {
      setIsSaving(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      label: `New ${type} Field`,
      placeholder: '',
      options: type === 'select' || type === 'multiselect' ? ['Option 1'] : undefined
    };
    setFields([...fields, newField]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Enterprise Form Builder</h2>
          <p className="text-muted-foreground">Dynamic schema generation for internal applications and surveys.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => saveForm('draft')}
            disabled={isSaving}
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button
            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
            onClick={() => saveForm('published')}
            disabled={isSaving}
          >
            <Wand2 className="h-4 w-4" />
            Deploy Form
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Toolbar */}
        <Card className="lg:col-span-1 h-fit sticky top-6">
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Field Palette</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button variant="ghost" className="justify-start gap-2 h-10 px-3 hover:bg-slate-100" onClick={() => addField('text')}>
              <Type className="h-4 w-4 text-blue-500" /> Short Answer
            </Button>
            <Button variant="ghost" className="justify-start gap-2 h-10 px-3 hover:bg-slate-100" onClick={() => addField('textarea')}>
              <FileText className="h-4 w-4 text-orange-500" /> Paragraph
            </Button>
            <Button variant="ghost" className="justify-start gap-2 h-10 px-3 hover:bg-slate-100" onClick={() => addField('select')}>
              <ChevronDown className="h-4 w-4 text-emerald-500" /> Dropdown
            </Button>
            <Button variant="ghost" className="justify-start gap-2 h-10 px-3 hover:bg-slate-100" onClick={() => addField('multiselect')}>
              <Layers className="h-4 w-4 text-purple-500" /> Multi Select
            </Button>
            <Button variant="ghost" className="justify-start gap-2 h-10 px-3 hover:bg-slate-100" onClick={() => addField('checkbox')}>
              <CheckSquare className="h-4 w-4 text-pink-500" /> Checkbox
            </Button>
          </CardContent>
        </Card>

        {/* Builder Canvas */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border-t-4 border-t-primary">
            <CardHeader className="pb-4">
              <Input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="text-3xl font-bold border-none px-0 focus-visible:ring-0 h-auto py-0"
              />
              <CardDescription>Assemble your form components below. Drag to reorder.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 border-t">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={fields.map(f => f.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {fields.map((field) => (
                      <SortableItem
                        key={field.id}
                        field={field}
                        onRemove={removeField}
                        onUpdate={updateField}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {fields.length === 0 && (
                <div className="border-2 border-dashed rounded-xl p-20 text-center text-muted-foreground bg-slate-50">
                  <Plus className="h-10 w-10 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">Your form is empty</p>
                  <p className="text-sm">Select a component from the left to begin.</p>
                </div>
              )}

              <div className="flex justify-center pt-4">
                <Button variant="outline" className="border-dashed h-12 px-10 gap-2 text-muted-foreground hover:text-foreground" onClick={() => addField('text')}>
                  <Plus className="h-4 w-4" />
                  Add Another Field
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FormBuilderPage;
