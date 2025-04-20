
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { EnhancementOptions } from "@/components/upload/EnhancementSettings";
import { toast } from "sonner";
import { UploadForm } from "@/components/upload/UploadForm";
import { EnhancementResult } from "@/components/upload/EnhancementResult";
import { EmptyState } from "@/components/upload/EmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Upload = () => {
  const [inputFiles, setInputFiles] = useState<File[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(0);
  const [inputPreviewUrls, setInputPreviewUrls] = useState<string[]>([]);
  const [enhancedImageUrls, setEnhancedImageUrls] = useState<string[]>([]);
  const [isLicensePlateMode, setIsLicensePlateMode] = useState(false);
  const [licensePlateMode, setLicensePlateMode] = useState<"standard" | "advanced">("standard");
  const [enhancementOptions, setEnhancementOptions] = useState<EnhancementOptions>({
    sharpness: 70,
    noiseReduction: 50,
    colorBoost: 50,
    detailEnhancement: 70,
    scale: 4,
    width: 1920,
    height: 1080
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);
      setInputFiles(files);
      setCurrentFileIndex(0);
      
      const previewUrls: string[] = [];
      files.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            previewUrls.push(e.target?.result as string);
            if (previewUrls.length === files.length) {
              setInputPreviewUrls(previewUrls);
            }
          };
          reader.readAsDataURL(file);
        } else {
          toast.error(`File ${file.name} is not an image`);
        }
      });

      setEnhancedImageUrls([]);
    }
  };

  const handleProcessingComplete = (resultUrl: string) => {
    setEnhancedImageUrls(prev => [...prev, resultUrl]);
    if (currentFileIndex < inputFiles.length - 1) {
      setCurrentFileIndex(prev => prev + 1);
    }
    toast.success(`Enhancement completed for image ${currentFileIndex + 1}/${inputFiles.length}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-esrgan-black">
      <Header />
      
      <main className="flex-1 py-16">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <motion.h1 
              className="mb-2 text-3xl font-bold text-white"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              AI-Powered Image Enhancement
            </motion.h1>
            <motion.p 
              className="mb-8 text-gray-400"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Upload your image and our ESRGAN-powered AI will enhance it with superior quality and detail.
            </motion.p>
            
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <UploadForm
                  inputFiles={inputFiles}
                  inputPreviewUrls={inputPreviewUrls}
                  currentFileIndex={currentFileIndex}
                  enhancedImageUrls={enhancedImageUrls}
                  isLicensePlateMode={isLicensePlateMode}
                  licensePlateMode={licensePlateMode}
                  enhancementOptions={enhancementOptions}
                  onFileSelect={handleFileSelect}
                  onProcessingComplete={handleProcessingComplete}
                  setIsLicensePlateMode={setIsLicensePlateMode}
                  setLicensePlateMode={setLicensePlateMode}
                  setInputFiles={setInputFiles}
                  setInputPreviewUrls={setInputPreviewUrls}
                  setEnhancedImageUrls={setEnhancedImageUrls}
                  setEnhancementOptions={setEnhancementOptions}
                />
              </div>
              
              <div>
                {enhancedImageUrls.length > 0 && inputPreviewUrls.length > 0 ? (
                  <EnhancementResult
                    inputPreviewUrls={inputPreviewUrls}
                    enhancedImageUrls={enhancedImageUrls}
                    currentFileIndex={currentFileIndex}
                    isLicensePlateMode={isLicensePlateMode}
                    licensePlateMode={licensePlateMode}
                    enhancementOptions={enhancementOptions}
                  />
                ) : (
                  <EmptyState 
                    inputFiles={inputFiles}
                    isLicensePlateMode={isLicensePlateMode}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Upload;
