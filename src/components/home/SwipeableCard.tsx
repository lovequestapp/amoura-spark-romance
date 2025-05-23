
import React from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';
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

  const handleProfileClick = () => {
    navigate(`/profile/${profile.id}`);
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    },
    exit: {
      x: window.innerWidth,
      opacity: 0,
      transition: { duration: 0.3 }
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
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{ originX: 0.5 }}
      className="relative"
      onClick={handleProfileClick}
    >
      <EnhancedProfileCard profile={profile} onSwipe={() => {}} />
    </motion.div>
  );
};

export default SwipeableCard;
