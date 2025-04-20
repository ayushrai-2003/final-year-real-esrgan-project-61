
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { FileImage } from "lucide-react";

interface EmptyStateProps {
  inputFile: File | null;
  isLicensePlateMode: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ inputFile, isLicensePlateMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="bg-esrgan-black-light border-gray-800 h-64 flex items-center justify-center">
        <div className="text-center p-6">
          <FileImage className="w-10 h-10 mb-4 mx-auto text-gray-500" />
          <p className="text-gray-400">
            {inputFile 
              ? `Process your ${isLicensePlateMode ? 'license plate' : 'image'} to see the enhanced result here`
              : `Upload an ${isLicensePlateMode ? 'license plate image' : 'image'} to begin the enhancement process`}
          </p>
        </div>
      </Card>
    </motion.div>
  );
};
