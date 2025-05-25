import React, { useState, useEffect } from 'react';
import { motion, useAnimation, PanInfo } from "framer-motion";
import AppLayout from '@/components/layout/AppLayout';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, X, MessageCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { Profile } from '@/components/home/SwipeableCard';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { enhancedProfiles } from '@/utils/placeholderData';
import PersonalityBadges from '@/components/home/PersonalityBadges';

const ExploreCard = ({ profile, onSwipe }: { profile: Profile; onSwipe: (direction: string) => void }) => {
  const controls = useAnimation();
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const { offset, velocity } = info;
    
    const swipeThreshold = 100;
    const swipeVelocityThreshold = 500;
    
    const shouldSwipeRight = offset.x > swipeThreshold || velocity.x > swipeVelocityThreshold;
    const shouldSwipeLeft = offset.x < -swipeThreshold || velocity.x < -swipeVelocityThreshold;

    if (shouldSwipeRight) {
      controls.start({
        x: window.innerWidth + 50,
        rotate: 20,
        transition: { duration: 0.3 }
      });
      setTimeout(() => {
        onSwipe("right");
        controls.set({ x: 0, rotate: 0 });
      }, 300);
    } else if (shouldSwipeLeft) {
      controls.start({
        x: -window.innerWidth - 50,
        rotate: -20,
        transition: { duration: 0.3 }
      });
      setTimeout(() => {
        onSwipe("left");
        controls.set({ x: 0, rotate: 0 });
      }, 300);
    } else {
      controls.start({ 
        x: 0, 
        rotate: 0,
        transition: { type: "spring", stiffness: 400, damping: 40 }
      });
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on buttons or if dragging
    if ((e.target as HTMLElement).closest('button') || isDragging) return;
    navigate(`/profile/${profile.id}`);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSwipe("like");
  };

  const handleSuperLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSwipe("superLike");
  };

  const handlePass = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSwipe("left");
  };

  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/messages`);
  };

  if (!profile) {
    console.log('ExploreCard: No profile provided');
    return null;
  }

  console.log('ExploreCard: Rendering profile:', profile.name);

  // Check for match score and enhanced features
  const hasMatchScore = profile && 'matchScore' in profile && profile.matchScore !== null;
  const matchScore = hasMatchScore ? (profile as any).matchScore : (profile?.personalityMatch || 0);
  const hasDealbreakers = profile?.dealbreakers && profile.dealbreakers.length > 0;
  const hasAttachmentScore = profile && (profile as any).attachmentScore !== undefined;
  const attachmentScore = hasAttachmentScore ? (profile as any).attachmentScore : undefined;

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      animate={controls}
      className="absolute inset-0 cursor-pointer touch-none"
      style={{ touchAction: 'pan-x' }}
      onClick={handleCardClick}
    >
      {/* Profile card with significant space for buttons */}
      <div className="relative w-full h-[calc(100vh-200px)] overflow-hidden">
        {/* Profile Image */}
        <img 
          src={profile.photos[0]} 
          alt={profile.name} 
          className="w-full h-full object-cover"
          draggable={false}
        />
        
        {/* Stronger gradient for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
        
        {/* Enhanced Profile Info */}
        <div className="absolute bottom-6 left-0 right-0 text-white z-10 p-6">
          {/* Header with name, age, verification, and premium badges */}
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-3xl font-bold drop-shadow-lg">{profile.name}, {profile.age}</h2>
            {profile.verified && (
              <CheckCircle className="h-6 w-6 text-blue-500 fill-white" />
            )}
            {profile.premium && (
              <Badge variant="premium" className="h-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white">Premium</Badge>
            )}
            {profile.featured && (
              <Badge className="bg-gradient-to-r from-amoura-gold to-amber-400 text-black h-5 flex items-center">
                <Star className="h-3 w-3 mr-1 fill-black" /> Featured
              </Badge>
            )}
          </div>
          
          {/* Distance and occupation */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <p className="text-white text-lg drop-shadow-lg">{profile.distance}</p>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <p className="text-white text-lg drop-shadow-lg">{profile.occupation}</p>
          </div>

          {/* Enhanced Match Information and Badges */}
          {hasMatchScore && (
            <div className="mb-3 flex flex-wrap gap-2 items-center">
              <Badge className={`bg-gradient-to-r ${matchScore > 80 
                ? 'from-amoura-deep-pink to-pink-500 hover:from-amoura-deep-pink hover:to-pink-600' 
                : matchScore > 65
                  ? 'from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600'
                  : 'from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600'
                } text-white font-semibold`}>
                {matchScore}% Match
              </Badge>
              
              {hasDealbreakers && (
                <Badge variant="outline" className="bg-red-50/90 text-red-500 border-red-200 flex items-center gap-1">
                  <AlertTriangle size={12} />
                  <span>Dealbreaker</span>
                </Badge>
              )}

              {hasAttachmentScore && attachmentScore > 80 && (
                <Badge variant="outline" className="bg-green-50/90 text-green-600 border-green-200 flex items-center gap-1">
                  <Heart size={12} className="fill-green-600" />
                  <span>Compatible Style</span>
                </Badge>
              )}
            </div>
          )}

          {/* Personality Badges */}
          {profile.relationshipIntention && profile.personalityBadges && (
            <div className="mb-3">
              <PersonalityBadges 
                intention={profile.relationshipIntention} 
                badges={profile.personalityBadges.slice(0, 2)} 
              />
            </div>
          )}

          {/* Personality Match Info with enhanced details */}
          {(profile.personalityMatch || matchScore) && (
            <div className="mb-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-pink-400" />
              <p className="text-pink-200 text-sm drop-shadow-lg">
                {matchScore}% match with your personality
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Clean Action Buttons */}
      <div className="absolute bottom-24 left-0 right-0 z-20 px-6">
        <div className="flex items-center justify-center gap-4">
          {/* Message Button with $ indicator for premium feature */}
          <Button
            onClick={handleMessage}
            className="h-14 px-8 bg-black/60 backdrop-blur-md hover:bg-black/70 text-white rounded-full flex items-center gap-3 font-medium text-base transition-all duration-200 hover:scale-105 border border-white/20"
          >
            <MessageCircle className="w-5 h-5" />
            $ Message
          </Button>

          {/* Like Button - Primary action */}
          <Button
            onClick={handleLike}
            className="h-14 px-10 bg-amoura-deep-pink hover:bg-amoura-deep-pink/90 text-white rounded-full flex items-center gap-3 font-semibold text-base transition-all duration-200 hover:scale-105 shadow-lg"
          >
            <Heart className="w-5 h-5" />
            Like
          </Button>
        </div>
        
        {/* Secondary Actions - Smaller and less prominent */}
        <div className="flex justify-center gap-6 mt-4">
          {/* Pass Button */}
          <Button
            onClick={handlePass}
            variant="ghost"
            className="h-10 w-10 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Super Like Button */}
          <Button
            onClick={handleSuperLike}
            className="h-10 w-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-lg"
          >
            <Star className="w-5 h-5 fill-current" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const Explore = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load demo profiles on component mount
  useEffect(() => {
    console.log('Explore: Loading demo profiles...');
    setLoading(true);
    
    // Simulate loading delay for realism
    setTimeout(() => {
      console.log('Explore: Setting profiles:', enhancedProfiles.length, 'profiles');
      setProfiles(enhancedProfiles);
      setCurrentIndex(0);
      setLoading(false);
      console.log('Explore: Demo profiles loaded successfully');
    }, 1000);
  }, []);

  const handleSwipe = async (direction: string) => {
    const currentProfile = profiles[currentIndex];
    if (!currentProfile) return;

    console.log('Explore: Swiping', direction, 'on profile:', currentProfile.name);

    // Handle different swipe actions
    if (direction === "right" || direction === "like") {
      toast({
        title: "Liked!",
        description: `You liked ${currentProfile.name}!`,
      });
    } else if (direction === "superLike") {
      toast({
        title: "Super Like!",
        description: `You super liked ${currentProfile.name}! ⭐`,
      });
    }

    // Move to next profile
    setCurrentIndex(prev => prev + 1);
  };

  const currentProfile = profiles[currentIndex];
  const hasMoreProfiles = currentIndex < profiles.length;

  console.log('Explore: Render state - profiles:', profiles.length, 'currentIndex:', currentIndex, 'hasMore:', hasMoreProfiles, 'loading:', loading);

  if (loading) {
    return (
      <AppLayout>
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profiles...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="fixed inset-0 bg-black overflow-hidden">
        {hasMoreProfiles && currentProfile ? (
          <div className="absolute inset-0">
            <ExploreCard
              key={currentProfile.id}
              profile={currentProfile}
              onSwipe={handleSwipe}
            />
          </div>
        ) : (
          <div className="fixed inset-0 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-12 h-12 text-pink-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                No More Profiles
              </h2>
              <p className="text-gray-300 mb-6">
                You've seen all available profiles. Check back later for new matches!
              </p>
              <Button
                onClick={() => {
                  setCurrentIndex(0);
                  setProfiles([...enhancedProfiles]);
                }}
                className="bg-pink-500 hover:bg-pink-600"
              >
                Refresh Profiles
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Explore;
