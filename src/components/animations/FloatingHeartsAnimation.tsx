
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface HeartParticle {
  id: number;
  x: number;
  y: number;
  delay: number;
  size: number;
  rotation: number;
  color: string;
}

interface FloatingHeartsAnimationProps {
  trigger: boolean;
  onComplete?: () => void;
  buttonRef?: React.RefObject<HTMLElement>;
}

const FloatingHeartsAnimation: React.FC<FloatingHeartsAnimationProps> = ({ 
  trigger, 
  onComplete, 
  buttonRef 
}) => {
  const [hearts, setHearts] = useState<HeartParticle[]>([]);

  useEffect(() => {
    if (trigger) {
      // Create multiple heart particles
      const newHearts: HeartParticle[] = [];
      const heartCount = 6;
      
      for (let i = 0; i < heartCount; i++) {
        newHearts.push({
          id: Date.now() + i,
          x: Math.random() * 100 - 50, // Random spread from -50px to 50px
          y: Math.random() * 80 + 40, // Random height from 40px to 120px
          delay: i * 0.1, // Stagger the animations
          size: Math.random() * 0.5 + 0.7, // Random size between 0.7 and 1.2
          rotation: Math.random() * 360, // Random initial rotation
          color: ['text-amoura-deep-pink', 'text-pink-500', 'text-red-500'][Math.floor(Math.random() * 3)]
        });
      }
      
      setHearts(newHearts);
      
      // Clear hearts after animation completes
      setTimeout(() => {
        setHearts([]);
        onComplete?.();
      }, 2500);
    }
  }, [trigger, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {hearts.map((heart) => {
          // Calculate position relative to button if buttonRef is provided
          let startX = window.innerWidth / 2;
          let startY = window.innerHeight / 2;
          
          if (buttonRef?.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            startX = rect.left + rect.width / 2;
            startY = rect.top + rect.height / 2;
          }

          return (
            <motion.div
              key={heart.id}
              className={`absolute ${heart.color} opacity-90`}
              style={{
                left: startX,
                top: startY,
                fontSize: `${heart.size * 20}px`,
              }}
              initial={{
                scale: 0,
                rotate: heart.rotation,
                x: 0,
                y: 0,
                opacity: 1,
              }}
              animate={{
                scale: [0, 1.2, 1, 0.8, 0],
                rotate: [heart.rotation, heart.rotation + 180, heart.rotation + 360],
                x: [0, heart.x * 0.3, heart.x * 0.7, heart.x],
                y: [0, -heart.y * 0.3, -heart.y * 0.6, -heart.y],
                opacity: [0, 1, 1, 0.7, 0],
              }}
              transition={{
                duration: 2,
                delay: heart.delay,
                ease: "easeOut",
                times: [0, 0.2, 0.4, 0.8, 1],
              }}
              exit={{
                opacity: 0,
                scale: 0,
              }}
            >
              <Heart className="w-full h-full fill-current drop-shadow-sm" />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default FloatingHeartsAnimation;
