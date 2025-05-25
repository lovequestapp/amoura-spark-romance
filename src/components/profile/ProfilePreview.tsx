
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, GraduationCap, Heart, MessageCircle, X } from 'lucide-react';

interface ProfilePreviewProps {
  open: boolean;
  onClose: () => void;
  profile: any;
  getAge: (birthDate: string) => number | null;
}

const ProfilePreview = ({ open, onClose, profile, getAge }: ProfilePreviewProps) => {
  if (!profile) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm p-0 gap-0 overflow-hidden">
        <DialogHeader className="absolute top-4 left-4 right-4 z-10">
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 bg-black/20 hover:bg-black/30 text-white rounded-full w-8 h-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        {/* Profile Card - Mobile Dating App Style */}
        <div className="relative bg-white">
          {/* Main Photo */}
          <div className="relative h-96 bg-gradient-to-b from-transparent to-black/60">
            <img 
              src={profile.photos?.[0] || '/placeholder.svg'} 
              alt={profile.full_name}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-end justify-between">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-1">
                    {profile.full_name}
                    {profile.birth_date && (
                      <span className="ml-2">{getAge(profile.birth_date)}</span>
                    )}
                  </h1>
                  
                  {/* Location */}
                  <div className="flex items-center gap-1 text-white/90 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">San Francisco, CA</span>
                  </div>

                  {/* Quick Info */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profile.gender && (
                      <Badge className="bg-white/20 text-white border-white/30">
                        {profile.gender}
                      </Badge>
                    )}
                    {profile.education && (
                      <Badge className="bg-white/20 text-white border-white/30">
                        <GraduationCap className="w-3 h-3 mr-1" />
                        {profile.education.split(' ')[0]}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          {profile.bio && (
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {/* Prompts */}
          {profile.prompts && profile.prompts.length > 0 && (
            <div className="px-6 pb-6">
              <div className="space-y-4">
                {profile.prompts.slice(0, 2).map((prompt: any, index: number) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs font-medium text-amoura-deep-pink mb-2 uppercase tracking-wide">
                      {prompt.question}
                    </p>
                    <p className="text-gray-800 text-sm">{prompt.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Photos Preview */}
          {profile.photos && profile.photos.length > 1 && (
            <div className="px-6 pb-6">
              <h3 className="font-semibold text-gray-900 mb-3">More Photos</h3>
              <div className="grid grid-cols-3 gap-2">
                {profile.photos.slice(1, 4).map((photo: string, index: number) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden">
                    <img 
                      src={photo} 
                      alt={`Photo ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="p-6 bg-gray-50 border-t">
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-gray-300"
              >
                <X className="w-4 h-4 mr-2" />
                Pass
              </Button>
              <Button
                className="flex-1 bg-amoura-deep-pink hover:bg-amoura-deep-pink/90"
              >
                <Heart className="w-4 h-4 mr-2" />
                Like
              </Button>
            </div>
            <Button
              variant="ghost"
              className="w-full mt-2 text-amoura-deep-pink"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePreview;
