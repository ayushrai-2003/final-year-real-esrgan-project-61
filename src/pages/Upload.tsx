
import React, { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { EnhancementOptions } from "@/components/upload/EnhancementSettings";
import { toast } from "sonner";
import { UploadForm } from "@/components/upload/UploadForm";
import { EnhancementResult } from "@/components/upload/EnhancementResult";
import { EmptyState } from "@/components/upload/EmptyState";

const Upload = () => {
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [inputPreviewUrl, setInputPreviewUrl] = useState<string | null>(null);
  const [enhancedImageUrl, setEnhancedImageUrl] = useState<string | null>(null);
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
      const file = event.target.files[0];
      setInputFile(file);
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setInputPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setInputPreviewUrl(null);
        toast.error("Please select an image file");
      }

      setEnhancedImageUrl(null);
    }
  };

  const handleProcessingComplete = (resultUrl: string) => {
    setEnhancedImageUrl(resultUrl);
    toast.success("Enhancement completed successfully!");
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
                  inputFile={inputFile}
                  inputPreviewUrl={inputPreviewUrl}
                  enhancedImageUrl={enhancedImageUrl}
                  isLicensePlateMode={isLicensePlateMode}
                  licensePlateMode={licensePlateMode}
                  enhancementOptions={enhancementOptions}
                  onFileSelect={handleFileSelect}
                  onProcessingComplete={handleProcessingComplete}
                  setIsLicensePlateMode={setIsLicensePlateMode}
                  setLicensePlateMode={setLicensePlateMode}
                  setInputFile={setInputFile}
                  setInputPreviewUrl={setInputPreviewUrl}
                  setEnhancedImageUrl={setEnhancedImageUrl}
                  setEnhancementOptions={setEnhancementOptions}
                />
              </div>
              
              <div>
                {enhancedImageUrl && inputPreviewUrl ? (
                  <EnhancementResult
                    inputPreviewUrl={inputPreviewUrl}
                    enhancedImageUrl={enhancedImageUrl}
                    isLicensePlateMode={isLicensePlateMode}
                    licensePlateMode={licensePlateMode}
                    enhancementOptions={enhancementOptions}
                  />
                ) : (
                  <EmptyState 
                    inputFile={inputFile}
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
