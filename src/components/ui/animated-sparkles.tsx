
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface AnimatedSparklesProps {
  size?: number;
  color?: string;
  className?: string;
}

export const AnimatedSparkles: React.FC<AnimatedSparklesProps> = ({ 
  size = 24, 
  color = "currentColor",
  className = ""
}) => {
  return (
    <motion.div 
      className={`inline-block ${className}`}
      initial={{ opacity: 0.7 }}
      animate={{ 
        opacity: [0.7, 1, 0.7],
        scale: [1, 1.1, 1],
        rotate: [0, 5, 0, -5, 0]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" 
      }}
    >
      <Sparkles size={size} color={color} />
    </motion.div>
  );
};
