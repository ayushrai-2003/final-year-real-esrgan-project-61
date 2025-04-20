
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageComparison } from "@/components/image-comparison";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { EnhancementOptions } from "@/components/upload/EnhancementSettings";

interface EnhancementResultProps {
  inputPreviewUrls: string[];
  enhancedImageUrls: string[];
  currentFileIndex: number;
  isLicensePlateMode: boolean;
  licensePlateMode: "standard" | "advanced";
  enhancementOptions: EnhancementOptions;
}

export const EnhancementResult: React.FC<EnhancementResultProps> = ({
  inputPreviewUrls,
  enhancedImageUrls,
  currentFileIndex,
  isLicensePlateMode,
  licensePlateMode,
  enhancementOptions,
}) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = enhancedImageUrls[currentFileIndex];
    link.download = "enhanced-image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded successfully!");
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-esrgan-black-light border-gray-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">Enhanced Result</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg overflow-hidden border border-gray-700">
            <ImageComparison 
              beforeImage={inputPreviewUrls[currentFileIndex]} 
              afterImage={enhancedImageUrls[currentFileIndex]} 
            />
          </div>
          
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Button 
              className="w-full bg-esrgan-orange hover:bg-esrgan-orange/80 py-6" 
              onClick={handleDownload}
            >
              <UploadCloud className="mr-2 h-4 w-4" />
              Download Enhanced Image
            </Button>
          </motion.div>
        </CardContent>
      </Card>
      
      <Card className="bg-esrgan-black-light border-gray-800">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <h3 className="font-medium text-white">Enhancement Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {isLicensePlateMode ? (
                <>
                  <div className="text-gray-400">Enhancement Mode:</div>
                  <div className="text-white font-medium flex items-center">
                    License Plate 
                    {licensePlateMode === "advanced" && 
                      <span className="ml-1 text-xs bg-esrgan-orange/20 text-esrgan-orange px-1 rounded">Advanced</span>
                    }
                  </div>
                  
                  <div className="text-gray-400">OCR Optimization:</div>
                  <div className="text-white font-medium">Applied</div>
                  
                  <div className="text-gray-400">Text Clarity:</div>
                  <div className="text-white font-medium">Enhanced</div>
                  
                  <div className="text-gray-400">Noise Reduction:</div>
                  <div className="text-white font-medium">High</div>
                  
                  {licensePlateMode === "advanced" && (
                    <>
                      <div className="text-gray-400">Neural Processing:</div>
                      <div className="text-white font-medium">Deep Analysis</div>
                      
                      <div className="text-gray-400">Edge Detection:</div>
                      <div className="text-white font-medium">Advanced</div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="text-gray-400">Upscale Factor:</div>
                  <div className="text-white font-medium">{enhancementOptions.scale}x</div>
                  
                  <div className="text-gray-400">Resolution:</div>
                  <div className="text-white font-medium">{enhancementOptions.width} x {enhancementOptions.height} px</div>
                  
                  <div className="text-gray-400">Sharpness:</div>
                  <div className="text-white font-medium">{enhancementOptions.sharpness}%</div>
                  
                  <div className="text-gray-400">Noise Reduction:</div>
                  <div className="text-white font-medium">{enhancementOptions.noiseReduction}%</div>
                  
                  <div className="text-gray-400">Detail Enhancement:</div>
                  <div className="text-white font-medium">{enhancementOptions.detailEnhancement}%</div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
