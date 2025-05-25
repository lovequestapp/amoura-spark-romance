
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface Like {
  id: string;
  user_id: string;
  name: string;
  photo: string;
  time: string;
}

export const useLikes = () => {
  const { user } = useAuth();
  const [likes, setLikes] = useState<Like[]>([]);
  const [loading, setLoading] = useState(true);

  // Demo likes data
  const demoLikes: Like[] = [
    {
      id: '4',
      user_id: '00000000-0000-0000-0000-000000000004',
      name: 'James',
      photo: 'https://source.unsplash.com/photo-1618160702438-9b02ab6515c9',
      time: '3 hours ago'
    },
    {
      id: '5',
      user_id: '00000000-0000-0000-0000-000000000005',
      name: 'Mia',
      photo: 'https://source.unsplash.com/photo-1582562124811-c09040d0a901',
      time: '1 day ago'
    }
  ];

  useEffect(() => {
    const fetchLikes = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Simulate loading
        await new Promise(resolve => setTimeout(resolve, 300));
        setLikes(demoLikes);
      } catch (error) {
        console.error('Error fetching likes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, [user]);

  return {
    likes,
    loading
  };
};
