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
import { useToast } from '@/components/ui/use-toast';
import PremiumFeatures from '@/components/subscription/PremiumFeatures';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { getPersonalizedMatches, getFeaturedMatch, WeightedMatch } from '@/services/matching';
import { useNavigate } from 'react-router-dom';

// Enhanced demo profiles for development/testing
import { enhancedProfiles } from '@/utils/placeholderData';

const Home = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { tier } = useSubscription();
  const navigate = useNavigate();

  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    ageRange: [18, 65],
    distance: 25,
    showVerifiedOnly: false,
    interests: [],
    relationshipIntention: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  
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
  } = useCardSwiper(filteredProfiles, async (profile, direction) => {
    // Record profile view when swiping
    if (user && profile.id) {
      recordProfileView(profile.id);
      
      // Track ML interaction for learning (only if in production)
      if (process.env.NODE_ENV === 'production') {
        try {
          const { trackUserInteraction } = await import('@/services/matching/matchingService');
          await trackUserInteraction(
            user.id, 
            String(profile.id), 
            direction as 'like' | 'pass' | 'super_like',
            {
              timeOfDay: new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening',
              dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(),
              profilePosition: currentIndex,
              matchScore: (profile as any).matchScore
            }
          );
        } catch (error) {
          console.error('Error tracking ML interaction:', error);
        }
      }
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
        console.log('Fetching matches for user:', user.email);
        
        // Always use demo profiles for development and testing
        // Apply enhanced filtering to sample data to simulate API call
        let filtered = [...enhancedProfiles];
        
        console.log('Starting with demo profiles:', filtered.length);
        
        if (filters.showVerifiedOnly) {
          filtered = filtered.filter(p => p.verified);
          console.log('After verified filter:', filtered.length);
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
          console.log('After relationship intention filter:', filtered.length);
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
          // Add attachment style and score for UI testing
          attachment_style: ['secure', 'anxious', 'avoidant', 'fearful'][Math.floor(Math.random() * 4)] as 'secure' | 'anxious' | 'avoidant' | 'fearful',
          attachmentScore: Math.floor(Math.random() * 70) + 30,
          // Occasionally add dealbreakers for UI testing
          dealbreakers: Math.random() > 0.8 ? ['smoking'] : undefined
        }));
        
        // Sort by match score
        withScores.sort((a, b) => b.matchScore - a.matchScore);
        
        console.log('Final filtered profiles with scores:', withScores.length);
        setFilteredProfiles(withScores);
        
      } catch (error) {
        console.error("Error fetching matches:", error);
        
        // Fallback to basic demo profiles if there's any error
        console.log('Using fallback demo profiles');
        const fallbackProfiles = enhancedProfiles.map(p => ({
          ...p,
          matchScore: Math.floor(Math.random() * 40) + 60,
          interestsScore: Math.floor(Math.random() * 70) + 30,
          personalityScore: Math.floor(Math.random() * 60) + 40,
        }));
        setFilteredProfiles(fallbackProfiles);
        
        toast({
          title: "Using Demo Profiles",
          description: "Showing demo profiles for testing purposes.",
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
  
  const handleSuperLike = async () => {
    if (currentProfile && user) {
      handleSwipe("superLike");
      
      // Save this swipe in history
      setSwipedProfiles([...swipedProfiles, { profile: currentProfile, direction: "superLike" }]);
      
      // Track super like for ML (only in production)
      if (process.env.NODE_ENV === 'production') {
        try {
          const { trackUserInteraction } = await import('@/services/matching/matchingService');
          await trackUserInteraction(
            user.id, 
            String(currentProfile.id), 
            'super_like',
            {
              timeOfDay: new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening',
              profilePosition: currentIndex,
              action: 'super_like'
            }
          );
        } catch (error) {
          console.error('Error tracking super like:', error);
        }
      }
      
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
  
  // Enhanced swipe handlers that maintain swipe history and ML tracking
  const handleSwipeWithHistory = async (direction: string) => {
    if (currentProfile && user) {
      setSwipedProfiles([...swipedProfiles, { profile: currentProfile, direction }]);
      
      // Track swipe for ML learning (only in production)
      if (process.env.NODE_ENV === 'production') {
        try {
          const { trackUserInteraction } = await import('@/services/matching/matchingService');
          await trackUserInteraction(
            user.id, 
            String(currentProfile.id), 
            direction as 'like' | 'pass',
            {
              timeOfDay: new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening',
              dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(),
              profilePosition: currentIndex,
              matchScore: (currentProfile as any).matchScore
            }
          );
        } catch (error) {
          console.error('Error tracking swipe:', error);
        }
      }
      
      handleSwipe(direction);
    }
  };
  
  // Debug logging for current state
  console.log('Home render - currentIndex:', currentIndex, 'filteredProfiles.length:', filteredProfiles.length, 'currentProfile:', currentProfile);
  
  return (
    <AppLayout>
      <div className="flex-1 flex flex-col p-4 w-full max-w-full">
        <DateIdea />
        
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
              className="w-full max-w-sm relative"
            >
              <AnimatePresence mode="wait">
                {currentIndex >= 0 && filteredProfiles.length > 0 && currentProfile ? (
                  <SwipeableCard
                    key={currentProfile.id || 'current'}
                    profile={currentProfile}
                    controls={controls}
                    dragConstraints={dragConstraints}
                    onDragStart={() => setDragging(true)}
                    onDragEnd={(event, info) => handleDragEnd(event, info)}
                  />
                ) : (
                  <NoMoreProfiles onRefresh={() => {
                    console.log('Refreshing profiles...');
                    setCurrentIndex(0);
                    // Reset to show demo profiles again
                    const refreshedProfiles = enhancedProfiles.map(p => ({
                      ...p,
                      matchScore: Math.floor(Math.random() * 40) + 60,
                      interestsScore: Math.floor(Math.random() * 70) + 30,
                      personalityScore: Math.floor(Math.random() * 60) + 40,
                    }));
                    setFilteredProfiles(refreshedProfiles);
                  }} />
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
        
        {currentIndex >= 0 && !isLoading && filteredProfiles.length > 0 && currentProfile && (
          <motion.div 
            className="flex justify-center gap-4 py-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                onClick={() => handleSwipeWithHistory("left")}
                size="lg"
                className="h-16 w-16 rounded-full bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-lg transform transition-all duration-200 hover:shadow-xl"
              >
                <X size={24} className="text-gray-500" />
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                onClick={() => handleSwipeWithHistory("right")}
                size="lg"
                className="h-16 w-16 rounded-full bg-amoura-deep-pink hover:bg-amoura-deep-pink/90 shadow-lg transform transition-all duration-200 hover:shadow-xl"
              >
                <Heart size={24} className="text-white" />
              </Button>
            </motion.div>
          </motion.div>
        )}
        
        <PremiumFeatures 
          onRewind={handleRewind}
          onSuperLike={handleSuperLike}
          onBoost={handleBoost}
        />
      </div>
    </AppLayout>
  );
};

export default Home;
