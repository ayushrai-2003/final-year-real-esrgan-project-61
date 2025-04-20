
import React, { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { EnhancementProcessor } from "@/components/enhancement-processor";
import { ImageComparison } from "@/components/image-comparison";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancementSettings, EnhancementOptions } from "@/components/upload/EnhancementSettings";
import { UploadCloud, FileImage, Car, Zap, Settings, SparklesIcon } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

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

  const handleDownload = () => {
    if (enhancedImageUrl) {
      const link = document.createElement("a");
      link.href = enhancedImageUrl;
      link.download = `enhanced-${inputFile?.name || "image"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Image downloaded successfully!");
    }
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
                      
                      {!inputFile ? (
                        <motion.label 
                          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer border-gray-700 bg-esrgan-black hover:border-esrgan-orange/50 transition-all"
                          whileHover={{ scale: 1.02, borderColor: "rgba(255,69,0,0.7)" }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
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
                            onChange={handleFileSelect}
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
                            {inputPreviewUrl ? (
                              <img 
                                src={inputPreviewUrl} 
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
                              {inputFile.name} ({(inputFile.size / (1024 * 1024)).toFixed(2)} MB)
                            </div>
                            <Button 
                              variant="outline"
                              size="sm"
                              className="border-gray-700 text-gray-300 hover:bg-gray-800"
                              onClick={() => {
                                setInputFile(null);
                                setInputPreviewUrl(null);
                                setEnhancedImageUrl(null);
                              }}
                            >
                              Change
                            </Button>
                          </div>
                          
                          <EnhancementProcessor 
                            inputImage={inputFile} 
                            onProcessingComplete={handleProcessingComplete}
                            isLicensePlateMode={isLicensePlateMode}
                            licensePlateMode={isLicensePlateMode ? licensePlateMode : undefined}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
                
                {inputFile && !enhancedImageUrl && !isLicensePlateMode && (
                  <motion.div 
                    className="mt-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <EnhancementSettings 
                      options={enhancementOptions}
                      onOptionsChange={setEnhancementOptions}
                    />
                  </motion.div>
                )}
                
                {inputFile && !enhancedImageUrl && isLicensePlateMode && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Card className="bg-esrgan-black-light border-gray-800 mt-6 p-4">
                      <div className="text-gray-300 space-y-2">
                        <div className="flex items-center">
                          <Car className="h-5 w-5 mr-2 text-esrgan-orange" />
                          <h3 className="font-medium">License Plate Enhancement Active</h3>
                        </div>
                        <p className="text-sm text-gray-400">
                          {licensePlateMode === "advanced" ? 
                            "Advanced analysis engaged - using neural network with specialized OCR optimization and multi-frame analysis." :
                            "Our specialized model will enhance and clarify license plate text, even from blurry or low-quality images."}
                        </p>
                        {licensePlateMode === "advanced" && (
                          <div className="flex items-center mt-2 bg-esrgan-black p-2 rounded border border-gray-700">
                            <Zap className="h-4 w-4 mr-2 text-esrgan-orange animate-pulse" />
                            <span className="text-xs text-gray-300">Advanced processing requires more time but delivers superior results</span>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                )}
              </div>
              
              <div>
                {enhancedImageUrl && (
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
                            beforeImage={inputPreviewUrl!} 
                            afterImage={enhancedImageUrl} 
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
                )}
                
                {!enhancedImageUrl && (
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
