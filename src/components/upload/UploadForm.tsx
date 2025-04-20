
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadCloud, Car, Zap, FileImage, Files } from "lucide-react";
import { EnhancementProcessor } from "@/components/enhancement-processor";
import { EnhancementSettings, EnhancementOptions } from "@/components/upload/EnhancementSettings";
import { toast } from "sonner";
import { FileUpload } from "@/components/ui/file-upload";

interface UploadFormProps {
  inputFiles: File[];
  inputPreviewUrls: string[];
  currentFileIndex: number;
  enhancedImageUrls: string[];
  isLicensePlateMode: boolean;
  licensePlateMode: "standard" | "advanced";
  enhancementOptions: EnhancementOptions;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onProcessingComplete: (resultUrl: string) => void;
  setIsLicensePlateMode: (value: boolean) => void;
  setLicensePlateMode: (value: "standard" | "advanced") => void;
  setInputFiles: (files: File[]) => void;
  setInputPreviewUrls: (urls: string[]) => void;
  setEnhancedImageUrls: (urls: string[]) => void;
  setEnhancementOptions: (options: EnhancementOptions) => void;
}

export const UploadForm: React.FC<UploadFormProps> = ({
  inputFiles,
  inputPreviewUrls,
  currentFileIndex,
  enhancedImageUrls,
  isLicensePlateMode,
  licensePlateMode,
  enhancementOptions,
  onFileSelect,
  onProcessingComplete,
  setIsLicensePlateMode,
  setLicensePlateMode,
  setInputFiles,
  setInputPreviewUrls,
  setEnhancedImageUrls,
  setEnhancementOptions,
}) => {
  const currentFile = inputFiles[currentFileIndex] || null;
  const currentPreviewUrl = inputPreviewUrls[currentFileIndex] || null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-esrgan-black-light border-gray-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">Upload Image</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="normal" className="mb-4">
            <TabsList className="grid grid-cols-2 mb-2 bg-esrgan-black">
              <TabsTrigger 
                value="normal" 
                onClick={() => setIsLicensePlateMode(false)}
                className="data-[state=active]:bg-esrgan-orange data-[state=active]:text-white"
              >
                Standard
              </TabsTrigger>
              <TabsTrigger 
                value="license-plate" 
                onClick={() => setIsLicensePlateMode(true)}
                className="data-[state=active]:bg-esrgan-orange data-[state=active]:text-white"
              >
                License Plate
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="normal">
              <p className="text-sm text-gray-400 mb-4">
                Enhance any image with our AI-powered ESRGAN technology. Perfect for photos, graphics, and more.
              </p>
            </TabsContent>
            
            <TabsContent value="license-plate">
              <div className="space-y-4">
                <p className="text-sm text-gray-400">
                  Specialized enhancement for vehicle license plates, optimized for readability and detail recovery.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div 
                    className={`p-3 rounded-lg cursor-pointer border flex flex-col items-center ${licensePlateMode === "standard" ? "border-esrgan-orange bg-esrgan-black/50" : "border-gray-700 bg-esrgan-black"}`}
                    onClick={() => setLicensePlateMode("standard")}
                  >
                    <Car className="h-8 w-8 mb-2 text-gray-300" />
                    <span className="text-sm text-gray-200 font-medium">Standard</span>
                    <span className="text-xs text-gray-400">Basic enhancement</span>
                  </div>
                  <div 
                    className={`p-3 rounded-lg cursor-pointer border flex flex-col items-center ${licensePlateMode === "advanced" ? "border-esrgan-orange bg-esrgan-black/50" : "border-gray-700 bg-esrgan-black"}`}
                    onClick={() => setLicensePlateMode("advanced")}
                  >
                    <Zap className="h-8 w-8 mb-2 text-gray-300" />
                    <span className="text-sm text-gray-200 font-medium">Advanced</span>
                    <span className="text-xs text-gray-400">Deep analysis</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          {inputFiles.length === 0 ? (
            <motion.label 
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer border-gray-700 bg-esrgan-black hover:border-esrgan-orange/50 transition-all"
              whileHover={{ scale: 1.02, borderColor: "rgba(255,69,0,0.7)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  {isLicensePlateMode 
                    ? "Upload vehicle license plate images for specialized enhancement" 
                    : "Supports JPG, PNG, WEBP, HEIC (max 10MB)"}
                </p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                multiple
                onChange={onFileSelect}
              />
            </motion.label>
          ) : (
            <div className="space-y-4">
              <motion.div 
                className="rounded-lg overflow-hidden border border-gray-700 aspect-video flex items-center justify-center bg-esrgan-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {currentPreviewUrl ? (
                  <img 
                    src={currentPreviewUrl} 
                    alt="Original" 
                    className="max-w-full max-h-full object-contain" 
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <FileImage className="w-10 h-10 mb-2" />
                    <p>Processing image...</p>
                  </div>
                )}
              </motion.div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  {currentFile ? (
                    <>
                      {currentFile.name} ({(currentFile.size / (1024 * 1024)).toFixed(2)} MB)
                      {inputFiles.length > 1 && (
                        <span className="ml-2">
                          (Image {currentFileIndex + 1} of {inputFiles.length})
                        </span>
                      )}
                    </>
                  ) : (
                    "No file selected"
                  )}
                </div>
                <Button 
                  variant="outline"
                  size="sm"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  onClick={() => {
                    setInputFiles([]);
                    setInputPreviewUrls([]);
                    setEnhancedImageUrls([]);
                  }}
                >
                  Change
                </Button>
              </div>
              
              {currentFile && (
                <EnhancementProcessor 
                  inputImage={currentFile} 
                  onProcessingComplete={onProcessingComplete}
                  isLicensePlateMode={isLicensePlateMode}
                  licensePlateMode={isLicensePlateMode ? licensePlateMode : undefined}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
