
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { EnhancementProcessor } from "@/components/enhancement-processor";
import { ImageComparison } from "@/components/image-comparison";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FeatureCard } from "@/components/feature-card";
import { ArrowRight, ImagePlus, Zap, Sparkles, LayoutGrid, Download } from "lucide-react";
import { Toaster } from "sonner";

const Index = () => {
  const [inputImage, setInputImage] = useState<File | null>(null);
  const [inputPreviewUrl, setInputPreviewUrl] = useState<string | null>(null);
  const [enhancedImageUrl, setEnhancedImageUrl] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setInputImage(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setInputPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Reset enhanced image when new input is selected
    setEnhancedImageUrl(null);
  };

  const handleProcessingComplete = (resultUrl: string) => {
    setEnhancedImageUrl(resultUrl);
  };

  return (
    <div className="flex min-h-screen flex-col bg-esrgan-black">
      <Toaster position="top-center" />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-hero-pattern py-16 md:py-24">
          <div className="container relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                Elevate Your Images with <span className="gradient-text">ESRGAN</span> Technology
              </h1>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
                Transform low-quality images into stunning high-resolution masterpieces with our 
                state-of-the-art AI-powered enhancement system.
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-esrgan-orange hover:bg-esrgan-orange/80"
                  onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Enhance Your Image
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-gray-700 text-white hover:bg-gray-800"
                >
                  Learn About ESRGAN
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-esrgan-black-dark">
          <div className="container">
            <h2 className="mb-12 text-center text-3xl font-bold text-white">
              Advanced Enhancement Features
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                title="Super Resolution"
                description="Upscale images up to 4x while maintaining clarity and adding realistic details."
                icon={Zap}
              />
              <FeatureCard
                title="Detail Enhancement"
                description="Recover and enhance fine details that are lost in low-quality originals."
                icon={Sparkles}
              />
              <FeatureCard
                title="All Image Formats"
                description="Support for all major image formats including JPG, PNG, WEBP, and more."
                icon={ImagePlus}
              />
              <FeatureCard
                title="Batch Processing"
                description="Process multiple images at once to save time on large enhancement jobs."
                icon={LayoutGrid}
              />
              <FeatureCard
                title="Instant Download"
                description="Download your enhanced images immediately after processing is complete."
                icon={Download}
              />
              <FeatureCard
                title="Advanced AI Model"
                description="Powered by Enhanced Super-Resolution Generative Adversarial Network."
                icon={Zap}
              />
            </div>
          </div>
        </section>

        {/* Upload and Process Section */}
        <section id="upload-section" className="py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-8 text-center text-3xl font-bold text-white">
                Enhance Your Image
              </h2>

              <div className="rounded-xl border border-gray-800 bg-esrgan-black-light p-6">
                <h3 className="mb-4 text-xl font-medium text-white">Upload an Image</h3>
                <FileUpload 
                  onFileSelect={handleFileSelect}
                  className="mb-4"
                />
                
                {/* Processing Section */}
                {inputImage && (
                  <EnhancementProcessor
                    inputImage={inputImage}
                    onProcessingComplete={handleProcessingComplete}
                  />
                )}
              </div>

              {/* Results Section */}
              {enhancedImageUrl && inputPreviewUrl && (
                <div className="mt-8 space-y-6 animate-fade-in">
                  <h2 className="text-center text-3xl font-bold text-white">
                    Enhancement Complete
                  </h2>
                  
                  <div className="rounded-xl border border-gray-800 bg-esrgan-black-light p-6">
                    <h3 className="mb-4 text-xl font-medium text-white">
                      Compare Results
                    </h3>
                    
                    <ImageComparison
                      beforeImage={inputPreviewUrl}
                      afterImage={enhancedImageUrl}
                      className="aspect-video w-full"
                    />
                    
                    <div className="mt-6 flex justify-center">
                      <Button 
                        size="lg"
                        className="bg-esrgan-orange hover:bg-esrgan-orange/80"
                        onClick={() => {
                          // Create a download link
                          const a = document.createElement('a');
                          a.href = enhancedImageUrl;
                          a.download = 'enhanced-image.png';
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
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

        {/* Technical Section */}
        <section className="py-16 bg-esrgan-black-dark">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-6 text-center text-3xl font-bold text-white">
                About ESRGAN Technology
              </h2>
              <p className="mb-6 text-center text-gray-300">
                Enhanced Super-Resolution Generative Adversarial Network (ESRGAN) represents 
                the cutting edge in image enhancement technology.
              </p>
              
              <div className="rounded-xl border border-gray-800 bg-esrgan-black-light p-6">
                <h3 className="mb-4 text-xl font-medium gradient-text">How It Works</h3>
                <p className="mb-4 text-gray-300">
                  ESRGAN uses a sophisticated deep learning architecture that combines:
                </p>
                
                <ul className="ml-6 mb-4 list-disc text-gray-400 space-y-2">
                  <li>Dense residual blocks for powerful feature extraction</li>
                  <li>Adversarial training to create photorealistic textures</li>
                  <li>Perceptual loss functions to enhance visual quality</li>
                  <li>Relativistic discriminator for balanced enhancement</li>
                </ul>
                
                <p className="text-gray-300">
                  The model has been trained on thousands of high-quality images to learn how to 
                  intelligently upscale low-resolution images while adding natural details and 
                  removing artifacts.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
