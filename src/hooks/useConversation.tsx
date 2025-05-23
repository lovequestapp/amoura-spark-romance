
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Helper function to convert demo IDs to UUIDs consistently
const getDemoUUID = (demoId: string) => {
  // Generate deterministic UUIDs for demo users
  if (!isNaN(Number(demoId))) {
    switch (demoId) {
      case "1": return "00000000-0000-0000-0000-000000000001";
      case "2": return "00000000-0000-0000-0000-000000000002";
      case "3": return "00000000-0000-0000-0000-000000000003";
      default: return `00000000-0000-0000-0000-${demoId.padStart(12, '0')}`;
    }
  }
  return demoId; // If it's already a UUID, return as is
};

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  user1_id: string;
  user2_id: string;
  last_message_at: string;
}

export const useConversation = (user1Id: string | null, user2Id: string | null) => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getOrCreateConversation = async () => {
      if (!user1Id || !user2Id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Convert demo IDs to UUID format
        const safeUser1Id = getDemoUUID(user1Id);
        const safeUser2Id = getDemoUUID(user2Id);
        
        console.log(`Looking for conversation between ${safeUser1Id} and ${safeUser2Id}`);
        
        // Check if conversation exists with users in either order
        const { data: existingConv, error: findError } = await supabase
          .from('conversations')
          .select('*')
          .or(`user1_id.eq.${safeUser1Id},user1_id.eq.${safeUser2Id}`)
          .or(`user2_id.eq.${safeUser1Id},user2_id.eq.${safeUser2Id}`)
          .eq(safeUser1Id === safeUser2Id ? 'user1_id' : 'user2_id', safeUser1Id === safeUser2Id ? safeUser1Id : safeUser2Id)
          .maybeSingle();

        if (findError) {
          console.error('Error finding conversation:', findError);
          throw findError;
        }

        if (existingConv) {
          console.log('Found existing conversation:', existingConv);
          setConversation(existingConv);
          return;
        }

        // Create new conversation
        console.log('Creating new conversation between', safeUser1Id, 'and', safeUser2Id);
        const { data, error } = await supabase
          .from('conversations')
          .insert({
            user1_id: safeUser1Id,
            user2_id: safeUser2Id
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating conversation:', error);
          throw error;
        }

        console.log('Created new conversation:', data);
        setConversation(data);
      } catch (err) {
        console.error('Error getting or creating conversation:', err);
        setError(err as Error);
        toast({
          title: "Error",
          description: "Failed to create conversation",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    getOrCreateConversation();
  }, [user1Id, user2Id]);

  return {
    conversation,
    loading,
    error
  };
};
