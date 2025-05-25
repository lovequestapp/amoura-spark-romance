
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/hooks/use-toast';
import { FormattedMessage } from './useRealtimeMessages';

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

export const useSendMessage = (conversationId: string | null, senderId: string | null, onMessageSent?: (message: FormattedMessage) => void) => {
  const [sending, setSending] = useState(false);

  const sendTextMessage = async (content: string) => {
    if (!conversationId || !senderId || !content.trim()) {
      console.log('Cannot send message - missing required data:', { conversationId, senderId, content: content.trim() });
      return null;
    }
    
    setSending(true);
    try {
      const safeSenderId = getDemoUUID(senderId);
      const messageId = uuidv4();
      
      console.log('Sending message with data:', {
        id: messageId,
        conversation_id: conversationId,
        sender_id: safeSenderId,
        content,
        message_type: 'text'
      });
      
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

      if (error) {
        console.error('Error inserting message:', error);
        throw error;
      }
      
      console.log('Message inserted successfully:', data);
      
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
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to send message",
        variant: "destructive",
      });
      return null;
    } finally {
      setSending(false);
    }
  };

  const sendImageMessage = async (imageFile: File) => {
    if (!conversationId || !senderId) return null;
    
    setSending(true);
    try {
      const safeSenderId = getDemoUUID(senderId);
      
      // Generate a unique file name
      const fileExtension = imageFile.name.split('.').pop() || 'jpg';
      const fileName = `${uuidv4()}.${fileExtension}`;
      const filePath = `${safeSenderId}/${fileName}`;

      console.log('Attempting to upload image to bucket: message-images, path:', filePath);

      // Upload the image file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('message-images')
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }

      console.log('Image uploaded successfully:', uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('message-images')
        .getPublicUrl(filePath);

      console.log('Generated public URL:', urlData.publicUrl);

      // Insert message record
      const { data, error } = await supabase
        .from('messages')
        .insert({
          id: uuidv4(),
          conversation_id: conversationId,
          sender_id: safeSenderId,
          content: urlData.publicUrl,
          message_type: 'image' as 'text' | 'voice' | 'image'
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting image message:', error);
        throw error;
      }

      console.log('Image message inserted successfully:', data);

      const formattedMessage: FormattedMessage = {
        id: data.id,
        text: data.content,
        sender: 'user',
        time: data.created_at,
        seen: false,
        message_type: 'image'
      };
      
      if (onMessageSent) {
        onMessageSent(formattedMessage);
      }
      
      return formattedMessage;
    } catch (error: any) {
      console.error('Error sending image message:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to send image",
        variant: "destructive",
      });
      return null;
    } finally {
      setSending(false);
    }
  };

  const sendVoiceMessage = async (audioBlob: Blob) => {
    if (!conversationId || !senderId) {
      console.error('Cannot send voice message - missing required data:', { conversationId, senderId });
      return null;
    }
    
    setSending(true);
    try {
      const safeSenderId = getDemoUUID(senderId);
      
      // Generate a unique file name
      const fileName = `${uuidv4()}.webm`;
      const filePath = `voice-messages/${fileName}`;

      console.log('Attempting to upload voice message to bucket: messages, path:', filePath);
      console.log('Audio blob size:', audioBlob.size, 'type:', audioBlob.type);

      // Upload the audio file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('messages')
        .upload(filePath, audioBlob, {
          contentType: 'audio/webm',
          cacheControl: '3600'
        });

      if (uploadError) {
        console.error('Voice upload error:', uploadError);
        throw new Error(`Voice upload failed: ${uploadError.message}`);
      }

      console.log('Voice message uploaded successfully:', uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('messages')
        .getPublicUrl(filePath);

      console.log('Generated voice URL:', urlData.publicUrl);

      // Insert message record with voice_url
      const messageId = uuidv4();
      const { data, error } = await supabase
        .from('messages')
        .insert({
          id: messageId,
          conversation_id: conversationId,
          sender_id: safeSenderId,
          voice_url: urlData.publicUrl,
          content: null, // Voice messages don't have text content
          message_type: 'voice' as 'text' | 'voice' | 'image'
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting voice message:', error);
        throw new Error(`Database insert failed: ${error.message}`);
      }

      console.log('Voice message inserted successfully:', data);

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
    } catch (error: any) {
      console.error('Error sending voice message:', error);
      toast({
        title: "Voice Message Error",
        description: error?.message || "Failed to send voice message. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setSending(false);
    }
  };

  return {
    sendTextMessage,
    sendImageMessage,
    sendVoiceMessage,
    sending
  };
};
