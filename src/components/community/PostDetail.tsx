
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

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

interface PostDetailProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
}

const PostDetail: React.FC<PostDetailProps> = ({ post, isOpen, onClose }) => {
  const [liked, setLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(post?.likes || 0);
  const { toast } = useToast();

  React.useEffect(() => {
    if (post) {
      setLikeCount(post.likes);
    }
  }, [post]);

  if (!post) return null;

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount(prev => prev - 1);
    } else {
      setLiked(true);
      setLikeCount(prev => prev + 1);
      
      // Show heart animation
      const heart = document.createElement('div');
      heart.className = 'heart-animation';
      document.body.appendChild(heart);
      setTimeout(() => document.body.removeChild(heart), 1000);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Post link has been copied to your clipboard",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center gap-3 border-b pb-4">
          <img 
            src={`https://source.unsplash.com${post.author.avatar}`}
            alt={post.author.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold">{post.author.name}</h3>
            <p className="text-sm text-muted-foreground">{post.timestamp}</p>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Post content */}
          <p className="text-lg whitespace-pre-line">{post.content}</p>
          
          {/* Image */}
          {post.image && (
            <div className="rounded-lg overflow-hidden">
              <img 
                src={`https://source.unsplash.com${post.image}`}
                alt="Post content"
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <Badge key={tag} variant="outline">
                #{tag}
              </Badge>
            ))}
          </div>
          
          {/* Interaction buttons */}
          <div className="flex items-center gap-4 pt-4 border-t">
            <Button 
              variant="ghost" 
              className={`gap-2 ${liked ? 'text-amoura-deep-pink' : ''}`}
              onClick={handleLike}
            >
              <motion.div whileTap={{ scale: 1.4 }}>
                <Heart className={liked ? "fill-amoura-deep-pink text-amoura-deep-pink" : ""} />
              </motion.div>
              {likeCount}
            </Button>
            
            <Button variant="ghost" className="gap-2">
              <MessageCircle />
              {post.comments}
            </Button>
            
            <Button variant="ghost" onClick={handleShare}>
              <Share />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostDetail;
