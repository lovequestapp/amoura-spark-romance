
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PostCard from './PostCard';
import PostDetail from './PostDetail';
import { useIsMobile } from '@/hooks/use-mobile';

interface CommunityFeedProps {
  activeTab: 'latest' | 'trending' | 'following';
}

// Enhanced mock data with new images
const posts = [
  {
    id: '1',
    author: {
      name: 'Party Planner Pro',
      avatar: '/photo-1649972904349-6e44c42644a7',
    },
    content: "Just hosted the most epic singles mixer event! The energy was incredible and we saw so many connections being made. Here are my top tips for organizing a successful social gathering:\n\n1. Choose a unique venue\n2. Create interactive activities\n3. Have great music\n4. Plan ice-breaker games\n\nSwipe to see the amazing moments we captured!",
    image: '/lovable-uploads/a587d90b-bc43-4d5f-8a28-253bf2ef3eba.png',
    tags: ['singles', 'events', 'networking', 'dating'],
    likes: 156,
    comments: 47,
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    author: {
      name: 'Adventure Seeker',
      avatar: '/photo-1581092795360-fd1ca04f0952',
    },
    content: "Just returned from an incredible hiking date in the mountains! If you're looking for a unique date idea that combines adventure and romance, this is it. The views were breathtaking and it's a perfect way to have meaningful conversations while staying active.\n\nPro tip: Pack a surprise picnic for the summit - it's the perfect romantic gesture!",
    image: '/lovable-uploads/dec017df-5117-4384-b5ee-21f5a6ca0e9b.png',
    tags: ['outdoors', 'dating', 'adventure', 'hiking'],
    likes: 89,
    comments: 23,
    timestamp: '6 hours ago'
  },
  {
    id: '3',
    author: {
      name: 'Sophia Rodriguez',
      avatar: '/photo-1581091226825-a6a2a5aee158',
    },
    content: 'Looking for advice: how soon is too soon to introduce someone you\'re dating to your family? We\'ve been seeing each other for about 3 months now.\n\nI really like them and things are going well, but I\'m worried about timing. Would love to hear others\' experiences!',
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
    content: 'Communication is key! Had a breakthrough conversation with my partner last night about our future goals. Sometimes just sitting down and talking openly makes all the difference.\n\nHere\'s what helped us have a productive discussion:\n- Set aside dedicated time\n- No phones or distractions\n- Use "I feel" statements\n- Listen actively\n- Take breaks if needed',
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
