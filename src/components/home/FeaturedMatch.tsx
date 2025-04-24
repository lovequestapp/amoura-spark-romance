import React, { useState } from 'react';
import { Star, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Profile } from './SwipeableCard';
import PersonalityBadges from './PersonalityBadges';

interface FeaturedMatchProps {
  profile: Profile;
  onViewProfile: () => void;
}

const FeaturedMatch: React.FC<FeaturedMatchProps> = ({ profile, onViewProfile }) => {
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(true);
  
  const handleClose = () => {
    setIsVisible(false);
    toast({
      description: "Featured match removed",
    });
  };
  
  if (!isVisible) return null;
  
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
                <h3 className="font-medium text-amoura-deep-pink">Today's Featured Match</h3>
              </div>
              <div className="flex items-center gap-2">
                {profile.personalityMatch && (
                  <span className="text-sm font-medium bg-white/80 rounded-full px-2 py-0.5">
                    {profile.personalityMatch}% match
                  </span>
                )}
                <button
                  onClick={handleClose}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close featured match"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
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
          </div>
          
          <div className="p-4">
            <p className="text-gray-700 mb-3 text-sm line-clamp-2">{profile.bio}</p>
            
            <button 
              onClick={onViewProfile}
              className="w-full py-2 bg-amoura-deep-pink text-white rounded-lg hover:bg-amoura-deep-pink/90 transition-colors"
            >
              View Full Profile
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeaturedMatch;
