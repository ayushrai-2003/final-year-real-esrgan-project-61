
import React, { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, BookOpen, Info } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    toast.success("Thank you! Your message has been sent successfully.");
    
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
        <section className="py-20 relative">
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

export default Contact;
