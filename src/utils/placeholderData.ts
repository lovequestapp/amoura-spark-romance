
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
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=600&fit=crop"
    ],
    video: {
      url: "https://example.com/sample-video.mp4",
      thumbnail: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop",
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
    photos: [
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=600&fit=crop"
    ],
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
    photos: [
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop"
    ],
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
    photos: [
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop"
    ],
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
    photos: [
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop"
    ],
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
  },
  {
    id: 6,
    name: "Marcus",
    age: 29,
    distance: "6 miles away",
    occupation: "Marketing Manager",
    photos: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop"
    ],
    bio: "Sports fanatic, weekend warrior, and always up for a good laugh. Looking for my adventure partner.",
    personalityMatch: 76,
    verified: false,
    premium: true,
    traits: [
      { name: "Energetic", score: 92 },
      { name: "Competitive", score: 85 },
      { name: "Funny", score: 88 },
    ],
    prompts: [
      {
        question: "I'm competitive about...",
        answer: "Board games, trivia nights, and who can find the best taco truck in the city."
      }
    ],
    relationshipIntention: "Dating",
    personalityBadges: ["Athletic", "Funny", "Competitive"],
    interests: ["Sports", "Fitness", "Comedy", "Food", "Outdoors"]
  },
  {
    id: 7,
    name: "Isabella",
    age: 25,
    distance: "1 mile away",
    occupation: "Graduate Student",
    photos: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop"
    ],
    bio: "Science nerd by day, bookworm by night. Currently working on my PhD in Marine Biology.",
    personalityMatch: 83,
    verified: true,
    traits: [
      { name: "Intellectual", score: 96 },
      { name: "Curious", score: 94 },
      { name: "Passionate", score: 87 },
    ],
    prompts: [
      {
        question: "I nerd out on...",
        answer: "Ocean conservation, discovering new species, and explaining why dolphins are actually terrifying."
      }
    ],
    relationshipIntention: "Serious",
    personalityBadges: ["Intellectual", "Passionate", "Ambitious"],
    interests: ["Science", "Books", "Ocean", "Research", "Education"]
  },
  {
    id: 8,
    name: "Jordan",
    age: 31,
    distance: "7 miles away",
    occupation: "Chef",
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&seed=8",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&seed=8"
    ],
    bio: "Culinary artist with a passion for fusion cuisine. Let me cook for you while you tell me about your day.",
    personalityMatch: 79,
    verified: false,
    traits: [
      { name: "Creative", score: 93 },
      { name: "Generous", score: 89 },
      { name: "Detail-oriented", score: 86 },
    ],
    prompts: [
      {
        question: "The way to my heart is...",
        answer: "Sharing a meal you've never tried before and being excited to talk about the flavors."
      }
    ],
    relationshipIntention: "Dating",
    personalityBadges: ["Creative", "Generous", "Culinary"],
    interests: ["Cooking", "Food", "Culture", "Travel", "Wine"]
  },
  {
    id: 9,
    name: "Maya",
    age: 24,
    distance: "3 miles away",
    occupation: "Social Worker",
    photos: [
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop&seed=9",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&seed=9"
    ],
    bio: "Making the world a better place, one person at a time. Dog mom to a rescue pit bull named Sunshine.",
    personalityMatch: 86,
    verified: true,
    featured: true,
    traits: [
      { name: "Compassionate", score: 97 },
      { name: "Determined", score: 90 },
      { name: "Optimistic", score: 93 },
    ],
    prompts: [
      {
        question: "I'm passionate about...",
        answer: "Social justice, rescue animals, and proving that pineapple absolutely belongs on pizza."
      }
    ],
    relationshipIntention: "Relationship",
    personalityBadges: ["Compassionate", "Strong", "Optimistic"],
    interests: ["Social Justice", "Animals", "Volunteering", "Hiking", "Music"]
  },
  {
    id: 10,
    name: "Ryan",
    age: 28,
    distance: "9 miles away",
    occupation: "Musician",
    photos: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&seed=10",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&seed=10"
    ],
    bio: "Singer-songwriter who believes music can heal anything. Currently working on my debut album.",
    personalityMatch: 74,
    verified: false,
    premium: true,
    traits: [
      { name: "Artistic", score: 94 },
      { name: "Emotional", score: 87 },
      { name: "Dreamer", score: 91 },
    ],
    prompts: [
      {
        question: "Late at night, you can find me...",
        answer: "Writing songs about everything from heartbreak to the perfect cup of coffee."
      }
    ],
    relationshipIntention: "Casual",
    personalityBadges: ["Musical", "Sensitive", "Creative"],
    interests: ["Music", "Writing", "Coffee", "Concerts", "Art"]
  }
] satisfies Profile[];
