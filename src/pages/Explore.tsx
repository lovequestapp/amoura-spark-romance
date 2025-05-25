import React, { useState, useEffect } from 'react';
import { motion, useAnimation, PanInfo } from "framer-motion";
import AppLayout from '@/components/layout/AppLayout';
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Star } from "lucide-react";
import { Profile } from '@/components/home/SwipeableCard';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { enhancedProfiles } from '@/utils/placeholderData';

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

  if (!profile) {
    console.log('ExploreCard: No profile provided');
    return null;
  }

  console.log('ExploreCard: Rendering profile:', profile.name);

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
      <div className="relative w-full h-full overflow-hidden bg-white rounded-2xl mx-4" style={{ height: 'calc(100vh - 200px)' }}>
        {/* Profile Image - Takes most of the space */}
        <div className="relative w-full h-5/6">
          <img 
            src={profile.photos[0]} 
            alt={profile.name} 
            className="w-full h-full object-cover"
            draggable={false}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          {/* Profile Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 text-white z-10 p-4">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold">{profile.name}, {profile.age}</h2>
              {profile.verified && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <p className="text-white/90 text-sm">{profile.distance}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <p className="text-white/90 text-sm">{profile.occupation}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons Section - Bottom 1/6 */}
        <div className="absolute bottom-0 left-0 right-0 h-1/6 bg-white z-20 p-4 flex items-center">
          <div className="flex gap-3 w-full">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              className="flex-1 bg-pink-500 text-white py-3 rounded-full text-center font-medium shadow-lg flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5" />
              Like
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSuperLike}
              className="flex-1 bg-blue-500 text-white py-3 rounded-full text-center font-medium shadow-lg flex items-center justify-center gap-2"
            >
              <Star className="w-5 h-5 fill-current" />
              Super Like
            </motion.button>
          </div>
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
