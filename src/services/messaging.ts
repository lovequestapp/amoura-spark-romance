
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string | null;
  voice_url: string | null;
  created_at: string;
  seen_at: string | null;
  message_type: 'text' | 'voice' | 'image';
}

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  user1_id: string;
  user2_id: string;
  last_message_at: string;
}

// Helper function to convert demo IDs to UUIDs consistently
export const getDemoUUID = (demoId: string) => {
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

// Note: The functions below are kept for backward compatibility
// New code should use the hooks directly: useConversation, useSendMessage, useRealtimeMessages

// Get or create conversation between two users
export const getOrCreateConversation = async (user1Id: string, user2Id: string) => {
  try {
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
    }

    if (existingConv) {
      console.log('Found existing conversation:', existingConv);
      return existingConv;
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
    return data;
  } catch (error) {
    console.error('Error getting or creating conversation:', error);
    toast({
      title: "Error",
      description: "Failed to create conversation",
      variant: "destructive",
    });
    throw error;
  }
};

// Send a text message
export const sendTextMessage = async (conversationId: string, senderId: string, content: string) => {
  try {
    const safeSenderId = getDemoUUID(senderId);
    
    const { data, error } = await supabase
      .from('messages')
      .insert({
        id: uuidv4(),
        conversation_id: conversationId,
        sender_id: safeSenderId,
        content,
        message_type: 'text'
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    toast({
      title: "Error",
      description: "Failed to send message",
      variant: "destructive",
    });
    throw error;
  }
};

// Send a voice message
export const sendVoiceMessage = async (conversationId: string, senderId: string, audioBlob: Blob) => {
  try {
    const safeSenderId = getDemoUUID(senderId);
    
    // Generate a unique file name
    const fileName = `${uuidv4()}.webm`;
    const filePath = `voice-messages/${fileName}`;

    // Upload the audio file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('messages')
      .upload(filePath, audioBlob);

    if (uploadError) {
      throw uploadError;
    }

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
        message_type: 'voice'
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error sending voice message:', error);
    toast({
      title: "Error",
      description: "Failed to send voice message",
      variant: "destructive",
    });
    throw error;
  }
};

// Get messages for a conversation
export const getMessages = async (conversationId: string) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

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

// Mark messages as seen
export const markMessagesAsSeen = async (conversationId: string, userId: string) => {
  try {
    const safeUserId = getDemoUUID(userId);
    
    const { error } = await supabase
      .from('messages')
      .update({ seen_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .neq('sender_id', safeUserId)
      .is('seen_at', null);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error marking messages as seen:', error);
  }
};
