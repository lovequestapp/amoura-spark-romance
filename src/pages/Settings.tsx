
import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, LogOut, Info, HelpCircle, User } from 'lucide-react';
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
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import PremiumModal from '@/components/subscription/PremiumModal';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/layout/AppLayout';

const Settings = () => {
  const navigate = useNavigate();
  const { tier, isSubscribed, subscriptionEnd, features } = useSubscription();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const [distanceValue, setDistanceValue] = useState([25]);
  const [ageRange, setAgeRange] = useState([24, 35]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account."
      });
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditProfileClick = () => {
    navigate('/profile/edit');
  };

  const handleEmailPhoneClick = () => {
    navigate('/settings/contact');
  };

  const handlePrivacyClick = () => {
    navigate('/privacy-policy');
  };

  const handleTermsClick = () => {
    navigate('/terms');
  };

  const handleHelpClick = () => {
    navigate('/help');
  };

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
      'connection': 'bg-blue-100 text-blue-800',
      'chemistry': 'bg-amber-100 text-amber-800',
      'commitment': 'bg-purple-100 text-purple-800'
    };
    
    if (tier === 'foundation') return null;
    
    return (
      <Badge className={`${colors[tier]} capitalize`}>
        {tier}
      </Badge>
    );
  };

  const isPremiumFeature = (requiredTier: string) => {
    const tierLevels = {
      'foundation': 0,
      'connection': 1,
      'chemistry': 2,
      'commitment': 3
    };
    
    return tierLevels[tier as keyof typeof tierLevels] < tierLevels[requiredTier as keyof typeof tierLevels];
  };

  return (
    <AppLayout>
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
        
        <section className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-200">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-lg font-medium">Your Subscription</h2>
            {getTierBadge()}
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            {isSubscribed 
              ? `Your ${tier} plan is active until ${formatDate(subscriptionEnd)}.` 
              : "You're on the Foundation (free) plan. Upgrade to access premium features!"}
          </p>
          
          <button 
            onClick={() => setShowPremiumModal(true)}
            className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-medium py-2 rounded-md hover:from-amber-500 hover:to-yellow-600 transition-colors"
          >
            {isSubscribed ? 'Manage Subscription' : 'Upgrade to Premium'}
          </button>
        </section>
        
        <div className="p-6 space-y-8">
          <section>
            <h2 className="text-lg font-medium mb-4">Account</h2>
            <div className="space-y-4">
              <button 
                onClick={handleEditProfileClick}
                className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <User className="text-gray-500" />
                  <span>Edit Profile</span>
                </div>
              </button>
              
              <button 
                onClick={handleEmailPhoneClick}
                className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Mail className="text-gray-500" />
                  <span>Email and Phone</span>
                </div>
              </button>
              
              <button 
                className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Lock className="text-gray-500" />
                  <span>Password</span>
                </div>
              </button>
            </div>
          </section>

          <Separator />
          
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
                  <span className="text-sm text-gray-500">{distanceValue[0]} miles</span>
                </div>
                <Slider
                  value={distanceValue}
                  onValueChange={setDistanceValue}
                  max={100}
                  step={1}
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Age Range
                  </label>
                  <span className="text-sm text-gray-500">{ageRange[0]} - {ageRange[1]}</span>
                </div>
                <Slider
                  value={ageRange}
                  onValueChange={setAgeRange}
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
              
              {features.advancedFilters ? (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Advanced Filters
                    </label>
                    <Badge className="bg-blue-100 text-blue-800">
                      {tier !== 'foundation' ? tier : 'Premium'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Height</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Education</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Relationship Goals</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-gray-100 p-3 rounded-md bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Advanced Filters</p>
                      <p className="text-xs text-gray-500">Filter by height, education, and more</p>
                    </div>
                    <Badge className="bg-gray-100 text-gray-500 cursor-pointer" onClick={() => setShowPremiumModal(true)}>
                      Connection+
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </section>
          
          <Separator />
          
          <section>
            <h2 className="text-lg font-medium mb-4">App Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="font-medium text-sm sm:text-base leading-tight">Notifications</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Push, email, and in-app</p>
                </div>
                <div className="flex-shrink-0">
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="font-medium text-sm sm:text-base leading-tight">Show online status</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Let others know when you're active</p>
                </div>
                <div className="flex-shrink-0">
                  <Switch defaultChecked disabled={features.hideOnlineStatus} />
                </div>
              </div>
              
              {features.hideOnlineStatus && (
                <div className="flex items-center justify-between py-2">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="font-medium text-sm sm:text-base leading-tight">Hide online status</p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Hide your activity status from others</p>
                  </div>
                  <div className="flex-shrink-0">
                    <Switch defaultChecked />
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between py-2">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="font-medium text-sm sm:text-base leading-tight">Read receipts</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Show when you've read messages</p>
                </div>
                <div className="flex-shrink-0">
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="font-medium text-sm sm:text-base leading-tight">Show my distance</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Display how far away you are</p>
                </div>
                <div className="flex-shrink-0">
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="font-medium text-sm sm:text-base leading-tight">Incognito mode</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Only show your profile to people you like</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isPremiumFeature('commitment') && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      Commitment
                    </span>
                  )}
                  <Switch disabled={isPremiumFeature('commitment')} checked={features.incognitoMode} />
                </div>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="font-medium text-sm sm:text-base leading-tight">Message before matching</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Send messages before matching</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isPremiumFeature('chemistry') && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      Chemistry+
                    </span>
                  )}
                  <Switch disabled={isPremiumFeature('chemistry')} checked={features.messageBeforeMatch} />
                </div>
              </div>
              
              {features.travelMode && (
                <div className="flex items-center justify-between py-2">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="font-medium text-sm sm:text-base leading-tight">Travel Mode</p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Change location for your next trip</p>
                  </div>
                  <div className="flex-shrink-0">
                    <Switch defaultChecked />
                  </div>
                </div>
              )}
            </div>
          </section>
          
          <Separator />
          
          <section>
            <h2 className="text-lg font-medium mb-4">Support</h2>
            <div className="space-y-4">
              <button 
                onClick={handleHelpClick}
                className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="text-gray-500" />
                  <span>Help & Support</span>
                </div>
              </button>
              
              <button 
                onClick={handlePrivacyClick}
                className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Info className="text-gray-500" />
                  <span>Privacy Policy</span>
                </div>
              </button>
              
              <button 
                onClick={handleTermsClick}
                className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Info className="text-gray-500" />
                  <span>Terms of Service</span>
                </div>
              </button>
              
              <button 
                onClick={handleLogout}
                className="flex items-center justify-between w-full p-4 text-left text-red-500 hover:bg-red-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="text-red-500" />
                  <span>Log Out</span>
                </div>
              </button>
            </div>
          </section>
        </div>
      </div>
      
      <PremiumModal 
        isOpen={showPremiumModal} 
        onClose={() => setShowPremiumModal(false)} 
      />
    </AppLayout>
  );
};

export default Settings;
