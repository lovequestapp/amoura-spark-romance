
import { supabase } from "@/integrations/supabase/client";
import { Profile } from '@/components/home/SwipeableCard';
import { WeightedMatch } from './index';

interface UserInteraction {
  userId: string;
  targetUserId: string;
  action: 'like' | 'pass' | 'super_like' | 'message' | 'match';
  timestamp: Date;
  contextData?: {
    timeOfDay: string;
    dayOfWeek: string;
    profilePosition: number;
    viewDuration?: number;
  };
}

interface SuccessPattern {
  ageRange: [number, number];
  interestOverlap: number;
  personalityCompatibility: number;
  locationDistance: number;
  attachmentStyleMatch: number;
  timeToMessage: number; // hours
  successRate: number;
  sampleSize: number;
}

class MLMatchingService {
  private successPatterns: SuccessPattern[] = [];
  private userPreferences: Map<string, any> = new Map();

  // Track user interactions for ML training
  async trackInteraction(interaction: UserInteraction): Promise<void> {
    try {
      // Store interaction in database for ML analysis
      await supabase.functions.invoke('track-user-interaction', {
        body: { interaction }
      });
      
      // Update local patterns if it's a significant interaction
      if (interaction.action === 'match' || interaction.action === 'message') {
        await this.updateSuccessPatterns(interaction);
      }
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  }

  // Analyze successful connections to identify patterns
  private async updateSuccessPatterns(interaction: UserInteraction): Promise<void> {
    try {
      // Fetch user and target profiles to analyze what made this connection successful
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', interaction.userId)
        .single();

      const { data: targetProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', interaction.targetUserId)
        .single();

      if (userProfile && targetProfile) {
        const pattern = this.extractSuccessPattern(userProfile, targetProfile, interaction);
        this.updatePatternDatabase(pattern);
      }
    } catch (error) {
      console.error('Error updating success patterns:', error);
    }
  }

  // Extract success patterns from successful matches
  private extractSuccessPattern(userProfile: any, targetProfile: any, interaction: UserInteraction): SuccessPattern {
    const userAge = this.calculateAge(userProfile.birth_date);
    const targetAge = this.calculateAge(targetProfile.birth_date);
    
    return {
      ageRange: [Math.min(userAge, targetAge), Math.max(userAge, targetAge)],
      interestOverlap: this.calculateInterestOverlap(userProfile, targetProfile),
      personalityCompatibility: this.calculatePersonalityCompatibility(userProfile, targetProfile),
      locationDistance: this.calculateDistance(userProfile, targetProfile),
      attachmentStyleMatch: this.calculateAttachmentMatch(userProfile, targetProfile),
      timeToMessage: this.calculateTimeToMessage(interaction),
      successRate: 1.0, // This successful match
      sampleSize: 1
    };
  }

  // Apply ML insights to improve match scoring
  async enhanceMatchScoring(baseMatches: WeightedMatch[], userId: string): Promise<WeightedMatch[]> {
    try {
      // Get user's historical preferences from ML analysis
      const userPrefs = await this.getUserMLPreferences(userId);
      
      // Apply ML-based scoring adjustments
      const enhancedMatches = baseMatches.map(match => {
        const mlScore = this.calculateMLScore(match, userPrefs);
        const enhancedScore = Math.round(match.matchScore * 0.7 + mlScore * 0.3);
        
        return {
          ...match,
          matchScore: Math.min(99, Math.max(1, enhancedScore)),
          mlEnhanced: true,
          mlConfidence: this.calculateConfidence(match, userPrefs)
        };
      });

      // Re-sort by enhanced scores
      return enhancedMatches.sort((a, b) => b.matchScore - a.matchScore);
    } catch (error) {
      console.error('Error enhancing match scoring:', error);
      return baseMatches; // Fallback to original scoring
    }
  }

  // Calculate ML-based score using learned patterns
  private calculateMLScore(match: WeightedMatch, userPrefs: any): number {
    let mlScore = 50; // Base score
    
    // Apply learned preferences
    if (userPrefs.preferredAgeRange) {
      // Use age from match if available, or calculate from birth_date if available
      let matchAge = match.age;
      if (!matchAge && match.birth_date) {
        matchAge = this.calculateAge(match.birth_date);
      }
      
      if (matchAge && matchAge >= userPrefs.preferredAgeRange[0] && matchAge <= userPrefs.preferredAgeRange[1]) {
        mlScore += 15;
      }
    }

    // Interest pattern matching
    if (userPrefs.successfulInterestPatterns && match.interests) {
      const interestScore = this.scoreInterestPatterns(match.interests, userPrefs.successfulInterestPatterns);
      mlScore += interestScore;
    }

    // Personality compatibility patterns
    if (userPrefs.personalityPreferences && match.traits) {
      const personalityScore = this.scorePersonalityPatterns(match.traits, userPrefs.personalityPreferences);
      mlScore += personalityScore;
    }

    // Time-based patterns (when user is most active)
    const timeScore = this.scoreTimePatterns(userPrefs.activeTimePatterns);
    mlScore += timeScore;

    // Attachment style preferences
    if (userPrefs.attachmentStylePreferences && match.attachment_style) {
      const attachmentScore = this.scoreAttachmentPattern(match.attachment_style, userPrefs.attachmentStylePreferences);
      mlScore += attachmentScore;
    }

    return Math.max(0, Math.min(100, mlScore));
  }

  // Get user's ML-derived preferences
  private async getUserMLPreferences(userId: string): Promise<any> {
    if (this.userPreferences.has(userId)) {
      return this.userPreferences.get(userId);
    }

    try {
      const { data } = await supabase.functions.invoke('get-ml-preferences', {
        body: { userId }
      });
      
      const preferences = data || this.getDefaultPreferences();
      this.userPreferences.set(userId, preferences);
      return preferences;
    } catch (error) {
      console.error('Error fetching ML preferences:', error);
      return this.getDefaultPreferences();
    }
  }

  // Predict match success probability
  async predictMatchSuccess(userProfile: any, targetProfile: any): Promise<number> {
    try {
      const features = this.extractFeatures(userProfile, targetProfile);
      
      // Simple ML prediction based on learned patterns
      let successProbability = 0.5; // Base probability
      
      // Apply pattern-based scoring
      for (const pattern of this.successPatterns) {
        const similarity = this.calculatePatternSimilarity(features, pattern);
        if (similarity > 0.7) {
          successProbability = Math.max(successProbability, pattern.successRate * similarity);
        }
      }

      return Math.min(0.95, Math.max(0.05, successProbability));
    } catch (error) {
      console.error('Error predicting match success:', error);
      return 0.5; // Default probability
    }
  }

  // Helper methods
  private calculateAge(birthDate: string): number {
    if (!birthDate) return 25; // Default age
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  private calculateInterestOverlap(profile1: any, profile2: any): number {
    const interests1 = profile1.user_interests?.map((ui: any) => ui.interests?.name) || [];
    const interests2 = profile2.user_interests?.map((ui: any) => ui.interests?.name) || [];
    
    if (interests1.length === 0 || interests2.length === 0) return 0;
    
    const overlap = interests1.filter((interest: string) => interests2.includes(interest));
    return overlap.length / Math.max(interests1.length, interests2.length);
  }

  private calculatePersonalityCompatibility(profile1: any, profile2: any): number {
    const traits1 = profile1.personality_traits || [];
    const traits2 = profile2.personality_traits || [];
    
    if (traits1.length === 0 || traits2.length === 0) return 0.5;
    
    let totalCompatibility = 0;
    let traitCount = 0;
    
    traits1.forEach((trait1: any) => {
      const trait2 = traits2.find((t: any) => t.name === trait1.name);
      if (trait2) {
        const diff = Math.abs(trait1.value - trait2.value);
        totalCompatibility += 1 - (diff / 100);
        traitCount++;
      }
    });
    
    return traitCount > 0 ? totalCompatibility / traitCount : 0.5;
  }

  private calculateDistance(profile1: any, profile2: any): number {
    if (!profile1.latitude || !profile1.longitude || !profile2.latitude || !profile2.longitude) {
      return 50; // Default distance
    }
    
    const R = 3963; // Earth's radius in miles
    const dLat = (profile2.latitude - profile1.latitude) * Math.PI / 180;
    const dLon = (profile2.longitude - profile1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(profile1.latitude * Math.PI / 180) * Math.cos(profile2.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private calculateAttachmentMatch(profile1: any, profile2: any): number {
    if (!profile1.attachment_style || !profile2.attachment_style) return 0.5;
    
    const compatibilityMatrix: Record<string, Record<string, number>> = {
      'secure': { 'secure': 0.9, 'anxious': 0.7, 'avoidant': 0.6, 'fearful': 0.5 },
      'anxious': { 'secure': 0.8, 'anxious': 0.4, 'avoidant': 0.3, 'fearful': 0.5 },
      'avoidant': { 'secure': 0.7, 'anxious': 0.3, 'avoidant': 0.5, 'fearful': 0.4 },
      'fearful': { 'secure': 0.6, 'anxious': 0.5, 'avoidant': 0.4, 'fearful': 0.6 }
    };
    
    return compatibilityMatrix[profile1.attachment_style]?.[profile2.attachment_style] || 0.5;
  }

  private calculateTimeToMessage(interaction: UserInteraction): number {
    // Placeholder - in real implementation, calculate from match to first message
    return Math.random() * 24; // Random hours for now
  }

  private async updatePatternDatabase(pattern: SuccessPattern): Promise<void> {
    // Update local patterns array (in production, this would update a database)
    this.successPatterns.push(pattern);
    
    // Keep only the most recent 1000 patterns to prevent memory issues
    if (this.successPatterns.length > 1000) {
      this.successPatterns = this.successPatterns.slice(-1000);
    }
  }

  private scoreInterestPatterns(interests: string[], patterns: any): number {
    // Score based on learned successful interest combinations
    return Math.min(15, interests.length * 2);
  }

  private scorePersonalityPatterns(traits: any[], patterns: any): number {
    // Score based on learned successful personality combinations
    return Math.min(10, traits.length);
  }

  private scoreTimePatterns(patterns: any): number {
    // Score based on current time and user's active patterns
    const hour = new Date().getHours();
    return hour >= 18 && hour <= 22 ? 5 : 0; // Evening boost
  }

  private scoreAttachmentPattern(style: string, patterns: any): number {
    // Score based on learned attachment style preferences
    return style === 'secure' ? 8 : 3;
  }

  private calculateConfidence(match: WeightedMatch, userPrefs: any): number {
    // Calculate confidence level in the ML enhancement
    let confidence = 0.5;
    
    if (userPrefs.sampleSize > 10) confidence += 0.2;
    if (match.matchScore > 80) confidence += 0.2;
    if (match.attachmentScore && match.attachmentScore > 75) confidence += 0.1;
    
    return Math.min(0.95, confidence);
  }

  private extractFeatures(userProfile: any, targetProfile: any): any {
    return {
      ageDifference: Math.abs(this.calculateAge(userProfile.birth_date) - this.calculateAge(targetProfile.birth_date)),
      interestOverlap: this.calculateInterestOverlap(userProfile, targetProfile),
      personalityCompatibility: this.calculatePersonalityCompatibility(userProfile, targetProfile),
      distance: this.calculateDistance(userProfile, targetProfile),
      attachmentMatch: this.calculateAttachmentMatch(userProfile, targetProfile)
    };
  }

  private calculatePatternSimilarity(features: any, pattern: SuccessPattern): number {
    // Calculate how similar current features are to a successful pattern
    let similarity = 0;
    let factors = 0;
    
    // Age range similarity
    if (features.ageDifference <= Math.abs(pattern.ageRange[1] - pattern.ageRange[0])) {
      similarity += 0.2;
    }
    factors++;
    
    // Interest overlap similarity
    if (Math.abs(features.interestOverlap - pattern.interestOverlap) < 0.2) {
      similarity += 0.2;
    }
    factors++;
    
    // Personality compatibility similarity
    if (Math.abs(features.personalityCompatibility - pattern.personalityCompatibility) < 0.15) {
      similarity += 0.2;
    }
    factors++;
    
    // Distance similarity
    if (Math.abs(features.distance - pattern.locationDistance) < 10) {
      similarity += 0.2;
    }
    factors++;
    
    // Attachment style similarity
    if (Math.abs(features.attachmentMatch - pattern.attachmentStyleMatch) < 0.1) {
      similarity += 0.2;
    }
    factors++;
    
    return factors > 0 ? similarity / factors : 0;
  }

  private getDefaultPreferences(): any {
    return {
      preferredAgeRange: [22, 35],
      successfulInterestPatterns: [],
      personalityPreferences: {},
      activeTimePatterns: {},
      attachmentStylePreferences: {},
      sampleSize: 0
    };
  }
}

export const mlMatchingService = new MLMatchingService();
