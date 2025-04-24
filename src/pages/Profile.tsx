
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileGallery from '@/components/profile/ProfileGallery';
import ProfileAnalytics from '@/components/profile/ProfileAnalytics';
import PremiumFeatures from '@/components/subscription/PremiumFeatures';

const Profile = () => {
  const { user } = useAuth();
  const { tier, isSubscribed, openUpgradeModal } = useSubscription();

  // Sample user profile data
  const profile = {
    photos: ['/assets/profile-1a.jpg', '/assets/profile-1b.jpg', '/assets/profile-1c.jpg'],
    bio: "Lover of travel, good food, and interesting conversations. Looking for someone who shares my passion for adventure and trying new things.",
    interests: ["Hiking", "Photography", "Cooking", "Reading"],
    prompts: [
      {
        question: "My simple pleasures",
        answer: "Morning coffee with a good book, sunset walks on the beach, and finding hidden cafés in new cities."
      },
      {
        question: "A perfect first date",
        answer: "Something active but relaxed - maybe a walk in a park followed by coffee or drinks, where we can actually talk and get to know each other."
      }
    ]
  };

  return (
    <AppLayout>
      <div className="p-4 max-w-3xl mx-auto">
        {/* Profile header */}
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-20 w-20 border-2 border-amoura-deep-pink">
            <AvatarImage src="/assets/profile-1a.jpg" />
            <AvatarFallback>You</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Your Profile</h1>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>

        {/* Profile stats - now first */}
        <div className="mb-6">
          <ProfileStats />
        </div>

        {/* Profile gallery */}
        <div className="mt-6">
          <h2 className="font-medium text-lg mb-2">Your Photos</h2>
          <ProfileGallery photos={profile.photos} />
          <Button variant="outline" className="w-full mt-3">
            Edit Photos
          </Button>
        </div>
        
        {/* Bio section */}
        <div className="mt-6">
          <h2 className="font-medium text-lg mb-2">About You</h2>
          <div className="bg-white p-4 rounded-lg border">
            <p>{profile.bio}</p>
          </div>
          <Button variant="outline" className="w-full mt-3">
            Edit Bio
          </Button>
        </div>
        
        {/* Prompts */}
        <div className="mt-6">
          <h2 className="font-medium text-lg mb-2">Your Prompts</h2>
          {profile.prompts.map((prompt, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border mb-3">
              <h3 className="font-medium text-amoura-deep-pink">{prompt.question}</h3>
              <p className="mt-1">{prompt.answer}</p>
            </div>
          ))}
          <Button variant="outline" className="w-full mt-3">
            Edit Prompts
          </Button>
        </div>

        {/* Premium features - moved to bottom */}
        <div className="mt-8">
          {!isSubscribed && (
            <div className="bg-gradient-to-r from-amoura-deep-pink to-amoura-gold p-4 rounded-lg mb-4 text-white flex justify-between items-center">
              <div>
                <h2 className="font-bold">Upgrade to Premium</h2>
                <p className="text-sm">Get more visibility and premium features</p>
              </div>
              <Button 
                onClick={openUpgradeModal}
                size="sm"
                variant="secondary"
                className="bg-white text-amoura-deep-pink hover:bg-gray-100"
              >
                View Plans
              </Button>
            </div>
          )}
          <PremiumFeatures />
        </div>

        {/* Profile analytics - moved to bottom */}
        <div className="mt-6">
          <ProfileAnalytics />
        </div>
        
        {/* Account settings */}
        <div className="mt-8 flex justify-center gap-4 mb-20">
          <Button variant="outline" onClick={() => window.location.href = '/settings'}>
            Account Settings
          </Button>
          <Button variant="default">
            Edit Profile
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
