
import { useState, useRef } from 'react';
import { PanInfo, useAnimation } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

interface Profile {
  id: number;
  name: string;
  [key: string]: any;
}

export function useCardSwiper(profiles: Profile[], onFinish?: () => void) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const { toast } = useToast();
  const controls = useAnimation();
  const dragConstraints = useRef(null);

  const currentProfile = profiles[currentIndex];

  const handleSwipe = (dir: string) => {
    setDirection(dir);
    
    controls.start({
      x: dir === 'right' ? 400 : -400,
      rotate: dir === 'right' ? 30 : -30,
      opacity: 0,
      transition: { type: "spring", stiffness: 400, damping: 40 }
    }).then(() => {
      if (currentIndex < profiles.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(-1);
        onFinish?.();
      }
      setDirection(null);
    });
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setDragging(false);
    const threshold = 100;
    
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        handleSwipe('right');
        
        // Create heart animation effect when liking
        const heart = document.createElement('div');
        heart.className = 'heart-animation';
        document.body.appendChild(heart);
        
        setTimeout(() => {
          document.body.removeChild(heart);
        }, 1000);
      } else {
        handleSwipe('left');
      }
    } else {
      // Reset card position if not swiped far enough
      controls.start({
        x: 0,
        rotate: 0,
        transition: { type: "spring", stiffness: 500, damping: 30 }
      });
    }
  };

  return {
    currentIndex,
    currentProfile,
    direction,
    dragging,
    controls,
    dragConstraints,
    handleSwipe,
    handleDragEnd,
    setDragging,
  };
}
