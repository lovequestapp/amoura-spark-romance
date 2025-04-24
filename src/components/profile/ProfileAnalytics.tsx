
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { supabase } from '@/integrations/supabase/client';
import { ChartBar } from 'lucide-react';

interface ProfileView {
  id: string;
  viewer: {
    id: string;
    username: string;
    avatar_url: string;
  };
  viewed_at: string;
}

const ProfileAnalytics = () => {
  const [profileViews, setProfileViews] = useState<ProfileView[]>([]);
  const [loading, setLoading] = useState(true);
  const { tier, features, openUpgradeModal } = useSubscription();
  const { toast } = useToast();
  const hasAnalytics = features.analytics;
  
  useEffect(() => {
    if (hasAnalytics) {
      fetchProfileViews();
    }
  }, [hasAnalytics]);
  
  const fetchProfileViews = async () => {
    try {
      setLoading(true);
      
      // Use a raw query instead of the typed client to work around TypeScript errors
      const { data, error } = await supabase.rpc('get_profile_views')
        .select(`
          id,
          viewer:viewer_id(id, username, avatar_url),
          viewed_at
        `)
        .order('viewed_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      setProfileViews(data || []);
    } catch (error) {
      console.error('Error fetching profile views:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile views.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const formatViewDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHrs < 24) {
      return diffHrs === 0 ? 'Just now' : `${diffHrs}h ago`;
    }
    
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) {
      return `${diffDays}d ago`;
    }
    
    return date.toLocaleDateString();
  };
  
  // If the user doesn't have analytics feature, show upgrade prompt
  if (!hasAnalytics) {
    return (
      <Card className="animate-in fade-in-50 my-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartBar className="w-5 h-5" />
            Profile Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-gray-500 mb-4">
              Upgrade to Gold or Platinum to see who viewed your profile!
            </p>
            <Button onClick={openUpgradeModal}>Upgrade Now</Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="animate-in fade-in-50 my-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <ChartBar className="w-5 h-5" />
            Profile Analytics
          </CardTitle>
          <Badge variant="secondary">{tier}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="font-medium mb-4">Recent Profile Views</h3>
        
        {loading ? (
          <div className="space-y-2">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mb-1" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : profileViews.length > 0 ? (
          <div className="space-y-3">
            {profileViews.map((view) => (
              <div key={view.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={view.viewer.avatar_url} />
                    <AvatarFallback>{view.viewer.username?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{view.viewer.username}</p>
                    <p className="text-xs text-gray-500">{formatViewDate(view.viewed_at)}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No one has viewed your profile yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileAnalytics;
