
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PostCard from './PostCard';
import PostDetail from './PostDetail';
import { useIsMobile } from '@/hooks/use-mobile';

interface CommunityFeedProps {
  activeTab: 'latest' | 'trending' | 'following';
}

// Mock data for demonstration
const posts = [
  {
    id: '1',
    author: {
      name: 'Emma Wilson',
      avatar: '/photo-1649972904349-6e44c42644a7',
    },
    content: "Just had an amazing first date at the new rooftop restaurant downtown! The views were incredible and conversation flowed easily. Anyone else have good first date spots to recommend?\n\nHere are some things that made it special:\n- Ambient lighting\n- Great music selection\n- Attentive but not intrusive service\n- Perfect weather for outdoor dining",
    image: '/photo-1486312338219-ce68d2c6f44d',
    tags: ['dating', 'firstdate', 'advice'],
    likes: 42,
    comments: 12,
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    author: {
      name: 'Marcus Chen',
      avatar: '/photo-1581092795360-fd1ca04f0952',
    },
    content: 'After 2 years of dating, I finally proposed yesterday! She said yes! Here are some tips that helped me plan the perfect proposal...',
    tags: ['proposal', 'success', 'relationships'],
    likes: 156,
    comments: 47,
    timestamp: '6 hours ago'
  },
  {
    id: '3',
    author: {
      name: 'Sophia Rodriguez',
      avatar: '/photo-1581091226825-a6a2a5aee158',
    },
    content: 'Looking for advice: how soon is too soon to introduce someone you\'re dating to your family? We\'ve been seeing each other for about 3 months now.',
    tags: ['advice', 'dating', 'family'],
    likes: 28,
    comments: 35,
    timestamp: '1 day ago'
  },
  {
    id: '4',
    author: {
      name: 'James Thompson',
      avatar: '/photo-1721322800607-8c38375eef04',
    },
    content: 'Communication is key! Had a breakthrough conversation with my partner last night about our future goals. Sometimes just sitting down and talking openly makes all the difference.',
    image: '/photo-1519389950473-47ba0277781c',
    tags: ['communication', 'relationships', 'growth'],
    likes: 89,
    comments: 16,
    timestamp: '2 days ago'
  },
];

const CommunityFeed: React.FC<CommunityFeedProps> = ({ activeTab }) => {
  const isMobile = useIsMobile();
  const [selectedPost, setSelectedPost] = useState<typeof posts[0] | null>(null);
  
  // Filter posts based on activeTab
  const displayPosts = posts.filter(post => {
    switch(activeTab) {
      case 'trending':
        return post.likes > 30; // Show posts with more than 30 likes
      case 'following':
        return Math.random() > 0.5; // Randomly filter for demo
      default:
        return true;
    }
  });
  
  return (
    <div className="space-y-4">
      {displayPosts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No posts to display</p>
        </div>
      ) : (
        displayPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={() => setSelectedPost(post)}
          >
            <PostCard post={post} isMobile={isMobile} />
          </motion.div>
        ))
      )}
      
      <PostDetail 
        post={selectedPost} 
        isOpen={!!selectedPost} 
        onClose={() => setSelectedPost(null)} 
      />
    </div>
  );
};

export default CommunityFeed;
