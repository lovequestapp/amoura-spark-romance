
import { COMPLEMENTARY_TRAITS, ATTACHMENT_COMPATIBILITY } from './constants';

// Calculate weighted compatibility score between two personality traits
export const calculateTraitCompatibility = (
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
export const calculateIntentionCompatibility = (intention1: string | null | undefined, intention2: string | null | undefined): number => {
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
export const calculateDistanceScore = (distance: string | undefined, maxPreferredDistance: number): number => {
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
export const calculateInterestCompatibility = (userInterests: string[], matchInterests: string[], categories?: Record<string, number>): number => {
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
export const calculateAttachmentCompatibility = (style1?: string, style2?: string): number => {
  if (!style1 || !style2) return 0.5;
  
  return ATTACHMENT_COMPATIBILITY[style1]?.[style2] ?? 0.5;
};

// Calculate lifestyle compatibility score
export const calculateLifestyleCompatibility = (
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

// Calculate geographic distance between two points using Haversine formula
export const calculateGeoDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
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
