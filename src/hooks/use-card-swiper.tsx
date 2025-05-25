
import { useState, useRef, useCallback, useEffect } from "react";
import { useAnimation, PanInfo } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Profile } from "@/components/home/SwipeableCard";

interface UseCardSwiperResult {
  currentIndex: number;
  currentProfile: Profile | null;
  controls: ReturnType<typeof useAnimation>;
  dragConstraints: React.RefObject<HTMLDivElement>;
  handleSwipe: (direction: string) => void;
  handleDragEnd: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  setDragging: (dragging: boolean) => void;
  setCurrentIndex: (index: number) => void;
  setProfiles: (profiles: Profile[]) => void;
}

export const useCardSwiper = (
  profiles: Profile[],
  onSwipe?: (profile: Profile, direction: string) => void
): UseCardSwiperResult => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [localProfiles, setLocalProfiles] = useState<Profile[]>(profiles);
  const controls = useAnimation();
  const dragConstraints = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Update local profiles when external profiles change
  useEffect(() => {
    setLocalProfiles(profiles);
    if (currentIndex >= profiles.length) {
      setCurrentIndex(Math.max(0, profiles.length - 1));
    }
  }, [profiles, currentIndex]);

  // Get current profile with null safety
  const currentProfile = localProfiles && localProfiles.length > 0 && currentIndex >= 0 && currentIndex < localProfiles.length 
    ? localProfiles[currentIndex] 
    : null;

  const handleSwipe = useCallback(
    (direction: string) => {
      if (!currentProfile) return;
      
      const profile = currentProfile;
      
      // Call the onSwipe callback if provided
      if (onSwipe) {
        onSwipe(profile, direction);
      }

      // Move to next profile
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1;
        return nextIndex >= localProfiles.length ? -1 : nextIndex;
      });

      // Show appropriate toast message
      if (direction === "right" || direction === "superLike") {
        toast({
          title: direction === "superLike" ? "Super Like!" : "Liked!",
          description: `You ${direction === "superLike" ? "super liked" : "liked"} ${profile.name}!`,
        });
      }
    },
    [currentProfile, localProfiles.length, onSwipe, toast]
  );

  const handleDragEnd = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (!currentProfile) return;
      
      setDragging(false);
      const { offset, velocity } = info;
      
      // Enhanced thresholds for more responsive swiping
      const swipeThreshold = 80; // Reduced threshold for easier swiping
      const swipeVelocityThreshold = 400; // Reduced velocity threshold
      
      // Calculate if swipe should trigger based on distance OR velocity
      const shouldSwipeRight = offset.x > swipeThreshold || velocity.x > swipeVelocityThreshold;
      const shouldSwipeLeft = offset.x < -swipeThreshold || velocity.x < -swipeVelocityThreshold;

      if (shouldSwipeRight) {
        // Swipe right - Like with enhanced animation
        controls.start({
          x: window.innerWidth + 100,
          y: offset.y * 0.3, // Add slight vertical movement
          rotate: 30,
          scale: 0.8,
          opacity: 0,
          transition: { 
            duration: 0.4,
            ease: [0.4, 0.0, 0.2, 1] // Custom easing for smooth exit
          },
        });
        setTimeout(() => {
          handleSwipe("right");
          controls.set({ 
            x: 0, 
            y: 0, 
            rotate: 0, 
            scale: 1, 
            opacity: 1 
          });
        }, 400);
      } else if (shouldSwipeLeft) {
        // Swipe left - Pass with enhanced animation
        controls.start({
          x: -window.innerWidth - 100,
          y: offset.y * 0.3, // Add slight vertical movement
          rotate: -30,
          scale: 0.8,
          opacity: 0,
          transition: { 
            duration: 0.4,
            ease: [0.4, 0.0, 0.2, 1] // Custom easing for smooth exit
          },
        });
        setTimeout(() => {
          handleSwipe("left");
          controls.set({ 
            x: 0, 
            y: 0, 
            rotate: 0, 
            scale: 1, 
            opacity: 1 
          });
        }, 400);
      } else {
        // Snap back to center with smooth spring animation
        controls.start({ 
          x: 0, 
          y: 0, 
          rotate: 0,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 1
          }
        });
      }
    },
    [currentProfile, controls, handleSwipe]
  );

  const setProfiles = useCallback((newProfiles: Profile[]) => {
    setLocalProfiles(newProfiles);
    if (currentIndex >= newProfiles.length) {
      setCurrentIndex(Math.max(0, newProfiles.length - 1));
    }
  }, [currentIndex]);

  return {
    currentIndex,
    currentProfile,
    controls,
    dragConstraints,
    handleSwipe,
    handleDragEnd,
    setDragging,
    setCurrentIndex,
    setProfiles,
  };
};
