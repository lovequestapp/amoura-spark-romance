
import React from 'react';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: {
    id: string;
    text?: string | null;
    voice_url?: string | null;
    sender: 'user' | 'match';
    time: string;
    seen?: boolean;
    message_type?: 'text' | 'voice' | 'image';
  };
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          isUser 
            ? 'bg-amoura-deep-pink text-white' 
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {message.message_type === 'voice' && message.voice_url ? (
          <div className="space-y-2">
            <audio 
              src={message.voice_url} 
              controls 
              className="max-w-full h-10"
              onError={(e) => {
                console.error('Failed to load voice message:', message.voice_url);
                console.error('Audio error event:', e);
              }}
              onLoadStart={() => {
                console.log('Loading voice message:', message.voice_url);
              }}
              onCanPlayThrough={() => {
                console.log('Voice message can play through:', message.voice_url);
              }}
            />
          </div>
        ) : message.message_type === 'image' && message.text ? (
          <div className="space-y-2">
            <img 
              src={message.text} 
              alt="Shared image" 
              className="max-w-full h-auto rounded-lg max-h-64 object-cover"
              onError={(e) => {
                console.error('Failed to load image:', message.text);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        ) : (
          <p className="break-words">{message.text}</p>
        )}
        
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className={`text-xs ${isUser ? 'text-white/70' : 'text-gray-500'}`}>
            {format(new Date(message.time), 'h:mm a')}
          </span>
          {isUser && (
            <span className="text-xs text-white/70">
              {message.seen ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
