import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from '@/components/layout/AppLayout';
import DateIdea from '@/components/profile/DateIdea';
import { Button } from "@/components/ui/button";
import { Heart, X, MessageCircle, Star, Settings, Filter } from "lucide-react";
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
import FloatingHeartsAnimation from '@/components/animations/FloatingHeartsAnimation';
import { Badge } from '@/components/ui/badge';
import PersonalityBadges from '@/components/home/PersonalityBadges';

// Enhanced demo profiles for development/testing
import { enhancedProfiles } from '@/utils/placeholderData';

const HomeProfileCard = ({ profile, onSwipe }: { profile: Profile; onSwipe: (direction: string) => void }) => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const likeButtonRef = useRef<HTMLButtonElement>(null);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  
  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || isDragging) return;
    navigate(`/profile/${profile.id}`);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowHeartAnimation(true);
    onSwipe("like");
  };

  const handlePass = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSwipe("left");
  };

  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/message-purchase`);
  };

  if (!profile) return null;

  const hasMatchScore = profile && 'matchScore' in profile && profile.matchScore !== null;
  const matchScore = hasMatchScore ? (profile as any).matchScore : (profile?.personalityMatch || 0);

  return (
    <>
      <motion.div
        className="absolute inset-0 cursor-pointer"
        onClick={handleCardClick}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        {/* Full-screen profile image with enhanced styling */}
        <div className="relative w-full h-full overflow-hidden rounded-3xl shadow-2xl">
          <img 
            src={profile.photos[0]} 
            alt={profile.name} 
            className="w-full h-full object-cover"
            draggable={false}
          />
          
          {/* Enhanced gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          
          {/* Top right badges */}
          <div className="absolute top-6 right-6 flex flex-col gap-2 z-10">
            {profile.verified && (
              <Badge className="bg-blue-500/90 text-white border-0 backdrop-blur-sm">
                Verified
              </Badge>
            )}
            {profile.premium && (
              <Badge className="bg-gradient-to-r from-purple-500/90 to-pink-500/90 text-white border-0 backdrop-blur-sm">
                Premium
              </Badge>
            )}
            {profile.featured && (
              <Badge className="bg-gradient-to-r from-amoura-gold/90 to-amber-400/90 text-black border-0 backdrop-blur-sm flex items-center">
                <Star className="h-3 w-3 mr-1 fill-black" /> Featured
              </Badge>
            )}
          </div>
          
          {/* Enhanced profile information overlay */}
          <div className="absolute bottom-0 left-0 right-0 text-white z-10 p-8">
            {/* Name and age with better typography */}
            <div className="mb-3">
              <h1 className="text-4xl font-bold drop-shadow-2xl mb-2">
                {profile.name}, {profile.age}
              </h1>
              <div className="flex items-center gap-3 text-white/90">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-lg font-medium">{profile.distance}</span>
              </div>
            </div>
            
            {/* Occupation */}
            <p className="text-white/80 text-lg mb-4 font-medium">{profile.occupation}</p>

            {/* Match score and personality badges */}
            {hasMatchScore && (
              <div className="mb-4 flex flex-wrap gap-2 items-center">
                <Badge className={`text-base px-4 py-2 font-bold bg-gradient-to-r ${matchScore > 80 
                  ? 'from-amoura-deep-pink to-pink-500' 
                  : matchScore > 65
                    ? 'from-orange-400 to-amber-500'
                    : 'from-blue-400 to-blue-500'
                  } text-white border-0 shadow-lg`}>
                  {matchScore}% Match
                </Badge>
              </div>
            )}

            {/* Personality badges */}
            {profile.relationshipIntention && profile.personalityBadges && (
              <div className="mb-6">
                <PersonalityBadges 
                  intention={profile.relationshipIntention} 
                  badges={profile.personalityBadges.slice(0, 2)} 
                />
              </div>
            )}

            {/* Interests preview */}
            {(profile as any).interests && (profile as any).interests.length > 0 && (
              <div className="mb-6">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
                  <h4 className="text-white/70 text-sm mb-2 font-medium">Things you can bond over</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🏙️</span>
                    <span className="text-white font-medium">{(profile as any).interests[0]}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced action buttons with Bumble-inspired design */}
        <div className="absolute bottom-8 left-0 right-0 z-20 px-8">
          <div className="flex items-center justify-center gap-6">
            {/* Pass button */}
            <Button
              onClick={handlePass}
              className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xl"
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Like button - main action */}
            <Button
              ref={likeButtonRef}
              onClick={handleLike}
              className="h-16 w-16 rounded-full bg-gradient-to-r from-amoura-deep-pink to-pink-500 hover:from-amoura-deep-pink hover:to-pink-600 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl"
            >
              <Heart className="w-7 h-7" />
            </Button>

            {/* Super like button */}
            <Button
              onClick={() => onSwipe("superLike")}
              className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xl"
            >
              <Star className="w-6 h-6 fill-current" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Floating Hearts Animation */}
      <FloatingHeartsAnimation
        trigger={showHeartAnimation}
        onComplete={() => setShowHeartAnimation(false)}
        buttonRef={likeButtonRef}
      />
    </>
  );
};

const Home = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { tier } = useSubscription();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

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
    setShowFilters(false);
    console.log("Filters applied:", newFilters);
  };

  const handleSwipeWithHistory = async (direction: string) => {
    if (currentProfile && user) {
      setSwipedProfiles([...swipedProfiles, { profile: currentProfile, direction }]);
      handleSwipe(direction);
    }
  };
  
  const hasMoreProfiles = currentIndex >= 0 && currentIndex < filteredProfiles.length;

  return (
    <AppLayout>
      <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        {/* Enhanced header with minimal design */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Collapsible date idea */}
            <div className="flex-1">
              <DateIdea />
            </div>
            
            {/* Filter button */}
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="ghost"
              size="icon"
              className="ml-4 h-10 w-10 rounded-full bg-gray-100/80 hover:bg-gray-200/80"
            >
              <Filter className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
          
          {/* Collapsible filters */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-100/50 bg-white/90 backdrop-blur-xl"
            >
              <div className="p-4">
                <MatchFilters onApplyFilters={handleApplyFilters} />
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Main content area with full-screen cards */}
        <div className="absolute inset-0 pt-20">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amoura-deep-pink mx-auto mb-3"></div>
                <p className="text-gray-600 font-medium">Finding your perfect matches...</p>
              </div>
            </div>
          ) : (
            <div className="h-full w-full relative max-w-md mx-auto">
              <AnimatePresence mode="wait">
                {hasMoreProfiles && currentProfile ? (
                  <HomeProfileCard
                    key={currentProfile.id}
                    profile={currentProfile}
                    onSwipe={handleSwipeWithHistory}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full p-8">
                    <NoMoreProfiles onRefresh={() => {
                      console.log('Refreshing profiles...');
                      setCurrentIndex(0);
                      const refreshedProfiles = enhancedProfiles.map(p => ({
                        ...p,
                        matchScore: Math.floor(Math.random() * 40) + 60,
                        interestsScore: Math.floor(Math.random() * 70) + 30,
                        personalityScore: Math.floor(Math.random() * 60) + 40,
                      }));
                      setFilteredProfiles(refreshedProfiles);
                    }} />
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
        
        {/* Bottom premium features - minimized */}
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-xl border-t border-gray-100/50">
          <div className="p-4">
            <PremiumFeatures 
              onRewind={() => {
                if (swipedProfiles.length > 0) {
                  const lastSwiped = swipedProfiles[swipedProfiles.length - 1];
                  if (lastSwiped) {
                    setSwipedProfiles(swipedProfiles.slice(0, -1));
                    setCurrentIndex(currentIndex - 1);
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
              }}
              onSuperLike={async () => {
                if (currentProfile && user) {
                  handleSwipe("superLike");
                  setSwipedProfiles([...swipedProfiles, { profile: currentProfile, direction: "superLike" }]);
                  toast({
                    title: "Super Like Sent!",
                    description: `${currentProfile.name} will be notified that you super liked them!`,
                    variant: "default",
                  });
                }
              }}
              onBoost={() => {
                toast({
                  title: "Profile Boosted!",
                  description: "Your profile will receive increased visibility for the next hour.",
                });
              }}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Home;
