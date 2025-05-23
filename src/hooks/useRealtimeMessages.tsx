
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/services/messaging';
import { toast } from '@/components/ui/use-toast';

export interface FormattedMessage {
  id: string;
  text?: string | null;
  voice_url?: string | null;
  sender: 'user' | 'match';
  time: string;
  seen?: boolean;
  message_type?: 'text' | 'voice' | 'image';
}

export const useRealtimeMessages = (conversationId: string | null, userId: string | null) => {
  const [messages, setMessages] = useState<FormattedMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to map database messages to UI format
  const formatMessages = (dbMessages: Message[]): FormattedMessage[] => {
    if (!userId) return [];
    
    return dbMessages.map((msg): FormattedMessage => ({
      id: msg.id,
      text: msg.content,
      voice_url: msg.voice_url,
      sender: msg.sender_id === userId ? 'user' : 'match',
      time: msg.created_at,
      seen: !!msg.seen_at,
      message_type: msg.message_type as 'text' | 'voice' | 'image'
    }));
  };

  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      if (!conversationId || !userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const dbMessages = await getMessages(conversationId);
        const formattedMessages = formatMessages(dbMessages);
        setMessages(formattedMessages);
        
        await markMessagesAsSeen(conversationId, userId);
      } catch (error) {
        console.error('Error loading messages:', error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [conversationId, userId]);

  // Set up real-time subscription
  useEffect(() => {
    if (!conversationId || !userId) return;

    console.log(`Setting up real-time subscription for conversation: ${conversationId}`);
    
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        }, 
        async (payload) => {
          console.log('Received real-time message update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newMsg = payload.new as Message;
            
            if (newMsg.sender_id !== userId) {
              const formattedMsg: FormattedMessage = {
                id: newMsg.id,
                text: newMsg.content,
                voice_url: newMsg.voice_url,
                sender: 'match',
                time: newMsg.created_at,
                seen: false,
                message_type: newMsg.message_type as 'text' | 'voice' | 'image'
              };
              
              setMessages(prev => [...prev, formattedMsg]);
              await markMessagesAsSeen(conversationId, userId);
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedMsg = payload.new as Message;
            
            if (updatedMsg.seen_at && !payload.old.seen_at) {
              setMessages(prev => prev.map(msg => 
                msg.id === updatedMsg.id ? {...msg, seen: true} : msg
              ));
            }
          }
      })
      .subscribe();

    // Clean up subscription when component unmounts
    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [conversationId, userId]);

  // Helper functions
  const getMessages = async (conversationId: string): Promise<Message[]> => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return (data || []).map(msg => ({
        ...msg,
        message_type: msg.message_type as 'text' | 'voice' | 'image'
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
      return [];
    }
  };

  const markMessagesAsSeen = async (conversationId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ seen_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .neq('sender_id', userId)
        .is('seen_at', null);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking messages as seen:', error);
    }
  };

  // Function to add a new message locally (optimistic update)
  const addMessage = (message: FormattedMessage) => {
    setMessages(prev => [...prev, message]);
  };

  return {
    messages,
    loading,
    addMessage
  };
};
