
import React, { useState, useEffect } from 'react';
import { motion, useAnimation, PanInfo } from "framer-motion";
import AppLayout from '@/components/layout/AppLayout';
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, ArrowLeft, Star } from "lucide-react";
import { useCardSwiper } from '@/hooks/use-card-swiper';
import { Profile } from '@/components/home/SwipeableCard';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { enhancedProfiles } from '@/utils/placeholderData';

const ExploreCard = ({ profile, onSwipe }: { profile: Profile; onSwipe: (direction: string) => void }) => {
  const controls = useAnimation();
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

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      animate={controls}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ touchAction: 'none' }}
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden bg-white shadow-2xl">
        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-pink-500 to-pink-400 z-30 flex items-center justify-between px-6 text-white text-sm font-medium">
          <span>12:56</span>
          <div className="flex items-center gap-1">
            <span className="text-xs">5G</span>
            <div className="flex gap-1">
              <div className="w-1 h-3 bg-white rounded-full"></div>
              <div className="w-1 h-3 bg-white rounded-full"></div>
              <div className="w-1 h-3 bg-white rounded-full"></div>
              <div className="w-1 h-3 bg-white/60 rounded-full"></div>
            </div>
            <div className="w-6 h-3 bg-white rounded-sm text-xs flex items-center justify-center text-black font-bold">75</div>
          </div>
        </div>

        {/* Heart Icon Top Right */}
        <div className="absolute top-16 right-6 z-20">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <Heart className="w-6 h-6 text-pink-500" />
          </motion.div>
        </div>

        {/* Profile Image */}
        <img 
          src={profile.photos[0]} 
          alt={profile.name} 
          className="w-full h-full object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Back Button */}
        <div className="absolute top-16 left-6 z-20">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.div>
        </div>

        {/* Like Profile Button */}
        <div className="absolute top-1/2 right-6 transform -translate-y-1/2 z-20">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSwipe("right")}
            className="bg-pink-500 text-white px-6 py-3 rounded-full font-medium shadow-lg flex items-center gap-2"
          >
            <Heart className="w-5 h-5" />
            Like Profile
          </motion.button>
        </div>

        {/* Profile Info */}
        <div className="absolute bottom-32 left-6 right-6 text-white z-20">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-5xl font-bold">{profile.name}, {profile.age}</h2>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <p className="text-white/90 text-lg">{profile.distance}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <p className="text-white/90 text-lg">{profile.occupation}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-6 left-6 right-6 flex gap-4 z-20">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSwipe("message")}
            className="flex-1 bg-black/40 backdrop-blur-sm text-white py-4 rounded-full text-center font-medium border border-white/20 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Message
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSwipe("right")}
            className="flex-1 bg-pink-500 text-white py-4 rounded-full text-center font-medium shadow-lg flex items-center justify-center gap-2"
          >
            <span className="text-xl">❤️</span>
            Like
          </motion.button>
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

  // Load profiles
  useEffect(() => {
    const loadProfiles = async () => {
      setLoading(true);
      try {
        // Use enhanced profiles with realistic data
        const exploreProfiles = enhancedProfiles.map(p => ({
          ...p,
          matchScore: Math.floor(Math.random() * 40) + 60,
        }));
        setProfiles(exploreProfiles);
      } catch (error) {
        console.error('Error loading profiles:', error);
        toast({
          title: "Error",
          description: "Failed to load profiles",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, [toast]);

  const handleSwipe = async (direction: string) => {
    const currentProfile = profiles[currentIndex];
    if (!currentProfile) return;

    // Handle different swipe actions
    if (direction === "right") {
      toast({
        title: "Liked!",
        description: `You liked ${currentProfile.name}!`,
      });
    } else if (direction === "message") {
      // Navigate to messages or show message interface
      toast({
        title: "Message",
        description: `Opening conversation with ${currentProfile.name}`,
      });
    }

    // Move to next profile
    setCurrentIndex(prev => prev + 1);
  };

  const currentProfile = profiles[currentIndex];
  const hasMoreProfiles = currentIndex < profiles.length;

  if (loading) {
    return (
      <AppLayout>
        <div className="flex-1 flex items-center justify-center">
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
      <div className="flex-1 relative bg-gradient-to-br from-pink-50 to-purple-50">
        {hasMoreProfiles && currentProfile ? (
          <div className="absolute inset-4">
            <ExploreCard
              key={currentProfile.id}
              profile={currentProfile}
              onSwipe={handleSwipe}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-12 h-12 text-pink-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                No More Profiles
              </h2>
              <p className="text-gray-600 mb-6">
                You've seen all available profiles. Check back later for new matches!
              </p>
              <Button
                onClick={() => {
                  setCurrentIndex(0);
                  // Reload profiles
                  const refreshedProfiles = enhancedProfiles.map(p => ({
                    ...p,
                    matchScore: Math.floor(Math.random() * 40) + 60,
                  }));
                  setProfiles(refreshedProfiles);
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
