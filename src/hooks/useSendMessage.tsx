
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';
import { FormattedMessage } from './useRealtimeMessages';

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

export const useSendMessage = (conversationId: string | null, senderId: string | null, onMessageSent?: (message: FormattedMessage) => void) => {
  const [sending, setSending] = useState(false);

  const sendTextMessage = async (content: string) => {
    if (!conversationId || !senderId || !content.trim()) return null;
    
    setSending(true);
    try {
      const safeSenderId = getDemoUUID(senderId);
      const messageId = uuidv4();
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('messages')
        .insert({
          id: messageId,
          conversation_id: conversationId,
          sender_id: safeSenderId,
          content,
          message_type: 'text' as 'text' | 'voice' | 'image'
        })
        .select()
        .single();

      if (error) throw error;
      
      const formattedMessage: FormattedMessage = {
        id: data.id,
        text: data.content,
        sender: 'user',
        time: data.created_at,
        seen: false,
        message_type: 'text'
      };
      
      if (onMessageSent) {
        onMessageSent(formattedMessage);
      }
      
      return formattedMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      return null;
    } finally {
      setSending(false);
    }
  };

  const sendVoiceMessage = async (audioBlob: Blob) => {
    if (!conversationId || !senderId) return null;
    
    setSending(true);
    try {
      const safeSenderId = getDemoUUID(senderId);
      
      // Generate a unique file name
      const fileName = `${uuidv4()}.webm`;
      const filePath = `voice-messages/${fileName}`;

      // Upload the audio file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('messages')
        .upload(filePath, audioBlob);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('messages')
        .getPublicUrl(filePath);

      // Insert message record
      const { data, error } = await supabase
        .from('messages')
        .insert({
          id: uuidv4(),
          conversation_id: conversationId,
          sender_id: safeSenderId,
          voice_url: urlData.publicUrl,
          message_type: 'voice' as 'text' | 'voice' | 'image'
        })
        .select()
        .single();

      if (error) throw error;

      const formattedMessage: FormattedMessage = {
        id: data.id,
        voice_url: data.voice_url,
        sender: 'user',
        time: data.created_at,
        seen: false,
        message_type: 'voice'
      };
      
      if (onMessageSent) {
        onMessageSent(formattedMessage);
      }
      
      return formattedMessage;
    } catch (error) {
      console.error('Error sending voice message:', error);
      toast({
        title: "Error",
        description: "Failed to send voice message",
        variant: "destructive",
      });
      return null;
    } finally {
      setSending(false);
    }
  };

  return {
    sendTextMessage,
    sendVoiceMessage,
    sending
  };
};
