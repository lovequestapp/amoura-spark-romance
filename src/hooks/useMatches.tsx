
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

export interface Match {
  id: string;
  user_id: string;
  name: string;
  photo: string;
  match_time: string;
  last_message?: string;
  last_message_time?: string;
  online: boolean;
  unread_count?: number;
}

export const useMatches = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Demo matches with realistic data for development
  const demoMatches: Match[] = [
    {
      id: '1',
      user_id: '00000000-0000-0000-0000-000000000001',
      name: 'Emma',
      photo: '/lovable-uploads/955e854b-03c9-4efe-91de-ea62233f88eb.png',
      match_time: 'Just now',
      last_message: null,
      online: true,
      unread_count: 0
    },
    {
      id: '2',
      user_id: '00000000-0000-0000-0000-000000000002',
      name: 'Alex',
      photo: '/lovable-uploads/d96b24ef-01b0-41a0-afdf-564574149a3c.png',
      match_time: '2 hours ago',
      last_message: 'Hey there! I noticed we both love hiking. Any favorite trails?',
      last_message_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      online: true,
      unread_count: 1
    },
    {
      id: '3',
      user_id: '00000000-0000-0000-0000-000000000003',
      name: 'Sofia',
      photo: '/lovable-uploads/c3b91871-0b81-4711-a02d-6771b41f44ed.png',
      match_time: '1 day ago',
      last_message: 'Thanks for the recommendation! I\'ll check out that restaurant this weekend.',
      last_message_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      online: false,
      unread_count: 0
    }
  ];

  useEffect(() => {
    const fetchMatches = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // For now, use demo data but in production this would fetch from Supabase
        // const { data: matchesData, error: matchesError } = await supabase
        //   .from('matches')
        //   .select(`
        //     *,
        //     conversations!inner(
        //       id,
        //       last_message_at,
        //       messages(content, created_at, sender_id)
        //     )
        //   `)
        //   .eq('user1_id', user.id)
        //   .or(`user2_id.eq.${user.id}`)
        //   .eq('is_active', true)
        //   .order('created_at', { ascending: false });

        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Use demo matches for now
        setMatches(demoMatches);
        console.log('Loaded demo matches:', demoMatches.length);
        
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError('Failed to load matches');
        toast({
          title: "Error",
          description: "Failed to load matches",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [user]);

  const createMatch = async (userId: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('matches')
        .insert({
          user1_id: user.id,
          user2_id: userId,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      
      // Refresh matches
      setMatches(prev => [...prev, {
        id: data.id,
        user_id: userId,
        name: 'New Match',
        photo: '',
        match_time: 'Just now',
        online: false,
        unread_count: 0
      }]);
      
      return data;
    } catch (error) {
      console.error('Error creating match:', error);
      toast({
        title: "Error",
        description: "Failed to create match",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    matches,
    loading,
    error,
    createMatch
  };
};
