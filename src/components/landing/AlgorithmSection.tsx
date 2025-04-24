import React from 'react';
import { motion } from 'framer-motion';

const AlgorithmSection = () => {
  const steps = [
    {
      title: "Emotional Intelligence Mapping",
      description: "Our proprietary algorithm analyzes your emotional patterns, values, and communication style to understand what truly matters in your relationships"
    },
    {
      title: "Multi-Dimensional Compatibility",
      description: "We assess over 136 psychological compatibility factors beyond superficial traits, creating match percentages based on genuine connection potential"
    },
    {
      title: "Adaptive Learning System",
      description: "As you interact, our AI continuously refines your compatibility models, recognizing subtle preference shifts to improve match quality over time"
    },
    {
      title: "Chemistry Prediction",
      description: "Using behavioral science, we identify potential romantic chemistry between users before they even meet, fostering more meaningful first interactions"
    }
  ];

  const lineVariants = {
    hidden: { pathLength: 0 },
    visible: { 
      pathLength: 1,
      transition: { 
        duration: 1.5,
        ease: "easeInOut",
      }
    }
  };

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-amoura-soft-pink via-white to-amoura-soft-pink/30 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-amoura-deep-pink blur-3xl"></div>
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

        <div className="md:hidden space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {index > 0 && (
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: '40px' }}
                  transition={{ duration: 0.5 }}
                  className="absolute -top-8 left-1/2 w-0.5 bg-amoura-deep-pink/20"
                />
              )}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-50">
                <h3 className="text-xl font-semibold mb-3 text-amoura-black">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          <svg className="absolute top-1/2 left-0 w-full h-24 -translate-y-1/2 z-0" 
               preserveAspectRatio="none"
               viewBox="0 0 1200 100"
               style={{ pointerEvents: 'none' }}>
            <motion.path
              d="M100,50 C300,20 500,80 700,50 C900,20 1100,80 1200,50"
              stroke="rgba(255, 20, 147, 0.2)"
              strokeWidth="2"
              fill="none"
              variants={lineVariants}
              initial="hidden"
              whileInView="visible"
            />
          </svg>
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative z-10"
            >
              <div className="bg-white rounded-xl p-6 shadow-md h-full border border-gray-50 hover:shadow-lg transition-shadow">
                <div className="pt-2">
                  <h3 className="text-xl font-semibold mb-3 text-amoura-black">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
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
