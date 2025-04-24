
import React from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import EnhancedProfileCard from './EnhancedProfileCard';
import { useNavigate } from 'react-router-dom';
import { Profile } from '@/types/profile';

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
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      scale: 0.95,
      opacity: 0,
      transition: { duration: 0.2 }
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
      dragElastic={0.7}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{ originX: 0.5 }}
      className="relative max-w-sm mx-auto w-full touch-none"
      onClick={handleProfileClick}
    >
      <EnhancedProfileCard profile={profile} onSwipe={() => {}} />
    </motion.div>
  );
};

export default SwipeableCard;
