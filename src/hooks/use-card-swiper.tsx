
import { useState, useRef, useCallback, useEffect } from "react";
import { useAnimation, PanInfo } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Profile } from "@/components/home/SwipeableCard";

interface UseCardSwiperResult {
  currentIndex: number;
  currentProfile: Profile | null;
  profiles: Profile[];
  controls: ReturnType<typeof useAnimation>;
  dragConstraints: React.RefObject<HTMLDivElement>;
  dragging: boolean;
  setDragging: React.Dispatch<React.SetStateAction<boolean>>;
  handleSwipe: (direction: string) => void;
  handleDragEnd: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  setProfiles: React.Dispatch<React.SetStateAction<Profile[]>>;
}

export const useCardSwiper = (
  initialProfiles: Profile[],
  onSwipe?: (profile: Profile, direction: string) => void
): UseCardSwiperResult => {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragConstraints = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const { toast } = useToast();
  
  // Update profiles when initial profiles change
  useEffect(() => {
    setProfiles(initialProfiles);
    if (initialProfiles.length > 0 && currentIndex >= initialProfiles.length) {
      setCurrentIndex(0);
    }
  }, [initialProfiles, currentIndex]);
  
  const currentProfile = profiles[currentIndex] || null;

  const triggerMatch = useCallback((profile: Profile) => {
    // Simulate a match with 30% probability
    const isMatch = Math.random() < 0.3;
    if (isMatch) {
      toast({
        title: "New Match! 🎉",
        description: `You and ${profile.name} liked each other!`,
        variant: "default",
      });
      // In a real app, you'd store this match in the database and show a match screen
    }
  }, [toast]);

  const handleSwipe = useCallback(
    (direction: string) => {
      if (!currentProfile) return;

      const xMove = direction === "right" || direction === "superLike" ? 600 : -600;
      
      controls.start({
        x: xMove,
        opacity: 0,
        transition: { duration: 0.5 },
      });

      // Notify about the swipe
      if (onSwipe) {
        onSwipe(currentProfile, direction);
      }
      
      // Trigger match logic on right swipe or super like
      if (direction === "right" || direction === "superLike") {
        triggerMatch(currentProfile);
      }

      // Move to next card after animation
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        controls.set({ x: 0, opacity: 1 });
      }, 500);
    },
    [currentProfile, controls, onSwipe, triggerMatch]
  );

  const handleDragEnd = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      setDragging(false);
      const threshold = 100;

      if (info.offset.x > threshold) {
        handleSwipe("right");
      } else if (info.offset.x < -threshold) {
        handleSwipe("left");
      } else {
        controls.start({
          x: 0,
          opacity: 1,
          transition: { type: "spring", stiffness: 300, damping: 25 },
        });
      }
    },
    [controls, handleSwipe]
  );

  return {
    currentIndex,
    currentProfile,
    profiles,
    controls,
    dragConstraints,
    dragging,
    setDragging,
    handleSwipe,
    handleDragEnd,
    setCurrentIndex,
    setProfiles,
  };
};
