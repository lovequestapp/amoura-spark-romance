
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from '@/components/layout/AppLayout';
import DateIdea from '@/components/profile/DateIdea';
import { Button } from "@/components/ui/button";
import { Heart, X, Sparkles } from "lucide-react";
import { useCardSwiper } from '@/hooks/use-card-swiper';
import SwipeableCard from '@/components/home/SwipeableCard';
import NoMoreProfiles from '@/components/home/NoMoreProfiles';
import MatchFilters from '@/components/home/MatchFilters';
import FeaturedMatch from '@/components/home/FeaturedMatch';
import { useToast } from '@/hooks/use-toast';
import PremiumFeatures from '@/components/subscription/PremiumFeatures';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/profile';
import { FilterOptions } from '@/types/filters';

export const enhancedProfiles = [
  {
    id: 1,
    name: "Emma",
    age: 28,
    distance: "3 miles away",
    occupation: "Graphic Designer",
    photos: [
      "/lovable-uploads/955e854b-03c9-4efe-91de-ea62233f88eb.png",
      "/lovable-uploads/d96b24ef-01b0-41a0-afdf-564574149a3c.png",
      "/lovable-uploads/c3b91871-0b81-4711-a02d-6771b41f44ed.png"
    ],
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
  const { user } = useAuth();
  const { tier } = useSubscription();
  
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
    
    // Record profile view when swiping
    if (user && profile.id) {
      recordProfileView(profile.id);
    }
  });
  
  const [filters, setFilters] = useState<FilterOptions>({
    ageRange: [18, 65],
    distance: 25,
    showVerifiedOnly: false,
    interests: [],
    relationshipIntention: null,
  });
  
  useEffect(() => {
    // Record a profile view when first viewing a profile
    if (user && currentProfile?.id) {
      recordProfileView(currentProfile.id);
    }
  }, [currentProfile?.id, user]);
  
  const recordProfileView = async (profileId: number | string) => {
    if (!user) return;
    
    try {
      // Call our record-profile-view function
      await supabase.functions.invoke('record-profile-view', {
        body: {
          viewerId: user.id,
          viewedId: String(profileId)
        }
      });
    } catch (error) {
      console.error("Error recording profile view:", error);
    }
  };
  
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
        setCurrentIndex(currentIndex - 1); // Go back one profile
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
      <div className="flex-1 flex flex-col bg-gray-50/80">
        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white to-transparent pointer-events-none" />
          
          <div className="container max-w-5xl mx-auto px-4 pt-6 pb-20">
            <div className="flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
              >
                <DateIdea />
              </motion.div>
              
              {featuredProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <FeaturedMatch 
                    profile={featuredProfile} 
                    onViewProfile={handleViewFeaturedProfile}
                  />
                </motion.div>
              )}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">Discover</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {}}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                  </div>
                </div>
                
                <div className="relative min-h-[500px] flex items-center justify-center p-4">
                  <div 
                    ref={dragConstraints}
                    className="w-full"
                  >
                    <AnimatePresence mode="wait">
                      {currentIndex >= 0 ? (
                        <SwipeableCard
                          profile={currentProfile}
                          controls={controls}
                          dragConstraints={dragConstraints}
                          onDragStart={() => setDragging(true)}
                          onDragEnd={handleDragEnd}
                        />
                      ) : (
                        <NoMoreProfiles onRefresh={() => currentIndex === -1 && setCurrentIndex(0)} />
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
              
              {currentIndex >= 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="fixed bottom-6 left-0 right-0 flex justify-center gap-4 px-4"
                >
                  <Button
                    onClick={() => handleSwipe("left")}
                    size="lg"
                    className="h-14 w-14 rounded-full bg-white shadow-lg hover:shadow-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transform transition-all active:scale-95"
                  >
                    <X className="h-6 w-6 text-gray-500" />
                  </Button>
                  
                  <Button
                    onClick={() => handleSwipe("right")}
                    size="lg"
                    className="h-14 w-14 rounded-full bg-amoura-deep-pink hover:bg-amoura-deep-pink/90 shadow-lg hover:shadow-xl transform transition-all active:scale-95"
                  >
                    <Heart className="h-6 w-6 text-white" />
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Home;
