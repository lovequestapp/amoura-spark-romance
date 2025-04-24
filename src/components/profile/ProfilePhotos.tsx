
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Camera, Video } from 'lucide-react';
import VideoPlayer from './VideoPlayer';

interface ProfilePhotosProps {
  photos: string[];
  video?: {
    url: string;
    thumbnail: string;
    duration: number;
  };
  editable?: boolean;
}

const ProfilePhotos: React.FC<ProfilePhotosProps> = ({ photos, video, editable = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showingVideo, setShowingVideo] = useState(false);
  
  const totalItems = photos.length + (video ? 1 : 0);
  
  const nextItem = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < totalItems - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowingVideo(currentIndex + 1 === photos.length);
    }
  };
  
  const prevItem = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowingVideo(currentIndex - 1 === photos.length);
    }
  };
  
  return (
    <div className="relative w-full aspect-[3/4]">
      {showingVideo && video ? (
        <VideoPlayer 
          videoUrl={video.url}
          thumbnail={video.thumbnail}
          duration={video.duration}
        />
      ) : (
        <img 
          src={photos[currentIndex]} 
          alt="Profile" 
          className="w-full h-full object-cover"
        />
      )}
      
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />
      
      {totalItems > 1 && (
        <>
          <button 
            onClick={prevItem}
            disabled={currentIndex === 0}
            className={`absolute top-1/2 left-2 h-8 w-8 rounded-full bg-black/30 flex items-center justify-center text-white -translate-y-1/2 ${
              currentIndex === 0 ? 'opacity-30' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          
          <button 
            onClick={nextItem}
            disabled={currentIndex === totalItems - 1}
            className={`absolute top-1/2 right-2 h-8 w-8 rounded-full bg-black/30 flex items-center justify-center text-white -translate-y-1/2 ${
              currentIndex === totalItems - 1 ? 'opacity-30' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <ChevronRight size={20} />
          </button>
          
          <div className="absolute top-4 left-0 right-0 flex justify-center gap-1">
            {Array.from({ length: totalItems }).map((_, index) => (
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
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-md">
            <Camera size={20} className="text-amoura-deep-pink" />
          </button>
          <button className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-md">
            <Video size={20} className="text-amoura-deep-pink" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotos;
