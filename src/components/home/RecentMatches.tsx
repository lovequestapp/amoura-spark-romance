
import React, { useState } from 'react';
import { Star, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Profile } from './SwipeableCard';
import PersonalityBadges from './PersonalityBadges';

interface RecentMatchesProps {
  profiles: Profile[];
  onViewProfile: (profileId: number | string) => void;
}

const RecentMatches: React.FC<RecentMatchesProps> = ({ profiles, onViewProfile }) => {
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(true);
  
  const handleClose = () => {
    setIsVisible(false);
    toast({
      description: "Recent matches removed",
    });
  };
  
  if (!isVisible || profiles.length === 0) return null;
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
          className="bg-white rounded-xl shadow-md overflow-hidden mb-4 border border-amoura-soft-pink"
        >
          <div className="p-4 bg-gradient-to-r from-amoura-soft-pink to-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-amoura-gold fill-amoura-gold mr-2" />
                <h3 className="font-medium text-amoura-deep-pink">Recent Matches</h3>
              </div>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close recent matches"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            
            <div className="flex flex-col space-y-4">
              {profiles.map((profile) => (
                <div key={profile.id} className="flex items-center space-x-3 border-b last:border-b-0 border-gray-100 pb-3 last:pb-0">
                  <div className="relative">
                    <img 
                      src={profile.photos[0]}
                      alt={profile.name}
                      className="h-20 w-20 object-cover rounded-full border-2 border-white"
                    />
                    {profile.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                        <CheckCircle className="h-5 w-5 text-blue-500 fill-white" />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-bold text-lg">{profile.name}, {profile.age}</h4>
                      {profile.verified && (
                        <CheckCircle className="h-4 w-4 ml-1 text-blue-500 fill-white" />
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{profile.occupation}</p>
                    <p className="text-gray-500 text-xs">{profile.distance}</p>
                    
                    {profile.relationshipIntention && profile.personalityBadges && (
                      <PersonalityBadges 
                        intention={profile.relationshipIntention} 
                        badges={profile.personalityBadges.slice(0, 1)} 
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4">
            <button 
              onClick={() => profiles.length > 0 && onViewProfile(profiles[0].id)}
              className="w-full py-2 bg-amoura-deep-pink text-white rounded-lg hover:bg-amoura-deep-pink/90 transition-colors"
            >
              View All Matches
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RecentMatches;
