
// Community page types
export interface Author {
  id: string;
  name: string;
  avatar: string;
}

export interface Post {
  id: string;
  author: Author;
  content: string;
  image?: string;
  tags: string[];
  likes: number;
  comments: number;
  timestamp: string;
  isUserPost?: boolean;
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  author: Author;
  content: string;
  timestamp: string;
}
