
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
import PremiumModal from './PremiumModal';

interface PremiumFeaturesProps {
  userTier: 'free' | 'basic' | 'gold' | 'platinum' | null;
  onRewind?: () => void;
  onSuperLike?: () => void;
  onBoost?: () => void;
}

export const PremiumFeatures: React.FC<PremiumFeaturesProps> = ({ 
  userTier = 'free',
  onRewind,
  onSuperLike,
  onBoost
}) => {
  const { toast } = useToast();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  
  // Count of available features based on tier
  const superLikeCount = userTier === 'platinum' ? 'Unlimited' : 
                        userTier === 'gold' ? '10/week' : 
                        userTier === 'basic' ? '5/week' : '0';
  
  const boostCount = userTier === 'platinum' ? '4/month' : 
                    userTier === 'gold' ? '2/month' : 
                    userTier === 'basic' ? '1/month' : '0';
  
  // Check if user has premium features
  const canRewind = userTier !== 'free';
  const canSuperLike = userTier !== 'free';
  const canBoost = userTier !== 'free';
  
  const handleAction = (action: string) => {
    if (userTier === 'free') {
      setShowPremiumModal(true);
      return;
    }
    
    switch (action) {
      case 'rewind':
        if (onRewind) onRewind();
        else {
          toast({
            title: "Rewind",
            description: "You've rewinded to the previous profile.",
          });
        }
        break;
      case 'superLike':
        if (onSuperLike) onSuperLike();
        else {
          toast({
            title: "Super Like",
            description: "You've super liked this profile!",
          });
        }
        break;
      case 'boost':
        if (onBoost) onBoost();
        else {
          toast({
            title: "Profile Boost",
            description: "Your profile will receive more visibility for the next hour!",
          });
        }
        break;
    }
  };
  
  const renderTierBadge = () => {
    if (!userTier || userTier === 'free') return null;
    
    const colors: Record<string, string> = {
      'basic': 'bg-blue-100 text-blue-800',
      'gold': 'bg-amber-100 text-amber-800',
      'platinum': 'bg-purple-100 text-purple-800'
    };
    
    return (
      <Badge className={`${colors[userTier]} capitalize`}>
        {userTier} Member
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
          onClick={() => handleAction('rewind')}
        >
          {!canRewind && <Lock size={12} className="absolute top-1 right-1" />}
          <Rewind size={18} className="mb-1" />
          <span className="text-xs">Rewind</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className={`flex flex-col items-center py-2 ${!canSuperLike ? 'opacity-70' : ''}`}
          onClick={() => handleAction('superLike')}
        >
          {!canSuperLike && <Lock size={12} className="absolute top-1 right-1" />}
          <Star size={18} className="mb-1 text-blue-500" />
          <span className="text-xs">Super Like</span>
          {canSuperLike && <span className="text-[10px]">{superLikeCount}</span>}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className={`flex flex-col items-center py-2 ${!canBoost ? 'opacity-70' : ''}`}
          onClick={() => handleAction('boost')}
        >
          {!canBoost && <Lock size={12} className="absolute top-1 right-1" />}
          <ZapIcon size={18} className="mb-1 text-purple-500" />
          <span className="text-xs">Boost</span>
          {canBoost && <span className="text-[10px]">{boostCount}</span>}
        </Button>
      </div>
      
      <PremiumModal 
        isOpen={showPremiumModal} 
        onClose={() => setShowPremiumModal(false)} 
      />
    </div>
  );
};

export default PremiumFeatures;
