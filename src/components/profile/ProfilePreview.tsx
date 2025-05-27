
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import DetailedProfileView from './DetailedProfileView';

interface ProfilePreviewProps {
  open: boolean;
  onClose: () => void;
  profile: any;
  getAge: (birthDate: string) => number | null;
}

const ProfilePreview = ({ open, onClose, profile, getAge }: ProfilePreviewProps) => {
  if (!profile) return null;

  // Transform the profile data to match DetailedProfileView format
  const transformedProfile = {
    id: profile.id || 'preview',
    full_name: profile.full_name,
    name: profile.full_name, // fallback for DetailedProfileView
    age: profile.birth_date ? getAge(profile.birth_date) : null,
    distance: '0 mi away', // placeholder for preview
    occupation: profile.education || 'Not specified',
    photos: profile.photos || [],
    bio: profile.bio || '',
    verified: true, // user's own profile is considered verified
    premium: false,
    traits: [], // could be populated from personality traits if available
    prompts: profile.prompts || [],
    relationshipIntention: profile.relationship_type || '',
    personalityBadges: [],
    interests: [], // could be populated from user interests
    location: 'Your location'
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm p-0 gap-0 overflow-hidden max-h-[90vh]">
        {/* Close button overlay */}
        <div className="absolute top-4 right-4 z-50">
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="bg-black/20 hover:bg-black/30 text-white rounded-full w-8 h-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Use the same DetailedProfileView component */}
        <div className="overflow-y-auto max-h-[90vh]">
          <DetailedProfileView profile={transformedProfile} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePreview;
