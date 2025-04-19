
import React, { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FileUpload } from "@/components/ui/file-upload";
import { EnhancementProcessor } from "@/components/enhancement-processor";
import { ImageComparison } from "@/components/image-comparison";
import { Button } from "@/components/ui/button";
import { UploadCloud, Check, Sparkles, Download } from "lucide-react";
import { toast } from "sonner";

const Upload = () => {
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [inputPreviewUrl, setInputPreviewUrl] = useState<string | null>(null);
  const [enhancedImageUrl, setEnhancedImageUrl] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setInputFile(file);
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setInputPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setInputPreviewUrl(null);
      toast.info(`Selected file: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
    }

    setEnhancedImageUrl(null);
  };

  const handleProcessingComplete = (resultUrl: string) => {
    setEnhancedImageUrl(resultUrl);
    toast.success("Enhancement completed successfully!");
  };

  return (
    <div className="flex min-h-screen flex-col bg-esrgan-black">
      <Header />
      
      <main className="flex-1">
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,69,0,0.1),transparent_70%)]"></div>
          <div className="container relative z-10">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-4 text-center text-3xl font-bold text-white">
                Enhance Your Files
              </h2>
              <p className="mb-8 text-center text-gray-300">
                Upload any file type for processing. Our system specializes in image enhancement but can handle various file formats.
              </p>

              <div className="rounded-xl border border-gray-800 bg-esrgan-black-light p-8 shadow-lg">
                <h3 className="mb-6 text-xl font-medium text-white flex items-center">
                  <UploadCloud className="mr-2 h-5 w-5 text-esrgan-orange" /> Upload Your File
                </h3>
                <FileUpload 
                  onFileSelect={handleFileSelect}
                  className="mb-6"
                  accept="*"
                  showSupportedTypes={true}
                />
                
                {inputFile && (
                  <div className="mt-8 animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-medium text-white">Processing</h3>
                      <div className="text-sm text-gray-400">
                        File: {inputFile.name} ({(inputFile.size / (1024 * 1024)).toFixed(2)} MB)
                      </div>
                    </div>
                    
                    <EnhancementProcessor
                      inputImage={inputFile}
                      onProcessingComplete={handleProcessingComplete}
                    />
                  </div>
                )}
              </div>

              {enhancedImageUrl && inputPreviewUrl && (
                <div className="mt-10 space-y-6 animate-fade-in">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">
                      Enhancement Complete
                    </h2>
                    <div className="flex justify-center items-center mb-6">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                        <Check className="h-4 w-4 text-green-600" />
                      </span>
                      <span className="ml-2 text-gray-300">Processed successfully</span>
                    </div>
                  </div>
                  
                  <div className="rounded-xl border border-gray-800 bg-esrgan-black-light p-8 shadow-lg">
                    <h3 className="mb-4 text-xl font-medium text-white flex items-center">
                      <Sparkles className="mr-2 h-5 w-5 text-esrgan-orange" /> Before & After Comparison
                    </h3>
                    
                    <ImageComparison
                      beforeImage={inputPreviewUrl}
                      afterImage={enhancedImageUrl}
                      className="aspect-video w-full rounded-lg overflow-hidden shadow-lg"
                    />
                    
                    <div className="mt-8 flex justify-center">
                      <Button 
                        size="lg"
                        className="bg-esrgan-orange hover:bg-esrgan-orange/80 shadow-lg hover:shadow-xl transition-all"
                        onClick={() => {
                          const a = document.createElement('a');
                          a.href = enhancedImageUrl;
                          a.download = 'enhanced-image.png';
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          
                          toast.success("Image downloaded successfully!");
                        }}
                      >
                        <Download className="mr-2 h-5 w-5" />
                        Download Enhanced Image
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Upload;
