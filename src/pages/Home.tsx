import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import AppLayout from '@/components/layout/AppLayout';
import DateIdea from '@/components/profile/DateIdea';
import { Button } from "@/components/ui/button";
import { Heart, X } from "lucide-react";
import { useCardSwiper } from '@/hooks/use-card-swiper';
import SwipeableCard, { Profile } from '@/components/home/SwipeableCard';
import NoMoreProfiles from '@/components/home/NoMoreProfiles';
import MatchFilters, { FilterOptions } from '@/components/home/MatchFilters';
import FeaturedMatch from '@/components/home/FeaturedMatch';
import { useToast } from '@/components/ui/use-toast';
import PremiumFeatures from '@/components/subscription/PremiumFeatures';

const enhancedProfiles = [
  {
    id: 1,
    name: "Emma",
    age: 28,
    distance: "3 miles away",
    occupation: "Graphic Designer",
    photos: ["/assets/profile-1a.jpg", "/assets/profile-1b.jpg", "/assets/profile-1c.jpg"],
    video: {
      url: "https://example.com/sample-video.mp4",
      thumbnail: "/assets/profile-1-video-thumb.jpg",
      duration: 45
    },
    bio: "Coffee addict, design enthusiast, and weekend hiker. Looking for someone to share laughs and adventures with.",
    personalityMatch: 85,
    verified: true,
    featured: true,
    traits: [
      { name: "Creative", score: 90 },
      { name: "Adventurous", score: 75 },
      { name: "Intellectual", score: 82 },
    ],
    prompts: [
      {
        question: "Two truths and a lie...",
        answer: "I've climbed Mt. Kilimanjaro, I speak three languages, I've never had a pet."
      },
      {
        question: "My simple pleasures...",
        answer: "Morning coffee with a good book, sunset beach walks, and finding hidden cafés in new cities."
      }
    ],
    relationshipIntention: "Dating",
    personalityBadges: ["Adventurous", "Creative", "Thoughtful"]
  },
  {
    id: 2,
    name: "Alex",
    age: 30,
    distance: "5 miles away",
    occupation: "Software Engineer",
    photos: ["/assets/profile-2a.jpg", "/assets/profile-2b.jpg"],
    bio: "Tech geek with a passion for hiking and craft beer. Looking for someone to explore new trails and breweries with.",
    premium: true,
    personalityMatch: 72,
    verified: false,
    traits: [
      { name: "Analytical", score: 95 },
      { name: "Introverted", score: 65 },
      { name: "Adventurous", score: 80 },
    ],
    prompts: [
      {
        question: "A perfect date would be...",
        answer: "A morning hike followed by brunch at a local spot, then exploring a neighborhood we haven't been to before."
      }
    ],
    relationshipIntention: "Relationship",
    personalityBadges: ["Analytical", "Outdoor-lover", "Thoughtful"]
  },
  {
    id: 3,
    name: "Sofia",
    age: 26,
    distance: "2 miles away",
    occupation: "Event Planner",
    photos: ["/assets/profile-3a.jpg", "/assets/profile-3b.jpg", "/assets/profile-3c.jpg"],
    bio: "Foodie, music lover, and avid traveler. Let's plan our next adventure together!",
    personalityMatch: 91,
    verified: true,
    traits: [
      { name: "Extroverted", score: 88 },
      { name: "Creative", score: 75 },
      { name: "Spontaneous", score: 92 },
    ],
    prompts: [
      {
        question: "We'll get along if...",
        answer: "You like trying new restaurants as much as I do, and you're up for spontaneous weekend trips."
      }
    ],
    relationshipIntention: "Casual",
    personalityBadges: ["Social", "Spontaneous", "Foodie"]
  }
] satisfies Profile[];

const swipedProfiles: Array<{ profile: Profile; direction: string }> = [];

const Home = () => {
  const { toast } = useToast();
  const [userTier, setUserTier] = useState<'free' | 'basic' | 'gold' | 'platinum'>('free');
  const {
    currentIndex,
    currentProfile,
    controls,
    dragConstraints,
    handleSwipe,
    handleDragEnd,
    setDragging,
    setCurrentIndex
  } = useCardSwiper(enhancedProfiles, (profile, direction) => {
    swipedProfiles.push({ profile, direction });
  });
  
  const [filters, setFilters] = useState<FilterOptions>({
    ageRange: [18, 65],
    distance: 25,
    showVerifiedOnly: false,
    interests: [],
    relationshipIntention: null,
  });
  
  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    console.log("Filters applied:", newFilters);
  };

  const handleViewFeaturedProfile = () => {
    toast({
      title: "Featured Profile",
      description: "View the full featured profile to learn more about this match.",
    });
    // In a real app, you would navigate to a detailed profile view
  };
  
  const featuredProfile = enhancedProfiles.find(profile => profile.featured === true);
  
  const handleRewind = () => {
    if (swipedProfiles.length > 0) {
      const lastSwiped = swipedProfiles.pop();
      if (lastSwiped) {
        setCurrentIndex(currentIndex + 1);
        toast({
          title: "Rewinded!",
          description: `You've gone back to ${lastSwiped.profile.name}'s profile.`,
        });
      }
    } else {
      toast({
        title: "No profiles to rewind",
        description: "You haven't swiped on any profiles yet.",
      });
    }
  };
  
  const handleSuperLike = () => {
    if (currentProfile) {
      handleSwipe("superLike");
      toast({
        title: "Super Like Sent!",
        description: `${currentProfile.name} will be notified that you super liked them!`,
        variant: "default",
      });
    }
  };
  
  const handleBoost = () => {
    toast({
      title: "Profile Boosted!",
      description: "Your profile will receive increased visibility for the next hour.",
    });
  };
  
  return (
    <AppLayout>
      <div className="flex-1 flex flex-col p-4">
        <DateIdea />
        
        {featuredProfile && (
          <FeaturedMatch 
            profile={featuredProfile} 
            onViewProfile={handleViewFeaturedProfile} 
          />
        )}
        
        <PremiumFeatures 
          userTier={userTier} 
          onRewind={handleRewind}
          onSuperLike={handleSuperLike}
          onBoost={handleBoost}
        />
        
        <MatchFilters onApplyFilters={handleApplyFilters} />
        
        <div className="flex-1 flex items-center justify-center relative">
          <div 
            ref={dragConstraints}
            className="w-full max-w-sm"
          >
            <AnimatePresence mode="wait">
              {currentIndex >= 0 ? (
                <SwipeableCard
                  profile={currentProfile}
                  controls={controls}
                  dragConstraints={dragConstraints}
                  onDragStart={() => setDragging(true)}
                  onDragEnd={(event, info) => handleDragEnd(event, info)}
                />
              ) : (
                <NoMoreProfiles onRefresh={() => currentIndex === -1 && setCurrentIndex(0)} />
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {currentIndex >= 0 && (
          <div className="flex justify-center gap-4 py-6">
            <Button
              onClick={() => handleSwipe("left")}
              size="lg"
              className="h-16 w-16 rounded-full bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm transform transition-transform active:scale-95"
            >
              <X size={24} className="text-gray-500" />
            </Button>
            
            <Button
              onClick={() => handleSwipe("right")}
              size="lg"
              className="h-16 w-16 rounded-full bg-amoura-deep-pink hover:bg-amoura-deep-pink/90 shadow-md transform transition-transform active:scale-95"
            >
              <Heart size={24} className="text-white" />
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Home;
