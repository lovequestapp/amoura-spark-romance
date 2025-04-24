
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from '@/components/layout/AppLayout';
import ProfileCard from '@/components/profile/ProfileCard';
import DateIdea from '@/components/profile/DateIdea';

const profiles = [
  {
    id: 1,
    name: "Emma",
    age: 28,
    distance: "3 miles away",
    occupation: "Graphic Designer",
    photos: ["/assets/profile-1a.jpg", "/assets/profile-1b.jpg", "/assets/profile-1c.jpg"],
    bio: "Coffee addict, design enthusiast, and weekend hiker. Looking for someone to share laughs and adventures with.",
    prompts: [
      {
        question: "Two truths and a lie...",
        answer: "I've climbed Mt. Kilimanjaro, I speak three languages, I've never had a pet."
      },
      {
        question: "My simple pleasures...",
        answer: "Morning coffee with a good book, sunset beach walks, and finding hidden cafés in new cities."
      }
    ]
  },
  {
    id: 2,
    name: "Alex",
    age: 30,
    distance: "5 miles away",
    occupation: "Software Engineer",
    photos: ["/assets/profile-2a.jpg", "/assets/profile-2b.jpg"],
    bio: "Tech geek with a passion for hiking and craft beer. Looking for someone to explore new trails and breweries with.",
    prompts: [
      {
        question: "A perfect date would be...",
        answer: "A morning hike followed by brunch at a local spot, then exploring a neighborhood we haven't been to before."
      }
    ]
  },
  {
    id: 3,
    name: "Sofia",
    age: 26,
    distance: "2 miles away",
    occupation: "Event Planner",
    photos: ["/assets/profile-3a.jpg", "/assets/profile-3b.jpg", "/assets/profile-3c.jpg"],
    bio: "Foodie, music lover, and avid traveler. Let's plan our next adventure together!",
    prompts: [
      {
        question: "We'll get along if...",
        answer: "You like trying new restaurants as much as I do, and you're up for spontaneous weekend trips."
      }
    ]
  }
];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<string | null>(null);
  
  const currentProfile = profiles[currentIndex];
  
  const handleSwipe = (dir: string) => {
    setDirection(dir);
    setTimeout(() => {
      if (currentIndex < profiles.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // When we've gone through all profiles, reset to show a message
        setCurrentIndex(-1);
      }
      setDirection(null);
    }, 300);
  };
  
  return (
    <AppLayout>
      <div className="flex-1 flex flex-col p-4">
        <DateIdea />
        
        <div className="flex-1 flex items-center justify-center relative">
          <AnimatePresence mode="wait">
            {currentIndex >= 0 ? (
              <motion.div
                key={currentProfile.id}
                initial={{ opacity: 1 }}
                animate={{ 
                  opacity: 1,
                  x: direction === 'right' ? 100 : direction === 'left' ? -100 : 0,
                  rotate: direction === 'right' ? 10 : direction === 'left' ? -10 : 0
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-sm"
              >
                <ProfileCard profile={currentProfile} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-6"
              >
                <div className="mb-4">
                  <span className="text-6xl">✨</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">You've seen all profiles for now</h3>
                <p className="text-gray-500 mb-6">Check back soon or adjust your preferences to see more people</p>
                <Button
                  onClick={() => setCurrentIndex(0)}
                  className="bg-amoura-deep-pink hover:bg-amoura-deep-pink/90 text-white"
                >
                  Refresh Profiles
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {currentIndex >= 0 && (
          <div className="flex justify-center gap-4 py-6">
            <Button
              onClick={() => handleSwipe("left")}
              size="lg"
              className="h-16 w-16 rounded-full bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            >
              <X size={24} className="text-gray-500" />
            </Button>
            
            <Button
              onClick={() => handleSwipe("right")}
              size="lg"
              className="h-16 w-16 rounded-full bg-amoura-deep-pink hover:bg-amoura-deep-pink/90"
            >
              <Heart size={24} className="text-white" />
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Home;
