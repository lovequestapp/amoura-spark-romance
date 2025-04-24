import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';

export type SubscriptionTier = 'free' | 'basic' | 'gold' | 'platinum';

interface SubscriptionContextType {
  tier: SubscriptionTier;
  isSubscribed: boolean;
  subscriptionEnd: Date | null;
  features: {
    rewind: boolean;
    superLikes: number | 'unlimited';
    boosts: number;
    profileVisibility: 'normal' | 'boosted' | 'prioritized';
    messageBeforeMatch: boolean;
    incognitoMode: boolean;
  };
  checkSubscription: () => Promise<void>;
  openUpgradeModal: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  tier: 'free',
  isSubscribed: false,
  subscriptionEnd: null,
  features: {
    rewind: false,
    superLikes: 0,
    boosts: 0,
    profileVisibility: 'normal',
    messageBeforeMatch: false,
    incognitoMode: false,
  },
  checkSubscription: async () => {},
  openUpgradeModal: () => {},
});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [subscriptionEnd, setSubscriptionEnd] = useState<Date | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Feature configurations based on tier
  const getTierFeatures = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'platinum':
        return {
          rewind: true,
          superLikes: 'unlimited' as const,
          boosts: 4,
          profileVisibility: 'prioritized' as const,
          messageBeforeMatch: true,
          incognitoMode: true,
        };
      case 'gold':
        return {
          rewind: true,
          superLikes: 10,
          boosts: 2,
          profileVisibility: 'boosted' as const,
          messageBeforeMatch: true,
          incognitoMode: false,
        };
      case 'basic':
        return {
          rewind: true,
          superLikes: 5,
          boosts: 1,
          profileVisibility: 'normal' as const,
          messageBeforeMatch: false,
          incognitoMode: false,
        };
      default:
        return {
          rewind: false,
          superLikes: 0,
          boosts: 0,
          profileVisibility: 'normal' as const,
          messageBeforeMatch: false,
          incognitoMode: false,
        };
    }
  };
  
  const features = getTierFeatures(tier);
  
  // In a real app, this would fetch subscription data from your backend
  const checkSubscription = async () => {
    if (!user) {
      setTier('free');
      return;
    }
    
    try {
      // Mock API call - in a real app, you'd call your backend
      console.log("Checking subscription for user:", user.id);
      
      // For demo purposes, we're simulating a subscription
      // In a real app, you'd make an API call to your backend
      
      // Simulate a premium user for demo purposes (random tier)
      // const tiers: SubscriptionTier[] = ['free', 'basic', 'gold', 'platinum'];
      // const randomTier = tiers[Math.floor(Math.random() * tiers.length)];
      // setTier(randomTier);
      
      // For demo, just keep it at free
      setTier('free');
      
      // Set a mock subscription end date - 30 days from now
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
      setSubscriptionEnd(endDate);
      
    } catch (error) {
      console.error("Error checking subscription:", error);
      toast({
        title: "Error",
        description: "Could not check subscription status. Please try again later.",
        variant: "destructive",
      });
    }
  };
  
  // Check subscription on component mount and when user changes
  useEffect(() => {
    checkSubscription();
  }, [user]);
  
  const openUpgradeModal = () => {
    setShowPremiumModal(true);
  };
  
  return (
    <SubscriptionContext.Provider
      value={{
        tier,
        isSubscribed: tier !== 'free',
        subscriptionEnd,
        features,
        checkSubscription,
        openUpgradeModal,
      }}
    >
      {children}
      {/* Premium modal would be rendered here in a real implementation */}
      {showPremiumModal && (
        <div>
          {/* This would be your premium modal component */}
        </div>
      )}
    </SubscriptionContext.Provider>
  );
};
