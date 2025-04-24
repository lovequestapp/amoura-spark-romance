
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Rewind, 
  ZapIcon, 
  Star,
  Lock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/contexts/SubscriptionContext';
import PremiumModal from './PremiumModal';

interface PremiumFeaturesProps {
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
  const canRewind = tier !== 'free';
  const canSuperLike = tier !== 'free';
  const canBoost = tier !== 'free';
  
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
    if (!tier || tier === 'free') return null;
    
    const colors: Record<string, string> = {
      'basic': 'bg-blue-100 text-blue-800',
      'gold': 'bg-amber-100 text-amber-800',
      'platinum': 'bg-purple-100 text-purple-800'
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
      
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          size="sm"
          className={`flex flex-col items-center py-2 ${!canRewind ? 'opacity-70' : ''}`}
          onClick={canRewind ? handleRewind : () => setShowPremiumModal(true)}
        >
          {!canRewind && <Lock size={12} className="absolute top-1 right-1" />}
          <Rewind size={18} className="mb-1" />
          <span className="text-xs">Rewind</span>
          {canRewind && features.rewinds && (
            <span className="text-[10px]">
              {getFeatureCount(features.rewinds, remainingRewinds)}
            </span>
          )}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className={`flex flex-col items-center py-2 ${!canSuperLike ? 'opacity-70' : ''} ${boostActive ? 'border-amoura-deep-pink' : ''}`}
          onClick={canSuperLike ? handleSuperLike : () => setShowPremiumModal(true)}
        >
          {!canSuperLike && <Lock size={12} className="absolute top-1 right-1" />}
          <Star size={18} className="mb-1 text-blue-500" />
          <span className="text-xs">Super Like</span>
          {canSuperLike && features.superLikes && (
            <span className="text-[10px]">
              {getFeatureCount(features.superLikes, remainingSuperLikes)}
            </span>
          )}
        </Button>
        
        <Button
          variant={boostActive ? "default" : "outline"}
          size="sm"
          className={`flex flex-col items-center py-2 ${!canBoost ? 'opacity-70' : ''} ${boostActive ? 'bg-purple-500 hover:bg-purple-600 text-white' : ''}`}
          onClick={canBoost ? handleBoost : () => setShowPremiumModal(true)}
        >
          {!canBoost && <Lock size={12} className="absolute top-1 right-1" />}
          <ZapIcon size={18} className={`mb-1 ${boostActive ? 'text-white' : 'text-purple-500'}`} />
          <span className="text-xs">Boost</span>
          {boostActive && boostUntil && (
            <span className="text-[10px]">
              Active
            </span>
          )}
          {canBoost && !boostActive && (
            <span className="text-[10px]">
              {features.boosts}/month
            </span>
          )}
        </Button>
      </div>
      
      <PremiumModal 
        isOpen={showPremiumModal} 
        onClose={() => setShowPremiumModal(false)} 
        onSubscribe={(tier) => {
          setShowPremiumModal(false);
        }}
      />
    </div>
  );
};

export default PremiumFeatures;
