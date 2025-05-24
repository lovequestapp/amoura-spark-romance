
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings as SettingsIcon,
  Save,
  Activity,
  Database,
  Shield
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: systemSettings, isLoading } = useQuery({
    queryKey: ['systemSettings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('setting_key');
      
      if (error) throw error;
      
      const settingsMap = data.reduce((acc: any, setting: any) => {
        acc[setting.setting_key] = setting.setting_value;
        return acc;
      }, {});
      
      setSettings(settingsMap);
      return data;
    },
  });

  const { data: activityLog } = useQuery({
    queryKey: ['adminActivityLog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_activity_log')
        .select(`
          *,
          profiles(full_name, username)
        `)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    },
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string, value: any }) => {
      const { error } = await supabase
        .from('system_settings')
        .update({ 
          setting_value: value,
          updated_by: (await supabase.auth.getUser()).data.user?.id,
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', key);
      
      if (error) throw error;

      // Log admin activity
      await supabase.rpc('log_admin_activity', {
        action_param: 'update_system_setting',
        target_type_param: 'setting',
        target_id_param: null,
        details_param: { setting_key: key, new_value: value }
      });
    },
    onSuccess: () => {
      toast({
        title: "Setting updated",
        description: "System setting has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['systemSettings'] });
      queryClient.invalidateQueries({ queryKey: ['adminActivityLog'] });
    },
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSetting = (key: string) => {
    updateSettingMutation.mutate({ key, value: settings[key] });
  };

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">System Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                App Configuration
              </CardTitle>
              <CardDescription>Core application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Maintenance Mode</label>
                  <p className="text-sm text-gray-500">Temporarily disable app access</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={settings.app_maintenance_mode === 'true'}
                    onCheckedChange={(checked) => 
                      handleSettingChange('app_maintenance_mode', checked ? 'true' : 'false')
                    }
                  />
                  <Button
                    size="sm"
                    onClick={() => handleSaveSetting('app_maintenance_mode')}
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Premium Features</label>
                  <p className="text-sm text-gray-500">Enable premium functionality</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={settings.premium_features_enabled === 'true'}
                    onCheckedChange={(checked) => 
                      handleSettingChange('premium_features_enabled', checked ? 'true' : 'false')
                    }
                  />
                  <Button
                    size="sm"
                    onClick={() => handleSaveSetting('premium_features_enabled')}
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Max Photos Per Profile</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={settings.max_photos_per_profile || 6}
                    onChange={(e) => handleSettingChange('max_photos_per_profile', e.target.value)}
                    min={1}
                    max={10}
                  />
                  <Button
                    size="sm"
                    onClick={() => handleSaveSetting('max_photos_per_profile')}
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Auto Content Moderation</label>
                  <p className="text-sm text-gray-500">Automatically flag inappropriate content</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={settings.content_moderation_auto === 'true'}
                    onCheckedChange={(checked) => 
                      handleSettingChange('content_moderation_auto', checked ? 'true' : 'false')
                    }
                  />
                  <Button
                    size="sm"
                    onClick={() => handleSaveSetting('content_moderation_auto')}
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Database Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Total Tables:</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Users:</span>
                  <span className="font-medium">{systemSettings?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Storage Used:</span>
                  <span className="font-medium">2.4 GB</span>
                </div>
                <div className="flex justify-between">
                  <span>API Requests (24h):</span>
                  <span className="font-medium">1,247</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Admin Activity Log
            </CardTitle>
            <CardDescription>Recent administrative actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activityLog?.map((log) => (
                <div key={log.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{log.action.replace(/_/g, ' ')}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(log.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    By {log.profiles?.full_name || log.profiles?.username || 'Unknown Admin'}
                  </p>
                  {log.details && (
                    <p className="text-xs text-gray-500 mt-1">
                      {JSON.stringify(log.details)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
