
import React from 'react';
import { useParams } from 'react-router-dom';
import DetailedProfileView from '@/components/profile/DetailedProfileView';
import { enhancedProfiles } from '@/utils/placeholderData';

const ProfileDetail = () => {
  const { id } = useParams();
  
  // For now, we'll use the mock data from placeholderData
  // In a real app, you would fetch this data from your backend
  const profile = enhancedProfiles.find(p => p.id === Number(id));
  
  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Profile not found</p>
      </div>
    );
  }

  return <DetailedProfileView profile={profile} />;
};

export default ProfileDetail;
