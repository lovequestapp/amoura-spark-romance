
export interface UserProfile {
  id: string;
  full_name?: string;
  username?: string;
  avatar_url?: string;
  birth_date?: string;
  gender?: 'woman' | 'man' | 'nonbinary' | 'other';
  height?: number;
  bio?: string;
  photos?: string[];
  prompts?: {
    question: string;
    answer: string;
  }[];
  onboarding_completed?: boolean;
  onboarding_step?: number;
  relationship_type?: string;
  education?: string;
  drinking?: string;
  pronouns?: string;
  latitude?: number;
  longitude?: number;
  dealbreakers?: string[];
  created_at?: string;
  updated_at?: string;
  attachment_style?: 'secure' | 'anxious' | 'avoidant' | 'fearful';
  trait_preferences?: {
    trait: string;
    importance: number; // 1-10 scale
  }[];
  personality_traits?: PersonalityTrait[];
  lifestyle_preferences?: LifestylePreference;
}

export interface PersonalityTrait {
  id?: string;
  user_id?: string;
  name: string;
  value: number;
  created_at?: string;
}

export interface LifestylePreference {
  id?: string;
  user_id?: string;
  smoking?: string;
  drinking?: string;
  exercise?: string;
  diet?: string;
  has_children?: boolean;
  wants_children?: boolean;
  pets?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserWithRelations extends UserProfile {
  personality_traits?: PersonalityTrait[];
  lifestyle_preferences?: LifestylePreference;
  dealbreakers?: string[];
  attachment_style?: 'secure' | 'anxious' | 'avoidant' | 'fearful';
  trait_preferences?: {
    trait: string;
    importance: number;
  }[];
}

export interface User extends UserProfile {
  personality_traits?: PersonalityTrait[];
  lifestyle_preferences?: LifestylePreference;
  dealbreakers?: string[];
  attachment_style?: 'secure' | 'anxious' | 'avoidant' | 'fearful';
  trait_preferences?: {
    trait: string;
    importance: number;
  }[];
}
