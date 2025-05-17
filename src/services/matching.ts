
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/components/home/SwipeableCard";

interface MatchingParams {
  userId: string;
  ageRange: [number, number];
  distance: number;
  relationshipIntention: string | null;
  interests: string[];
  personalityTraits?: {
    name: string;
    value: number;
  }[];
}

interface WeightedMatch extends Profile {
  matchScore: number;
  interestsScore: number;
  personalityScore: number;
  intentionScore: number;
  locationScore: number;
}

export const calculateMatchScore = (
  userProfile: any,
  potentialMatch: any
): WeightedMatch => {
  // Base profile
  const baseProfile = potentialMatch as Profile;
  
  // Weights for different match factors (can be adjusted)
  const weights = {
    interests: 0.35,
    personality: 0.30,
    intention: 0.20,
    location: 0.15,
  };
  
  // Calculate interests overlap score (0-1)
  const userInterests = userProfile.interests || [];
  const matchInterests = potentialMatch.interests || [];
  
  const interestOverlaps = userInterests.filter(interest => 
    matchInterests.includes(interest)
  ).length;
  
  const interestsScore = userInterests.length > 0 ? 
    interestOverlaps / Math.max(userInterests.length, 1) : 0;
  
  // Calculate personality compatibility (0-1)
  const userTraits = userProfile.personality_traits || [];
  const matchTraits = potentialMatch.personality_traits || [];
  
  let personalityScore = 0.5; // Default middle score
  
  if (userTraits.length > 0 && matchTraits.length > 0) {
    // Compare traits to find compatibility
    const compatibilitySum = userTraits.reduce((sum, trait) => {
      const matchingTrait = matchTraits.find(t => t.name === trait.name);
      if (matchingTrait) {
        // Calculate how similar the values are (0-1)
        const similarity = 1 - Math.abs(trait.value - matchingTrait.value) / 100;
        return sum + similarity;
      }
      return sum;
    }, 0);
    
    personalityScore = userTraits.length > 0 ?
      compatibilitySum / userTraits.length : 0.5;
  }
  
  // Calculate relationship intention alignment (0-1)
  let intentionScore = 0.5; // Default middle score
  if (userProfile.relationshipIntention && potentialMatch.relationshipIntention) {
    intentionScore = userProfile.relationshipIntention === potentialMatch.relationshipIntention ? 
      1.0 : 0.3; // High score for exact match, lower for mismatch
  }
  
  // Calculate location proximity score (0-1)
  // For now we'll extract distance from the string like "5 miles away" and calculate score
  let locationScore = 0.5; // Default middle score
  const distanceMatch = potentialMatch.distance?.match(/(\d+)/);
  if (distanceMatch) {
    const distanceValue = parseInt(distanceMatch[0], 10);
    // Closer distances get higher scores (inverted scale)
    locationScore = Math.max(0, 1 - (distanceValue / 50)); // Max 50 miles for normalization
  }
  
  // Calculate total weighted score (0-100)
  const matchScore = Math.round(
    (interestsScore * weights.interests + 
    personalityScore * weights.personality + 
    intentionScore * weights.intention + 
    locationScore * weights.location) * 100
  );
  
  return {
    ...baseProfile,
    matchScore,
    interestsScore: Math.round(interestsScore * 100),
    personalityScore: Math.round(personalityScore * 100),
    intentionScore: Math.round(intentionScore * 100),
    locationScore: Math.round(locationScore * 100)
  };
};

export const getPersonalizedMatches = async (
  params: MatchingParams
): Promise<WeightedMatch[]> => {
  try {
    // Fetch user's own profile first to use for comparison
    const { data: userProfile, error: userProfileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', params.userId)
      .single();
    
    if (userProfileError) throw userProfileError;
    
    // Fetch all potential matches that fit basic criteria
    const { data: potentialMatches, error } = await supabase
      .from('profiles')
      .select(`
        *,
        user_interests (interest_id, interests (name, category))
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
      filteredMatches = filteredMatches.filter(match => 
        !params.relationshipIntention || 
        !match.relationship_type || 
        match.relationship_type === params.relationshipIntention
      );
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

export const getFeaturedMatch = (matches: WeightedMatch[]): WeightedMatch | null => {
  if (!matches.length) return null;
  
  // Feature the highest scoring match
  // Could add additional logic here like showing newer profiles or ones with certain attributes
  return {
    ...matches[0],
    featured: true
  };
};

// Export types
export type { WeightedMatch, MatchingParams };
