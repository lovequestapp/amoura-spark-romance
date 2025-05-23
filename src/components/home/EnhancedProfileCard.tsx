
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { AlertTriangle, Info, Shield } from 'lucide-react';
import ProfilePhotos from '@/components/profile/ProfilePhotos';
import ProfilePrompt from '@/components/profile/ProfilePrompt';
import PersonalityMatch from './PersonalityMatch';
import PersonalityBadges from './PersonalityBadges';
import ProfileHeader from './card/ProfileHeader';
import MatchInfo from './card/MatchInfo';
import CardActions from './card/CardActions';
import { Profile } from './SwipeableCard';
import { Badge } from '@/components/ui/badge';

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
  
  // Check for match score to display compatibility indicators
  const hasMatchScore = 'matchScore' in profile;
  const matchScore = hasMatchScore ? (profile as any).matchScore : profile.personalityMatch;
  
  // Check for dealbreakers
  const hasDealbreakers = profile.dealbreakers && profile.dealbreakers.length > 0;
  
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
        
        {hasMatchScore && (
          <div className="mb-3 flex flex-wrap gap-2 items-center">
            <Badge className={`bg-gradient-to-r ${matchScore > 80 
              ? 'from-amoura-deep-pink to-pink-500 hover:from-amoura-deep-pink hover:to-pink-600' 
              : matchScore > 65
                ? 'from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600'
                : 'from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600'
              } text-white font-semibold`}>
              {matchScore}% Match
            </Badge>
            
            {hasDealbreakers && (
              <Badge variant="outline" className="bg-red-50 text-red-500 border-red-200 flex items-center gap-1">
                <AlertTriangle size={12} />
                <span>Dealbreaker</span>
              </Badge>
            )}
          </div>
        )}
        
        {!expanded ? (
          <>
            <MatchInfo 
              personalityMatch={profile.personalityMatch || matchScore}
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
                    matchPercentage={profile.personalityMatch || matchScore || 0} 
                    traits={profile.traits}
                  />
                  
                  {/* Show detailed match metrics if available */}
                  {hasMatchScore && (profile as any).interestsScore && (
                    <div className="mt-3 space-y-2">
                      <h4 className="text-sm font-medium">Compatibility Details:</h4>
                      <div className="space-y-1.5 text-xs text-gray-600">
                        <div className="flex justify-between">
                          <span>Interests Match:</span>
                          <span>{(profile as any).interestsScore}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Personality Match:</span>
                          <span>{(profile as any).personalityScore}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Intention Match:</span>
                          <span>{(profile as any).intentionScore}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Location Match:</span>
                          <span>{(profile as any).locationScore}%</span>
                        </div>
                        
                        {/* Show lifestyle match if available */}
                        {(profile as any).lifestyleScore !== undefined && (
                          <div className="flex justify-between">
                            <span>Lifestyle Match:</span>
                            <span>{(profile as any).lifestyleScore}%</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Display dealbreakers if present */}
                      {hasDealbreakers && (
                        <div className="mt-2 pt-2 border-t border-red-100">
                          <div className="flex items-center gap-1 text-red-500 text-xs mb-1">
                            <AlertTriangle size={12} />
                            <span className="font-medium">Potential Dealbreakers:</span>
                          </div>
                          <ul className="text-xs text-red-500">
                            {profile.dealbreakers?.map((dealbreaker, idx) => (
                              <li key={idx} className="flex items-center gap-1 ml-4">
                                • {dealbreaker === 'smoking' ? 'Smoking habits' : 
                                   dealbreaker === 'kids-views' ? 'Different views on children' : 
                                   dealbreaker}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                  
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
                  
                  {/* Display interests if available */}
                  {(profile as any).interests && (profile as any).interests.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Interests</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(profile as any).interests.map((interest: string) => (
                          <Badge key={interest} variant="outline" className="bg-amoura-soft-pink/30 text-amoura-deep-pink border-amoura-deep-pink/20">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Display lifestyle information if available */}
                  {profile.lifestyle && Object.keys(profile.lifestyle).length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Lifestyle</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {Object.entries(profile.lifestyle).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-1.5">
                            <span className="text-gray-500 capitalize">{key}:</span>
                            <span className="font-medium">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {(profile.personalityMatch || matchScore) && !showPersonality && (
                    <Button 
                      onClick={() => setShowPersonality(true)}
                      variant="outline"
                      className="w-full mb-4 text-sm"
                      size="sm"
                    >
                      <Info size={14} className="mr-2" />
                      Show Compatibility Details
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
