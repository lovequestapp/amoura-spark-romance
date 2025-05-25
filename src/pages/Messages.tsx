
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Image, Send, Mic } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import IceBreaker from '@/components/messages/IceBreaker';
import MessageBubble from '@/components/messages/MessageBubble';
import EmojiPicker from '@/components/messages/EmojiPicker';
import VoiceRecorder from '@/components/messages/VoiceRecorder';
import { useRealtimeMessages } from '@/hooks/useRealtimeMessages';
import { useConversation } from '@/hooks/useConversation';
import { useSendMessage } from '@/hooks/useSendMessage';

interface MatchProfile {
  id: string;
  name: string;
  photo: string;
}

const matchProfiles: Record<string, MatchProfile> = {
  '00000000-0000-0000-0000-000000000001': {
    id: '1',
    name: 'Emma',
    photo: '/lovable-uploads/955e854b-03c9-4efe-91de-ea62233f88eb.png'
  },
  '00000000-0000-0000-0000-000000000002': {
    id: '2',
    name: 'Alex',
    photo: '/lovable-uploads/d96b24ef-01b0-41a0-afdf-564574149a3c.png'
  },
  '00000000-0000-0000-0000-000000000003': {
    id: '3',
    name: 'Sofia',
    photo: '/lovable-uploads/c3b91871-0b81-4711-a02d-6771b41f44ed.png'
  }
};

const Messages = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [newMessage, setNewMessage] = useState('');
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const match = id && matchProfiles[id] ? matchProfiles[id] : null;
  const userId = user?.id || 'demo-user';

  // Use our custom hooks
  const { conversation, loading: conversationLoading } = useConversation(
    userId,
    id ? id : null
  );
  
  const { messages, loading: messagesLoading, addMessage } = useRealtimeMessages(
    conversation?.id || null,
    userId
  );
  
  const { sendTextMessage, sendVoiceMessage, sending } = useSendMessage(
    conversation?.id || null,
    userId,
    addMessage
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Attempting to send message:', {
      message: newMessage.trim(),
      conversationId: conversation?.id,
      userId,
      sending
    });
    
    if (!newMessage.trim() || sending || !conversation?.id) {
      console.log('Cannot send message - missing data or already sending');
      return;
    }
    
    try {
      const result = await sendTextMessage(newMessage.trim());
      console.log('Send message result:', result);
      
      if (result) {
        setNewMessage('');
        console.log('Message sent successfully, clearing input');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  const handleSendVoice = async (audioBlob: Blob) => {
    if (sending || !conversation?.id) return;
    
    const result = await sendVoiceMessage(audioBlob);
    if (result) {
      setShowVoiceRecorder(false);
    }
  };
  
  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
  };
  
  const useIceBreaker = (text: string) => {
    setNewMessage(text);
  };
  
  const loading = conversationLoading || messagesLoading;
  
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
        <div className="p-4 border-b flex items-center bg-white">
          <ArrowLeft 
            size={20} 
            className="mr-3 cursor-pointer text-gray-600 hover:text-gray-800" 
            onClick={() => navigate('/matches')} 
          />
          <div className="flex items-center">
            <img 
              src={match.photo} 
              alt={match.name}
              className="h-10 w-10 rounded-full object-cover mr-3 border border-gray-200"
            />
            <div>
              <h2 className="font-medium">{match.name}</h2>
              <span className="text-xs text-green-500">Online now</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
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
                <span className="text-xs bg-white px-3 py-1 rounded-full text-gray-500 shadow-sm">
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
        
        {showVoiceRecorder ? (
          <div className="p-3 border-t bg-white">
            <VoiceRecorder 
              onSendVoice={handleSendVoice} 
              onCancel={() => setShowVoiceRecorder(false)} 
            />
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="p-3 border-t flex items-center gap-2 bg-white">
            <button type="button" className="text-gray-500 p-2 hover:text-gray-700 transition-colors">
              <Image size={20} />
            </button>
            
            <div className="flex-1 relative">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="rounded-full pr-10 border-gray-300 focus:border-amoura-deep-pink"
                disabled={sending || !conversation?.id}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <EmojiPicker onEmojiSelect={handleEmojiSelect} />
              </div>
            </div>
            
            {newMessage.trim() ? (
              <button 
                type="submit" 
                className="text-amoura-deep-pink bg-transparent p-2 hover:bg-amoura-deep-pink/10 rounded-full transition-colors disabled:opacity-50"
                disabled={sending || !conversation?.id}
              >
                <Send size={20} />
              </button>
            ) : (
              <button 
                type="button" 
                className="text-amoura-deep-pink bg-transparent p-2 hover:bg-amoura-deep-pink/10 rounded-full transition-colors"
                onClick={() => setShowVoiceRecorder(true)}
                disabled={sending || !conversation?.id}
              >
                <Mic size={20} />
              </button>
            )}
          </form>
        )}
        
        {(messages.length === 0 || messages.length < 3) && !showVoiceRecorder && (
          <div className="p-3 mt-2 bg-white">
            <IceBreaker onUse={useIceBreaker} />
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Messages;
