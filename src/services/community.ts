import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";
import { Post, Comment } from "@/types/community";
import { useAuth } from "@/contexts/AuthContext";
import { Database } from "@/integrations/supabase/types";

// Utility function to format timestamp to relative time
export const formatRelativeTime = (timestamp: string | Date): string => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHr = Math.round(diffMin / 60);
  const diffDays = Math.round(diffHr / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin} ${diffMin === 1 ? "minute" : "minutes"} ago`;
  if (diffHr < 24) return `${diffHr} ${diffHr === 1 ? "hour" : "hours"} ago`;
  if (diffDays < 30) return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
  
  return date.toLocaleDateString();
};

// Function to format database post to frontend post
export const formatPost = async (
  dbPost: Database["public"]["Tables"]["community_posts"]["Row"],
  userId?: string | null
): Promise<Post> => {
  // Get user profile information
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url, id')
    .eq('id', dbPost.user_id)
    .single();
  
  // Get tags
  const { data: tags } = await supabase
    .from('post_tags')
    .select('tag')
    .eq('post_id', dbPost.id);

  // Check if the current user has liked the post
  let isLiked = false;
  if (userId) {
    const { data: hasLiked } = await supabase.rpc('has_liked_post', { 
      post_id_param: dbPost.id 
    });
    isLiked = !!hasLiked;
  }

  // Default avatar if none exists
  const avatarPath = profile?.avatar_url || '/photo-1581091226825-a6a2a5aee158';

  return {
    id: dbPost.id,
    author: {
      id: dbPost.user_id || '',
      name: profile?.full_name || 'Anonymous User',
      avatar: avatarPath
    },
    content: dbPost.content,
    image: dbPost.image_url,
    tags: tags?.map(t => t.tag) || ['general'],
    likes: dbPost.likes || 0,
    comments: dbPost.comments || 0,
    timestamp: formatRelativeTime(dbPost.created_at || new Date()),
    isUserPost: dbPost.user_id === userId,
    isLiked
  };
};

// Function to fetch posts
export const fetchPosts = async (userId?: string | null): Promise<Post[]> => {
  const { data: posts, error } = await supabase
    .from('community_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  const formattedPosts = await Promise.all(
    posts.map(post => formatPost(post, userId))
  );

  return formattedPosts;
};

// Function to fetch a user's posts
export const fetchUserPosts = async (userId: string | null): Promise<Post[]> => {
  if (!userId) return [];

  const { data: posts, error } = await supabase
    .from('community_posts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching user posts:", error);
    return [];
  }

  const formattedPosts = await Promise.all(
    posts.map(post => formatPost(post, userId))
  );

  return formattedPosts;
};

// Function to fetch trending posts
export const fetchTrendingPosts = async (userId?: string | null): Promise<Post[]> => {
  const { data: posts, error } = await supabase
    .from('community_posts')
    .select('*')
    .order('likes', { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching trending posts:", error);
    return [];
  }

  const formattedPosts = await Promise.all(
    posts.map(post => formatPost(post, userId))
  );

  return formattedPosts;
};

// Function to fetch posts by tag
export const fetchPostsByTag = async (tag: string, userId?: string | null): Promise<Post[]> => {
  const { data: tagResults, error: tagError } = await supabase
    .from('post_tags')
    .select('post_id')
    .eq('tag', tag);

  if (tagError || !tagResults.length) {
    console.error("Error fetching posts by tag:", tagError);
    return [];
  }

  const postIds = tagResults.map(result => result.post_id);

  const { data: posts, error: postsError } = await supabase
    .from('community_posts')
    .select('*')
    .in('id', postIds)
    .order('created_at', { ascending: false });

  if (postsError) {
    console.error("Error fetching posts by IDs:", postsError);
    return [];
  }

  const formattedPosts = await Promise.all(
    posts.map(post => formatPost(post, userId))
  );

  return formattedPosts;
};

// Function to create a new post
export const createPost = async (
  content: string, 
  tags: string[], 
  imageFile?: File | null
): Promise<Post | null> => {
  try {
    // Check if the user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw new Error("You must be logged in to create a post");
    }

    const userId = session.user.id;

    let imageUrl: string | undefined = undefined;

    // Upload image if provided
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        throw new Error("Failed to upload image");
      }

      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath);

      imageUrl = publicUrl;
    }

    // Insert post
    const { data: newPost, error: postError } = await supabase
      .from('community_posts')
      .insert({
        user_id: userId,
        content,
        image_url: imageUrl
      })
      .select()
      .single();

    if (postError) {
      console.error("Error creating post:", postError);
      throw new Error("Failed to create post");
    }

    // Insert tags
    if (tags.length > 0) {
      const tagInserts = tags.map(tag => ({
        post_id: newPost.id,
        tag: tag.toLowerCase().trim()
      }));

      const { error: tagError } = await supabase
        .from('post_tags')
        .insert(tagInserts);

      if (tagError) {
        console.error("Error adding tags:", tagError);
      }
    }

    // Return formatted post
    return await formatPost(newPost, userId);
  } catch (error) {
    console.error("Error in createPost:", error);
    return null;
  }
};

// Function to like a post
export const likePost = async (postId: string): Promise<number> => {
  const { data, error } = await supabase.rpc('like_post', { post_id_param: postId });
  
  if (error) {
    console.error("Error liking post:", error);
    throw new Error("Failed to like post");
  }
  
  // Fix: Check if data is an object and has a likes property
  if (data && typeof data === 'object' && 'likes' in data) {
    return data.likes as number;
  }
  return 0;
};

// Function to unlike a post
export const unlikePost = async (postId: string): Promise<number> => {
  const { data, error } = await supabase.rpc('unlike_post', { post_id_param: postId });
  
  if (error) {
    console.error("Error unliking post:", error);
    throw new Error("Failed to unlike post");
  }
  
  // Fix: Check if data is an object and has a likes property
  if (data && typeof data === 'object' && 'likes' in data) {
    return data.likes as number;
  }
  return 0;
};

// Function to add a comment
export const addComment = async (
  postId: string, 
  content: string
): Promise<Comment | null> => {
  // Check if the user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    throw new Error("You must be logged in to comment");
  }

  const userId = session.user.id;

  // Insert comment
  const { data: newComment, error } = await supabase
    .from('post_comments')
    .insert({
      post_id: postId,
      user_id: userId,
      content
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding comment:", error);
    return null;
  }

  // Update comment count on post
  const { count } = await supabase
    .from('post_comments')
    .select('id', { count: 'exact', head: true })
    .eq('post_id', postId);

  await supabase
    .from('community_posts')
    .update({ comments: count || 0 })
    .eq('id', postId);

  // Get author info
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', userId)
    .single();

  return {
    id: newComment.id,
    author: {
      id: userId,
      name: profile?.full_name || 'Anonymous User',
      avatar: profile?.avatar_url || '/photo-1581091226825-a6a2a5aee158'
    },
    content: newComment.content,
    timestamp: formatRelativeTime(newComment.created_at)
  };
};

// Function to fetch comments for a post
export const fetchComments = async (postId: string): Promise<Comment[]> => {
  // First, get all comments for the post
  const { data: comments, error } = await supabase
    .from('post_comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching comments:", error);
    return [];
  }

  // Then, get profiles for each user_id in the comments
  const commentResults = await Promise.all(comments.map(async (comment) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('id', comment.user_id)
      .single();

    return {
      id: comment.id,
      author: {
        id: comment.user_id || '',
        name: profile?.full_name || 'Anonymous User',
        avatar: profile?.avatar_url || '/photo-1581091226825-a6a2a5aee158'
      },
      content: comment.content,
      timestamp: formatRelativeTime(comment.created_at)
    };
  }));

  return commentResults;
};

// Function to delete a post
export const deletePost = async (postId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('community_posts')
      .delete()
      .eq('id', postId);

    if (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in deletePost:", error);
    throw error;
  }
};
