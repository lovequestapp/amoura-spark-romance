
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, X, Star } from "lucide-react";
import { motion, AnimatePresence, PanInfo, useAnimation } from "framer-motion";
import { useToast } from '@/components/ui/use-toast';
import AppLayout from '@/components/layout/AppLayout';
import DateIdea from '@/components/profile/DateIdea';
import EnhancedProfileCard from '@/components/home/EnhancedProfileCard';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

const enhancedProfiles = [
  {
    id: 1,
    name: "Emma",
    age: 28,
    distance: "3 miles away",
    occupation: "Graphic Designer",
    photos: ["/assets/profile-1a.jpg", "/assets/profile-1b.jpg", "/assets/profile-1c.jpg"],
    bio: "Coffee addict, design enthusiast, and weekend hiker. Looking for someone to share laughs and adventures with.",
    personalityMatch: 85,
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
    premium: true,
    personalityMatch: 72,
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
    personalityMatch: 91,
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
    ]
  }
];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const controls = useAnimation();
  
  const currentProfile = enhancedProfiles[currentIndex];
  
  const handleSwipe = (dir: string) => {
    setDirection(dir);
    
    // Animate the card in the appropriate direction
    controls.start({
      x: dir === 'right' ? 400 : -400,
      rotate: dir === 'right' ? 30 : -30,
      opacity: 0,
      transition: { type: "spring", stiffness: 400, damping: 40 }
    }).then(() => {
      if (currentIndex < enhancedProfiles.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(-1); // When we've gone through all profiles, reset to show a message
      }
      setDirection(null);
    });
  };

  const dragConstraints = useRef(null);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setDragging(false);
    const threshold = 100;
    
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        handleSwipe('right');
        
        // Create heart animation effect when liking
        const heart = document.createElement('div');
        heart.className = 'heart-animation';
        document.body.appendChild(heart);
        
        setTimeout(() => {
          document.body.removeChild(heart);
        }, 1000);
      } else {
        handleSwipe('left');
      }
    } else {
      // Reset card position if not swiped far enough
      controls.start({
        x: 0,
        rotate: 0,
        transition: { type: "spring", stiffness: 500, damping: 30 }
      });
    }
  };
  
  return (
    <AppLayout>
      <div className="flex-1 flex flex-col p-4">
        <DateIdea />
        
        <div className="flex-1 flex items-center justify-center relative">
          <motion.div 
            ref={dragConstraints}
            className="w-full max-w-sm"
          >
            <AnimatePresence mode="wait">
              {currentIndex >= 0 ? (
                <motion.div
                  key={currentProfile.id}
                  drag={isMobile ? "x" : false}
                  dragConstraints={dragConstraints}
                  dragElastic={0.7}
                  onDragStart={() => setDragging(true)}
                  onDragEnd={handleDragEnd}
                  animate={controls}
                  initial={{ x: 0, rotate: 0, scale: 0.95, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  className="touch-none"
                  style={{ touchAction: "pan-y" }}
                >
                  <EnhancedProfileCard 
                    profile={currentProfile} 
                    onSwipe={handleSwipe}
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="text-center p-6 mx-auto"
                  style={{ maxWidth: isMobile ? "90%" : "400px" }}
                >
                  <div className="mb-4">
                    <span className="text-6xl">✨</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">You've seen all profiles for now</h3>
                  <p className="text-gray-500 mb-6">Check back soon or adjust your preferences to see more people</p>
                  
                  <div className="space-y-4">
                    <Button
                      onClick={() => setCurrentIndex(0)}
                      className="bg-amoura-deep-pink hover:bg-amoura-deep-pink/90 text-white w-full"
                    >
                      Refresh Profiles
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => {
                        toast({
                          title: "Premium Feature",
                          description: "Upgrade to see more profiles!",
                        });
                      }}
                    >
                      <Star size={16} className="text-amoura-gold" />
                      <span>Upgrade to See More</span>
                      <Badge variant="premium" className="ml-1">Premium</Badge>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        
        {currentIndex >= 0 && (
          <div className="flex justify-center gap-4 py-6">
            <Button
              onClick={() => handleSwipe("left")}
              size="lg"
              className="h-16 w-16 rounded-full bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm transform transition-transform active:scale-95"
            >
              <X size={24} className="text-gray-500" />
            </Button>
            
            <Button
              onClick={() => handleSwipe("right")}
              size="lg"
              className="h-16 w-16 rounded-full bg-amoura-deep-pink hover:bg-amoura-deep-pink/90 shadow-md transform transition-transform active:scale-95"
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
