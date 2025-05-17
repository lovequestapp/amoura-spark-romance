
import React, { useCallback } from 'react';
import { X, Upload, Image, Loader2 } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { validatePhoto, uploadProfilePhoto } from '@/services/profile';

interface PhotoUploaderProps {
  photos: { file: File; url: string }[];
  onPhotosChange: (photos: { file: File; url: string }[]) => void;
  maxPhotos?: number;
  onError?: (message: string) => void;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ 
  photos, 
  onPhotosChange, 
  maxPhotos = 6,
  onError
}) => {
  const [uploading, setUploading] = React.useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    // Validate file before upload
    const validationError = validatePhoto(file);
    if (validationError) {
      toast({
        title: "Invalid file",
        description: validationError,
        variant: "destructive"
      });
      if (onError) onError(validationError);
      return;
    }
    
    if (photos.length >= maxPhotos) {
      toast({
        title: "Limit reached",
        description: `You can upload a maximum of ${maxPhotos} photos.`,
        variant: "destructive"
      });
      if (onError) onError(`You can upload a maximum of ${maxPhotos} photos.`);
      return;
    }
    
    setUploading(true);
    
    try {
      // Create a temporary URL for preview
      const localUrl = URL.createObjectURL(file);
      
      // Add to photos array with local URL first for immediate feedback
      const updatedPhotos = [...photos, { file, url: localUrl }];
      onPhotosChange(updatedPhotos);
      
      // Start actual upload to storage
      const { url, error } = await uploadProfilePhoto(file);
      
      if (error || !url) {
        // If upload fails, remove the temporary photo
        onPhotosChange(photos);
        throw new Error(error || "Failed to upload photo");
      }
      
      // Update with the real URL from storage
      const finalPhotos = photos.map(p => p);
      finalPhotos.push({ file, url });
      onPhotosChange(finalPhotos);
      
      toast({
        title: "Photo uploaded",
        description: "Your photo has been added successfully."
      });
    } catch (error) {
      console.error('Error in photo upload:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to upload photo";
      
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive"
      });
      
      if (onError) onError(errorMessage);
    } finally {
      setUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleRemovePhoto = useCallback((index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    onPhotosChange(newPhotos);
    
    toast({
      title: "Photo removed",
      description: "The photo has been removed from your profile."
    });
  }, [photos, onPhotosChange]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo, index) => (
          <div 
            key={index} 
            className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden"
          >
            <img 
              src={photo.url} 
              alt={`Profile photo ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <button
              type="button"
              onClick={() => handleRemovePhoto(index)}
              className="absolute top-1 right-1 bg-black/70 rounded-full p-1 text-white hover:bg-black"
              aria-label="Remove photo"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        
        {photos.length < maxPhotos && (
          <label className="flex flex-col items-center justify-center aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange} 
              disabled={uploading}
            />
            <div className="flex flex-col items-center">
              {uploading ? (
                <>
                  <Loader2 size={24} className="text-amoura-deep-pink animate-spin mb-1" />
                  <span className="text-xs text-gray-500">Uploading...</span>
                </>
              ) : (
                <>
                  <Upload size={24} className="text-amoura-deep-pink mb-1" />
                  <span className="text-xs text-gray-500">Add photo</span>
                </>
              )}
            </div>
          </label>
        )}
      </div>
      
      <p className="text-xs text-center text-gray-500">
        {photos.length}/{maxPhotos} photos
      </p>
    </div>
  );
};

export default PhotoUploader;
