
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Rewind, 
  Star,
  Bolt,
  Lock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/contexts/SubscriptionContext';
import PremiumModal from './PremiumModal';
import { cn } from '@/lib/utils';

export interface PremiumFeaturesProps {
  onRewind?: () => void;
  onSuperLike?: () => void;
  onBoost?: () => void;
}

export const PremiumFeatures: React.FC<PremiumFeaturesProps> = ({ 
  onRewind,
  onSuperLike,
  onBoost
}) => {
  const { toast } = useToast();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  
  const { 
    tier, 
    features, 
    remainingRewinds,
    remainingSuperLikes,
    boostActive,
    boostUntil,
    performRewind,
    performSuperLike,
    activateBoost
  } = useSubscription();
  
  // Display count based on feature limits
  const getFeatureCount = (feature: number | 'unlimited', remaining: number) => {
    if (feature === 'unlimited') return 'Unlimited';
    return `${remaining}/${feature}`;
  };
  
  // Check if user has premium features
  const canRewind = tier !== 'foundation' || features.rewinds > 0;
  const canSuperLike = tier !== 'foundation' || features.superLikes > 0;
  const canBoost = tier !== 'foundation' && features.boosts > 0;
  
  const handleRewind = async () => {
    const canProceed = await performRewind();
    
    if (canProceed) {
      if (onRewind) {
        onRewind();
      } else {
        toast({
          title: "Rewind",
          description: "You've rewound to the previous profile.",
        });
      }
    }
  };
  
  const handleSuperLike = async () => {
    const canProceed = await performSuperLike();
    
    if (canProceed) {
      if (onSuperLike) {
        onSuperLike();
      } else {
        toast({
          title: "Super Like",
          description: "You've super liked this profile!",
        });
      }
    }
  };
  
  const handleBoost = async () => {
    // If already boosted, just show status
    if (boostActive) {
      const timeRemaining = boostUntil ? Math.ceil((boostUntil.getTime() - Date.now()) / 1000 / 60) : 0;
      
      toast({
        title: "Boost Active",
        description: `Your profile is already boosted for ${timeRemaining} more minutes.`,
      });
      return;
    }
    
    const success = await activateBoost();
    
    if (success && onBoost) {
      onBoost();
    }
  };
  
  const renderTierBadge = () => {
    if (!tier || tier === 'foundation') return null;
    
    const colors: Record<string, string> = {
      'connection': 'bg-blue-100 text-blue-800',
      'chemistry': 'bg-amber-100 text-amber-800',
      'commitment': 'bg-purple-100 text-purple-800'
    };
    
    return (
      <Badge className={`${colors[tier]} capitalize`}>
        {tier} Member
      </Badge>
    );
  };
  
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Premium Features</h3>
        {renderTierBadge()}
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant={canRewind ? "outline" : "ghost"}
            size="lg"
            className={cn(
              "relative w-full h-24 flex flex-col items-center justify-center gap-1 border-2",
              !canRewind ? "opacity-70 border-gray-200" : "border-blue-400 hover:border-blue-500 hover:bg-blue-50",
              {"border-blue-500 bg-blue-50": remainingRewinds > 0}
            )}
            onClick={canRewind ? handleRewind : () => setShowPremiumModal(true)}
          >
            {!canRewind && <Lock size={14} className="absolute top-2 right-2 text-gray-400" />}
            <Rewind size={24} className={cn(
              "transition-colors",
              canRewind ? "text-blue-500" : "text-gray-400"
            )} />
            <span className="text-xs font-medium">Rewind</span>
            {canRewind && features.rewinds && (
              <span className={cn(
                "text-[10px] px-2 py-0.5 rounded-full",
                remainingRewinds > 0 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
              )}>
                {getFeatureCount(features.rewinds, remainingRewinds)}
              </span>
            )}
          </Button>
        </motion.div>
        
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant={canSuperLike ? "outline" : "ghost"}
            size="lg"
            className={cn(
              "relative w-full h-24 flex flex-col items-center justify-center gap-1 border-2",
              !canSuperLike ? "opacity-70 border-gray-200" : "border-amber-400 hover:border-amber-500 hover:bg-amber-50",
              {"border-amber-500 bg-amber-50": remainingSuperLikes > 0}
            )}
            onClick={canSuperLike ? handleSuperLike : () => setShowPremiumModal(true)}
          >
            {!canSuperLike && <Lock size={14} className="absolute top-2 right-2 text-gray-400" />}
            <Star size={24} className={cn(
              "transition-colors",
              canSuperLike ? "text-amber-500" : "text-gray-400"
            )} />
            <span className="text-xs font-medium">Super Like</span>
            {canSuperLike && features.superLikes && (
              <span className={cn(
                "text-[10px] px-2 py-0.5 rounded-full",
                remainingSuperLikes > 0 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"
              )}>
                {getFeatureCount(features.superLikes, remainingSuperLikes)}
              </span>
            )}
          </Button>
        </motion.div>
        
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant={canBoost ? "outline" : "ghost"}
            size="lg"
            className={cn(
              "relative w-full h-24 flex flex-col items-center justify-center gap-1 border-2",
              !canBoost ? "opacity-70 border-gray-200" : 
              boostActive ? "border-purple-500 bg-purple-50" : "border-purple-400 hover:border-purple-500 hover:bg-purple-50"
            )}
            onClick={canBoost ? handleBoost : () => setShowPremiumModal(true)}
          >
            {!canBoost && <Lock size={14} className="absolute top-2 right-2 text-gray-400" />}
            <Bolt size={24} className={cn(
              "transition-colors",
              canBoost ? "text-purple-500" : "text-gray-400"
            )} />
            <span className="text-xs font-medium">Boost</span>
            {boostActive ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                Active
              </span>
            ) : canBoost && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {features.boosts === 'unlimited' ? 'Unlimited' : `${features.boosts}/month`}
              </span>
            )}
          </Button>
        </motion.div>
      </div>
      
      <PremiumModal 
        isOpen={showPremiumModal} 
        onClose={() => setShowPremiumModal(false)} 
        onSubscribe={(tier) => setShowPremiumModal(false)}
      />
    </div>
  );
};

export default PremiumFeatures;
