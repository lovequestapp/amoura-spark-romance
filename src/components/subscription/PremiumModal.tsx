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

  const handleSubscribe = async (tier: SubscriptionTier) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { tier }
      });
      
      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      }
      
      if (onSubscribe) {
        onSubscribe(tier);
      }
      
      onClose();
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Error",
        description: "There was an issue processing your subscription. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const isCurrentPlan = (planTier: SubscriptionTier) => currentTier === planTier;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] overflow-hidden flex flex-col p-0 rounded-xl bg-gradient-to-br from-amoura-deep-pink via-pink-500 to-amoura-gold">
        <DialogHeader className="p-6 text-center shrink-0">
          <DialogTitle className="text-3xl font-bold text-white">Choose Your Perfect Plan</DialogTitle>
          <p className="text-white/90">Find the plan that matches your dating goals</p>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-6 py-4 bg-white/10 backdrop-blur-sm">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {premiumPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white/95 backdrop-blur rounded-xl border p-5 relative transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  plan.popular ? 'border-amoura-gold shadow-lg' : 'border-white/20'
                } ${isCurrentPlan(plan.tier) ? 'ring-2 ring-amoura-deep-pink' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 right-4 bg-gradient-to-r from-amber-400 to-amoura-gold px-3 py-1 rounded-full text-xs font-medium text-black shadow-lg">
                    Most Popular
                  </div>
                )}
                
                {isCurrentPlan(plan.tier) && (
                  <div className="absolute -top-3 left-4 bg-amoura-deep-pink px-3 py-1 rounded-full text-xs font-medium text-white shadow-lg">
                    Current Plan
                  </div>
                )}
                
                <div className="flex items-center gap-2 mb-3">
                  <Star size={24} className={plan.popular ? "fill-amoura-gold text-amoura-gold" : ""} />
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                </div>
                
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-500">/{plan.period}</span>
                  )}
                </div>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check size={18} className="text-green-500 mt-0.5 shrink-0" />
                      <span className="text-gray-700">{feature}</span>
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
                          : 'bg-gradient-to-r from-amoura-deep-pink to-pink-500 hover:from-pink-600 hover:to-amoura-deep-pink text-white'
                  }`}
                >
                  {isCurrentPlan(plan.tier) ? 'Current Plan' : plan.tier === 'foundation' ? 'Free Plan' : 'Choose Plan'}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
        
        <DialogFooter className="bg-black/5 backdrop-blur-sm px-6 py-4 text-center mt-auto shrink-0">
          <p className="text-sm text-white/80 mx-auto">
            Cancel anytime. Premium subscriptions will auto-renew until canceled.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumModal;
