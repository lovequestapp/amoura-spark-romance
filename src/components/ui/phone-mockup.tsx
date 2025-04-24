
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PhoneMockupProps {
  children: ReactNode;
  className?: string;
}

const PhoneMockup = ({ children, className = "" }: PhoneMockupProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative w-[280px] h-[580px] mx-auto ${className}`}
    >
      {/* Phone frame */}
      <div className="absolute inset-0 bg-amoura-black rounded-[40px] p-3 shadow-2xl">
        {/* Status bar */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-[30px] bg-amoura-black rounded-b-[14px] z-10"></div>
        
        {/* Screen content */}
        <div className="w-full h-full rounded-[32px] overflow-hidden border-[8px] border-amoura-black bg-white relative">
          {children}
          
          {/* Home indicator */}
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gray-800 rounded-full"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default PhoneMockup;
