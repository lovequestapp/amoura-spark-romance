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

// Update the MatchingParams interface
interface MatchingParams {
  userId: string;
  ageRange: [number, number];
  distance: number;
  relationshipIntention: string | null;
  interests: string[];
  personalityTraits?: PersonalityTrait[];
  dealbreakers?: string[];
  lifestylePreferences?: Record<string, string | boolean>;
}

// Import the types we created
import { User, PersonalityTrait, LifestylePreference } from '@/types/profiles';

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
            // Apply enhanced filtering to sample data to simulate API call
            let filtered = [...enhancedProfiles];
            
            if (filters.showVerifiedOnly) {
              filtered = filtered.filter(p => p.verified);
            }
            
            if (filters.relationshipIntention) {
              // Apply more nuanced relationship intention matching
              const intensityMap: Record<string, number> = {
                'casual': 1,
                'dating': 2,
                'relationship': 3,
                'serious': 4,
                'marriage': 5
              };
              
              const userIntensity = intensityMap[filters.relationshipIntention] || 3;
              
              filtered = filtered.filter(p => {
                if (!p.relationshipIntention) return true;
                const matchIntensity = intensityMap[p.relationshipIntention] || 3;
                // More flexible matching - allow within +/- 1 level
                return Math.abs(userIntensity - matchIntensity) <= 1;
              });
            }
            
            // Add match scores to simulated data with more realistic distribution
            const withScores = filtered.map(p => ({
              ...p,
              // More realistic score distribution
              matchScore: Math.floor(Math.random() * 30) + 55 + (p.verified ? 10 : 0) + 
                          (filters.interests.some(i => p.interests?.includes(i)) ? 15 : 0),
              interestsScore: Math.floor(Math.random() * 70) + 30,
              personalityScore: Math.floor(Math.random() * 60) + 40,
              intentionScore: Math.floor(Math.random() * 80) + 20,
              locationScore: Math.floor(Math.random() * 90) + 10,
              lifestyleScore: Math.floor(Math.random() * 75) + 25,
              // Occasionally add dealbreakers for UI testing
              dealbreakers: Math.random() > 0.8 ? ['smoking'] : undefined
            }));
            
            // Sort by match score
            withScores.sort((a, b) => b.matchScore - a.matchScore);
            
            setFilteredProfiles(withScores);
            
            // Simulate recent matches with better selection logic
            const simulatedMatches = withScores
              .filter(p => p.matchScore > 75) // High quality matches only
              .slice(0, 3);
            setRecentMatches(simulatedMatches);
            
            setIsLoading(false);
            return;
          }, 500);
          return;
        }
        
        // Production code - use enhanced matching algorithm
        const matches = await getPersonalizedMatches({
          userId: user.id,
          ageRange: filters.ageRange,
          distance: filters.distance,
          relationshipIntention: filters.relationshipIntention,
          interests: filters.interests,
          personalityTraits: user.personality_traits as PersonalityTrait[],
          dealbreakers: user.dealbreakers || [],
          lifestylePreferences: user.lifestyle_preferences as Record<string, string | boolean>
        });
        
        setFilteredProfiles(matches);
        
        // Get recent matches with highest compatibility
        const highQualityMatches = matches
          .filter(match => match.matchScore > 80)
          .slice(0, 3);
        
        setRecentMatches(highQualityMatches);
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
    if (!currentProfile) return;
    
    // Enhanced featured profile logic
    const featured = getFeaturedMatch(filteredProfiles as WeightedMatch[]);
    
    if (featured) {
      navigate(`/profile/${featured.id}`);
      
      toast({
        title: "Featured Match",
        description: `${featured.name} has been selected as your featured match based on exceptional compatibility!`,
      });
    }
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
