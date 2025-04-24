
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Heart, X, Info, Star } from 'lucide-react';
import ProfilePhotos from '@/components/profile/ProfilePhotos';
import ProfilePrompt from '@/components/profile/ProfilePrompt';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PersonalityMatch from './PersonalityMatch';
import { useToast } from '@/components/ui/use-toast';

interface Profile {
  id: number;
  name: string;
  age: number;
  distance: string;
  occupation: string;
  photos: string[];
  bio: string;
  premium?: boolean;
  personalityMatch?: number;
  prompts: {
    question: string;
    answer: string;
  }[];
  traits?: Array<{
    name: string;
    score: number;
  }>;
}

interface EnhancedProfileCardProps {
  profile: Profile;
  onSwipe: (direction: string) => void;
}

const EnhancedProfileCard: React.FC<EnhancedProfileCardProps> = ({ profile, onSwipe }) => {
  const [expanded, setExpanded] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);
  const [showPersonality, setShowPersonality] = useState(false);
  const { toast } = useToast();
  
  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  
  const nextPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPromptIndex((promptIndex + 1) % profile.prompts.length);
  };

  const handleLike = () => {
    onSwipe('right');
    toast({
      title: "Liked!",
      description: `You liked ${profile.name}'s profile.`,
    });
  };

  const handlePass = () => {
    onSwipe('left');
    toast({
      description: `You passed on ${profile.name}'s profile.`,
    });
  };

  const handleMessage = () => {
    toast({
      title: "Message Feature",
      description: "You can message after matching with this profile.",
    });
  };
  
  return (
    <motion.div 
      layout
      className="swipe-card touch-none"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ProfilePhotos photos={profile.photos} />
      
      <div className="px-4 py-3">
        <div className="flex justify-between items-baseline mb-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">
              {profile.name}, {profile.age}
            </h2>
            {profile.premium && (
              <Badge variant="premium" className="h-5">Premium</Badge>
            )}
          </div>
          <span className="text-sm text-gray-500">{profile.distance}</span>
        </div>
        
        <p className="text-gray-700 mb-3">{profile.occupation}</p>
        
        {!expanded ? (
          <>
            {profile.personalityMatch && (
              <div 
                onClick={() => setShowPersonality(true)}
                className="flex items-center gap-1 text-sm text-amoura-deep-pink mb-3 cursor-pointer"
              >
                <Info size={14} />
                <span>{profile.personalityMatch}% match with your personality</span>
              </div>
            )}
            
            <Button 
              onClick={toggleExpand}
              variant="ghost" 
              className="w-full flex justify-between items-center py-2 px-0"
            >
              <span>View profile</span>
              <span>↓</span>
            </Button>
          </>
        ) : (
          <div className="animate-fade-in">
            <AnimatePresence mode="wait">
              {showPersonality && profile.traits ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4"
                >
                  <PersonalityMatch 
                    matchPercentage={profile.personalityMatch || 0} 
                    traits={profile.traits}
                  />
                  <Button 
                    onClick={() => setShowPersonality(false)}
                    variant="ghost"
                    className="w-full mt-2 text-sm"
                  >
                    Hide Personality Match
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-gray-700 mb-4">{profile.bio}</p>
                  
                  {profile.personalityMatch && !showPersonality && (
                    <Button 
                      onClick={() => setShowPersonality(true)}
                      variant="outline"
                      className="w-full mb-4 text-sm"
                      size="sm"
                    >
                      <Info size={14} className="mr-2" />
                      Show Personality Match
                    </Button>
                  )}
                  
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
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="flex justify-between">
              <Button
                onClick={handlePass}
                variant="outline"
                size="sm"
                className="rounded-full"
              >
                <X size={16} className="mr-1" />
                Pass
              </Button>
              
              <Button
                onClick={handleMessage}
                size="sm"
                className="rounded-full bg-transparent border border-amoura-deep-pink text-amoura-deep-pink hover:bg-amoura-soft-pink"
              >
                <MessageCircle size={16} className="mr-1" />
                Message
              </Button>
              
              <Button
                onClick={handleLike}
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
              className="w-full flex justify-between items-center py-2 px-0 mt-2"
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

export default EnhancedProfileCard;
