
import React from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import EnhancedProfileCard from './EnhancedProfileCard';

interface Profile {
  id: number;
  name: string;
  age: number;
  distance: string;
  occupation: string;
  photos: string[];
  bio: string;
  premium?: boolean;
  personalityMatch?: number;
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
    >
      <EnhancedProfileCard profile={profile} onSwipe={() => {}} />
    </motion.div>
  );
};

export default SwipeableCard;
