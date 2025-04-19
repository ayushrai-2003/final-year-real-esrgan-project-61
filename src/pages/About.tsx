
import React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, BookOpen } from "lucide-react";

const About = () => {
  return (
    <div className="flex min-h-screen flex-col bg-esrgan-black">
      <Header />
      
      <main className="flex-1">
        <section className="py-20 bg-esrgan-black-dark relative">
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
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
