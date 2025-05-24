
// Enhanced intention matching with spectrum analysis and timeline compatibility
import { ATTACHMENT_COMPATIBILITY } from './constants';

export interface IntentionProfile {
  relationshipIntention?: string;
  timeline_expectations?: string; // 'immediate', 'within_months', 'within_year', 'no_rush', 'unsure'
  dating_history?: {
    longest_relationship?: number; // in months
    relationship_count?: number;
    time_since_last?: number; // in months
    commitment_pattern?: 'serial_monogamist' | 'casual_dater' | 'long_term_seeker' | 'mixed';
  };
  attachment_style?: 'secure' | 'anxious' | 'avoidant' | 'fearful';
}

// Define relationship intention spectrum with numerical values and characteristics
const INTENTION_SPECTRUM = {
  'casual': { 
    value: 0, 
    commitment_level: 1, 
    timeline_tolerance: ['no_rush', 'unsure'],
    compatible_patterns: ['casual_dater', 'mixed']
  },
  'dating': { 
    value: 25, 
    commitment_level: 2, 
    timeline_tolerance: ['within_year', 'no_rush', 'unsure'],
    compatible_patterns: ['casual_dater', 'mixed', 'long_term_seeker']
  },
  'relationship': { 
    value: 50, 
    commitment_level: 3, 
    timeline_tolerance: ['within_months', 'within_year', 'no_rush'],
    compatible_patterns: ['mixed', 'long_term_seeker', 'serial_monogamist']
  },
  'serious': { 
    value: 75, 
    commitment_level: 4, 
    timeline_tolerance: ['immediate', 'within_months', 'within_year'],
    compatible_patterns: ['long_term_seeker', 'serial_monogamist']
  },
  'marriage': { 
    value: 100, 
    commitment_level: 5, 
    timeline_tolerance: ['immediate', 'within_months'],
    compatible_patterns: ['long_term_seeker', 'serial_monogamist']
  }
} as const;

// Timeline compatibility scoring
const TIMELINE_COMPATIBILITY = {
  'immediate': { value: 100, urgency: 5 },
  'within_months': { value: 75, urgency: 4 },
  'within_year': { value: 50, urgency: 3 },
  'no_rush': { value: 25, urgency: 2 },
  'unsure': { value: 0, urgency: 1 }
} as const;

export const calculateAdvancedIntentionCompatibility = (
  userProfile: IntentionProfile,
  matchProfile: IntentionProfile
): {
  overallScore: number;
  intentionScore: number;
  timelineScore: number;
  historyScore: number;
  attachmentBonus: number;
  details: {
    intentionAlignment: string;
    timelineAlignment: string;
    historyCompatibility: string;
    recommendations?: string[];
  };
} => {
  // Base intention compatibility using spectrum
  const intentionScore = calculateSpectrumIntentionMatch(
    userProfile.relationshipIntention,
    matchProfile.relationshipIntention
  );

  // Timeline expectations compatibility
  const timelineScore = calculateTimelineCompatibility(
    userProfile.timeline_expectations,
    matchProfile.timeline_expectations,
    userProfile.relationshipIntention,
    matchProfile.relationshipIntention
  );

  // Dating history pattern analysis
  const historyScore = calculateHistoryCompatibility(
    userProfile.dating_history,
    matchProfile.dating_history
  );

  // Attachment style bonus for intention alignment
  const attachmentBonus = calculateAttachmentIntentionBonus(
    userProfile.attachment_style,
    matchProfile.attachment_style,
    userProfile.relationshipIntention,
    matchProfile.relationshipIntention
  );

  // Weighted overall score
  const overallScore = Math.round(
    (intentionScore * 0.4 + timelineScore * 0.3 + historyScore * 0.2 + attachmentBonus * 0.1) * 100
  ) / 100;

  // Generate detailed analysis
  const details = generateIntentionAnalysis(
    userProfile,
    matchProfile,
    intentionScore,
    timelineScore,
    historyScore
  );

  return {
    overallScore,
    intentionScore: Math.round(intentionScore * 100),
    timelineScore: Math.round(timelineScore * 100),
    historyScore: Math.round(historyScore * 100),
    attachmentBonus: Math.round(attachmentBonus * 100),
    details
  };
};

const calculateSpectrumIntentionMatch = (
  intention1?: string,
  intention2?: string
): number => {
  if (!intention1 || !intention2) return 0.5;

  const spec1 = INTENTION_SPECTRUM[intention1 as keyof typeof INTENTION_SPECTRUM];
  const spec2 = INTENTION_SPECTRUM[intention2 as keyof typeof INTENTION_SPECTRUM];

  if (!spec1 || !spec2) return 0.5;

  // Calculate distance on spectrum (0-100 scale)
  const distance = Math.abs(spec1.value - spec2.value);
  
  // Convert distance to compatibility score
  // Closer intentions = higher score, but allow some flexibility
  let baseScore = 1 - (distance / 100);
  
  // Bonus for exact matches
  if (intention1 === intention2) {
    baseScore = Math.min(baseScore + 0.2, 1.0);
  }
  
  // Bonus for adjacent intentions (within 25 points)
  else if (distance <= 25) {
    baseScore = Math.min(baseScore + 0.1, 1.0);
  }
  
  return Math.max(0, baseScore);
};

const calculateTimelineCompatibility = (
  timeline1?: string,
  timeline2?: string,
  intention1?: string,
  intention2?: string
): number => {
  if (!timeline1 || !timeline2) return 0.5;

  const time1 = TIMELINE_COMPATIBILITY[timeline1 as keyof typeof TIMELINE_COMPATIBILITY];
  const time2 = TIMELINE_COMPATIBILITY[timeline2 as keyof typeof TIMELINE_COMPATIBILITY];

  if (!time1 || !time2) return 0.5;

  // Calculate urgency compatibility
  const urgencyDiff = Math.abs(time1.urgency - time2.urgency);
  let timelineScore = 1 - (urgencyDiff / 4); // Max difference is 4

  // Enhance score based on intention compatibility
  if (intention1 && intention2) {
    const spec1 = INTENTION_SPECTRUM[intention1 as keyof typeof INTENTION_SPECTRUM];
    const spec2 = INTENTION_SPECTRUM[intention2 as keyof typeof INTENTION_SPECTRUM];

    if (spec1 && spec2) {
      // Check if timelines are compatible with stated intentions
      const timeline1Compatible = spec1.timeline_tolerance.includes(timeline1 as any);
      const timeline2Compatible = spec2.timeline_tolerance.includes(timeline2 as any);

      if (timeline1Compatible && timeline2Compatible) {
        timelineScore = Math.min(timelineScore + 0.2, 1.0);
      } else if (!timeline1Compatible || !timeline2Compatible) {
        timelineScore = Math.max(timelineScore - 0.3, 0);
      }
    }
  }

  return Math.max(0, timelineScore);
};

const calculateHistoryCompatibility = (
  history1?: IntentionProfile['dating_history'],
  history2?: IntentionProfile['dating_history']
): number => {
  if (!history1 || !history2) return 0.5;

  let compatibilityScore = 0.5;
  let factors = 0;

  // Compare commitment patterns
  if (history1.commitment_pattern && history2.commitment_pattern) {
    const pattern1 = history1.commitment_pattern;
    const pattern2 = history2.commitment_pattern;

    // Define pattern compatibility matrix
    const patternCompatibility: Record<string, Record<string, number>> = {
      'serial_monogamist': {
        'serial_monogamist': 0.9,
        'long_term_seeker': 0.8,
        'mixed': 0.6,
        'casual_dater': 0.3
      },
      'long_term_seeker': {
        'long_term_seeker': 1.0,
        'serial_monogamist': 0.8,
        'mixed': 0.5,
        'casual_dater': 0.2
      },
      'mixed': {
        'mixed': 0.7,
        'serial_monogamist': 0.6,
        'long_term_seeker': 0.5,
        'casual_dater': 0.6
      },
      'casual_dater': {
        'casual_dater': 0.8,
        'mixed': 0.6,
        'serial_monogamist': 0.3,
        'long_term_seeker': 0.2
      }
    };

    compatibilityScore += (patternCompatibility[pattern1]?.[pattern2] || 0.5) * 0.4;
    factors += 0.4;
  }

  // Compare relationship experience levels
  if (history1.relationship_count !== undefined && history2.relationship_count !== undefined) {
    const diff = Math.abs(history1.relationship_count - history2.relationship_count);
    const experienceScore = Math.max(0, 1 - (diff / 10)); // Normalize to reasonable range
    compatibilityScore += experienceScore * 0.2;
    factors += 0.2;
  }

  // Compare longest relationship durations
  if (history1.longest_relationship && history2.longest_relationship) {
    const ratio = Math.min(history1.longest_relationship, history2.longest_relationship) /
                  Math.max(history1.longest_relationship, history2.longest_relationship);
    compatibilityScore += ratio * 0.3;
    factors += 0.3;
  }

  // Time since last relationship consideration
  if (history1.time_since_last !== undefined && history2.time_since_last !== undefined) {
    // Similar recent dating activity suggests compatibility
    const timeDiff = Math.abs(history1.time_since_last - history2.time_since_last);
    const timeScore = Math.max(0, 1 - (timeDiff / 24)); // 24 months max difference
    compatibilityScore += timeScore * 0.1;
    factors += 0.1;
  }

  return factors > 0 ? compatibilityScore / factors : 0.5;
};

const calculateAttachmentIntentionBonus = (
  attachment1?: string,
  attachment2?: string,
  intention1?: string,
  intention2?: string
): number => {
  if (!attachment1 || !attachment2 || !intention1 || !intention2) return 0;

  // Get base attachment compatibility
  const attachmentScore = ATTACHMENT_COMPATIBILITY[attachment1]?.[attachment2] || 0.5;

  // Boost score if attachment styles align well with stated intentions
  const spec1 = INTENTION_SPECTRUM[intention1 as keyof typeof INTENTION_SPECTRUM];
  const spec2 = INTENTION_SPECTRUM[intention2 as keyof typeof INTENTION_SPECTRUM];

  if (!spec1 || !spec2) return attachmentScore * 0.5;

  // Secure attachment gets bonus for serious intentions
  if ((attachment1 === 'secure' || attachment2 === 'secure') && 
      (spec1.commitment_level >= 3 || spec2.commitment_level >= 3)) {
    return Math.min(attachmentScore + 0.2, 1.0);
  }

  // Anxious attachment works better with consistent, committed partners
  if ((attachment1 === 'anxious' && spec2.commitment_level >= 4) ||
      (attachment2 === 'anxious' && spec1.commitment_level >= 4)) {
    return Math.min(attachmentScore + 0.15, 1.0);
  }

  return attachmentScore;
};

const generateIntentionAnalysis = (
  userProfile: IntentionProfile,
  matchProfile: IntentionProfile,
  intentionScore: number,
  timelineScore: number,
  historyScore: number
) => {
  const recommendations: string[] = [];
  
  // Intention alignment analysis
  let intentionAlignment = 'Good match';
  if (intentionScore < 0.3) {
    intentionAlignment = 'Significant differences in relationship goals';
    recommendations.push('Discuss relationship expectations early');
  } else if (intentionScore < 0.6) {
    intentionAlignment = 'Some differences in relationship goals';
    recommendations.push('Clarify long-term intentions');
  } else if (intentionScore > 0.8) {
    intentionAlignment = 'Excellent alignment in relationship goals';
  }

  // Timeline alignment analysis
  let timelineAlignment = 'Compatible timelines';
  if (timelineScore < 0.3) {
    timelineAlignment = 'Very different timeline expectations';
    recommendations.push('Discuss timeline expectations openly');
  } else if (timelineScore < 0.6) {
    timelineAlignment = 'Somewhat different timeline expectations';
    recommendations.push('Be flexible with timing');
  } else if (timelineScore > 0.8) {
    timelineAlignment = 'Very similar timeline expectations';
  }

  // History compatibility analysis
  let historyCompatibility = 'Compatible dating patterns';
  if (historyScore < 0.3) {
    historyCompatibility = 'Very different dating histories';
    recommendations.push('Share relationship experiences gradually');
  } else if (historyScore < 0.6) {
    historyCompatibility = 'Somewhat different dating patterns';
    recommendations.push('Learn from each other\'s experiences');
  } else if (historyScore > 0.8) {
    historyCompatibility = 'Very similar dating experiences';
  }

  return {
    intentionAlignment,
    timelineAlignment,
    historyCompatibility,
    recommendations: recommendations.length > 0 ? recommendations : undefined
  };
};

// Export utility function for backwards compatibility
export const calculateIntentionCompatibility = (
  intention1: string | null | undefined, 
  intention2: string | null | undefined
): number => {
  return calculateSpectrumIntentionMatch(intention1 || undefined, intention2 || undefined);
};
