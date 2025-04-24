
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bolt, Clock, User } from 'lucide-react';

interface CommunityTabsProps {
  activeTab: 'latest' | 'trending' | 'my-feed';
  onChange: (tab: 'latest' | 'trending' | 'my-feed') => void;
}

const CommunityTabs: React.FC<CommunityTabsProps> = ({ activeTab, onChange }) => {
  return (
    <div className="border-b pb-2">
      <Tabs value={activeTab} onValueChange={(value) => onChange(value as any)}>
        <TabsList className="w-full md:w-auto bg-transparent space-x-4">
          <TabsTrigger value="latest" className="flex items-center gap-2 data-[state=active]:text-amoura-deep-pink data-[state=active]:border-b-2 data-[state=active]:border-amoura-deep-pink rounded-none">
            <Clock size={16} />
            <span>Latest</span>
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center gap-2 data-[state=active]:text-amoura-deep-pink data-[state=active]:border-b-2 data-[state=active]:border-amoura-deep-pink rounded-none">
            <Bolt size={16} />
            <span>Trending</span>
          </TabsTrigger>
          <TabsTrigger value="my-feed" className="flex items-center gap-2 data-[state=active]:text-amoura-deep-pink data-[state=active]:border-b-2 data-[state=active]:border-amoura-deep-pink rounded-none">
            <User size={16} />
            <span>My Feed</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default CommunityTabs;
