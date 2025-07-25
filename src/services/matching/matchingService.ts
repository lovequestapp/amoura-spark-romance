
import { supabase } from "@/integrations/supabase/client";
import { MatchingParams, WeightedMatch } from './index';
import { calculateMatchScore } from './scoreCalculator';
import { calculateGeoDistance, calculateAttachmentCompatibility } from './compatibilityUtils';
import { mlMatchingService } from './mlMatchingService';

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
        // Get lifestyle preferences with proper type checking
        const matchLifestyle = match.lifestyle_preferences;
        
        // Check if we have valid lifestyle data (not null and is an object)
        const hasValidLifestyle = matchLifestyle && 
          typeof matchLifestyle === 'object' && 
          !Array.isArray(matchLifestyle) &&
          !('message' in matchLifestyle);
        
        // Example implementation for a few common dealbreakers
        if (params.dealbreakers?.includes('no-smoking') && hasValidLifestyle) {
          const lifestyle = matchLifestyle as any; // Type assertion for database object
          if (lifestyle.smoking && lifestyle.smoking !== 'never') {
            return false;
          }
        }
        
        if (params.dealbreakers?.includes('no-kids') && hasValidLifestyle) {
          const lifestyle = matchLifestyle as any; // Type assertion for database object
          if (lifestyle.has_children === true) {
            return false;
          }
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
    let scoredMatches = filteredMatches.map(match => 
      calculateMatchScore(userProfile, match)
    );
    
    // Apply ML enhancements to improve matching
    try {
      console.log('Applying ML enhancements to matches...');
      scoredMatches = await mlMatchingService.enhanceMatchScoring(scoredMatches, params.userId);
    } catch (mlError) {
      console.warn('ML enhancement failed, using base scoring:', mlError);
      // Continue with base scoring if ML fails
    }
    
    // Sort by match score (highest first)
    return scoredMatches.sort((a, b) => b.matchScore - a.matchScore);
    
  } catch (error) {
    console.error('Error getting personalized matches:', error);
    return [];
  }
};

export const getFeaturedMatch = (matches: WeightedMatch[]): WeightedMatch | null => {
  if (!matches.length) return null;
  
  // More sophisticated featured match selection with ML insights
  // Consider both match score and diversity of profiles shown
  
  // Option 1: Feature the highest scoring ML-enhanced match
  const mlEnhancedMatches = matches.filter((match: any) => match.mlEnhanced);
  const topMLMatch = mlEnhancedMatches.length > 0 ? mlEnhancedMatches[0] : matches[0];
  
  // Option 2: Feature a slightly lower match but with complementary personality
  const complementaryMatch = matches.find(match => 
    match.matchScore > 80 && 
    match.personalityScore < 70 && 
    match.interestsScore > 85 &&
    match.attachmentScore && match.attachmentScore > 75
  );
  
  // Option 3: Feature a high-confidence ML match
  const highConfidenceMatch = matches.find((match: any) => 
    match.mlEnhanced && 
    match.mlConfidence > 0.8 &&
    match.matchScore > 75
  );
  
  // Choose the featured match with some intelligent randomness
  const featured = Math.random() > 0.6 ? 
    (highConfidenceMatch || complementaryMatch || topMLMatch) : 
    topMLMatch;
  
  return {
    ...featured,
    featured: true
  };
};

// Track user interactions for ML learning
export const trackUserInteraction = async (
  userId: string, 
  targetUserId: string, 
  action: 'like' | 'pass' | 'super_like' | 'message' | 'match',
  contextData?: any
): Promise<void> => {
  try {
    await mlMatchingService.trackInteraction({
      userId,
      targetUserId,
      action,
      timestamp: new Date(),
      contextData
    });
  } catch (error) {
    console.error('Error tracking user interaction:', error);
  }
};
