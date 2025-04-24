import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type SubscriptionTier = 'free' | 'basic' | 'gold' | 'platinum';

interface SubscriptionFeatures {
  rewinds: number | 'unlimited';
  superLikes: number | 'unlimited';
  boosts: number;
  profileVisibility: 'normal' | 'boosted' | 'prioritized';
  messageBeforeMatch: boolean;
  incognitoMode: boolean;
  analytics: boolean;
}

interface SubscriptionContextType {
  tier: SubscriptionTier;
  isSubscribed: boolean;
  subscriptionEnd: Date | null;
  features: SubscriptionFeatures;
  remainingRewinds: number;
  remainingSuperLikes: number;
  boostActive: boolean;
  boostUntil: Date | null;
  checkSubscription: () => Promise<void>;
  updateSubscription: (tier: SubscriptionTier) => Promise<void>;
  performRewind: () => Promise<boolean>;
  performSuperLike: () => Promise<boolean>;
  activateBoost: () => Promise<boolean>;
  openUpgradeModal: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  tier: 'free',
  isSubscribed: false,
  subscriptionEnd: null,
  features: {
    rewinds: 0,
    superLikes: 0,
    boosts: 0,
    profileVisibility: 'normal',
    messageBeforeMatch: false,
    incognitoMode: false,
    analytics: false,
  },
  remainingRewinds: 0,
  remainingSuperLikes: 0,
  boostActive: false,
  boostUntil: null,
  checkSubscription: async () => {},
  updateSubscription: async () => {},
  performRewind: async () => false,
  performSuperLike: async () => false,
  activateBoost: async () => false,
  openUpgradeModal: () => {},
});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [subscriptionEnd, setSubscriptionEnd] = useState<Date | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [features, setFeatures] = useState<SubscriptionFeatures>({
    rewinds: 0,
    superLikes: 0,
    boosts: 0,
    profileVisibility: 'normal',
    messageBeforeMatch: false,
    incognitoMode: false,
    analytics: false,
  });
  const [remainingRewinds, setRemainingRewinds] = useState(0);
  const [remainingSuperLikes, setRemainingSuperLikes] = useState(0);
  const [boostActive, setBoostActive] = useState(false);
  const [boostUntil, setBoostUntil] = useState<Date | null>(null);
  
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      checkSubscription();
    } else {
      setTier('free');
      setSubscriptionEnd(null);
      setFeatures({
        rewinds: 0,
        superLikes: 0,
        boosts: 0,
        profileVisibility: 'normal',
        messageBeforeMatch: false,
        incognitoMode: false,
        analytics: false,
      });
      setRemainingRewinds(0);
      setRemainingSuperLikes(0);
      setBoostActive(false);
      setBoostUntil(null);
    }
  }, [user]);
  
  const checkSubscription = async () => {
    if (!user) {
      setTier('free');
      return;
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        body: { userId: user.id }
      });
      
      if (error) throw error;
      
      if (data) {
        setTier(data.subscription_tier || 'free');
        setSubscriptionEnd(data.subscription_end ? new Date(data.subscription_end) : null);
        setFeatures(data.features || features);
        
        const { data: subscriberData, error: subscriberError } = await supabase
          .rpc('get_subscriber_data', { user_id_param: user.id });
          
        if (subscriberError) {
          console.error("Error fetching subscriber data:", subscriberError);
          return;
        }
        
        if (subscriberData) {
          setRemainingRewinds(subscriberData.remaining_rewinds || 0);
          setRemainingSuperLikes(subscriberData.remaining_super_likes || 0);
          
          if (subscriberData.boost_until) {
            const boostEndTime = new Date(subscriberData.boost_until);
            const isActive = boostEndTime > new Date();
            setBoostActive(isActive);
            setBoostUntil(isActive ? boostEndTime : null);
          }
        }
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
      toast({
        title: "Error",
        description: "Could not check subscription status. Please try again later.",
        variant: "destructive",
      });
    }
  };
  
  const updateSubscription = async (newTier: SubscriptionTier) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        body: { userId: user.id, tier: newTier }
      });
      
      if (error) throw error;
      
      await checkSubscription();
      
      toast({
        title: "Subscription Updated",
        description: `Your subscription has been updated to ${newTier}.`,
      });
      
      return data;
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast({
        title: "Error",
        description: "Failed to update subscription. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const performRewind = async () => {
    if (!user) return false;
    
    if (tier === 'free') {
      setShowPremiumModal(true);
      return false;
    }
    
    if (remainingRewinds <= 0 && features.rewinds !== 'unlimited') {
      toast({
        title: "No Rewinds Remaining",
        description: "You've used all your rewinds for this period.",
        variant: "destructive",
      });
      return false;
    }
    
    if (features.rewinds !== 'unlimited') {
      try {
        const { error } = await supabase.rpc('update_remaining_rewinds', {
          user_id_param: user.id,
          new_value: remainingRewinds - 1
        });
          
        if (error) throw error;
        
        setRemainingRewinds(prev => prev - 1);
      } catch (error) {
        console.error("Error updating rewinds:", error);
        return false;
      }
    }
    
    return true;
  };
  
  const performSuperLike = async () => {
    if (!user) return false;
    
    if (tier === 'free') {
      setShowPremiumModal(true);
      return false;
    }
    
    if (remainingSuperLikes <= 0 && features.superLikes !== 'unlimited') {
      toast({
        title: "No Super Likes Remaining",
        description: "You've used all your Super Likes for this period.",
        variant: "destructive",
      });
      return false;
    }
    
    if (features.superLikes !== 'unlimited') {
      try {
        const { error } = await supabase.rpc('update_remaining_super_likes', {
          user_id_param: user.id,
          new_value: remainingSuperLikes - 1
        });
          
        if (error) throw error;
        
        setRemainingSuperLikes(prev => prev - 1);
      } catch (error) {
        console.error("Error updating super likes:", error);
        return false;
      }
    }
    
    return true;
  };
  
  const activateBoost = async () => {
    if (!user) return false;
    
    if (tier === 'free') {
      setShowPremiumModal(true);
      return false;
    }
    
    const boostEnd = new Date();
    boostEnd.setHours(boostEnd.getHours() + 1);
    
    try {
      const { error } = await supabase.rpc('update_boost_until', {
        user_id_param: user.id,
        boost_until_param: boostEnd.toISOString()
      });
        
      if (error) throw error;
      
      setBoostActive(true);
      setBoostUntil(boostEnd);
      
      toast({
        title: "Boost Activated",
        description: "Your profile visibility is boosted for the next hour!",
      });
      
      return true;
    } catch (error) {
      console.error("Error activating boost:", error);
      toast({
        title: "Error",
        description: "Could not activate boost. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };
  
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
        remainingRewinds,
        remainingSuperLikes,
        boostActive,
        boostUntil,
        checkSubscription,
        updateSubscription,
        performRewind,
        performSuperLike,
        activateBoost,
        openUpgradeModal,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
