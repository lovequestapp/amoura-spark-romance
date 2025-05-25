
import React from 'react';
import { motion } from 'framer-motion';
import { Like } from '@/hooks/useLikes';

interface LikeCardProps {
  like: Like;
  index: number;
}

const LikeCard: React.FC<LikeCardProps> = ({ like, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative rounded-xl overflow-hidden group cursor-pointer shadow-sm"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <img 
        src={like.photo} 
        alt={like.name}
        className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
        <h3 className="font-medium">{like.name}</h3>
        <p className="text-xs opacity-80">{like.time}</p>
      </div>
    </motion.div>
  );
};

export default LikeCard;
