
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Camera, X } from 'lucide-react';

interface ProfilePhotosProps {
  photos: string[];
  editable?: boolean;
}

const ProfilePhotos: React.FC<ProfilePhotosProps> = ({ photos, editable = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < photos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  return (
    <div className="relative w-full aspect-[3/4]">
      <img 
        src={photos[currentIndex]} 
        alt="Profile" 
        className="w-full h-full object-cover"
      />
      
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />
      
      {photos.length > 1 && (
        <>
          <button 
            onClick={prevPhoto}
            disabled={currentIndex === 0}
            className={`absolute top-1/2 left-2 h-8 w-8 rounded-full bg-black/30 flex items-center justify-center text-white -translate-y-1/2 ${
              currentIndex === 0 ? 'opacity-30' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          
          <button 
            onClick={nextPhoto}
            disabled={currentIndex === photos.length - 1}
            className={`absolute top-1/2 right-2 h-8 w-8 rounded-full bg-black/30 flex items-center justify-center text-white -translate-y-1/2 ${
              currentIndex === photos.length - 1 ? 'opacity-30' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <ChevronRight size={20} />
          </button>
          
          <div className="absolute top-4 left-0 right-0 flex justify-center gap-1">
            {photos.map((_, index) => (
              <div 
                key={index}
                className={`h-1 w-8 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </>
      )}
      
      {editable && (
        <button className="absolute bottom-4 right-4 h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-md">
          <Camera size={20} className="text-amoura-deep-pink" />
        </button>
      )}
    </div>
  );
};

export default ProfilePhotos;
