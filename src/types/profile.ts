
export interface Profile {
  id: number | string;
  name: string;
  age: number;
  distance: string;
  occupation: string;
  photos: string[];
  bio: string;
  video?: {
    url: string;
    thumbnail: string;
    duration: number;
  };
  personalityMatch?: number;
  verified?: boolean;
  premium?: boolean;
  featured?: boolean;
  traits?: Array<{
    name: string;
    score: number;
  }>;
  prompts: Array<{
    question: string;
    answer: string;
  }>;
  relationshipIntention?: string;
  personalityBadges?: string[];
  location?: string;
  interests?: string[];
}
