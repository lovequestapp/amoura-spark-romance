
import { useState, useEffect } from 'react';
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
        
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Use demo matches for now - in production this would fetch from Supabase
        // When the database types are updated, we can use real Supabase queries
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
      // For now, just add to local state
      // In production, this would create a match in Supabase
      const newMatch: Match = {
        id: Date.now().toString(),
        user_id: userId,
        name: 'New Match',
        photo: '',
        match_time: 'Just now',
        online: false,
        unread_count: 0
      };
      
      setMatches(prev => [...prev, newMatch]);
      
      toast({
        title: "New Match!",
        description: "You have a new match!",
      });
      
      return newMatch;
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
