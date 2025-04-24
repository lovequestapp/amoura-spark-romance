
import React from 'react';
import { Edit } from 'lucide-react';

interface ProfilePromptProps {
  question: string;
  answer: string;
  editable?: boolean;
}

const ProfilePrompt: React.FC<ProfilePromptProps> = ({ question, answer, editable = false }) => {
  return (
    <div className="profile-prompt relative">
      <h3 className="font-medium text-amoura-deep-pink mb-1">{question}</h3>
      <p className="text-gray-700">{answer}</p>
      
      {editable && (
        <button className="absolute top-3 right-3 h-7 w-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
          <Edit size={14} />
        </button>
      )}
    </div>
  );
};

export default ProfilePrompt;
