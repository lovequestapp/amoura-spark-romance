
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Image, Send } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import IceBreaker from '@/components/messages/IceBreaker';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'match';
  time: string;
  seen: boolean;
}

const conversations: Record<string, {
  match: {
    id: number;
    name: string;
    photo: string;
  },
  messages: Message[];
}> = {
  '1': {
    match: {
      id: 1,
      name: 'Emma',
      photo: '/assets/profile-1a.jpg'
    },
    messages: []
  },
  '2': {
    match: {
      id: 2,
      name: 'Alex',
      photo: '/assets/profile-2a.jpg'
    },
    messages: [
      {
        id: 1,
        text: "Hey there! I noticed we both love hiking. Any favorite trails?",
        sender: 'match',
        time: '2:34 PM',
        seen: true
      }
    ]
  },
  '3': {
    match: {
      id: 3,
      name: 'Sofia',
      photo: '/assets/profile-3a.jpg'
    },
    messages: [
      {
        id: 1,
        text: "Hi! I really liked your answer about favorite travel destinations.",
        sender: 'match',
        time: '11:20 AM',
        seen: true
      },
      {
        id: 2,
        text: "Thanks! I've been lucky to visit some amazing places. What about you?",
        sender: 'user',
        time: '11:45 AM',
        seen: true
      },
      {
        id: 3,
        text: "I love exploring Europe, but my dream is to visit Japan someday.",
        sender: 'match',
        time: '12:15 PM',
        seen: true
      },
      {
        id: 4,
        text: "Japan is incredible! I went to Tokyo and Kyoto last year. I can recommend some restaurants if you ever go.",
        sender: 'user',
        time: '12:30 PM',
        seen: true
      },
      {
        id: 5,
        text: "Thanks for the recommendation! I'll check out that restaurant this weekend.",
        sender: 'match',
        time: '1:05 PM',
        seen: false
      }
    ]
  }
};

const Messages = () => {
  const { id } = useParams<{ id: string }>();
  const [newMessage, setNewMessage] = useState('');
  
  if (!id || !conversations[id]) {
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
  
  const conversation = conversations[id];
  const { match, messages } = conversation;
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // In a real app, we would send this to an API
      // For now, we'll just simulate adding it to the local state
      setNewMessage('');
    }
  };
  
  return (
    <AppLayout hideNavigation>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b flex items-center">
          <ArrowLeft size={20} className="mr-3" onClick={() => window.history.back()} />
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
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="font-medium mb-1">It's a match!</h3>
              <p className="text-sm text-gray-500 mb-6">Send a message to start the conversation</p>
              
              <IceBreaker />
            </div>
          ) : (
            <>
              <div className="text-center">
                <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-500">
                  {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
              
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`message-bubble ${message.sender === 'user' ? 'sent' : 'received'}`}>
                    <p>{message.text}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-xs opacity-70">{message.time}</span>
                      {message.sender === 'user' && (
                        <span className="text-xs">
                          {message.seen ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {messages.length > 0 && messages.length < 3 && <IceBreaker />}
            </>
          )}
        </div>
        
        <form onSubmit={handleSendMessage} className="p-4 border-t flex items-center gap-3">
          <button type="button" className="text-gray-500">
            <Image size={20} />
          </button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full"
          />
          <button 
            type="submit" 
            className={`${newMessage ? 'text-amoura-deep-pink' : 'text-gray-400'}`}
            disabled={!newMessage}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </AppLayout>
  );
};

export default Messages;
