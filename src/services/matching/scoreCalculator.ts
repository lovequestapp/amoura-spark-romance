
import { Profile } from '@/components/home/SwipeableCard';
import { WeightedMatch } from './index';
import {
  calculateInterestCompatibility,
  calculateTraitCompatibility,
  calculateIntentionCompatibility,
  calculateDistanceScore,
  calculateLifestyleCompatibility,
  calculateAttachmentCompatibility
} from './compatibilityUtils';

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
