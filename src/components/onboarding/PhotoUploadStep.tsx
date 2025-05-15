
import React from 'react';
import PhotoUploader from '@/components/profile/PhotoUploader';
import { toast } from "@/hooks/use-toast";

interface PhotoUploadStepProps {
  photos: { file: File; url: string }[];
  setPhotos: React.Dispatch<React.SetStateAction<{ file: File; url: string }[]>>;
}

const PhotoUploadStep: React.FC<PhotoUploadStepProps> = ({ photos, setPhotos }) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Add your photos</h2>
      <p className="text-gray-500 mb-8">Upload at least 3 photos to help others get to know you better</p>
      
      <PhotoUploader 
        photos={photos}
        onPhotosChange={setPhotos}
        maxPhotos={6}
      />
      
      <p className="text-xs text-gray-500 mt-4">
        Photos should clearly show your face and reflect your personality. Group photos are fine, but make sure we can identify you.
      </p>
    </div>
  );
};

export default PhotoUploadStep;
