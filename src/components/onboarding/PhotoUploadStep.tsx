
import React, { useState, useEffect } from 'react';
import PhotoUploader from '@/components/profile/PhotoUploader';
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PhotoUploadStepProps {
  photos: { file: File; url: string }[];
  setPhotos: React.Dispatch<React.SetStateAction<{ file: File; url: string }[]>>;
}

const PhotoUploadStep: React.FC<PhotoUploadStepProps> = ({ photos, setPhotos }) => {
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Validate photos whenever they change
  useEffect(() => {
    if (photos.length < 1) {
      setIsValid(false);
      setErrorMessage("Please upload at least 1 photo to continue.");
    } else {
      setIsValid(true);
      setErrorMessage("");
    }
  }, [photos]);

  const handleAddSamplePhotos = () => {
    // This is just for demo purposes - in a real app, you'd want users to upload their own photos
    toast({
      title: "Demo mode",
      description: "In a real app, users would upload their own photos."
    });
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-3">Add your photos</h2>
      <p className="text-gray-500 mb-6">Upload at least 1 photo to help others get to know you better. We recommend adding 3-6 photos.</p>
      
      {!isValid && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      <PhotoUploader 
        photos={photos}
        onPhotosChange={setPhotos}
        maxPhotos={6}
      />
      
      <div className="mt-4 space-y-4">
        <p className="text-xs text-gray-500">
          Photos should clearly show your face and reflect your personality. Group photos are fine, but make sure we can identify you.
        </p>
        
        {photos.length === 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddSamplePhotos}
            className="w-full"
          >
            Use sample photos (Demo)
          </Button>
        )}
        
        <div className="flex flex-col space-y-1">
          <p className="text-xs font-medium text-gray-700">Photo requirements:</p>
          <ul className="text-xs text-gray-500 list-disc pl-5">
            <li>Clear, recent photos of yourself</li>
            <li>Avoid heavily filtered images</li>
            <li>At least one clear photo of your face</li>
            <li>Maximum size: 10MB per photo</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PhotoUploadStep;
