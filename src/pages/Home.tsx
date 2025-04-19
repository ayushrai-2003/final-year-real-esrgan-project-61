
import React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/feature-card";
import { ArrowRight, ImagePlus, Zap, Sparkles, LayoutGrid, Download, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex min-h-screen flex-col bg-esrgan-black">
      <Header />
      
      <main className="flex-1">
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
                <Link to="/upload">
                  <Button 
                    size="lg" 
                    className="bg-esrgan-orange hover:bg-esrgan-orange/80 shadow-lg hover:shadow-xl transition-all"
                  >
                    Enhance Your Image
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-gray-700 text-white hover:bg-gray-800 transition-all"
                  >
                    Learn About ESRGAN
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-esrgan-orange/10 rounded-full blur-3xl"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"></div>
        </section>

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
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
