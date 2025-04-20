
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { FileImage, Files } from "lucide-react";

interface EmptyStateProps {
  inputFiles: File[];
  isLicensePlateMode: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ inputFiles, isLicensePlateMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="bg-esrgan-black-light border-gray-800 h-64 flex items-center justify-center">
        <div className="text-center p-6">
          {inputFiles.length > 1 ? (
            <Files className="w-10 h-10 mb-4 mx-auto text-gray-500" />
          ) : (
            <FileImage className="w-10 h-10 mb-4 mx-auto text-gray-500" />
          )}
          <p className="text-gray-400">
            {inputFiles.length > 0
              ? `Process your ${inputFiles.length} ${isLicensePlateMode ? 'license plate(s)' : 'image(s)'} to see the enhanced results here`
              : `Upload ${isLicensePlateMode ? 'license plate images' : 'images'} to begin the enhancement process`}
          </p>
        </div>
      </Card>
    </motion.div>
  );
};
