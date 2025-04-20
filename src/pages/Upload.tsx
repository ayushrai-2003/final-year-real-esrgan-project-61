
import React, { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { EnhancementProcessor } from "@/components/enhancement-processor";
import { ImageComparison } from "@/components/image-comparison";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancementSettings, EnhancementOptions } from "@/components/upload/EnhancementSettings";
import { UploadCloud, FileImage, Car } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Upload = () => {
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [inputPreviewUrl, setInputPreviewUrl] = useState<string | null>(null);
  const [enhancedImageUrl, setEnhancedImageUrl] = useState<string | null>(null);
  const [isLicensePlateMode, setIsLicensePlateMode] = useState(false);
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
            <h1 className="mb-2 text-3xl font-bold text-white">Image Enhancement</h1>
            <p className="mb-8 text-gray-400">
              Upload your image and our ESRGAN-powered AI will enhance it with superior quality and detail.
            </p>
            
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <Card className="bg-esrgan-black-light border-gray-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-lg">Upload Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                      <Switch
                        id="license-plate-mode"
                        checked={isLicensePlateMode}
                        onCheckedChange={setIsLicensePlateMode}
                      />
                      <Label htmlFor="license-plate-mode" className="flex items-center text-white">
                        <Car className="h-4 w-4 mr-2" />
                        License Plate Enhancement Mode
                      </Label>
                    </div>
                    
                    {!inputFile ? (
                      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer border-gray-700 bg-esrgan-black hover:border-esrgan-orange/50 transition-all">
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
                      </label>
                    ) : (
                      <div className="space-y-4">
                        <div className="rounded-lg overflow-hidden border border-gray-700 aspect-video flex items-center justify-center bg-esrgan-black">
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
                        </div>
                        
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
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {inputFile && !enhancedImageUrl && !isLicensePlateMode && (
                  <div className="mt-6">
                    <EnhancementSettings 
                      options={enhancementOptions}
                      onOptionsChange={setEnhancementOptions}
                    />
                  </div>
                )}
                
                {inputFile && !enhancedImageUrl && isLicensePlateMode && (
                  <Card className="bg-esrgan-black-light border-gray-800 mt-6 p-4">
                    <div className="text-gray-300 space-y-2">
                      <div className="flex items-center">
                        <Car className="h-5 w-5 mr-2 text-esrgan-orange" />
                        <h3 className="font-medium">License Plate Enhancement Active</h3>
                      </div>
                      <p className="text-sm text-gray-400">
                        Our specialized model will enhance and clarify license plate text, 
                        even from blurry or low-quality images.
                      </p>
                    </div>
                  </Card>
                )}
              </div>
              
              <div>
                {enhancedImageUrl && (
                  <div className="space-y-6">
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
                        
                        <Button 
                          className="w-full bg-esrgan-orange hover:bg-esrgan-orange/80" 
                          onClick={handleDownload}
                        >
                          <UploadCloud className="mr-2 h-4 w-4" />
                          Download Enhanced Image
                        </Button>
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
                                <div className="text-white font-medium">License Plate</div>
                                
                                <div className="text-gray-400">OCR Optimization:</div>
                                <div className="text-white font-medium">Applied</div>
                                
                                <div className="text-gray-400">Text Clarity:</div>
                                <div className="text-white font-medium">Enhanced</div>
                                
                                <div className="text-gray-400">Noise Reduction:</div>
                                <div className="text-white font-medium">High</div>
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
                  </div>
                )}
                
                {!enhancedImageUrl && (
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
