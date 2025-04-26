
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageComparison } from "@/components/image-comparison";
import { Download, Share, RefreshCw } from "lucide-react";
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
    link.download = "enhanced-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Enhanced image downloaded successfully!");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const blob = await fetch(enhancedImageUrls[currentFileIndex]).then(r => r.blob());
        const file = new File([blob], "enhanced-image.png", { type: "image/png" });
        
        await navigator.share({
          title: 'Enhanced Image',
          text: 'Check out this enhanced image!',
          files: [file]
        });
        toast.success("Image shared successfully!");
      } catch (error) {
        console.error("Error sharing:", error);
        // Fallback if sharing files failed
        try {
          await navigator.share({
            title: 'Enhanced Image',
            text: 'Check out this enhanced image!'
          });
        } catch (err) {
          toast.error("Couldn't share the image");
        }
      }
    } else {
      toast.error("Sharing not supported on this browser");
    }
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
          
          <div className="grid grid-cols-2 gap-2">
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Button 
                className="w-full bg-esrgan-orange hover:bg-esrgan-orange/80 py-5" 
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Button 
                className="w-full bg-gray-700 hover:bg-gray-600 py-5" 
                onClick={handleShare}
              >
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button>
            </motion.div>
          </div>
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
                  
                  <div className="text-gray-400">Color Preservation:</div>
                  <div className="text-white font-medium">Full</div>
                  
                  <div className="text-gray-400">Noise Reduction:</div>
                  <div className="text-white font-medium">High</div>
                  
                  {licensePlateMode === "advanced" && (
                    <>
                      <div className="text-gray-400">Processing Level:</div>
                      <div className="text-white font-medium">Premium</div>
                      
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
                  
                  <div className="text-gray-400">Color Enhancement:</div>
                  <div className="text-white font-medium">{enhancementOptions.colorBoost}%</div>
                  
                  <div className="text-gray-400">Detail Enhancement:</div>
                  <div className="text-white font-medium">{enhancementOptions.detailEnhancement}%</div>
                </>
              )}
            </div>
            
            <div className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-700">
              <p className="flex items-center">
                <RefreshCw className="h-3 w-3 mr-1 text-esrgan-orange" />
                Enhanced with premium quality algorithms
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
