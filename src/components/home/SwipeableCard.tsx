
import React from 'react';
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
  birth_date?: string; // Add birth_date property
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
  profile: Profile;
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

  // Motion values for smooth dragging animations
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform values for dynamic animations during drag
  const rotate = useTransform(x, [-300, 0, 300], [-30, 0, 30]);
  const scale = useTransform(x, [-300, 0, 300], [0.8, 1, 0.8]);
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 0.5, 1, 0.5, 0]);

  const handleProfileClick = (e: React.MouseEvent) => {
    // Prevent navigation if currently dragging
    if (Math.abs(x.get()) > 5) return;
    navigate(`/profile/${profile.id}`);
  };
  
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9,
      rotate: -5
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 25,
        mass: 1
      }
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      transition: { 
        duration: 0.2,
        ease: "easeInOut"
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
      dragElastic={0.8}
      dragMomentum={false}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{ 
        x, 
        y, 
        rotate, 
        scale,
        originX: 0.5,
        originY: 0.5
      }}
      className="relative cursor-pointer touch-none"
      onClick={handleProfileClick}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
    >
      {/* Card with enhanced shadow and styling */}
      <motion.div
        style={{ opacity }}
        className="relative bg-white rounded-3xl shadow-2xl overflow-hidden"
        whileHover={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          transition: { duration: 0.3 }
        }}
      >
        <EnhancedProfileCard profile={profile} onSwipe={() => {}} />
      </motion.div>
    </motion.div>
  );
};

export default SwipeableCard;
