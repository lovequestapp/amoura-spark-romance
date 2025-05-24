
import { getPersonalizedMatches, getFeaturedMatch } from './matchingService';
import { calculateMatchScore } from './scoreCalculator';
import { calculateAdvancedIntentionCompatibility } from './intentionMatching';
import { Profile } from '@/components/home/SwipeableCard';
import { UserProfile, PersonalityTrait, LifestylePreference } from '@/types/profiles';

// Re-export the main matching interface
export { getPersonalizedMatches, getFeaturedMatch, calculateMatchScore, calculateAdvancedIntentionCompatibility };

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
  intentionDetails?: any; // Enhanced intention analysis details
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
  // Enhanced intention matching parameters
  timelineExpectations?: 'immediate' | 'within_months' | 'within_year' | 'no_rush' | 'unsure';
  datingHistory?: {
    longest_relationship?: number;
    relationship_count?: number;
    time_since_last?: number;
    commitment_pattern?: 'serial_monogamist' | 'casual_dater' | 'long_term_seeker' | 'mixed';
  };
}
