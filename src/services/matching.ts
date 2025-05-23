
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/components/home/SwipeableCard";
import { UserProfile, PersonalityTrait, LifestylePreference } from '@/types/profiles';

// Update the MatchingParams to match the Home.tsx interface
interface MatchingParams {
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

interface WeightedMatch extends Profile {
  matchScore: number;
  interestsScore: number;
  personalityScore: number;
  intentionScore: number;
  locationScore: number;
  lifestyleScore?: number;
  dealbreakers?: string[];
  attachmentScore?: number;
}

// Define which traits should use similarity vs complementary matching
const COMPLEMENTARY_TRAITS = ['extroversion', 'openness', 'risk_taking'];
const SIMILARITY_TRAITS = ['conscientiousness', 'agreeableness', 'emotional_stability', 'ambition'];

// Map attachment style compatibility (higher = better match)
const ATTACHMENT_COMPATIBILITY: Record<string, Record<string, number>> = {
  'secure': {
    'secure': 1.0,
    'anxious': 0.7,
    'avoidant': 0.7,
    'fearful': 0.5
  },
  'anxious': {
    'secure': 0.8,
    'anxious': 0.4,
    'avoidant': 0.3,
    'fearful': 0.2
  },
  'avoidant': {
    'secure': 0.8,
    'anxious': 0.3,
    'avoidant': 0.5,
    'fearful': 0.3
  },
  'fearful': {
    'secure': 0.7,
    'anxious': 0.3,
    'avoidant': 0.3,
    'fearful': 0.2
  }
};

// Calculate weighted compatibility score between two personality traits
const calculateTraitCompatibility = (
  trait1: number, 
  trait2: number, 
  traitType: string,
  userPreferences?: Array<{trait: string, importance: number}>
): { score: number, weight: number } => {
  // Get importance weight if specified in preferences
  const preference = userPreferences?.find(p => p.trait.toLowerCase() === traitType.toLowerCase());
  const importanceWeight = preference ? preference.importance / 5 : 1; // Normalize to 0.2-2.0 range
  
  // Determine if this trait should use complementary or similarity matching
  const isComplementary = COMPLEMENTARY_TRAITS.includes(traitType.toLowerCase());
  
  let score: number;
  
  if (isComplementary) {
    // For complementary traits, optimal difference is around 40-60%
    const diff = Math.abs(trait1 - trait2);
    // Score is highest when difference is around 50 (on 0-100 scale)
    score = 1 - Math.abs(diff - 50) / 50;
  } else {
    // For similarity traits, closer values are better
    score = 1 - Math.abs(trait1 - trait2) / 100;
  }
  
  return { score, weight: importanceWeight };
};

// Calculate relationship intention compatibility on a spectrum
const calculateIntentionCompatibility = (intention1: string | null | undefined, intention2: string | null | undefined): number => {
  if (!intention1 || !intention2) return 0.5; // Neutral if either is undefined
  
  // Define relationship intention spectrum with numerical values
  const intentionValues: Record<string, number> = {
    'casual': 0,
    'dating': 25,
    'relationship': 50,
    'serious': 75,
    'marriage': 100
  };
  
  const value1 = intentionValues[intention1] ?? 50;
  const value2 = intentionValues[intention2] ?? 50;
  
  // Calculate compatibility - closer intentions are more compatible
  const similarity = 1 - Math.abs(value1 - value2) / 100;
  
  // But give a bonus for exact matches
  return intention1 === intention2 ? Math.min(similarity + 0.3, 1.0) : similarity;
};

// Calculate distance score based on user preferences and real distances
const calculateDistanceScore = (distance: string | undefined, maxPreferredDistance: number): number => {
  if (!distance) return 0.5; // Default middle score if no distance info
  
  // Extract distance value from string like "5 miles away"
  const distanceMatch = distance.match(/(\d+)/);
  if (!distanceMatch) return 0.5;
  
  const actualDistance = parseInt(distanceMatch[0], 10);
  
  // Proximity score - higher for closer matches
  // Non-linear scoring that favors closer matches more heavily
  return Math.pow(Math.max(0, 1 - (actualDistance / (maxPreferredDistance * 2))), 1.5);
};

// Calculate interest-based compatibility with category weighting
const calculateInterestCompatibility = (userInterests: string[], matchInterests: string[], categories?: Record<string, number>): number => {
  if (!userInterests.length || !matchInterests.length) return 0.5;
  
  // Count shared interests
  const sharedInterests = userInterests.filter(interest => matchInterests.includes(interest));
  
  // Basic score based on percentage of shared interests relative to user's interests
  const baseScore = sharedInterests.length / Math.max(userInterests.length, 1);
  
  // Apply category weighting if available
  if (categories && sharedInterests.length > 0) {
    // This would involve looking up each interest's category and applying weights
    // Simplified version for now
    return baseScore;
  }
  
  return baseScore;
};

// Calculate attachment style compatibility
const calculateAttachmentCompatibility = (style1?: string, style2?: string): number => {
  if (!style1 || !style2) return 0.5;
  
  return ATTACHMENT_COMPATIBILITY[style1]?.[style2] ?? 0.5;
};

// Calculate lifestyle compatibility score
const calculateLifestyleCompatibility = (
  userLifestyle: Record<string, string | boolean> = {}, 
  matchLifestyle: Record<string, string | boolean> = {}
): number => {
  // Key lifestyle factors to compare
  const factors = ['drinking', 'smoking', 'exercise', 'diet', 'kids'];
  let totalWeight = 0;
  let weightedScore = 0;
  
  for (const factor of factors) {
    if (userLifestyle[factor] !== undefined && matchLifestyle[factor] !== undefined) {
      const weight = factor === 'kids' || factor === 'smoking' ? 2 : 1; // Higher weight for critical factors
      totalWeight += weight;
      
      // Exact match is best
      if (userLifestyle[factor] === matchLifestyle[factor]) {
        weightedScore += weight;
      } 
      // Compatible but not exact matches
      else if (
        (factor === 'drinking' && 
          ((userLifestyle[factor] === 'occasionally' && matchLifestyle[factor] === 'socially') || 
           (userLifestyle[factor] === 'socially' && matchLifestyle[factor] === 'occasionally'))) ||
        (factor === 'exercise' && 
          ((userLifestyle[factor] === 'sometimes' && matchLifestyle[factor] === 'regularly') || 
           (userLifestyle[factor] === 'regularly' && matchLifestyle[factor] === 'sometimes')))
      ) {
        weightedScore += weight * 0.75;
      }
      // Partially compatible
      else {
        weightedScore += weight * 0.25;
      }
    }
  }
  
  return totalWeight > 0 ? weightedScore / totalWeight : 0.5;
};

export const calculateMatchScore = (
  userProfile: any,
  potentialMatch: any
): WeightedMatch => {
  // Base profile
  const baseProfile = potentialMatch as Profile;
  
  // Weights for different match factors (can be dynamically adjusted based on user preferences)
  const weights = {
    interests: 0.25,
    personality: 0.25,
    intention: 0.15,
    location: 0.10,
    lifestyle: 0.15,
    attachment: 0.10, // New weight for attachment style compatibility
  };
  
  // Normalize weights to sum to 1.0 (excluding factors that aren't available)
  const hasLifestyleData = userProfile.lifestyle && potentialMatch.lifestyle;
  const hasAttachmentData = userProfile.attachment_style && potentialMatch.attachment_style;
  
  let totalWeight = 0;
  Object.keys(weights).forEach(key => {
    if ((key === 'lifestyle' && hasLifestyleData) || 
        (key === 'attachment' && hasAttachmentData) || 
        (key !== 'lifestyle' && key !== 'attachment')) {
      totalWeight += (weights as any)[key];
    }
  });
  
  Object.keys(weights).forEach(key => {
    if ((key === 'lifestyle' && !hasLifestyleData) || 
        (key === 'attachment' && !hasAttachmentData)) {
      (weights as any)[key] = 0;
    } else {
      (weights as any)[key] = (weights as any)[key] / totalWeight;
    }
  });
  
  // Calculate interests overlap score with category weighting
  const userInterests = userProfile.interests || [];
  const matchInterests = potentialMatch.interests || [];
  
  const interestsScore = calculateInterestCompatibility(userInterests, matchInterests);
  
  // Calculate personality compatibility with trait-specific matching
  const userTraits = userProfile.personality_traits || [];
  const matchTraits = potentialMatch.personality_traits || [];
  const userPreferences = userProfile.trait_preferences || [];
  
  let personalityScore = 0.5; // Default middle score
  let totalTraitWeight = 0;
  
  if (userTraits.length > 0 && matchTraits.length > 0) {
    let weightedTraitScore = 0;
    
    // Compare traits using trait-specific compatibility logic and user preferences
    userTraits.forEach(trait => {
      const matchingTrait = matchTraits.find(t => t.name === trait.name);
      if (matchingTrait) {
        const { score, weight } = calculateTraitCompatibility(
          trait.value, 
          matchingTrait.value, 
          trait.name,
          userPreferences
        );
        weightedTraitScore += score * weight;
        totalTraitWeight += weight;
      }
    });
    
    personalityScore = totalTraitWeight > 0 ? 
      weightedTraitScore / totalTraitWeight : 0.5;
  }
  
  // Calculate relationship intention alignment with spectrum matching
  const intentionScore = calculateIntentionCompatibility(
    userProfile.relationshipIntention,
    potentialMatch.relationshipIntention
  );
  
  // Calculate location proximity score with non-linear preference
  const locationScore = calculateDistanceScore(potentialMatch.distance, 50); // Assuming 50 miles max preference
  
  // Calculate lifestyle compatibility if data available
  let lifestyleScore = 0.5;
  if (hasLifestyleData) {
    lifestyleScore = calculateLifestyleCompatibility(userProfile.lifestyle, potentialMatch.lifestyle);
  }
  
  // Calculate attachment style compatibility if data available
  let attachmentScore = 0.5;
  if (hasAttachmentData) {
    attachmentScore = calculateAttachmentCompatibility(
      userProfile.attachment_style,
      potentialMatch.attachment_style
    );
  }
  
  // Check for dealbreakers
  const dealbreakers: string[] = [];
  if (userProfile.dealbreakers && userProfile.dealbreakers.length > 0) {
    // Example dealbreaker: smoking when user specified "no smoking"
    if (userProfile.dealbreakers.includes('no-smoking') && 
        potentialMatch.lifestyle?.smoking && 
        potentialMatch.lifestyle.smoking !== 'never') {
      dealbreakers.push('smoking');
    }
    
    // Example dealbreaker: different views on having children
    if (userProfile.dealbreakers.includes('kids-alignment') && 
        userProfile.lifestyle?.wantsKids !== potentialMatch.lifestyle?.wantsKids) {
      dealbreakers.push('kids-views');
    }
    
    // New dealbreaker: incompatible attachment styles
    if (userProfile.dealbreakers.includes('attachment-style') &&
        hasAttachmentData &&
        attachmentScore < 0.4) {
      dealbreakers.push('attachment-style');
    }
  }
  
  // Calculate total weighted score, applying dealbreaker penalties
  let matchScore = Math.round(
    (interestsScore * weights.interests + 
    personalityScore * weights.personality + 
    intentionScore * weights.intention + 
    locationScore * weights.location +
    (hasLifestyleData ? lifestyleScore * weights.lifestyle : 0) +
    (hasAttachmentData ? attachmentScore * weights.attachment : 0)) * 100
  );
  
  // Apply dealbreaker penalties
  if (dealbreakers.length > 0) {
    // Each dealbreaker reduces score by up to 40%
    const penalty = Math.min(0.4 * dealbreakers.length, 0.7); 
    matchScore = Math.round(matchScore * (1 - penalty));
  }
  
  return {
    ...baseProfile,
    matchScore,
    interestsScore: Math.round(interestsScore * 100),
    personalityScore: Math.round(personalityScore * 100),
    intentionScore: Math.round(intentionScore * 100),
    locationScore: Math.round(locationScore * 100),
    lifestyleScore: hasLifestyleData ? Math.round(lifestyleScore * 100) : undefined,
    attachmentScore: hasAttachmentData ? Math.round(attachmentScore * 100) : undefined,
    dealbreakers: dealbreakers.length > 0 ? dealbreakers : undefined
  };
};

export const getPersonalizedMatches = async (
  params: MatchingParams
): Promise<WeightedMatch[]> => {
  try {
    // Fetch user's own profile first to use for comparison
    const { data: userProfile, error: userProfileError } = await supabase
      .from('profiles')
      .select(`
        *,
        user_interests (interest_id, interests (name, category)),
        personality_traits (name, value),
        lifestyle_preferences (*)
      `)
      .eq('id', params.userId)
      .single();
    
    if (userProfileError) throw userProfileError;
    
    // Fetch all potential matches with expanded data
    const { data: potentialMatches, error } = await supabase
      .from('profiles')
      .select(`
        *,
        user_interests (interest_id, interests (name, category)),
        personality_traits (name, value),
        lifestyle_preferences (*)
      `)
      .neq('id', params.userId); // Exclude current user
      
    if (error) throw error;
    
    // Apply filters for age range and relationship intention
    let filteredMatches = potentialMatches || [];
    
    if (params.ageRange) {
      // Convert birth_date to age and filter by age range
      const currentYear = new Date().getFullYear();
      filteredMatches = filteredMatches.filter(match => {
        if (!match.birth_date) return true; // Include if no birth_date (can be filtered out later)
        
        const birthYear = new Date(match.birth_date).getFullYear();
        const age = currentYear - birthYear;
        return age >= params.ageRange[0] && age <= params.ageRange[1];
      });
    }
    
    if (params.relationshipIntention) {
      // More nuanced filtering - if user wants serious, include serious/marriage but not casual
      const intensityMap: Record<string, number> = {
        'casual': 1,
        'dating': 2,
        'relationship': 3,
        'serious': 4,
        'marriage': 5
      };
      
      const userIntensity = intensityMap[params.relationshipIntention] || 3;
      
      filteredMatches = filteredMatches.filter(match => {
        if (!match.relationship_type) return true; // Include those who haven't specified
        
        const matchIntensity = intensityMap[match.relationship_type] || 3;
        
        // Allow matches within +/- 1 level of intensity for more flexible matching
        return Math.abs(userIntensity - matchIntensity) <= 1;
      });
    }
    
    // Apply distance filtering if coordinates available
    if (params.distance > 0 && userProfile && userProfile.latitude && userProfile.longitude) {
      filteredMatches = filteredMatches.filter(match => {
        // Skip if no coordinates available
        if (!match.latitude || !match.longitude) return true;
        
        // Calculate actual distance
        const distance = calculateGeoDistance(
          userProfile.latitude, 
          userProfile.longitude,
          match.latitude,
          match.longitude
        );
        
        return distance <= params.distance;
      });
    }
    
    // Apply dealbreaker filtering if specified
    if (params.dealbreakers && params.dealbreakers.length > 0) {
      filteredMatches = filteredMatches.filter(match => {
        // Type guard for lifestyle_preferences
        const lifestyle = match.lifestyle_preferences as LifestylePreference | undefined;
        
        // Example implementation for a few common dealbreakers
        if (params.dealbreakers?.includes('no-smoking') && 
            lifestyle?.smoking && lifestyle.smoking !== 'never') {
          return false;
        }
        
        if (params.dealbreakers?.includes('no-kids') && 
            lifestyle?.has_children === true) {
          return false;
        }
        
        // New dealbreaker filter for attachment styles
        if (params.dealbreakers?.includes('attachment-style') && 
            userProfile.attachment_style && 
            match.attachment_style) {
          const compatScore = calculateAttachmentCompatibility(
            userProfile.attachment_style, 
            match.attachment_style
          );
          if (compatScore < 0.4) return false;
        }
        
        return true;
      });
    }
    
    // Calculate match scores and sort by score
    const scoredMatches = filteredMatches.map(match => 
      calculateMatchScore(userProfile, match)
    );
    
    // Sort by match score (highest first)
    return scoredMatches.sort((a, b) => b.matchScore - a.matchScore);
    
  } catch (error) {
    console.error('Error getting personalized matches:', error);
    return [];
  }
};

// Calculate geographic distance between two points using Haversine formula
const calculateGeoDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 3963.0; // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const getFeaturedMatch = (matches: WeightedMatch[]): WeightedMatch | null => {
  if (!matches.length) return null;
  
  // More sophisticated featured match selection
  // Consider both match score and diversity of profiles shown
  
  // Option 1: Feature the highest scoring match
  const topMatch = matches[0];
  
  // Option 2: Feature a slightly lower match but with complementary personality
  const complementaryMatch = matches.find(match => 
    match.matchScore > 80 && 
    match.personalityScore < 70 && 
    match.interestsScore > 85 &&
    match.attachmentScore && match.attachmentScore > 75
  );
  
  // Option 3: Feature a match with a unique quality 
  const uniqueMatch = matches.find(match => 
    match.premium || match.verified || 
    (match.interests?.find(i => i.includes("rare"))) ||
    (match.attachmentScore && match.attachmentScore > 90)
  );
  
  // Choose the featured match with some randomness for variety
  const featured = Math.random() > 0.7 ? (complementaryMatch || uniqueMatch || topMatch) : topMatch;
  
  return {
    ...featured,
    featured: true
  };
};

// Export types
export type { WeightedMatch, MatchingParams };
