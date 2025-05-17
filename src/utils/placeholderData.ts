
import { Profile } from '@/components/home/SwipeableCard';

// Enhanced profiles with detailed information for the matching algorithm
export const enhancedProfiles = [
  {
    id: 1,
    name: "Emma",
    age: 28,
    distance: "3 miles away",
    occupation: "Graphic Designer",
    photos: [
      "/lovable-uploads/955e854b-03c9-4efe-91de-ea62233f88eb.png",
      "/lovable-uploads/d96b24ef-01b0-41a0-afdf-564574149a3c.png",
      "/lovable-uploads/c3b91871-0b81-4711-a02d-6771b41f44ed.png"
    ],
    video: {
      url: "https://example.com/sample-video.mp4",
      thumbnail: "/assets/profile-1-video-thumb.jpg",
      duration: 45
    },
    bio: "Coffee addict, design enthusiast, and weekend hiker. Looking for someone to share laughs and adventures with.",
    personalityMatch: 85,
    verified: true,
    featured: true,
    traits: [
      { name: "Creative", score: 90 },
      { name: "Adventurous", score: 75 },
      { name: "Intellectual", score: 82 },
    ],
    prompts: [
      {
        question: "Two truths and a lie...",
        answer: "I've climbed Mt. Kilimanjaro, I speak three languages, I've never had a pet."
      },
      {
        question: "My simple pleasures...",
        answer: "Morning coffee with a good book, sunset beach walks, and finding hidden cafés in new cities."
      }
    ],
    relationshipIntention: "Dating",
    personalityBadges: ["Adventurous", "Creative", "Thoughtful"],
    interests: ["Art", "Hiking", "Coffee", "Photography", "Design"]
  },
  {
    id: 2,
    name: "Alex",
    age: 30,
    distance: "5 miles away",
    occupation: "Software Engineer",
    photos: ["/assets/profile-2a.jpg", "/assets/profile-2b.jpg"],
    bio: "Tech geek with a passion for hiking and craft beer. Looking for someone to explore new trails and breweries with.",
    premium: true,
    personalityMatch: 72,
    verified: false,
    traits: [
      { name: "Analytical", score: 95 },
      { name: "Introverted", score: 65 },
      { name: "Adventurous", score: 80 },
    ],
    prompts: [
      {
        question: "A perfect date would be...",
        answer: "A morning hike followed by brunch at a local spot, then exploring a neighborhood we haven't been to before."
      }
    ],
    relationshipIntention: "Relationship",
    personalityBadges: ["Analytical", "Outdoor-lover", "Thoughtful"],
    interests: ["Hiking", "Technology", "Craft Beer", "Gaming", "Reading"]
  },
  {
    id: 3,
    name: "Sofia",
    age: 26,
    distance: "2 miles away",
    occupation: "Event Planner",
    photos: ["/assets/profile-3a.jpg", "/assets/profile-3b.jpg", "/assets/profile-3c.jpg"],
    bio: "Foodie, music lover, and avid traveler. Let's plan our next adventure together!",
    personalityMatch: 91,
    verified: true,
    traits: [
      { name: "Extroverted", score: 88 },
      { name: "Creative", score: 75 },
      { name: "Spontaneous", score: 92 },
    ],
    prompts: [
      {
        question: "We'll get along if...",
        answer: "You like trying new restaurants as much as I do, and you're up for spontaneous weekend trips."
      }
    ],
    relationshipIntention: "Casual",
    personalityBadges: ["Social", "Spontaneous", "Foodie"],
    interests: ["Food", "Music", "Travel", "Social Events", "Dancing"]
  },
  {
    id: 4,
    name: "Daniel",
    age: 32,
    distance: "8 miles away",
    occupation: "Photographer",
    photos: ["/assets/profile-4a.jpg", "/assets/profile-4b.jpg"],
    bio: "Visual storyteller, nature enthusiast, and amateur chef. Always looking for the perfect shot and the perfect meal.",
    personalityMatch: 78,
    verified: true,
    traits: [
      { name: "Artistic", score: 95 },
      { name: "Patient", score: 85 },
      { name: "Observant", score: 90 },
    ],
    prompts: [
      {
        question: "I get excited about...",
        answer: "Golden hour light, finding hidden viewpoints in the city, and cooking a meal that makes people smile."
      }
    ],
    relationshipIntention: "Relationship",
    personalityBadges: ["Creative", "Observant", "Thoughtful"],
    interests: ["Photography", "Cooking", "Nature", "Art", "Travel"]
  },
  {
    id: 5,
    name: "Olivia",
    age: 27,
    distance: "4 miles away",
    occupation: "Yoga Instructor",
    photos: ["/assets/profile-5a.jpg", "/assets/profile-5b.jpg"],
    bio: "Mindfulness advocate, tea enthusiast, and book lover. Seeking someone to share quiet mornings and deep conversations.",
    personalityMatch: 88,
    verified: true,
    traits: [
      { name: "Mindful", score: 95 },
      { name: "Empathetic", score: 90 },
      { name: "Calm", score: 93 },
    ],
    prompts: [
      {
        question: "My ideal Sunday...",
        answer: "Morning yoga, farmers market visit, reading in a park, and cooking a nourishing dinner with someone special."
      }
    ],
    relationshipIntention: "Relationship",
    personalityBadges: ["Mindful", "Compassionate", "Balanced"],
    interests: ["Yoga", "Reading", "Wellness", "Cooking", "Nature"]
  }
] satisfies Profile[];
