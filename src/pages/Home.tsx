
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from '@/components/layout/AppLayout';
import DateIdea from '@/components/profile/DateIdea';
import { Button } from "@/components/ui/button";
import { Heart, X } from "lucide-react";
import { useCardSwiper } from '@/hooks/use-card-swiper';
import SwipeableCard, { Profile } from '@/components/home/SwipeableCard';
import NoMoreProfiles from '@/components/home/NoMoreProfiles';
import MatchFilters, { FilterOptions } from '@/components/home/MatchFilters';
import RecentMatches from '@/components/home/RecentMatches';
import { useToast } from '@/components/ui/use-toast';
import PremiumFeatures from '@/components/subscription/PremiumFeatures';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { getPersonalizedMatches, getFeaturedMatch, WeightedMatch } from '@/services/matching';
import { useNavigate } from 'react-router-dom';

// Placeholder profiles for development/testing are still available
import { enhancedProfiles } from '@/utils/placeholderData';

const Home = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { tier } = useSubscription();
  const navigate = useNavigate();

  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>(enhancedProfiles);
  const [filters, setFilters] = useState<FilterOptions>({
    ageRange: [18, 65],
    distance: 25,
    showVerifiedOnly: false,
    interests: [],
    relationshipIntention: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [recentMatches, setRecentMatches] = useState<Profile[]>([]);
  
  const {
    currentIndex,
    currentProfile,
    controls,
    dragConstraints,
    handleSwipe,
    handleDragEnd,
    setDragging,
    setCurrentIndex,
    setProfiles
  } = useCardSwiper(filteredProfiles, (profile, direction) => {
    // Record profile view when swiping
    if (user && profile.id) {
      recordProfileView(profile.id);
    }
  });
  
  // Store swiped profiles to support rewind feature
  const [swipedProfiles, setSwipedProfiles] = useState<Array<{ profile: Profile; direction: string }>>([]);
  
  // Fetch personalized matches when user or filters change
  useEffect(() => {
    const fetchMatches = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        // For development/demo, use placeholder data
        if (process.env.NODE_ENV === 'development' && enhancedProfiles.length) {
          setTimeout(() => {
            // Apply basic filtering to sample data to simulate API call
            let filtered = [...enhancedProfiles];
            
            if (filters.showVerifiedOnly) {
              filtered = filtered.filter(p => p.verified);
            }
            
            if (filters.relationshipIntention) {
              filtered = filtered.filter(p => 
                !p.relationshipIntention || 
                p.relationshipIntention === filters.relationshipIntention
              );
            }
            
            // Add match scores to simulated data
            const withScores = filtered.map(p => ({
              ...p,
              matchScore: Math.round(Math.random() * 40) + 60, // Random score between 60-100
              interestsScore: Math.round(Math.random() * 100),
              personalityScore: Math.round(Math.random() * 100),
              intentionScore: Math.round(Math.random() * 100),
              locationScore: Math.round(Math.random() * 100),
            }));
            
            // Sort by match score
            withScores.sort((a, b) => b.matchScore - a.matchScore);
            
            setFilteredProfiles(withScores);
            
            // Simulate recent matches (just take first 3 profiles)
            const simulatedMatches = withScores.slice(0, 3);
            setRecentMatches(simulatedMatches);
            
            setIsLoading(false);
            return;
          }, 500);
          return;
        }
        
        // Production code - use real data
        const matches = await getPersonalizedMatches({
          userId: user.id,
          ageRange: filters.ageRange,
          distance: filters.distance,
          relationshipIntention: filters.relationshipIntention,
          interests: filters.interests,
        });
        
        setFilteredProfiles(matches);
        
        // In production, you would fetch actual matches from your API
        // This is a placeholder for demonstration
        const actualMatches = matches.slice(0, 3);
        setRecentMatches(actualMatches);
      } catch (error) {
        console.error("Error fetching matches:", error);
        toast({
          title: "Error",
          description: "Failed to load matches. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMatches();
  }, [user, filters, toast]);

  // Record profile view 
  useEffect(() => {
    if (user && currentProfile?.id) {
      recordProfileView(currentProfile.id);
    }
  }, [currentProfile?.id, user]);
  
  const recordProfileView = async (profileId: number | string) => {
    if (!user) return;
    
    try {
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

  const handleViewProfile = (profileId: number | string) => {
    navigate(`/profile/${profileId}`);
  };
  
  const handleViewFeaturedProfile = () => {
    toast({
      title: "Featured Profile",
      description: "View the full featured profile to learn more about this match.",
    });
    // In a real app, you would navigate to a detailed profile view
  };
  
  const handleRewind = () => {
    if (swipedProfiles.length > 0) {
      const lastSwiped = swipedProfiles[swipedProfiles.length - 1];
      if (lastSwiped) {
        setSwipedProfiles(swipedProfiles.slice(0, -1));
        setCurrentIndex(currentIndex - 1); // Go back one profile
        
        // Re-insert the profile at the current index
        const updatedProfiles = [...filteredProfiles];
        updatedProfiles.splice(currentIndex, 0, lastSwiped.profile);
        setProfiles(updatedProfiles);
        
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
      
      // Save this swipe in history
      setSwipedProfiles([...swipedProfiles, { profile: currentProfile, direction: "superLike" }]);
      
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
  
  // Enhanced swipe handlers that maintain swipe history
  const handleSwipeWithHistory = (direction: string) => {
    if (currentProfile) {
      setSwipedProfiles([...swipedProfiles, { profile: currentProfile, direction }]);
      handleSwipe(direction);
    }
  };
  
  return (
    <AppLayout>
      <div className="flex-1 flex flex-col p-4 w-full max-w-full">
        <DateIdea />
        
        <PremiumFeatures 
          onRewind={handleRewind}
          onSuperLike={handleSuperLike}
          onBoost={handleBoost}
        />
        
        <MatchFilters onApplyFilters={handleApplyFilters} />
        
        <div className="flex-1 flex items-center justify-center relative w-full">
          {isLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amoura-deep-pink mx-auto mb-3"></div>
              <p className="text-gray-600">Finding your best matches...</p>
            </div>
          ) : (
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
          )}
        </div>
        
        {currentIndex >= 0 && !isLoading && (
          <div className="flex justify-center gap-4 py-6">
            <Button
              onClick={() => handleSwipeWithHistory("left")}
              size="lg"
              className="h-16 w-16 rounded-full bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm transform transition-transform active:scale-95"
            >
              <X size={24} className="text-gray-500" />
            </Button>
            
            <Button
              onClick={() => handleSwipeWithHistory("right")}
              size="lg"
              className="h-16 w-16 rounded-full bg-amoura-deep-pink hover:bg-amoura-deep-pink/90 shadow-md transform transition-transform active:scale-95"
            >
              <Heart size={24} className="text-white" />
            </Button>
          </div>
        )}
        
        {recentMatches.length > 0 && (
          <div className="sticky bottom-0 pb-4 z-10 w-full">
            <RecentMatches 
              profiles={recentMatches} 
              onViewProfile={handleViewProfile} 
            />
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Home;
