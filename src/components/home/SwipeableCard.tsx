
import React, { useCallback } from 'react';
import { motion, useAnimation, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import EnhancedProfileCard from './EnhancedProfileCard';
import { useNavigate } from 'react-router-dom';

export interface Profile {
  id: number | string;
  name: string;
  age: number;
  distance: string;
  occupation: string;
  photos: string[];
  bio: string;
  birth_date?: string;
  premium?: boolean;
  verified?: boolean;
  featured?: boolean;
  personalityMatch?: number;
  video?: {
    url: string;
    thumbnail: string;
    duration: number;
  };
  prompts: {
    question: string;
    answer: string;
  }[];
  traits?: Array<{
    name: string;
    score: number;
  }>;
  relationshipIntention?: string;
  personalityBadges?: string[];
  interests?: string[];
  matchScore?: number;
  interestsScore?: number;
  personalityScore?: number;
  intentionScore?: number;
  locationScore?: number;
  lifestyleScore?: number;
  dealbreakers?: string[];
  lifestyle?: Record<string, string | boolean>;
  latitude?: number;
  longitude?: number;
  attachment_style?: 'secure' | 'anxious' | 'avoidant' | 'fearful';
  attachmentScore?: number;
}

interface SwipeableCardProps {
  profile: Profile | null;
  controls: ReturnType<typeof useAnimation>;
  dragConstraints: React.RefObject<HTMLDivElement>;
  onDragStart: () => void;
  onDragEnd: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({
  profile,
  controls,
  dragConstraints,
  onDragStart,
  onDragEnd
}) => {
  const navigate = useNavigate();

  // Early return if profile is null
  if (!profile) {
    console.log('SwipeableCard: profile is null, not rendering');
    return null;
  }

  // Motion values for smooth dragging animations - optimized for performance
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Optimized transform values with reduced calculations
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const scale = useTransform(x, [-200, 0, 200], [0.95, 1, 0.95]);

  const handleProfileClick = useCallback((e: React.MouseEvent) => {
    // Prevent navigation if currently dragging or profile is null
    if (!profile || Math.abs(x.get()) > 5) return;
    navigate(`/profile/${profile.id}`);
  }, [x, navigate, profile]);
  
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8
      }
    },
    exit: {
      scale: 0.9,
      opacity: 0,
      transition: { 
        duration: 0.15,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      drag
      dragConstraints={dragConstraints}
      dragElastic={0.2}
      dragMomentum={false}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{ 
        x, 
        y, 
        rotate, 
        scale
      }}
      className="relative cursor-pointer touch-none will-change-transform"
      onClick={handleProfileClick}
      whileHover={{ 
        scale: 1.01,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ 
        scale: 0.99,
        transition: { duration: 0.1 }
      }}
    >
      {/* Single clean card container */}
      <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
        <EnhancedProfileCard profile={profile} onSwipe={() => {}} />
      </div>
    </motion.div>
  );
};

export default SwipeableCard;
