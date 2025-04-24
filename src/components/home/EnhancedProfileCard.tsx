import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Heart, X, Info, Star, CheckCircle } from 'lucide-react';
import ProfilePhotos from '@/components/profile/ProfilePhotos';
import ProfilePrompt from '@/components/profile/ProfilePrompt';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PersonalityMatch from './PersonalityMatch';
import PersonalityBadges from './PersonalityBadges';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Profile } from './SwipeableCard';

interface EnhancedProfileCardProps {
  profile: Profile;
  onSwipe: (direction: string) => void;
}

const EnhancedProfileCard: React.FC<EnhancedProfileCardProps> = ({ profile, onSwipe }) => {
  const [expanded, setExpanded] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);
  const [showPersonality, setShowPersonality] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
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
      className="swipe-card touch-none mx-auto"
      style={{ maxWidth: isMobile ? 'calc(100% - 24px)' : '400px', width: '100%' }}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 25
      }}
    >
      <ProfilePhotos photos={profile.photos} />
      
      <div className="px-4 py-3">
        <div className="flex justify-between items-baseline mb-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold flex items-center">
              {profile.name}, {profile.age}
              {profile.verified && (
                <CheckCircle className="h-4 w-4 ml-1 text-blue-500 fill-white" />
              )}
            </h2>
            {profile.premium && (
              <Badge variant="premium" className="h-5">Premium</Badge>
            )}
            {profile.featured && (
              <Badge className="bg-gradient-to-r from-amoura-gold to-amber-400 text-black h-5 flex items-center">
                <Star className="h-3 w-3 mr-1 fill-black" /> Featured
              </Badge>
            )}
          </div>
          <span className="text-sm text-gray-500">{profile.distance}</span>
        </div>
        
        <p className="text-gray-700 mb-3">{profile.occupation}</p>
        
        {profile.relationshipIntention && profile.personalityBadges && (
          <div className="mb-3">
            <PersonalityBadges 
              intention={profile.relationshipIntention} 
              badges={profile.personalityBadges.slice(0, 2)} 
            />
          </div>
        )}
        
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
              className="w-full flex justify-between items-center py-2 px-0 hover:bg-amoura-soft-pink hover:text-amoura-deep-pink transition-colors"
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
                  transition={{ duration: 0.3 }}
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
                  transition={{ duration: 0.3 }}
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

export default EnhancedProfileCard;
