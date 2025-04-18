
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { EnhancementProcessor } from "@/components/enhancement-processor";
import { ImageComparison } from "@/components/image-comparison";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FeatureCard } from "@/components/feature-card";
import { 
  ArrowRight, 
  ImagePlus, 
  Zap, 
  Sparkles, 
  LayoutGrid, 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  BookOpen,
  Check,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [inputPreviewUrl, setInputPreviewUrl] = useState<string | null>(null);
  const [enhancedImageUrl, setEnhancedImageUrl] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleFileSelect = (file: File) => {
    setInputFile(file);
    
    // Create preview URL for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setInputPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // For non-image files, set a placeholder
      setInputPreviewUrl(null);
      toast.info(`Selected file: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
    }

    // Reset enhanced image when new input is selected
    setEnhancedImageUrl(null);
  };

  const handleProcessingComplete = (resultUrl: string) => {
    setEnhancedImageUrl(resultUrl);
    toast.success("Enhancement completed successfully!");
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form fields
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Process the form submission (in a real app, this would send the data to a server)
    toast.success("Thank you! Your message has been sent successfully.");
    
    // Reset the form
    setContactForm({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSmoothScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-esrgan-black">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - Enhanced with better animations and CTA */}
        <section id="hero-section" className="relative overflow-hidden bg-hero-pattern py-20 md:py-28">
          <div className="absolute inset-0 bg-gradient-to-r from-esrgan-black to-transparent opacity-50"></div>
          <div className="container relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl animate-fade-in">
                Elevate Your Images with <span className="gradient-text">ESRGAN</span> Technology
              </h1>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300 animate-fade-in" style={{animationDelay: "200ms"}}>
                Transform low-quality images into stunning high-resolution masterpieces with our 
                state-of-the-art DL-Powered enhancement system. Specialized in license plate recognition and enhancement.
              </p>
              <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{animationDelay: "400ms"}}>
                <Button 
                  size="lg" 
                  className="bg-esrgan-orange hover:bg-esrgan-orange/80 shadow-lg hover:shadow-xl transition-all"
                  onClick={() => handleSmoothScroll('upload-section')}
                >
                  Enhance Your Image
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-gray-700 text-white hover:bg-gray-800 transition-all"
                  onClick={() => handleSmoothScroll('about-section')}
                >
                  Learn About ESRGAN
                </Button>
              </div>
            </div>
          </div>
          
          {/* Added decorative elements */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-esrgan-orange/10 rounded-full blur-3xl"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"></div>
        </section>

        {/* Features Section - Enhanced with subtle animation */}
        <section className="py-20 bg-esrgan-black-dark relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,69,0,0.1),transparent_70%)]"></div>
          <div className="container relative z-10">
            <h2 className="mb-4 text-center text-3xl font-bold text-white">
              Advanced Enhancement Features
            </h2>
            <p className="mb-12 mx-auto max-w-2xl text-center text-gray-400">
              Our platform leverages cutting-edge AI technology to deliver exceptional results for all your image enhancement needs
            </p>
            
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
                title="License Plate Recognition"
                description="Specialized enhancement for vehicle license plates with high accuracy."
                icon={FileText}
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
            </div>
          </div>
        </section>

        {/* Upload and Process Section - Improved with more comprehensive file support */}
        <section id="upload-section" className="py-20 relative">
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
                  <Upload className="mr-2 h-5 w-5 text-esrgan-orange" /> Upload Your File
                </h3>
                <FileUpload 
                  onFileSelect={handleFileSelect}
                  className="mb-6"
                  accept="*"
                  showSupportedTypes={true}
                />
                
                {/* Processing Section with improved status indicators */}
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

              {/* Results Section with improved comparison view */}
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
                          // Create a download link
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

        {/* Expanded About Section - Completely revamped with better organization and visuals */}
        <section id="about-section" className="py-20 bg-esrgan-black-dark relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,69,0,0.05),transparent_70%)]"></div>
          <div className="container relative z-10">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-4 text-center text-3xl font-bold text-white">
                About ESRGAN Technology
              </h2>
              <p className="mb-8 text-center text-gray-300">
                Enhanced Super-Resolution Generative Adversarial Network (ESRGAN) represents 
                the cutting edge in image enhancement technology, with specialized optimization for license plate recognition.
              </p>
              
              <Tabs defaultValue="how-it-works" className="w-full">
                <TabsList className="grid grid-cols-3 mb-8 bg-esrgan-black">
                  <TabsTrigger value="how-it-works" className="data-[state=active]:bg-esrgan-orange data-[state=active]:text-white">How It Works</TabsTrigger>
                  <TabsTrigger value="project-phases" className="data-[state=active]:bg-esrgan-orange data-[state=active]:text-white">Project Phases</TabsTrigger>
                  <TabsTrigger value="datasets" className="data-[state=active]:bg-esrgan-orange data-[state=active]:text-white">Datasets</TabsTrigger>
                </TabsList>
                
                <TabsContent value="how-it-works" className="rounded-xl border border-gray-800 bg-esrgan-black-light p-8 shadow-lg">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/2">
                      <h3 className="mb-4 text-xl font-medium gradient-text">Technical Overview</h3>
                      <p className="mb-4 text-gray-300">
                        ESRGAN uses a sophisticated deep learning architecture that combines:
                      </p>
                      
                      <ul className="ml-6 mb-6 list-disc text-gray-400 space-y-3">
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
                    
                    <div className="md:w-1/2 border-l border-gray-700 pl-8">
                      <h3 className="mb-4 text-xl font-medium gradient-text">Key Advantages</h3>
                      
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-esrgan-orange flex items-center justify-center">
                            <Check className="h-4 w-4 text-black" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">Superior Detail Recovery</h4>
                            <p className="text-gray-400">Preserves and enhances fine details that other methods lose during upscaling</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-esrgan-orange flex items-center justify-center">
                            <Check className="h-4 w-4 text-black" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">Specialized for License Plates</h4>
                            <p className="text-gray-400">Our model has been fine-tuned specifically for optimal license plate enhancement</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-esrgan-orange flex items-center justify-center">
                            <Check className="h-4 w-4 text-black" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">Performance Optimized</h4>
                            <p className="text-gray-400">Efficient implementation for faster processing times without sacrificing quality</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="project-phases" className="rounded-xl border border-gray-800 bg-esrgan-black-light p-8 shadow-lg">
                  <h3 className="mb-6 text-xl font-medium gradient-text">Development Timeline</h3>
                  
                  <div className="relative border-l-2 border-esrgan-orange/30 pl-8 ml-6 space-y-10">
                    <div className="relative">
                      <div className="absolute -left-[2.7rem] w-6 h-6 rounded-full bg-esrgan-orange flex items-center justify-center shadow-lg shadow-esrgan-orange/20">
                        <Check className="h-4 w-4 text-black" />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-semibold text-white text-lg">Phase 1: Research and Model Selection</h4>
                          <span className="ml-3 text-xs bg-esrgan-orange/20 text-esrgan-orange px-2 py-1 rounded">Completed</span>
                        </div>
                        <p className="text-gray-400 mt-2">
                          Comprehensive research on various super-resolution models, with ESRGAN selected for its superior performance on detail preservation.
                          We analyzed over 15 different architectures before finalizing our approach.
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-[2.7rem] w-6 h-6 rounded-full bg-esrgan-orange flex items-center justify-center shadow-lg shadow-esrgan-orange/20">
                        <Check className="h-4 w-4 text-black" />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-semibold text-white text-lg">Phase 2: Dataset Preparation</h4>
                          <span className="ml-3 text-xs bg-esrgan-orange/20 text-esrgan-orange px-2 py-1 rounded">Completed</span>
                        </div>
                        <p className="text-gray-400 mt-2">
                          Curated high-quality datasets including DIV2K, DF2K, and specialized license plate datasets (INDIAN_LP and AUTO_LP).
                          Our team spent over 400 hours curating, cleaning, and preprocessing the training data.
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-[2.7rem] w-6 h-6 rounded-full bg-esrgan-orange flex items-center justify-center shadow-lg shadow-esrgan-orange/20">
                        <Check className="h-4 w-4 text-black" />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-semibold text-white text-lg">Phase 3: Model Training</h4>
                          <span className="ml-3 text-xs bg-esrgan-orange/20 text-esrgan-orange px-2 py-1 rounded">Completed</span>
                        </div>
                        <p className="text-gray-400 mt-2">
                          Extensive training on various datasets, with specialized fine-tuning for license plate recognition accuracy.
                          Training was conducted on 8 NVIDIA A100 GPUs for a total of 2,000+ GPU hours to achieve optimal performance.
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-[2.7rem] w-6 h-6 rounded-full bg-esrgan-orange flex items-center justify-center shadow-lg shadow-esrgan-orange/20">
                        <Check className="h-4 w-4 text-black" />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-semibold text-white text-lg">Phase 4: Optimization</h4>
                          <span className="ml-3 text-xs bg-esrgan-orange/20 text-esrgan-orange px-2 py-1 rounded">Completed</span>
                        </div>
                        <p className="text-gray-400 mt-2">
                          Performance optimization for real-world usage, reducing processing time while maintaining quality.
                          We achieved a 68% reduction in processing time through architecture optimizations and efficient implementation.
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-[2.7rem] w-6 h-6 rounded-full bg-esrgan-orange flex items-center justify-center shadow-lg shadow-esrgan-orange/20">
                        <Check className="h-4 w-4 text-black" />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-semibold text-white text-lg">Phase 5: Web Application Development</h4>
                          <span className="ml-3 text-xs bg-esrgan-orange/20 text-esrgan-orange px-2 py-1 rounded">Completed</span>
                        </div>
                        <p className="text-gray-400 mt-2">
                          Creation of user-friendly interface for image enhancement with React and modern web technologies.
                          The web application was designed with accessibility and ease-of-use as primary objectives.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="datasets" className="rounded-xl border border-gray-800 bg-esrgan-black-light p-8 shadow-lg">
                  <h3 className="mb-6 text-xl font-medium gradient-text">Training Datasets</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-lg border border-gray-700 bg-esrgan-black p-6 hover:border-esrgan-orange/50 transition-all">
                      <h4 className="font-semibold text-white mb-3 text-lg">DIV2K Dataset</h4>
                      <p className="text-gray-400 mb-3">
                        High-quality dataset with 1000 diverse 2K resolution images for general super-resolution tasks.
                      </p>
                      <ul className="list-disc pl-5 text-gray-400 space-y-1">
                        <li>800 training images</li>
                        <li>100 validation images</li>
                        <li>100 testing images</li>
                        <li>2K resolution (2048×1080)</li>
                      </ul>
                    </div>
                    
                    <div className="rounded-lg border border-gray-700 bg-esrgan-black p-6 hover:border-esrgan-orange/50 transition-all">
                      <h4 className="font-semibold text-white mb-3 text-lg">DF2K Dataset</h4>
                      <p className="text-gray-400 mb-3">
                        Combined DIV2K and Flickr2K datasets, providing over 3,450 high-resolution training images.
                      </p>
                      <ul className="list-disc pl-5 text-gray-400 space-y-1">
                        <li>1000 DIV2K images</li>
                        <li>2450 Flickr2K images</li>
                        <li>Diverse scenarios and lighting conditions</li>
                        <li>High-quality natural images</li>
                      </ul>
                    </div>
                    
                    <div className="rounded-lg border border-gray-700 bg-esrgan-black p-6 hover:border-esrgan-orange/50 transition-all">
                      <h4 className="font-semibold text-white mb-3 text-lg">INDIAN Vehicle License Plate Dataset</h4>
                      <p className="text-gray-400 mb-3">
                        Specialized collection of Indian license plates with varying conditions, including 5,000+ samples with different lighting, angles, and weather conditions.
                      </p>
                      <ul className="list-disc pl-5 text-gray-400 space-y-1">
                        <li>5,000+ annotated license plate images</li>
                        <li>Multiple vehicle types</li>
                        <li>Various environmental conditions</li>
                        <li>Different plate formats and designs</li>
                      </ul>
                    </div>
                    
                    <div className="rounded-lg border border-gray-700 bg-esrgan-black p-6 hover:border-esrgan-orange/50 transition-all">
                      <h4 className="font-semibold text-white mb-3 text-lg">AUTOMATIC LICENSE NUMBER PLATE DETECTION Dataset</h4>
                      <p className="text-gray-400 mb-3">
                        Comprehensive dataset with 10,000+ annotated license plate images from multiple countries, focusing on detection and recognition accuracy.
                      </p>
                      <ul className="list-disc pl-5 text-gray-400 space-y-1">
                        <li>10,000+ annotated images</li>
                        <li>International plate formats</li>
                        <li>Character-level annotations</li>
                        <li>Real-world surveillance scenarios</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-8 rounded-lg border border-gray-700 bg-esrgan-black p-6">
                    <h3 className="mb-4 text-xl font-medium gradient-text">Technologies Used</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-white mb-3">Deep Learning Technologies</h4>
                        <ul className="list-disc pl-5 text-gray-400 space-y-2">
                          <li><span className="text-esrgan-orange">PyTorch:</span> Deep Learning Framework</li>
                          <li><span className="text-esrgan-orange">ESRGAN Architecture:</span> Advanced GAN-based model</li>
                          <li><span className="text-esrgan-orange">CUDA GPU Acceleration:</span> For optimal performance</li>
                          <li><span className="text-esrgan-orange">TensorFlow:</span> For model validation</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-white mb-3">Web Technologies</h4>
                        <ul className="list-disc pl-5 text-gray-400 space-y-2">
                          <li><span className="text-esrgan-orange">React.js:</span> Frontend Framework</li>
                          <li><span className="text-esrgan-orange">TailwindCSS:</span> For responsive styling</li>
                          <li><span className="text-esrgan-orange">WebAssembly:</span> For client-side processing</li>
                          <li><span className="text-esrgan-orange">RESTful APIs:</span> For model integration</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
        
        {/* Contact Section - Enhanced with better layout and interactive elements */}
        <section id="contact-section" className="py-20 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,69,0,0.1),transparent_70%)]"></div>
          <div className="container relative z-10">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-4 text-center text-3xl font-bold text-white">
                Get in Touch
              </h2>
              <p className="mb-10 text-center text-gray-300">
                Have questions about our technology or need custom image enhancement solutions? We're here to help!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="rounded-xl border border-gray-800 bg-esrgan-black-light p-8 shadow-lg hover:border-esrgan-orange/30 transition-all">
                  <h3 className="mb-6 text-xl font-medium text-white flex items-center">
                    <Mail className="mr-2 h-5 w-5 text-esrgan-orange" />
                    Send us a Message
                  </h3>
                  
                  <form className="space-y-5" onSubmit={handleContactSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name <span className="text-red-500">*</span></label>
                        <Input 
                          id="name" 
                          placeholder="Your name" 
                          className="bg-esrgan-black border-gray-700 focus:border-esrgan-orange focus:ring-esrgan-orange/30" 
                          value={contactForm.name}
                          onChange={handleContactChange}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email <span className="text-red-500">*</span></label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="your@email.com" 
                          className="bg-esrgan-black border-gray-700 focus:border-esrgan-orange focus:ring-esrgan-orange/30"
                          value={contactForm.email}
                          onChange={handleContactChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                      <Input 
                        id="subject" 
                        placeholder="What's this about?" 
                        className="bg-esrgan-black border-gray-700 focus:border-esrgan-orange focus:ring-esrgan-orange/30"
                        value={contactForm.subject}
                        onChange={handleContactChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message <span className="text-red-500">*</span></label>
                      <Textarea
                        id="message"
                        placeholder="Your message..."
                        className="bg-esrgan-black border-gray-700 focus:border-esrgan-orange focus:ring-esrgan-orange/30 min-h-[150px]"
                        value={contactForm.message}
                        onChange={handleContactChange}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-esrgan-orange hover:bg-esrgan-orange/80 shadow-lg hover:shadow-xl transition-all">
                      <Mail className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                </div>
                
                <div className="flex flex-col justify-between space-y-6">
                  <div className="rounded-xl border border-gray-800 bg-esrgan-black-light p-8 shadow-lg hover:border-esrgan-orange/30 transition-all">
                    <h3 className="mb-6 text-xl font-medium text-white flex items-center">
                      <Phone className="mr-2 h-5 w-5 text-esrgan-orange" />
                      Contact Information
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-esrgan-black flex items-center justify-center border border-gray-700">
                          <Mail className="h-5 w-5 text-esrgan-orange" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-300">Email</p>
                          <a href="mailto:ayushrai2219@gmail.com" className="text-gray-400 hover:text-esrgan-orange transition-colors">
                            ayushrai2219@gmail.com
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-esrgan-black flex items-center justify-center border border-gray-700">
                          <Phone className="h-5 w-5 text-esrgan-orange" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-300">Phone</p>
                          <a href="tel:+919569815811" className="text-gray-400 hover:text-esrgan-orange transition-colors">
                            +91 9569815811
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-esrgan-black flex items-center justify-center border border-gray-700">
                          <MapPin className="h-5 w-5 text-esrgan-orange" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-300">Address</p>
                          <p className="text-gray-400">
                            Pune, Maharashtra, India
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-xl border border-gray-800 bg-esrgan-black-light p-8 shadow-lg hover:border-esrgan-orange/30 transition-all">
                    <h3 className="mb-4 text-xl font-medium text-white flex items-center">
                      <BookOpen className="mr-2 h-5 w-5 text-esrgan-orange" />
                      Project FAQ
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-white">What file formats are supported?</h4>
                        <p className="text-gray-400 text-sm">We support all common file formats. For enhancement, we specialize in image formats like JPG, PNG, WEBP, etc.</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-white">How long does processing take?</h4>
                        <p className="text-gray-400 text-sm">Processing typically takes 5-30 seconds depending on image size and complexity.</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-white">Can I enhance non-license plate images?</h4>
                        <p className="text-gray-400 text-sm">Yes, our system works on any image type, but is specially optimized for license plates.</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-white">Is there a file size limit?</h4>
                        <p className="text-gray-400 text-sm">The maximum file size for processing is 10MB to ensure optimal performance.</p>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 mt-6"
                      onClick={() => handleSmoothScroll('about-section')}
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Learn More About the Project
                    </Button>
                  </div>
                </div>
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
