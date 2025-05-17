
import React, { useState, useEffect } from 'react';
import PhotoUploader from '@/components/profile/PhotoUploader';
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { uploadProfilePhoto } from '@/services/profile';
import { Loader2 } from 'lucide-react';

interface PhotoUploadStepProps {
  photos: { file: File; url: string }[];
  setPhotos: React.Dispatch<React.SetStateAction<{ file: File; url: string }[]>>;
}

const PhotoUploadStep: React.FC<PhotoUploadStepProps> = ({ photos, setPhotos }) => {
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
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

  const handleAddSamplePhotos = async () => {
    setIsUploading(true);
    setUploadError(null);
    
    try {
      // For demo purposes - using sample images
      const sampleImages = [
        '/lovable-uploads/4388b48e-0a4b-4870-9e6b-55b46b986162.png',
        '/lovable-uploads/47129695-da2d-45c2-af99-edd3aa1c1244.png',
        '/lovable-uploads/563b3aaf-34dd-4f18-b63b-7c65acc45c6f.png'
      ];
      
      // Create fake File objects with the sample images
      const samplePhotos = sampleImages.slice(0, 3).map((url, index) => {
        // Create a simple placeholder File object with sample data
        const dummyFile = new File([''], `sample-${index}.png`, { type: 'image/png' });
        return { file: dummyFile, url: url };
      });
      
      setPhotos(samplePhotos);
      toast({
        title: "Sample photos added",
        description: "Sample photos have been added to your profile for demonstration purposes."
      });
    } catch (error) {
      console.error('Error adding sample photos:', error);
      setUploadError("Failed to add sample photos. Please try again or upload your own photos.");
      toast({
        title: "Error",
        description: "Failed to add sample photos. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
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
      
      {uploadError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}
      
      <PhotoUploader 
        photos={photos}
        onPhotosChange={setPhotos}
        maxPhotos={6}
        onError={(error) => {
          setUploadError(error);
          toast({
            title: "Upload failed",
            description: error,
            variant: "destructive"
          });
        }}
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
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading samples...
              </>
            ) : (
              "Use sample photos (Demo)"
            )}
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
