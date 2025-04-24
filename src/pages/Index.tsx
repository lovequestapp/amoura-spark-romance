
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import WelcomeCard from "@/components/welcome/WelcomeCard";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const welcomeCards = [
    {
      title: "Find Your Perfect Match",
      description: "Discover people who share your interests and values",
      image: "/assets/welcome-1.jpg"
    },
    {
      title: "Meaningful Connections",
      description: "Go beyond swiping with rich profiles and prompts",
      image: "/assets/welcome-2.jpg"
    },
    {
      title: "Quality Conversations",
      description: "Break the ice with personalized conversation starters",
      image: "/assets/welcome-3.jpg"
    }
  ];
  
  const nextStep = () => {
    if (currentStep < welcomeCards.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-amoura-soft-pink">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mb-6"
        >
          <div className="flex justify-center mb-8">
            <div className="relative">
              <h1 className="text-5xl font-bold text-amoura-deep-pink">amoura</h1>
              <span className="absolute -top-2 -right-4 text-amoura-gold text-3xl">✦</span>
            </div>
          </div>

          <WelcomeCard
            key={currentStep}
            title={welcomeCards[currentStep].title}
            description={welcomeCards[currentStep].description}
            image={welcomeCards[currentStep].image}
          />

          <div className="flex justify-center gap-2 mt-6">
            {welcomeCards.map((_, index) => (
              <div 
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep ? "w-8 bg-amoura-deep-pink" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </motion.div>
        
        <div className="w-full max-w-md space-y-4">
          <Button 
            className="w-full bg-amoura-deep-pink hover:bg-amoura-deep-pink/90 text-white rounded-full py-6 font-medium"
            onClick={nextStep}
          >
            {currentStep === welcomeCards.length - 1 ? "Get Started" : "Next"}
          </Button>
          
          {currentStep === welcomeCards.length - 1 ? (
            <div className="flex justify-center gap-6">
              <Link to="/login" className="text-amoura-black font-medium">
                Log in
              </Link>
              <Link to="/signup" className="text-amoura-deep-pink font-medium">
                Sign up
              </Link>
            </div>
          ) : (
            <Button 
              variant="ghost"
              className="w-full text-gray-500"
              onClick={() => setCurrentStep(welcomeCards.length - 1)}
            >
              Skip
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
