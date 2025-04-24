
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { SubscriptionTier } from '@/contexts/SubscriptionContext';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe?: (tier: SubscriptionTier) => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, onSubscribe }) => {
  const { toast } = useToast();
  const { tier: currentTier, updateSubscription } = useSubscription();
  
  const premiumPlans = [
    {
      name: "Foundation",
      tier: "foundation" as SubscriptionTier,
      price: "Free",
      period: "",
      features: [
        "8 Likes per day",
        "1 Rewind per day",
        "1 Super Like per week",
        "Match & message freely",
        "Basic filters"
      ]
    },
    {
      name: "Connection",
      tier: "connection" as SubscriptionTier,
      price: "$12.99",
      period: "monthly",
      features: [
        "Unlimited Likes",
        "3 Rewinds per day",
        "5 Super Likes per week",
        "1 Boost per month",
        "See who liked you",
        "Advanced filters",
        "Ad-free",
        "Priority visibility"
      ],
      popular: true
    },
    {
      name: "Chemistry",
      tier: "chemistry" as SubscriptionTier,
      price: "$22.99",
      period: "monthly",
      features: [
        "All Connection features",
        "Unlimited Rewinds",
        "10 Super Likes per week",
        "2 Boosts per month",
        "Message before matching",
        "Profile viewers list",
        "Travel mode",
        "Hide online status"
      ]
    },
    {
      name: "Commitment",
      tier: "commitment" as SubscriptionTier,
      price: "$34.99",
      period: "monthly",
      features: [
        "All Chemistry features",
        "Unlimited Super Likes & Boosts",
        "Incognito Mode",
        "AI Profile Optimization",
        "Monthly Match Report",
        "VIP Support Access"
      ]
    }
  ];

  const handleSubscribe = async (planTier: SubscriptionTier) => {
    try {
      await updateSubscription(planTier);
      
      if (onSubscribe) {
        onSubscribe(planTier);
      }
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an issue updating your subscription. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const isCurrentPlan = (planTier: SubscriptionTier) => {
    return currentTier === planTier;
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] overflow-hidden flex flex-col p-0 rounded-xl">
        <DialogHeader className="bg-gradient-to-r from-amber-400 to-amoura-gold p-6 text-center shrink-0">
          <DialogTitle className="text-3xl font-bold text-black">Choose Your Perfect Plan</DialogTitle>
          <p className="text-black/75">Find the plan that matches your dating goals</p>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {premiumPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl border p-5 relative ${
                  plan.popular ? 'border-amoura-gold shadow-lg' : 'border-gray-200'
                } ${isCurrentPlan(plan.tier) ? 'ring-2 ring-amoura-deep-pink' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-6 transform -translate-y-1/2 bg-amoura-gold px-3 py-1 rounded-full text-xs font-medium text-black">
                    Most Popular
                  </div>
                )}
                
                {isCurrentPlan(plan.tier) && (
                  <div className="absolute top-0 left-6 transform -translate-y-1/2 bg-amoura-deep-pink px-3 py-1 rounded-full text-xs font-medium text-white">
                    Current Plan
                  </div>
                )}
                
                <div className="flex items-center gap-2 mb-2">
                  <Star size={20} className={plan.popular ? "fill-amoura-gold text-amoura-gold" : ""} />
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                </div>
                
                <div className="mb-4">
                  <span className="text-2xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-500">/{plan.period}</span>
                  )}
                </div>
                
                <ul className="space-y-2 mb-5">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={() => handleSubscribe(plan.tier)}
                  disabled={isCurrentPlan(plan.tier)}
                  className={`w-full ${
                    isCurrentPlan(plan.tier) 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : plan.popular 
                        ? 'bg-gradient-to-r from-amber-400 to-amoura-gold hover:from-amber-500 hover:to-amber-400 text-black' 
                        : plan.tier === 'foundation'
                          ? 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                          : 'bg-amoura-deep-pink hover:bg-amoura-deep-pink/90'
                  }`}
                >
                  {isCurrentPlan(plan.tier) ? 'Current Plan' : plan.tier === 'foundation' ? 'Free Plan' : 'Subscribe'}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
        
        <DialogFooter className="bg-gray-50 px-6 py-4 text-center mt-auto shrink-0">
          <p className="text-sm text-gray-500 mx-auto">
            Cancel anytime. Premium subscriptions will auto-renew until canceled.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumModal;
