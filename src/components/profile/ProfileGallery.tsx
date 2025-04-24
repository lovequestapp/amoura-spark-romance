
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { updateProfilePhotos } from '@/services/profile';
import { useToast } from '@/hooks/use-toast';

interface ProfileGalleryProps {
  photos: string[];
  editable?: boolean;
  onAddPhoto?: () => void;
  onPhotosChanged?: (newPhotos: string[]) => void;
}

const ProfileGallery: React.FC<ProfileGalleryProps> = ({ 
  photos, 
  editable = false,
  onAddPhoto,
  onPhotosChanged
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  
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

  const handleDeletePhoto = async () => {
    if (photos.length <= 1) {
      toast({
        title: "Cannot delete",
        description: "You must have at least one photo on your profile.",
        variant: "destructive"
      });
      return;
    }

    setIsDeleting(true);
    
    // Remove the current photo
    const updatedPhotos = [...photos];
    updatedPhotos.splice(currentIndex, 1);
    
    // Update on Supabase
    const success = await updateProfilePhotos(updatedPhotos);
    
    setIsDeleting(false);
    
    if (success) {
      // Adjust the current index if needed
      if (currentIndex >= updatedPhotos.length) {
        setCurrentIndex(Math.max(0, updatedPhotos.length - 1));
      }
      
      // Update local state through the parent component
      if (onPhotosChanged) {
        onPhotosChanged(updatedPhotos);
      }
      
      toast({
        title: "Photo deleted",
        description: "Your photo has been successfully deleted.",
      });
    } else {
      toast({
        title: "Delete failed",
        description: "There was an error deleting your photo. Please try again.",
        variant: "destructive"
      });
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
            aria-label="Previous photo"
          >
            <ChevronLeft size={20} className="text-gray-800" />
          </button>
          
          <button 
            onClick={nextPhoto}
            disabled={currentIndex === photos.length - 1}
            className={`absolute top-1/2 right-2 z-20 h-8 w-8 rounded-full bg-white/80 flex items-center justify-center shadow-sm -translate-y-1/2 transition-opacity ${
              currentIndex === photos.length - 1 ? 'opacity-50 cursor-not-allowed' : 'opacity-90 hover:opacity-100'
            }`}
            aria-label="Next photo"
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
        <div className="absolute bottom-4 right-4 z-20 flex gap-2">
          <button 
            onClick={handleDeletePhoto}
            disabled={isDeleting}
            className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-red-50"
            aria-label="Delete photo"
          >
            <Trash2 size={20} className="text-red-500" />
          </button>
          
          <button 
            onClick={onAddPhoto}
            className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-amoura-soft-pink"
            aria-label="Add photo"
          >
            <Plus size={20} className="text-amoura-deep-pink" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileGallery;
