import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Settings as SettingsIcon,
  Database,
  Mail,
  Palette,
  Lock,
  Save,
  Globe
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SettingsPage = () => {
  const [settings, setSettings] = useState<any[]>([]);
  const [localSettings, setLocalSettings] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const session = await supabase.auth.getSession();
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/settings`, {
        headers: { Authorization: `Bearer ${session.data.session?.access_token}` }
      });
      setSettings(res.data);

      // Initialize local state
      const initial: Record<string, string> = {};
      res.data.forEach((s: any) => initial[s.key] = s.value);
      setLocalSettings(initial);
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocalChange = (key: string, value: string) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key: string) => {
    const value = localSettings[key];
    setIsSaving(true);
    try {
      const session = await supabase.auth.getSession();
      await axios.put(`${import.meta.env.VITE_API_URL}/settings/${key}`, { value }, {
        headers: { Authorization: `Bearer ${session.data.session?.access_token}` }
      });
      alert('Setting updated!');
    } catch (err) {
      console.error('Error saving setting:', err);
      alert('Failed to update setting.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
        <p className="text-muted-foreground">Configure global application behavior and integrations.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general" className="gap-2">
            <Globe className="h-4 w-4" /> General
          </TabsTrigger>
          <TabsTrigger value="auth" className="gap-2">
            <Lock className="h-4 w-4" /> Security & Auth
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <Mail className="h-4 w-4" /> Email (SMTP)
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" /> Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Configuration</CardTitle>
              <CardDescription>Basic information about your instance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <p>Loading settings...</p>
              ) : (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="site_name">Site Name</Label>
                    <div className="flex gap-2">
                      <Input
                        id="site_name"
                        value={localSettings['site_name'] || ''}
                        onChange={(e) => handleLocalChange('site_name', e.target.value)}
                      />
                      <Button onClick={() => handleSave('site_name')} disabled={isSaving}>Update</Button>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="support_email">Support Contact Email</Label>
                    <div className="flex gap-2">
                      <Input
                        id="support_email"
                        value={localSettings['support_email'] || ''}
                        onChange={(e) => handleLocalChange('support_email', e.target.value)}
                      />
                      <Button onClick={() => handleSave('support_email')} disabled={isSaving}>Update</Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Settings</CardTitle>
              <CardDescription>Manage how users access the system.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base">Allow Public Registration</Label>
                  <p className="text-sm text-muted-foreground italic">If disabled, only admins can create new users.</p>
                </div>
                <div className="h-6 w-11 rounded-full bg-slate-200" /> {/* Toggle placeholder */}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="session_timeout">Session Timeout (Minutes)</Label>
                <Input id="session_timeout" type="number" defaultValue="60" />
              </div>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
