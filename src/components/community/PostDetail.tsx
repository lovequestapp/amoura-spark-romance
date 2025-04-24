import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share, Send, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Post, Comment } from '@/types/community';
import { addComment, fetchComments, likePost, unlikePost } from '@/services/community';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2 } from 'lucide-react';
import { deletePost } from '@/services/community';

interface PostDetailProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onTagClick?: (tag: string) => void;
  selectedTag?: string;
}

const PostDetail: React.FC<PostDetailProps> = ({ post, isOpen, onClose, onTagClick, selectedTag }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.likes || 0);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (post) {
      setLikeCount(post.likes);
      if ('isLiked' in post) {
        setLiked(!!post.isLiked);
      }
      
      if (isOpen) {
        loadComments();
      }
    }
  }, [post, isOpen]);
  
  const loadComments = async () => {
    if (!post) return;
    
    setLoadingComments(true);
    try {
      const fetchedComments = await fetchComments(post.id);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  if (!post) return null;

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like posts",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (liked) {
        const newLikeCount = await unlikePost(post.id);
        setLiked(false);
        setLikeCount(newLikeCount);
      } else {
        const newLikeCount = await likePost(post.id);
        setLiked(true);
        setLikeCount(newLikeCount);
        
        const heart = document.createElement('div');
        heart.className = 'heart-animation';
        document.body.appendChild(heart);
        setTimeout(() => document.body.removeChild(heart), 1000);
      }
      
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['user-posts'] });
      queryClient.invalidateQueries({ queryKey: ['trending-posts'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleShare = () => {
    const postUrl = `${window.location.origin}/community?post=${post.id}`;
    navigator.clipboard.writeText(postUrl);
    
    toast({
      title: "Link copied!",
      description: "Post link has been copied to your clipboard",
    });
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user) {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to comment",
          variant: "destructive"
        });
      }
      return;
    }
    
    setSubmittingComment(true);
    try {
      const comment = await addComment(post.id, newComment);
      if (comment) {
        setComments([comment, ...comments]);
        setNewComment('');
        
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        queryClient.invalidateQueries({ queryKey: ['user-posts'] });
        queryClient.invalidateQueries({ queryKey: ['trending-posts'] });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmittingComment(false);
    }
  };
  
  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.preventDefault();
    if (onTagClick) {
      onClose();
      onTagClick(tag);
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    
    try {
      await deletePost(post.id);
      
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['user-posts'] });
      queryClient.invalidateQueries({ queryKey: ['trending-posts'] });
      
      toast({
        title: "Post deleted",
        description: "Your post has been successfully deleted",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getImageSrc = (path?: string) => {
    if (!path) return '';
    
    if (path.startsWith('/lovable-uploads/') || path.startsWith('https://')) {
      return path;
    } else {
      return `https://source.unsplash.com${path}`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[90vh] overflow-y-auto p-0 gap-0 rounded-xl" aria-describedby="post-content">
        <VisuallyHidden>
          <DialogTitle>Post by {post.author.name}</DialogTitle>
        </VisuallyHidden>
        <DialogHeader className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm p-4 border-b">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2" 
              onClick={onClose}
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <img 
              src={getImageSrc(post.author.avatar)}
              alt={post.author.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold">{post.author.name}</h3>
              <p className="text-sm text-muted-foreground">{post.timestamp}</p>
            </div>
            {post.isUserPost && (
              <div className="ml-auto flex items-center gap-2">
                <Badge variant="outline">Your Post</Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onClick={handleDelete}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete post
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </DialogHeader>
        
        <div className="p-4 space-y-4" id="post-content">
          <p className="text-lg whitespace-pre-line">{post.content}</p>
          
          {post.image && (
            <Card className="overflow-hidden rounded-lg border">
              <img 
                src={post.image}
                alt="Post content"
                className="w-full h-auto object-cover"
              />
            </Card>
          )}
          
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <Badge 
                key={tag} 
                variant="outline"
                className={`cursor-pointer hover:bg-muted transition-colors ${tag === selectedTag ? 'bg-amoura-soft-pink text-amoura-deep-pink' : ''}`}
                onClick={(e) => handleTagClick(e, tag)}
              >
                #{tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center gap-4 py-4 border-t border-b">
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
              {comments.length}
            </Button>
            
            <Button variant="ghost" onClick={handleShare}>
              <Share />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <Textarea
                placeholder={user ? "Write a comment..." : "Sign in to comment"}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-grow resize-none"
                disabled={!user || submittingComment}
              />
              <Button 
                onClick={handleSubmitComment} 
                className="self-end"
                disabled={!user || submittingComment || !newComment.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {loadingComments ? (
                <p className="text-center text-muted-foreground">Loading comments...</p>
              ) : comments.length === 0 ? (
                <p className="text-center text-muted-foreground">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map((comment) => (
                  <Card key={comment.id} className="p-4">
                    <div className="flex gap-3">
                      <img
                        src={getImageSrc(comment.author.avatar)}
                        alt={comment.author.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{comment.author.name}</h4>
                          <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                        </div>
                        <p className="mt-1 text-sm">{comment.content}</p>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostDetail;
