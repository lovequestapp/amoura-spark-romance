
import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ImagePlus, Loader2 } from 'lucide-react';
import { uploadProfilePhoto, updateProfilePhotos } from '@/services/profile';
import { useToast } from '@/hooks/use-toast';

interface PhotoUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onPhotoUploaded: (url: string) => void;
  currentPhotos: string[];
  currentPhotosCount: number;
}

const PhotoUploadDialog = ({ open, onClose, onPhotoUploaded, currentPhotos, currentPhotosCount }: PhotoUploadDialogProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (currentPhotosCount >= 6) {
      toast({
        title: "Maximum photos reached",
        description: "You can only have up to 6 photos. Please delete some photos first.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    const result = await uploadProfilePhoto(file);
    
    if (result.url) {
      // Add the new photo to the current photos array
      const updatedPhotos = [...currentPhotos, result.url];
      
      // Save the updated photos to Supabase
      const success = await updateProfilePhotos(updatedPhotos);
      
      setIsUploading(false);
      
      if (success) {
        onPhotoUploaded(result.url);
        toast({
          title: "Photo uploaded",
          description: "Your photo has been successfully uploaded and saved.",
        });
        onClose();
      } else {
        toast({
          title: "Upload failed",
          description: "There was an error saving your photo. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      setIsUploading(false);
      toast({
        title: "Upload failed",
        description: result.error || "There was an error uploading your photo. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Photo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-32 border-dashed border-2"
            variant="outline"
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <div className="flex flex-col items-center">
                <ImagePlus className="h-6 w-6 mb-2" />
                <span>Click to upload</span>
              </div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoUploadDialog;
