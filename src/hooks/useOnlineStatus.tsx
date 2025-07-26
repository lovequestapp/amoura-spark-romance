import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface OnlineStatus {
  user_id: string;
  is_online: boolean;
  last_seen: string;
}

export const useOnlineStatus = (userIds: string[] = []) => {
  const [onlineStatuses, setOnlineStatuses] = useState<Record<string, OnlineStatus>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userIds.length === 0) {
      setLoading(false);
      return;
    }

    const fetchOnlineStatuses = async () => {
      try {
        const { data, error } = await supabase
          .from('user_online_status')
          .select('*')
          .in('user_id', userIds);

        if (error) throw error;

        const statusMap: Record<string, OnlineStatus> = {};
        data?.forEach(status => {
          statusMap[status.user_id] = status;
        });

        setOnlineStatuses(statusMap);
      } catch (error) {
        console.error('Error fetching online statuses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOnlineStatuses();

    // Set up real-time subscription for online status changes
    const channel = supabase
      .channel('user_online_status_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_online_status',
        filter: `user_id=in.(${userIds.join(',')})`
      }, (payload) => {
        console.log('Online status change:', payload);
        
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const updatedStatus = payload.new as OnlineStatus;
          setOnlineStatuses(prev => ({
            ...prev,
            [updatedStatus.user_id]: updatedStatus
          }));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userIds]);

  const isUserOnline = (userId: string): boolean => {
    const status = onlineStatuses[userId];
    if (!status) return false;

    if (status.is_online) return true;

    // Consider user online if last seen within 5 minutes
    const lastSeen = new Date(status.last_seen);
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    
    return lastSeen > fiveMinutesAgo;
  };

  const getLastSeen = (userId: string): string => {
    const status = onlineStatuses[userId];
    if (!status) return 'Unknown';

    if (isUserOnline(userId)) return 'Online';

    const lastSeen = new Date(status.last_seen);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffMinutes < 1440) { // 24 hours
      return `${Math.floor(diffMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffMinutes / 1440)}d ago`;
    }
  };

  return {
    onlineStatuses,
    loading,
    isUserOnline,
    getLastSeen
  };
};