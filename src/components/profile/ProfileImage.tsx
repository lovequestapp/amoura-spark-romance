
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProfileImageProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  online?: boolean;
  className?: string;
  onClick?: () => void;
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  src,
  alt,
  size = 'md',
  online,
  className,
  onClick
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20'
  };
  
  const handleClick = () => {
    if (onClick) onClick();
  };
  
  return (
    <div className={cn('relative', className)} onClick={handleClick}>
      <motion.div
        whileHover={{ scale: onClick ? 1.05 : 1 }}
        whileTap={{ scale: onClick ? 0.95 : 1 }}
      >
        <img 
          src={src.startsWith('http') ? src : `https://source.unsplash.com${src}`} 
          alt={alt}
          className={cn(
            sizeClasses[size], 
            'rounded-full object-cover border-2 border-white shadow-sm',
            onClick && 'cursor-pointer'
          )}
        />
      </motion.div>
      
      {online !== undefined && (
        <div 
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-white',
            size === 'sm' ? 'h-2 w-2' : 'h-3 w-3',
            online ? 'bg-green-500' : 'bg-gray-300'
          )} 
        />
      )}
    </div>
  );
};

export default ProfileImage;
