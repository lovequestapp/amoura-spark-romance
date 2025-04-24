
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface NoMoreProfilesProps {
  onRefresh: () => void;
}

const NoMoreProfiles: React.FC<NoMoreProfilesProps> = ({ onRefresh }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col items-center justify-center p-8 text-center"
    >
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <RefreshCw className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        No More Profiles
      </h3>
      <p className="text-gray-500 mb-6 max-w-[240px]">
        You've seen all profiles for now. Check back later or adjust your filters.
      </p>
      <Button
        onClick={onRefresh}
        variant="outline"
        className="rounded-full"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Refresh
      </Button>
    </motion.div>
  );
};

export default NoMoreProfiles;
