
import React, { useState } from 'react';
import { MessageCircle, Heart, X } from 'lucide-react';
import ProfilePhotos from './ProfilePhotos';
import ProfilePrompt from './ProfilePrompt';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface Profile {
  id: number;
  name: string;
  age: number;
  distance: string;
  occupation: string;
  photos: string[];
  bio: string;
  prompts: {
    question: string;
    answer: string;
  }[];
}

interface ProfileCardProps {
  profile: Profile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  const [expanded, setExpanded] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);
  
  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  
  const nextPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPromptIndex((promptIndex + 1) % profile.prompts.length);
  };
  
  return (
    <motion.div 
      layout
      className="swipe-card touch-none mx-auto"
      style={{ maxWidth: 'calc(100% - 24px)', width: '100%' }}
    >
      <ProfilePhotos photos={profile.photos} />
      
      <div className="px-4 py-3">
        <div className="flex justify-between items-baseline mb-1">
          <h2 className="text-xl font-bold">
            {profile.name}, {profile.age}
          </h2>
          <span className="text-sm text-gray-500">{profile.distance}</span>
        </div>
        
        <p className="text-gray-700 mb-3">{profile.occupation}</p>
        
        {!expanded ? (
          <Button 
            onClick={toggleExpand}
            variant="ghost" 
            className="w-full flex justify-between items-center py-2 px-0 hover:bg-amoura-soft-pink hover:text-amoura-deep-pink transition-colors"
          >
            <span>View profile</span>
            <span>↓</span>
          </Button>
        ) : (
          <div className="animate-fade-in">
            <p className="text-gray-700 mb-4">{profile.bio}</p>
            
            {profile.prompts.length > 0 && (
              <div onClick={nextPrompt} className="mb-4 cursor-pointer">
                <ProfilePrompt 
                  question={profile.prompts[promptIndex].question}
                  answer={profile.prompts[promptIndex].answer}
                />
                {profile.prompts.length > 1 && (
                  <div className="flex justify-center mt-2 space-x-1">
                    {profile.prompts.map((_, index) => (
                      <div 
                        key={index}
                        className={`h-1 w-4 rounded-full ${
                          index === promptIndex ? 'bg-amoura-deep-pink' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
              >
                <X size={16} className="mr-1" />
                Pass
              </Button>
              
              <Button
                size="sm"
                className="rounded-full bg-transparent border border-amoura-deep-pink text-amoura-deep-pink hover:bg-amoura-soft-pink"
              >
                <MessageCircle size={16} className="mr-1" />
                Message
              </Button>
              
              <Button
                size="sm"
                className="rounded-full bg-amoura-deep-pink hover:bg-amoura-deep-pink/90"
              >
                <Heart size={16} className="mr-1" />
                Like
              </Button>
            </div>
            
            <Button 
              onClick={toggleExpand}
              variant="ghost" 
              className="w-full flex justify-between items-center py-2 px-0 mt-2 hover:bg-amoura-soft-pink hover:text-amoura-deep-pink transition-colors"
            >
              <span>Close</span>
              <span>↑</span>
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfileCard;
