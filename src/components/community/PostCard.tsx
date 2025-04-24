
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface Author {
  name: string;
  avatar: string;
}

interface Post {
  id: string;
  author: Author;
  content: string;
  image?: string;
  tags: string[];
  likes: number;
  comments: number;
  timestamp: string;
}

interface PostCardProps {
  post: Post;
  isMobile: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, isMobile }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const { toast } = useToast();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the post detail
    
    if (liked) {
      setLiked(false);
      setLikeCount(likeCount - 1);
    } else {
      setLiked(true);
      setLikeCount(likeCount + 1);
      
      // Show heart animation
      const heart = document.createElement('div');
      heart.className = 'heart-animation';
      document.body.appendChild(heart);
      setTimeout(() => document.body.removeChild(heart), 1000);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Post link has been copied to your clipboard",
    });
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Comments",
      description: "Comment functionality coming soon!",
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all cursor-pointer">
      <CardContent className="p-4">
        {/* Author info */}
        <div className="flex items-center gap-3 mb-3">
          <img 
            src={`https://source.unsplash.com${post.author.avatar}`}
            alt={post.author.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium">{post.author.name}</p>
            <p className="text-xs text-muted-foreground">{post.timestamp}</p>
          </div>
        </div>
        
        {/* Post content - truncated in card view */}
        <p className="mb-3 line-clamp-3">{post.content}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {post.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
        
        {/* Image preview */}
        {post.image && (
          <div className="mb-3 rounded-md overflow-hidden">
            <img 
              src={`https://source.unsplash.com${post.image}`}
              alt="Post content"
              className="w-full h-48 object-cover"
            />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-2 border-t flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className={`gap-2 ${liked ? 'text-amoura-deep-pink' : ''}`}
          onClick={handleLike}
        >
          <motion.div whileTap={{ scale: 1.4 }}>
            <Heart 
              size={isMobile ? 18 : 16} 
              className={liked ? "fill-amoura-deep-pink text-amoura-deep-pink" : ""}
            />
          </motion.div>
          {likeCount}
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2" 
          onClick={handleComment}
        >
          <MessageCircle size={isMobile ? 18 : 16} />
          {post.comments}
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleShare}
        >
          <Share size={isMobile ? 18 : 16} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
