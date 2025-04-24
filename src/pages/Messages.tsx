
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Image, Send, Mic } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import IceBreaker from '@/components/messages/IceBreaker';
import { supabase } from '@/integrations/supabase/client';
import { getOrCreateConversation, sendTextMessage, sendVoiceMessage, getMessages, markMessagesAsSeen } from '@/services/messaging';
import MessageBubble from '@/components/messages/MessageBubble';
import EmojiPicker from '@/components/messages/EmojiPicker';
import VoiceRecorder from '@/components/messages/VoiceRecorder';
import { toast } from '@/components/ui/use-toast';

interface MatchProfile {
  id: number;
  name: string;
  photo: string;
}

interface Message {
  id: string;
  text?: string | null;
  voice_url?: string | null;
  sender: 'user' | 'match';
  time: string;
  seen?: boolean;
  message_type?: 'text' | 'voice' | 'image';
}

const matchProfiles: Record<string, MatchProfile> = {
  '1': {
    id: 1,
    name: 'Emma',
    photo: '/lovable-uploads/955e854b-03c9-4efe-91de-ea62233f88eb.png'
  },
  '2': {
    id: 2,
    name: 'Alex',
    photo: '/lovable-uploads/d96b24ef-01b0-41a0-afdf-564574149a3c.png'
  },
  '3': {
    id: 3,
    name: 'Sofia',
    photo: '/lovable-uploads/c3b91871-0b81-4711-a02d-6771b41f44ed.png'
  }
};

const Messages = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get match profile based on route parameter
  const match = id && matchProfiles[id] ? matchProfiles[id] : null;

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load messages when conversation ID changes
  useEffect(() => {
    const loadMessages = async () => {
      if (!user?.id || !id || !match) return;
      
      try {
        setLoading(true);
        
        // Get or create conversation
        const conversation = await getOrCreateConversation(user.id, id);
        setConversationId(conversation.id);
        
        // Get messages
        const dbMessages = await getMessages(conversation.id);
        
        // Transform to UI format
        const formattedMessages = dbMessages.map((msg): Message => ({
          id: msg.id,
          text: msg.content,
          voice_url: msg.voice_url,
          sender: msg.sender_id === user.id ? 'user' : 'match',
          time: msg.created_at,
          seen: !!msg.seen_at,
          message_type: msg.message_type
        }));
        
        setMessages(formattedMessages);
        
        // Mark messages as seen
        await markMessagesAsSeen(conversation.id, user.id);
        
        // Set up subscription for real-time updates
        const subscription = supabase
          .channel('messages_channel')
          .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversation.id}` }, 
            async (payload) => {
              if (payload.eventType === 'INSERT') {
                const newMsg = payload.new;
                
                // Only add message if not from current user
                if (newMsg.sender_id !== user.id) {
                  const formattedMsg: Message = {
                    id: newMsg.id,
                    text: newMsg.content,
                    voice_url: newMsg.voice_url,
                    sender: 'match',
                    time: newMsg.created_at,
                    seen: false,
                    message_type: newMsg.message_type
                  };
                  
                  setMessages(prev => [...prev, formattedMsg]);
                  
                  // Mark as seen
                  await markMessagesAsSeen(conversation.id, user.id);
                }
              } else if (payload.eventType === 'UPDATE') {
                // Handle message updates (e.g., marking as seen)
                if (payload.new.seen_at && payload.old.seen_at === null) {
                  setMessages(prev => prev.map(msg => 
                    msg.id === payload.new.id ? {...msg, seen: true} : msg
                  ));
                }
              }
          })
          .subscribe();
        
        return () => {
          supabase.removeChannel(subscription);
        };
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
  }, [user, id, match]);
  
  // Scroll to bottom on messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Handle sending text message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user?.id || !conversationId) return;
    
    try {
      // Send to database
      const sentMessage = await sendTextMessage(conversationId, user.id, newMessage.trim());
      
      // Add to UI
      const formattedMsg: Message = {
        id: sentMessage.id,
        text: sentMessage.content,
        sender: 'user',
        time: sentMessage.created_at,
        seen: false,
        message_type: 'text'
      };
      
      setMessages(prev => [...prev, formattedMsg]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };
  
  // Handle sending voice message
  const handleSendVoice = async (audioBlob: Blob) => {
    if (!user?.id || !conversationId) return;
    
    try {
      // Send to database
      const sentMessage = await sendVoiceMessage(conversationId, user.id, audioBlob);
      
      // Add to UI
      const formattedMsg: Message = {
        id: sentMessage.id,
        voice_url: sentMessage.voice_url,
        sender: 'user',
        time: sentMessage.created_at,
        seen: false,
        message_type: 'voice'
      };
      
      setMessages(prev => [...prev, formattedMsg]);
      setShowVoiceRecorder(false);
    } catch (error) {
      console.error('Failed to send voice message:', error);
    }
  };
  
  // Handle adding emoji to message
  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
  };
  
  // Handle ice breaker selection
  const useIceBreaker = (text: string) => {
    setNewMessage(text);
  };
  
  // Fallback when no match is selected
  if (!id || !match) {
    return (
      <AppLayout>
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div>
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-2xl font-bold mb-2">Your messages will appear here</h2>
            <p className="text-gray-500">When you match with someone, you can start a conversation</p>
          </div>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout hideNavigation>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b flex items-center">
          <ArrowLeft size={20} className="mr-3" onClick={() => navigate('/matches')} />
          <div className="flex items-center">
            <img 
              src={match.photo} 
              alt={match.name}
              className="h-10 w-10 rounded-full object-cover mr-3"
            />
            <div>
              <h2 className="font-medium">{match.name}</h2>
              <span className="text-xs text-gray-500">Online now</span>
            </div>
          </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin h-6 w-6 border-2 border-amoura-deep-pink border-t-transparent rounded-full"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="font-medium mb-1">It's a match!</h3>
              <p className="text-sm text-gray-500 mb-6">Send a message to start the conversation</p>
            </div>
          ) : (
            <>
              <div className="text-center">
                <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-500">
                  {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
              
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        {showVoiceRecorder ? (
          <div className="p-3 border-t">
            <VoiceRecorder 
              onSendVoice={handleSendVoice} 
              onCancel={() => setShowVoiceRecorder(false)} 
            />
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="p-3 border-t flex items-center gap-2">
            <button type="button" className="text-gray-500 p-2">
              <Image size={20} />
            </button>
            
            <div className="flex-1 relative">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="rounded-full pr-10"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <EmojiPicker onEmojiSelect={handleEmojiSelect} />
              </div>
            </div>
            
            {newMessage ? (
              <button 
                type="submit" 
                className="text-amoura-deep-pink bg-transparent p-2"
              >
                <Send size={20} />
              </button>
            ) : (
              <button 
                type="button" 
                className="text-amoura-deep-pink bg-transparent p-2"
                onClick={() => setShowVoiceRecorder(true)}
              >
                <Mic size={20} />
              </button>
            )}
          </form>
        )}
        
        {/* Ice Breaker at bottom */}
        {(messages.length === 0 || messages.length < 3) && !showVoiceRecorder && (
          <div className="p-3 pt-0">
            <IceBreaker onUse={useIceBreaker} />
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Messages;
