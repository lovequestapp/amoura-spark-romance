
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { AlertTriangle, Info, Shield, Heart } from 'lucide-react';
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
  
  // Early return if profile is null or undefined
  if (!profile) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-50 rounded-2xl">
        <div className="text-center text-gray-500">
          <p>No profile data available</p>
        </div>
      </div>
    );
  }
  
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
    if (profile.prompts && profile.prompts.length > 0) {
      setPromptIndex((promptIndex + 1) % profile.prompts.length);
    }
  };
  
  // Check for match score to display compatibility indicators - with null safety
  const hasMatchScore = profile && 'matchScore' in profile && profile.matchScore !== null;
  const matchScore = hasMatchScore ? (profile as any).matchScore : (profile?.personalityMatch || 0);
  
  // Check for dealbreakers - with null safety
  const hasDealbreakers = profile?.dealbreakers && profile.dealbreakers.length > 0;

  // Check for attachment style - with null safety
  const hasAttachmentScore = profile && (profile as any).attachmentScore !== undefined;
  const attachmentScore = hasAttachmentScore ? (profile as any).attachmentScore : undefined;
  
  return (
    <div 
      className="w-full bg-transparent"
      style={{ maxWidth: isMobile ? '100%' : '400px' }}
    >
      {profile.photos && profile.photos.length > 0 && (
        <ProfilePhotos photos={profile.photos} video={profile.video} />
      )}
      
      <div className="px-4 py-3">
        <ProfileHeader 
          name={profile.name || 'Unknown'}
          age={profile.age || 0}
          distance={profile.distance || 'Unknown'}
          verified={profile.verified}
          premium={profile.premium}
          featured={profile.featured}
        />
        
        <p className="text-gray-700 mb-3">{profile.occupation || 'Not specified'}</p>
        
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

            {hasAttachmentScore && attachmentScore > 80 && (
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 flex items-center gap-1">
                <Heart size={12} className="fill-green-600" />
                <span>Compatible Style</span>
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
                        
                        {/* Show attachment style match if available */}
                        {hasAttachmentScore && (
                          <div className="flex justify-between">
                            <span>Attachment Style:</span>
                            <span className={attachmentScore && attachmentScore > 80 
                              ? "text-green-600 font-medium" 
                              : attachmentScore && attachmentScore < 50 
                                ? "text-red-500 font-medium"
                                : ""
                            }>
                              {attachmentScore}%
                            </span>
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
                                   dealbreaker === 'attachment-style' ? 'Incompatible attachment styles' :
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
                  <p className="text-gray-700 mb-4">{profile.bio || 'No bio available'}</p>
                  
                  {/* Display attachment style if available */}
                  {(profile as any).attachment_style && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Attachment Style:</p>
                        <Badge 
                          className={`${
                            (profile as any).attachment_style === 'secure' 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                              : (profile as any).attachment_style === 'anxious'
                                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                        >
                          {(profile as any).attachment_style === 'secure' 
                            ? 'Secure' 
                            : (profile as any).attachment_style === 'anxious'
                              ? 'Anxious'
                              : (profile as any).attachment_style === 'avoidant'
                                ? 'Avoidant'
                                : 'Fearful'}
                        </Badge>
                      </div>
                    </div>
                  )}
                  
                  {/* Display interests if available */}
                  {(profile as any).interests && (profile as any).interests.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Interests</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(profile as any).interests.map((interest: string, index: number) => (
                          <Badge key={index} variant="outline" className="bg-amoura-soft-pink/30 text-amoura-deep-pink border-amoura-deep-pink/20">
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
                  
                  {profile.prompts && profile.prompts.length > 0 && (
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
              profileName={profile.name || 'Unknown'}
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
    </div>
  );
};

export default EnhancedProfileCard;
