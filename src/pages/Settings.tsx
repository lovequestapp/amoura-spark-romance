import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSubscription } from '@/contexts/SubscriptionContext';
import PremiumModal from '@/components/subscription/PremiumModal';
import { Badge } from '@/components/ui/badge';

const Settings = () => {
  const navigate = useNavigate();
  const { tier, isSubscribed, subscriptionEnd } = useSubscription();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTierBadge = () => {
    const colors: Record<string, string> = {
      'basic': 'bg-blue-100 text-blue-800',
      'gold': 'bg-amber-100 text-amber-800',
      'platinum': 'bg-purple-100 text-purple-800'
    };
    
    if (tier === 'free') return null;
    
    return (
      <Badge className={`${colors[tier]} capitalize`}>
        {tier}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 flex items-center border-b">
        <button 
          onClick={() => navigate('/profile')}
          className="flex items-center"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back
        </button>
        <h1 className="text-lg font-medium mx-auto">Settings</h1>
      </div>
      
      <div className="p-6 space-y-8">
        <section className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-200">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-lg font-medium">Your Subscription</h2>
            {getTierBadge()}
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            {isSubscribed 
              ? `Your ${tier} subscription is active until ${formatDate(subscriptionEnd)}.` 
              : "You don't have an active subscription. Upgrade to access premium features!"}
          </p>
          
          <button 
            onClick={() => setShowPremiumModal(true)}
            className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-medium py-2 rounded-md hover:from-amber-500 hover:to-yellow-600 transition-colors"
          >
            {isSubscribed ? 'Manage Subscription' : 'Upgrade to Premium'}
          </button>
        </section>
        
        <section>
          <h2 className="text-lg font-medium mb-4">Discovery Settings</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <Select defaultValue="current">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current Location</SelectItem>
                  <SelectItem value="custom">Set Custom Location</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Distance
                </label>
                <span className="text-sm text-gray-500">25 miles</span>
              </div>
              <Slider
                defaultValue={[25]}
                max={100}
                step={1}
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Age Range
                </label>
                <span className="text-sm text-gray-500">24 - 35</span>
              </div>
              <Slider
                defaultValue={[24, 35]}
                min={18}
                max={70}
                step={1}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Show Me
              </label>
              <Select defaultValue="women">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="women">Women</SelectItem>
                  <SelectItem value="men">Men</SelectItem>
                  <SelectItem value="everyone">Everyone</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>
        
        <Separator />
        
        <section>
          <h2 className="text-lg font-medium mb-4">App Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notifications</p>
                <p className="text-sm text-gray-500">Push, email, and in-app</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show online status</p>
                <p className="text-sm text-gray-500">Let others know when you're active</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Read receipts</p>
                <p className="text-sm text-gray-500">Show when you've read messages</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show my distance</p>
                <p className="text-sm text-gray-500">Display how far away you are</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Incognito mode</p>
                <p className="text-sm text-gray-500">Only show your profile to people you like</p>
              </div>
              <div className="flex items-center gap-2">
                {tier !== 'platinum' && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    Platinum
                  </span>
                )}
                <Switch disabled={tier !== 'platinum'} />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Message before matching</p>
                <p className="text-sm text-gray-500">Send messages before matching</p>
              </div>
              <div className="flex items-center gap-2">
                {!['gold', 'platinum'].includes(tier) && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    Gold+
                  </span>
                )}
                <Switch disabled={!['gold', 'platinum'].includes(tier)} />
              </div>
            </div>
          </div>
        </section>
        
        <Separator />
        
        <section>
          <h2 className="text-lg font-medium mb-4">Account</h2>
          
          <div className="space-y-4">
            <button className="block w-full text-left py-2 text-amoura-deep-pink">
              Upgrade to Premium
            </button>
            <button className="block w-full text-left py-2 text-gray-700">
              Email and Phone
            </button>
            <button className="block w-full text-left py-2 text-gray-700">
              Privacy Policy
            </button>
            <button className="block w-full text-left py-2 text-gray-700">
              Terms of Service
            </button>
            <button className="block w-full text-left py-2 text-gray-700">
              Help & Support
            </button>
            <button className="block w-full text-left py-2 text-red-500">
              Log Out
            </button>
          </div>
        </section>
      </div>
      
      <PremiumModal 
        isOpen={showPremiumModal} 
        onClose={() => setShowPremiumModal(false)} 
      />
    </div>
  );
};

export default Settings;
