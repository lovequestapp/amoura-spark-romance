
import React from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import EnhancedProfileCard from './EnhancedProfileCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface SwipeableCardProps {
  profile: any;
  controls: any;
  dragConstraints: any;
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
  const isMobile = useIsMobile();

  return (
    <motion.div
      key={profile.id}
      drag={isMobile ? "x" : false}
      dragConstraints={dragConstraints}
      dragElastic={0.7}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      animate={controls}
      initial={{ x: 0, rotate: 0, scale: 0.95, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      className="touch-none"
      style={{ touchAction: "pan-y" }}
    >
      <EnhancedProfileCard 
        profile={profile}
        onSwipe={() => {}}
      />
    </motion.div>
  );
};

export default SwipeableCard;
