
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';

const ContactSettings = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="min-h-screen bg-white">
        <div className="p-4 flex items-center border-b">
          <button 
            onClick={() => navigate('/settings')}
            className="flex items-center"
          >
            <ArrowLeft size={18} className="mr-1" />
            Back
          </button>
          <h1 className="text-lg font-medium mx-auto">Email and Phone</h1>
        </div>
        <div className="p-6">
          <p>Contact settings coming soon...</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default ContactSettings;
