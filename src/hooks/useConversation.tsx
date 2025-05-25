
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  updated_at: string;
  last_message_at: string;
}

// Helper function to convert demo IDs to UUIDs consistently
const getDemoUUID = (demoId: string) => {
  if (!isNaN(Number(demoId))) {
    switch (demoId) {
      case "1": return "00000000-0000-0000-0000-000000000001";
      case "2": return "00000000-0000-0000-0000-000000000002";
      case "3": return "00000000-0000-0000-0000-000000000003";
      default: return `00000000-0000-0000-0000-${demoId.padStart(12, '0')}`;
    }
  }
  return demoId;
};

export const useConversation = (userId: string | null, otherUserId: string | null) => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getOrCreateConversation = async () => {
      if (!userId || !otherUserId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const safeUserId = getDemoUUID(userId);
        const safeOtherUserId = getDemoUUID(otherUserId);
        
        console.log(`Looking for conversation between ${safeUserId} and ${safeOtherUserId}`);
        
        // First try to find existing conversation
        const { data: existingConv, error: findError } = await supabase
          .from('conversations')
          .select('*')
          .or(`and(user1_id.eq.${safeUserId},user2_id.eq.${safeOtherUserId}),and(user1_id.eq.${safeOtherUserId},user2_id.eq.${safeUserId})`)
          .maybeSingle();

        if (findError) {
          console.error('Error finding conversation:', findError);
        }

        if (existingConv) {
          console.log('Found existing conversation:', existingConv);
          setConversation(existingConv);
          setLoading(false);
          return;
        }

        // Create new conversation if none exists
        console.log('Creating new conversation');
        const { data: newConv, error: createError } = await supabase
          .from('conversations')
          .insert({
            user1_id: safeUserId,
            user2_id: safeOtherUserId
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating conversation:', createError);
          throw createError;
        }

        console.log('Created new conversation:', newConv);
        setConversation(newConv);
        
      } catch (err) {
        console.error('Error getting or creating conversation:', err);
        setError('Failed to load conversation');
        toast({
          title: "Error",
          description: "Failed to load conversation",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    getOrCreateConversation();
  }, [userId, otherUserId]);

  return {
    conversation,
    loading,
    error
  };
};
