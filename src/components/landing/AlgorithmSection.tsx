
import React from 'react';
import { motion } from 'framer-motion';

const AlgorithmSection = () => {
  const steps = [
    {
      number: "01",
      title: "Emotional Intelligence Mapping",
      description: "Our proprietary algorithm analyzes your emotional patterns, values, and communication style to understand what truly matters in your relationships"
    },
    {
      number: "02",
      title: "Multi-Dimensional Compatibility",
      description: "We assess over 136 psychological compatibility factors beyond superficial traits, creating match percentages based on genuine connection potential"
    },
    {
      number: "03",
      title: "Adaptive Learning System",
      description: "As you interact, our AI continuously refines your compatibility models, recognizing subtle preference shifts to improve match quality over time"
    },
    {
      number: "04",
      title: "Chemistry Prediction",
      description: "Using behavioral science, we identify potential romantic chemistry between users before they even meet, fostering more meaningful first interactions"
    }
  ];

  // For the animation of the connecting line
  const lineVariants = {
    hidden: { pathLength: 0 },
    visible: { 
      pathLength: 1,
      transition: { 
        duration: 1.5,
        ease: "easeInOut",
        delay: 0.2
      }
    }
  };

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-amoura-soft-pink via-white to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-amoura-deep-pink blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-amoura-gold blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-amoura-deep-pink font-medium mb-2 inline-block"
          >
            THE SCIENCE OF ATTRACTION
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-amoura-black">
            Our Love Algorithm
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Powered by behavioral science and advanced AI to help you find connections that resonate on a deeper level
          </p>
        </motion.div>

        <div className="relative">
          {/* Mobile view */}
          <div className="md:hidden space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative bg-white rounded-xl p-6 shadow-md border border-gray-50"
              >
                <div className="absolute -top-2 -right-2 bg-amoura-deep-pink text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-amoura-black pr-6">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
          
          {/* Desktop view with connecting lines */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* SVG connector lines */}
            <svg className="absolute top-1/4 left-0 w-full h-1/2 z-0 pointer-events-none" viewBox="0 0 1200 100" preserveAspectRatio="none">
              <motion.path
                d="M0,50 C300,0 500,100 700,50 C900,0 1100,100 1200,50"
                stroke="#FFC0CB"
                strokeWidth="2"
                strokeDasharray="5,5"
                fill="none"
                variants={lineVariants}
                initial="hidden"
                whileInView="visible"
              />
            </svg>
            
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative z-10"
              >
                <div className="bg-white rounded-xl p-6 shadow-md h-full border border-gray-50 hover:shadow-lg transition-shadow">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-amoura-deep-pink text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                    {step.number}
                  </div>
                  <div className="pt-4">
                    <h3 className="text-xl font-semibold mb-3 text-amoura-black">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <p className="text-amoura-black font-medium text-lg">
            Trusted by <span className="text-amoura-deep-pink font-bold">25,000+</span> couples who found their perfect match
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AlgorithmSection;
