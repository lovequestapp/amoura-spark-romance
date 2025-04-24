
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface ProfileImageProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  online?: boolean;
  premium?: boolean;
  className?: string;
  onClick?: () => void;
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  src,
  alt,
  size = 'md',
  online,
  premium,
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
            'rounded-full object-cover shadow-sm',
            premium ? 'border-2 border-amoura-gold' : 'border-2 border-white',
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
      
      {premium && (
        <div className={cn(
          'absolute -top-1 -right-1 rounded-full bg-gradient-to-r from-amoura-gold to-amber-500 flex items-center justify-center shadow-sm',
          size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-6 w-6'
        )}>
          <Star 
            size={size === 'sm' ? 8 : size === 'md' ? 10 : 12} 
            className="text-black fill-black" 
          />
        </div>
      )}
    </div>
  );
};

export default ProfileImage;
