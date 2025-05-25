
import React, { useRef } from 'react';
import { Image } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, disabled = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <button 
        type="button" 
        onClick={handleImageClick}
        disabled={disabled}
        className="text-gray-500 p-2 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Image size={20} />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
};

export default ImageUpload;
