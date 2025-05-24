
import { getPersonalizedMatches, getFeaturedMatch } from './matchingService';
import { calculateMatchScore } from './scoreCalculator';
import { Profile } from '@/components/home/SwipeableCard';
import { UserProfile, PersonalityTrait, LifestylePreference } from '@/types/profiles';

// Re-export the main matching interface
export { getPersonalizedMatches, getFeaturedMatch, calculateMatchScore };

// Re-export types for external use
export interface WeightedMatch extends Profile {
  matchScore: number;
  interestsScore: number;
  personalityScore: number;
  intentionScore: number;
  locationScore: number;
  lifestyleScore?: number;
  dealbreakers?: string[];
  attachmentScore?: number;
}

export interface MatchingParams {
  userId: string;
  ageRange: [number, number];
  distance: number;
  relationshipIntention: string | null;
  interests: string[];
  personalityTraits?: PersonalityTrait[];
  dealbreakers?: string[];
  lifestylePreferences?: Record<string, string | boolean>;
  attachmentStyle?: string;
  traitPreferences?: Array<{trait: string, importance: number}>;
}
