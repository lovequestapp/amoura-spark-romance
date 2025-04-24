
import React, { useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface PhotoUploaderProps {
  photos: { file: File; url: string; }[];
  onPhotosChange: (photos: { file: File; url: string; }[]) => void;
  maxPhotos?: number;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ 
  photos, 
  onPhotosChange, 
  maxPhotos = 6 
}) => {
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (photos.length >= maxPhotos) {
      toast({
        title: "Maximum photos reached",
        description: `You can only upload up to ${maxPhotos} photos`,
        variant: "destructive",
      });
      return;
    }

    const url = URL.createObjectURL(file);
    onPhotosChange([...photos, { file, url }]);
  }, [photos, maxPhotos, onPhotosChange]);

  const handleRemovePhoto = useCallback((index: number) => {
    const newPhotos = [...photos];
    URL.revokeObjectURL(newPhotos[index].url);
    newPhotos.splice(index, 1);
    onPhotosChange(newPhotos);
  }, [photos, onPhotosChange]);

  return (
    <div className="grid grid-cols-3 gap-3">
      {Array.from({ length: maxPhotos }).map((_, index) => {
        const photo = photos[index];
        
        return (
          <div 
            key={index}
            className={`aspect-square rounded-xl overflow-hidden relative ${
              photo ? 'bg-black' : 'bg-gray-100 border border-dashed border-gray-300'
            }`}
          >
            {photo ? (
              <>
                <img 
                  src={photo.url} 
                  alt={`Upload ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleRemovePhoto(index)}
                  className="absolute top-2 right-2 h-8 w-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/75 transition-colors"
                  aria-label="Remove photo"
                >
                  <X size={18} />
                </button>
              </>
            ) : (
              <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Upload size={24} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Add photo</span>
              </label>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PhotoUploader;
