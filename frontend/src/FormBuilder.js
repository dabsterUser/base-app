import React, { useState } from 'react';
import axios from 'axios';
import { supabase } from './supabaseClient';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

const FormBuilder = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState([{ name: '', label: '', type: 'text' }]);
  const [isSaving, setIsSaving] = useState(false);

  const addField = () => {
    setFields([...fields, { name: '', label: '', type: 'text' }]);
  };

  const removeField = (index) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    try {
      await axios.post('http://localhost:3000/forms', {
        title,
        description,
        fields,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Form created!');
      setTitle('');
      setDescription('');
      setFields([{ name: '', label: '', type: 'text' }]);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create New Form</CardTitle>
        <CardDescription>Design your form by adding fields below.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Form Title</Label>
              <Input
                id="title"
                placeholder="E.g. Customer Feedback"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Optional description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">Form Fields</Label>
              <Button type="button" variant="outline" size="sm" onClick={addField}>
                <Plus className="w-4 h-4 mr-2" />
                Add Field
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={index} className="flex gap-4 items-end border p-4 rounded-lg bg-slate-50/50">
                  <div className="grid gap-2 flex-1">
                    <Label>Field Label</Label>
                    <Input
                      placeholder="E.g. Full Name"
                      value={field.label}
                      onChange={(e) => {
                        const newFields = [...fields];
                        newFields[index].label = e.target.value;
                        newFields[index].name = e.target.value.toLowerCase().replace(/ /g, '_');
                        setFields(newFields);
                      }}
                      required
                    />
                  </div>
                  <div className="grid gap-2 w-32">
                    <Label>Type</Label>
                    <select
                      value={field.type}
                      onChange={(e) => {
                        const newFields = [...fields];
                        newFields[index].type = e.target.value;
                        setFields(newFields);
                      }}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="text">Text</option>
                      <option value="textarea">Textarea</option>
                    </select>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeField(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto" type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Form"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default FormBuilder;
