
// Define which traits should use similarity vs complementary matching
export const COMPLEMENTARY_TRAITS = ['extroversion', 'openness', 'risk_taking'];
export const SIMILARITY_TRAITS = ['conscientiousness', 'agreeableness', 'emotional_stability', 'ambition'];

// Map attachment style compatibility (higher = better match)
export const ATTACHMENT_COMPATIBILITY: Record<string, Record<string, number>> = {
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
