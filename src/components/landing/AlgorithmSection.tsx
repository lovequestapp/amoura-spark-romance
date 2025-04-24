
import React from 'react';
import { motion } from 'framer-motion';

const AlgorithmSection = () => {
  const steps = [
    {
      number: "01",
      title: "Smart Preferences",
      description: "We analyze your interests, values, and behavior to understand what matters most to you"
    },
    {
      number: "02",
      title: "Compatibility Scoring",
      description: "Our algorithm calculates match percentages based on multiple compatibility factors"
    },
    {
      number: "03",
      title: "Continuous Learning",
      description: "The more you interact, the better we understand your type and improve your matches"
    }
  ];

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-amoura-soft-pink to-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4 text-amoura-black">Our Matching Algorithm</h2>
          <p className="text-gray-600">Powered by advanced AI to help you find genuine connections</p>
        </motion.div>

        <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <span className="text-4xl font-bold text-amoura-deep-pink/10 absolute -top-2 right-4">
                  {step.number}
                </span>
                <h3 className="text-xl font-semibold mb-2 text-amoura-black">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AlgorithmSection;
