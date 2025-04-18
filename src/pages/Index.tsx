
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
      setInputPreviewUrl(null);
    }

    // Reset enhanced image when new input is selected
    setEnhancedImageUrl(null);
    
    // Validate file type for processing
    if (!file.type.startsWith('image/')) {
      toast.warning("Only image files can be enhanced with our system. Other files will be processed differently.");
    }
  };

  const handleProcessingComplete = (resultUrl: string) => {
    setEnhancedImageUrl(resultUrl);
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

  return (
    <div className="flex min-h-screen flex-col bg-esrgan-black">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section id="hero-section" className="relative overflow-hidden bg-hero-pattern py-16 md:py-24">
          <div className="container relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                Elevate Your Images with <span className="gradient-text">ESRGAN</span> Technology
              </h1>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
                Transform low-quality images into stunning high-resolution masterpieces with our 
                state-of-the-art DL-Powered enhancement system. Specialized in license plate recognition and enhancement.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
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
                  onClick={() => document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' })}
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

        {/* Upload and Process Section */}
        <section id="upload-section" className="py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-8 text-center text-3xl font-bold text-white">
                Enhance Your Image
              </h2>

              <div className="rounded-xl border border-gray-800 bg-esrgan-black-light p-6">
                <h3 className="mb-4 text-xl font-medium text-white">Upload a File</h3>
                <FileUpload 
                  onFileSelect={handleFileSelect}
                  className="mb-4"
                  accept="image/*"
                  showSupportedTypes={true}
                />
                
                {/* Processing Section */}
                {inputFile && (
                  <EnhancementProcessor
                    inputImage={inputFile}
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

        {/* Expanded About Section */}
        <section id="about-section" className="py-16 bg-esrgan-black-dark">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-6 text-center text-3xl font-bold text-white">
                About ESRGAN Technology
              </h2>
              <p className="mb-6 text-center text-gray-300">
                Enhanced Super-Resolution Generative Adversarial Network (ESRGAN) represents 
                the cutting edge in image enhancement technology, with specialized optimization for license plate recognition.
              </p>
              
              <Tabs defaultValue="how-it-works" className="w-full">
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
                  <TabsTrigger value="project-phases">Project Phases</TabsTrigger>
                  <TabsTrigger value="datasets">Datasets</TabsTrigger>
                </TabsList>
                
                <TabsContent value="how-it-works" className="rounded-xl border border-gray-800 bg-esrgan-black-light p-6">
                  <h3 className="mb-4 text-xl font-medium gradient-text">Technical Overview</h3>
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
                </TabsContent>
                
                <TabsContent value="project-phases" className="rounded-xl border border-gray-800 bg-esrgan-black-light p-6">
                  <h3 className="mb-4 text-xl font-medium gradient-text">Development Timeline</h3>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-esrgan-orange flex items-center justify-center">
                        <Check className="h-4 w-4 text-black" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Phase 1: Research and Model Selection</h4>
                        <p className="text-gray-400">Comprehensive research on various super-resolution models, with ESRGAN selected for its superior performance on detail preservation.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-esrgan-orange flex items-center justify-center">
                        <Check className="h-4 w-4 text-black" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Phase 2: Dataset Preparation</h4>
                        <p className="text-gray-400">Curated high-quality datasets including DIV2K, DF2K, and specialized license plate datasets (INDIAN_LP and AUTO_LP).</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-esrgan-orange flex items-center justify-center">
                        <Check className="h-4 w-4 text-black" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Phase 3: Model Training</h4>
                        <p className="text-gray-400">Extensive training on various datasets, with specialized fine-tuning for license plate recognition accuracy.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-esrgan-orange flex items-center justify-center">
                        <Check className="h-4 w-4 text-black" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Phase 4: Optimization</h4>
                        <p className="text-gray-400">Performance optimization for real-world usage, reducing processing time while maintaining quality.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-esrgan-orange flex items-center justify-center">
                        <Check className="h-4 w-4 text-black" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Phase 5: Web Application Development</h4>
                        <p className="text-gray-400">Creation of user-friendly interface for image enhancement with React and modern web technologies.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="datasets" className="rounded-xl border border-gray-800 bg-esrgan-black-light p-6">
                  <h3 className="mb-4 text-xl font-medium gradient-text">Training Datasets</h3>
                  
                  <div className="space-y-6">
                    <div className="rounded-lg border border-gray-700 bg-esrgan-black p-4">
                      <h4 className="font-semibold text-white mb-2">DIV2K Dataset</h4>
                      <p className="text-gray-400">High-quality dataset with 1000 diverse 2K resolution images for general super-resolution tasks.</p>
                    </div>
                    
                    <div className="rounded-lg border border-gray-700 bg-esrgan-black p-4">
                      <h4 className="font-semibold text-white mb-2">DF2K Dataset</h4>
                      <p className="text-gray-400">Combined DIV2K and Flickr2K datasets, providing over 3,450 high-resolution training images.</p>
                    </div>
                    
                    <div className="rounded-lg border border-gray-700 bg-esrgan-black p-4">
                      <h4 className="font-semibold text-white mb-2">INDIAN Vehicle License Plate Dataset</h4>
                      <p className="text-gray-400">Specialized collection of Indian license plates with varying conditions, including 5,000+ samples with different lighting, angles, and weather conditions.</p>
                    </div>
                    
                    <div className="rounded-lg border border-gray-700 bg-esrgan-black p-4">
                      <h4 className="font-semibold text-white mb-2">AUTOMATIC LICENSE NUMBER PLATE DETECTION Dataset</h4>
                      <p className="text-gray-400">Comprehensive dataset with 10,000+ annotated license plate images from multiple countries, focusing on detection and recognition accuracy.</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-8 rounded-xl border border-gray-800 bg-esrgan-black-light p-6">
                <h3 className="mb-4 text-xl font-medium gradient-text">Technologies Used</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg border border-gray-700 bg-esrgan-black p-4">
                    <h4 className="font-semibold text-white mb-2">Deep Learning Technologies</h4>
                    <ul className="list-disc pl-5 text-gray-400 space-y-1">
                      <li>PyTorch Deep Learning Framework</li>
                      <li>ESRGAN Architecture</li>
                      <li>CUDA GPU Acceleration</li>
                      <li>TensorFlow for Model Validation</li>
                    </ul>
                  </div>
                  
                  <div className="rounded-lg border border-gray-700 bg-esrgan-black p-4">
                    <h4 className="font-semibold text-white mb-2">Web Technologies</h4>
                    <ul className="list-disc pl-5 text-gray-400 space-y-1">
                      <li>React.js Frontend Framework</li>
                      <li>TailwindCSS for Styling</li>
                      <li>WebAssembly for Client-Side Processing</li>
                      <li>RESTful APIs for Model Integration</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact Section - Updated */}
        <section id="contact-section" className="py-16">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-6 text-center text-3xl font-bold text-white">
                Get in Touch
              </h2>
              <p className="mb-12 text-center text-gray-300">
                Have questions about our technology or need custom image enhancement solutions?
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="rounded-xl border border-gray-800 bg-esrgan-black-light p-6">
                  <h3 className="mb-6 text-xl font-medium text-white">Send us a Message</h3>
                  
                  <form className="space-y-4" onSubmit={handleContactSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Name <span className="text-red-500">*</span></label>
                        <Input 
                          id="name" 
                          placeholder="Your name" 
                          className="bg-esrgan-black border-gray-700" 
                          value={contactForm.name}
                          onChange={handleContactChange}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email <span className="text-red-500">*</span></label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="your@email.com" 
                          className="bg-esrgan-black border-gray-700"
                          value={contactForm.email}
                          onChange={handleContactChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-1">Subject</label>
                      <Input 
                        id="subject" 
                        placeholder="What's this about?" 
                        className="bg-esrgan-black border-gray-700"
                        value={contactForm.subject}
                        onChange={handleContactChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-1">Message <span className="text-red-500">*</span></label>
                      <Textarea
                        id="message"
                        placeholder="Your message..."
                        className="bg-esrgan-black border-gray-700 min-h-[150px]"
                        value={contactForm.message}
                        onChange={handleContactChange}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-esrgan-orange hover:bg-esrgan-orange/80">
                      Send Message
                    </Button>
                  </form>
                </div>
                
                <div className="flex flex-col justify-between space-y-6">
                  <div className="rounded-xl border border-gray-800 bg-esrgan-black-light p-6">
                    <h3 className="mb-6 text-xl font-medium text-white">Contact Information</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Mail className="h-5 w-5 text-esrgan-orange mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-300">Email</p>
                          <p className="text-gray-400">ayushrai2219@gmail.com</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 text-esrgan-orange mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-300">Phone</p>
                          <p className="text-gray-400">+91 9569815811</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-esrgan-orange mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-300">Address</p>
                          <p className="text-gray-400">Pune, Maharashtra, India</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-xl border border-gray-800 bg-esrgan-black-light p-6">
                    <h3 className="mb-4 text-xl font-medium text-white">Project FAQ</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold text-white">What image formats are supported?</h4>
                        <p className="text-gray-400 text-sm">We support all common image formats including JPG, PNG, WEBP, and more.</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-white">How long does processing take?</h4>
                        <p className="text-gray-400 text-sm">Processing typically takes 5-30 seconds depending on image size and complexity.</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-white">Can I enhance non-license plate images?</h4>
                        <p className="text-gray-400 text-sm">Yes, our system works on any image type, but is specially optimized for license plates.</p>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 mt-4"
                      onClick={() => document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' })}
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
