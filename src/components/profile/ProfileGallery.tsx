
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface ProfileGalleryProps {
  photos: string[];
  editable?: boolean;
  onAddPhoto?: () => void;
}

const ProfileGallery: React.FC<ProfileGalleryProps> = ({ 
  photos, 
  editable = false,
  onAddPhoto 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const nextPhoto = () => {
    if (currentIndex < photos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const prevPhoto = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  return (
    <div className="relative overflow-hidden rounded-xl bg-gray-100">
      <div className="aspect-[3/4] relative">
        {photos.map((photo, index) => (
          <motion.div
            key={photo}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentIndex ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className={`absolute inset-0 ${index === currentIndex ? 'z-10' : 'z-0'}`}
          >
            <img 
              src={photo} 
              alt={`Profile photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>
      
      {photos.length > 1 && (
        <>
          <button 
            onClick={prevPhoto}
            disabled={currentIndex === 0}
            className={`absolute top-1/2 left-2 z-20 h-8 w-8 rounded-full bg-white/80 flex items-center justify-center shadow-sm -translate-y-1/2 transition-opacity ${
              currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-90 hover:opacity-100'
            }`}
          >
            <ChevronLeft size={20} className="text-gray-800" />
          </button>
          
          <button 
            onClick={nextPhoto}
            disabled={currentIndex === photos.length - 1}
            className={`absolute top-1/2 right-2 z-20 h-8 w-8 rounded-full bg-white/80 flex items-center justify-center shadow-sm -translate-y-1/2 transition-opacity ${
              currentIndex === photos.length - 1 ? 'opacity-50 cursor-not-allowed' : 'opacity-90 hover:opacity-100'
            }`}
          >
            <ChevronRight size={20} className="text-gray-800" />
          </button>
        </>
      )}
      
      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-1.5">
        {photos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === currentIndex 
                ? 'w-6 bg-white' 
                : 'w-1.5 bg-white/60'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
      
      {editable && (
        <button 
          onClick={onAddPhoto}
          className="absolute bottom-4 right-4 z-20 h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-md"
        >
          <Plus size={20} className="text-amoura-deep-pink" />
        </button>
      )}
    </div>
  );
};

export default ProfileGallery;
