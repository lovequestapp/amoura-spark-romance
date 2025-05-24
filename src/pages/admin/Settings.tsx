
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings as SettingsIcon, 
  Shield, 
  Users, 
  AlertTriangle,
  Save
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: systemSettings, isLoading } = useQuery({
    queryKey: ['systemSettings'],
    queryFn: async () => {
      // Query system settings directly since types aren't updated yet
      const { data, error } = await supabase
        .from('system_settings' as any)
        .select('*');
      
      if (error) throw error;
      
      // Convert array to object for easier access
      const settingsMap: any = {};
      data?.forEach((setting: any) => {
        settingsMap[setting.setting_key] = setting.setting_value;
      });
      return settingsMap;
    },
  });

  const { data: adminActivity } = useQuery({
    queryKey: ['adminActivity'],
    queryFn: async () => {
      // Query admin activity log directly since types aren't updated yet
      const { data, error } = await supabase
        .from('admin_activity_log' as any)
        .select(`
          *,
          profiles!admin_activity_log_admin_id_fkey(full_name, username)
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
        .from('system_settings' as any)
        .update({
          setting_value: value,
          updated_by: (await supabase.auth.getUser()).data.user?.id,
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', key);
      
      if (error) throw error;

      // Log the admin activity
      await supabase.rpc('log_admin_activity' as any, {
        action_param: 'update_system_setting',
        target_type_param: 'system_setting',
        target_id_param: null,
        details_param: { setting_key: key, new_value: value }
      });
    },
    onSuccess: () => {
      toast({
        title: "Settings updated",
        description: "System settings have been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['systemSettings'] });
      queryClient.invalidateQueries({ queryKey: ['adminActivity'] });
    },
  });

  const handleToggleSetting = (key: string, currentValue: boolean) => {
    updateSettingMutation.mutate({ key, value: !currentValue });
  };

  const handleNumberSetting = (key: string, value: string) => {
    updateSettingMutation.mutate({ key, value: parseInt(value) });
  };

  if (isLoading) {
    return <div>Loading system settings...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">System Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              General Settings
            </CardTitle>
            <CardDescription>Configure general application settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="maintenance">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Enable to put the app in maintenance mode
                </p>
              </div>
              <Switch
                id="maintenance"
                checked={systemSettings?.app_maintenance_mode === true}
                onCheckedChange={() => handleToggleSetting('app_maintenance_mode', systemSettings?.app_maintenance_mode === true)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="premium">Premium Features</Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable premium features
                </p>
              </div>
              <Switch
                id="premium"
                checked={systemSettings?.premium_features_enabled === true}
                onCheckedChange={() => handleToggleSetting('premium_features_enabled', systemSettings?.premium_features_enabled === true)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-photos">Max Photos Per Profile</Label>
              <Input
                id="max-photos"
                type="number"
                value={systemSettings?.max_photos_per_profile || 6}
                onChange={(e) => handleNumberSetting('max_photos_per_profile', e.target.value)}
                min="1"
                max="10"
              />
              <p className="text-sm text-muted-foreground">
                Maximum number of photos users can upload
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Content Moderation
            </CardTitle>
            <CardDescription>Configure content moderation settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-moderation">Auto Moderation</Label>
                <p className="text-sm text-muted-foreground">
                  Enable automatic content moderation
                </p>
              </div>
              <Switch
                id="auto-moderation"
                checked={systemSettings?.content_moderation_auto === true}
                onCheckedChange={() => handleToggleSetting('content_moderation_auto', systemSettings?.content_moderation_auto === true)}
              />
            </div>

            <div className="space-y-2">
              <Label>Moderation Guidelines</Label>
              <Textarea
                placeholder="Enter content moderation guidelines..."
                rows={4}
                className="resize-none"
              />
              <Button size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save Guidelines
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Recent Admin Activity
            </CardTitle>
            <CardDescription>Latest administrative actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {adminActivity?.map((activity: any) => (
                <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {activity.profiles?.full_name || activity.profiles?.username || 'Admin'}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {activity.action.replace(/_/g, ' ')}
                      </p>
                      {activity.details && (
                        <p className="text-xs text-gray-400">
                          {JSON.stringify(activity.details)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(activity.created_at).toLocaleString()}
                  </div>
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
