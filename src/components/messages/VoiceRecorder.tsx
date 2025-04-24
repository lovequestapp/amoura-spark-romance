
import React from 'react';
import { Mic, MicOff, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceRecorder } from '@/hooks/use-voice-recorder';

interface VoiceRecorderProps {
  onSendVoice: (blob: Blob) => void;
  onCancel: () => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onSendVoice, onCancel }) => {
  const { 
    isRecording, 
    audioBlob, 
    audioUrl, 
    recordingTime,
    startRecording, 
    stopRecording, 
    cancelRecording,
    formatTime
  } = useVoiceRecorder();

  const handleSend = () => {
    if (audioBlob) {
      onSendVoice(audioBlob);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
        {!isRecording && !audioUrl && (
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center text-gray-500">
              <Mic size={18} className="mr-2" />
              <span>Tap to record voice message</span>
            </div>
            <Button 
              type="button" 
              variant="ghost"
              size="sm" 
              className="rounded-full text-red-500"
              onClick={onCancel}
            >
              <X size={18} />
            </Button>
          </div>
        )}

        {isRecording && (
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse" />
              <span className="text-red-500 font-medium">{formatTime(recordingTime)}</span>
            </div>
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="ghost"
                size="sm" 
                className="rounded-full text-red-500" 
                onClick={cancelRecording}
              >
                <X size={18} />
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="rounded-full"
                onClick={stopRecording}
              >
                <MicOff size={18} />
              </Button>
            </div>
          </div>
        )}

        {audioUrl && !isRecording && (
          <div className="w-full flex items-center justify-between">
            <audio src={audioUrl} controls className="h-8 w-48" />
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="ghost"
                size="sm" 
                className="rounded-full text-gray-500" 
                onClick={cancelRecording}
              >
                <X size={18} />
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                className="rounded-full bg-amoura-deep-pink hover:bg-amoura-deep-pink/90"
                onClick={handleSend}
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        )}

        {!isRecording && !audioUrl && (
          <Button 
            type="button"
            variant="ghost"
            size="lg"
            className="rounded-full absolute left-1/2 transform -translate-x-1/2 bg-amoura-deep-pink text-white hover:bg-amoura-deep-pink/90"
            onClick={startRecording}
          >
            <Mic size={24} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;
