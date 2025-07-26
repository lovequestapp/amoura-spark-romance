import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Profile } from '@/components/home/SwipeableCard';

interface MatchScore {
  user_id: string;
  target_user_id: string;
  overall_score: number;
  personality_score: number;
  interests_score: number;
  lifestyle_score: number;
  location_score: number;
  intention_score: number;
}

export const useRealtimeMatching = () => {
  const [matches, setMatches] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchScores, setMatchScores] = useState<MatchScore[]>([]);
  const { user } = useAuth();

  const fetchMatches = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get matches from profiles table for now (we'll enhance this later)
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          full_name,
          birth_date,
          bio,
          photos,
          latitude,
          longitude,
          onboarding_completed
        `)
        .eq('onboarding_completed', true)
        .neq('id', user.id)
        .limit(20);

      if (error) throw error;

      // Transform the data to match our Profile interface
      const transformedMatches: Profile[] = profiles?.map((match: any) => ({
        id: match.id,
        name: match.full_name || match.username || 'Unknown',
        age: match.birth_date ? new Date().getFullYear() - new Date(match.birth_date).getFullYear() : 25,
        distance: '0 km', // We'll calculate this later
        occupation: 'Professional', // Default occupation
        bio: match.bio || '',
        photos: Array.isArray(match.photos) ? match.photos : [],
        interests: [], // We'll fetch this separately if needed
        prompts: [],
        matchScore: 75, // Default score, will be calculated
        personalityScore: 50,
        interestsScore: 50,
      })) || [];

      setMatches(transformedMatches);
    } catch (error) {
      console.error('Error fetching matches:', error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const calculateMatchScore = useCallback(async (targetUserId: string) => {
    if (!user) return null;

    try {
      const { data: score, error } = await supabase.rpc('calculate_match_score', {
        user_id_param: user.id,
        target_user_id_param: targetUserId
      });

      if (error) throw error;
      return score;
    } catch (error) {
      console.error('Error calculating match score:', error);
      return null;
    }
  }, [user]);

  const trackInteraction = useCallback(async (
    interactionType: string,
    targetUserId: string,
    metadata: any = {}
  ) => {
    if (!user) return;

    try {
      await supabase.functions.invoke('track-user-interaction', {
        body: {
          interactionType,
          targetUserId,
          metadata
        }
      });

      // Also track locally for real-time updates
      await supabase.rpc('track_user_activity', {
        user_id_param: user.id,
        activity_type_param: interactionType,
        metadata_param: {
          target_user_id: targetUserId,
          ...metadata
        }
      });
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  }, [user]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    // Subscribe to match score updates
    const matchScoreChannel = supabase
      .channel(`match_scores:${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'match_scores',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        console.log('Match score update:', payload);
        
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const newScore = payload.new as MatchScore;
          setMatchScores(prev => {
            const filtered = prev.filter(s => 
              s.user_id !== newScore.user_id || s.target_user_id !== newScore.target_user_id
            );
            return [...filtered, newScore];
          });
        }
      })
      .subscribe();

    // Subscribe to new likes/matches
    const likesChannel = supabase
      .channel(`profile_likes:${user.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'profile_likes',
        filter: `liked_profile_id=eq.${user.id}`
      }, (payload) => {
        console.log('New like received:', payload);
        // You could show a notification here
      })
      .subscribe();

    return () => {
      supabase.removeChannel(matchScoreChannel);
      supabase.removeChannel(likesChannel);
    };
  }, [user]);

  // Fetch matches when user changes
  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  // Update user online status periodically
  useEffect(() => {
    if (!user) return;

    const updateOnlineStatus = async () => {
      try {
        await supabase.rpc('update_user_online_status', {
          user_id_param: user.id,
          is_online_param: true
        });
      } catch (error) {
        console.error('Error updating online status:', error);
      }
    };

    // Update immediately
    updateOnlineStatus();

    // Then update every 30 seconds
    const interval = setInterval(updateOnlineStatus, 30000);

    // Clean up on visibility change
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        updateOnlineStatus();
      } else {
        try {
          await supabase.rpc('update_user_online_status', {
            user_id_param: user.id,
            is_online_param: false
          });
        } catch (error: any) {
          console.error('Error updating online status:', error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  return {
    matches,
    loading,
    matchScores,
    fetchMatches,
    calculateMatchScore,
    trackInteraction,
    refetch: fetchMatches
  };
};