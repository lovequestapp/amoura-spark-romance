
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
  placeholderStyle?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ 
  src, 
  alt, 
  className, 
  fallback, 
  placeholderStyle,
  ...props 
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imageSource, setImageSource] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    // Reset states when src changes
    if (src) {
      setLoaded(false);
      setError(false);
      
      const img = new Image();
      img.src = src;
      
      img.onload = () => {
        setImageSource(src);
        setLoaded(true);
      };
      
      img.onerror = () => {
        setError(true);
        console.error(`Failed to load image: ${src}`);
      };
    }
  }, [src]);
  
  if (error) {
    return fallback || (
      <div className={cn(
        "flex items-center justify-center bg-gray-100", 
        placeholderStyle || "w-full h-full min-h-[100px]"
      )}>
        <span className="text-gray-400 text-sm">Failed to load image</span>
      </div>
    );
  }
  
  if (!loaded) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-gray-50", 
        placeholderStyle || "w-full h-full min-h-[100px]"
      )}>
        <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
      </div>
    );
  }
  
  return (
    <img
      src={imageSource}
      alt={alt}
      className={className}
      loading="lazy"
      {...props}
    />
  );
};

export default LazyImage;
