
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import ProfilePhotos from '@/components/profile/ProfilePhotos';
import ProfilePrompt from '@/components/profile/ProfilePrompt';
import PersonalityMatch from './PersonalityMatch';
import PersonalityBadges from './PersonalityBadges';
import ProfileHeader from './card/ProfileHeader';
import MatchInfo from './card/MatchInfo';
import CardActions from './card/CardActions';
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

  const nextPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPromptIndex((promptIndex + 1) % profile.prompts.length);
  };
  
  return (
    <motion.div 
      layout
      className="swipe-card touch-none mx-auto"
      style={{ maxWidth: isMobile ? 'calc(100% - 24px)' : '400px', width: '100%' }}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <ProfilePhotos photos={profile.photos} video={profile.video} />
      
      <div className="px-4 py-3">
        <ProfileHeader 
          name={profile.name}
          age={profile.age}
          distance={profile.distance}
          verified={profile.verified}
          premium={profile.premium}
          featured={profile.featured}
        />
        
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
            <MatchInfo 
              personalityMatch={profile.personalityMatch}
              onClick={() => setShowPersonality(true)}
            />
            
            <Button 
              onClick={() => setExpanded(true)}
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
            
            <CardActions
              profileName={profile.name}
              onLike={handleLike}
              onPass={handlePass}
            />
            
            <Button 
              onClick={() => setExpanded(false)}
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
