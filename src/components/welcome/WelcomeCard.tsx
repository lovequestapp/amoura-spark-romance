
import React from 'react';
import { motion } from 'framer-motion';

interface WelcomeCardProps {
  title: string;
  description: string;
  image: string;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ title, description, image }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="rounded-3xl overflow-hidden bg-white shadow-lg"
    >
      <div className="relative h-80">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <p className="text-white/90">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeCard;
