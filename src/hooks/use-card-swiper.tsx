import { useState, useRef } from 'react';
import { useAnimation, PanInfo } from 'framer-motion';
import { Profile } from '@/types/profile';

export const useCardSwiper = (
  profiles: Profile[], 
  onSwipe?: (profile: Profile, direction: string) => void
) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragConstraints = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  const currentProfile = profiles[currentIndex];

  const handleSwipe = (direction: string) => {
    if (!currentProfile) return;
    
    const xDirection = direction === "left" ? -1000 : direction === "right" ? 1000 : 0;
    const yDirection = direction === "superLike" ? -1000 : 0;
    
    controls.start({ 
      x: xDirection, 
      y: yDirection,
      opacity: 0,
      transition: { duration: 0.5 }
    }).then(() => {
      // Call onSwipe callback with profile and direction
      if (onSwipe) {
        onSwipe(currentProfile, direction);
      }
      
      // Move to next profile
      setCurrentIndex(prev => {
        if (prev + 1 >= profiles.length) {
          return -1; // No more profiles
        }
        return prev + 1;
      });
      
      // Reset position
      controls.set({ x: 0, y: 0, opacity: 1 });
    });
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setDragging(false);
    const swipeThreshold = 150;
    
    if (Math.abs(info.offset.x) > swipeThreshold) {
      const direction = info.offset.x > 0 ? "right" : "left";
      handleSwipe(direction);
    } else if (info.offset.y < -swipeThreshold) {
      // Swipe up for Super Like
      handleSwipe("superLike");
    } else {
      controls.start({ x: 0, y: 0, transition: { type: "spring", stiffness: 500, damping: 30 } });
    }
  };

  return {
    currentIndex,
    currentProfile,
    controls,
    dragConstraints,
    dragging,
    setDragging,
    handleSwipe,
    handleDragEnd,
    setCurrentIndex
  };
};
