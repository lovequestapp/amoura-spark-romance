
import React, { useState } from 'react';
import { Play, Pause, Video } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnail: string;
  duration: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, thumbnail, duration }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative aspect-[3/4] w-full">
      <video
        ref={videoRef}
        src={videoUrl}
        poster={thumbnail}
        className="w-full h-full object-cover"
        onEnded={() => setIsPlaying(false)}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          onClick={togglePlay}
          className="h-12 w-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white transition-opacity hover:bg-black/70"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
      </div>
      {!isPlaying && (
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white text-sm">
          <Video size={16} />
          <span>{Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}</span>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
