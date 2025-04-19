
import React from 'react';
import { Button } from "@/components/ui/button";
import { Github, Info, UploadCloud } from "lucide-react";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="w-full border-b border-gray-800 bg-esrgan-black sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-esrgan-orange to-red-600"></div>
          <span className="text-xl font-bold gradient-text">
            Real-ESRGAN Enhancer
          </span>
        </div>
        
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <a href="#hero-section" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
                Home
              </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a href="#upload-section" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
                Upload
              </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a href="#about-section" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
                About
              </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a href="#contact-section" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
                Contact
              </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/training" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
                Training
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        <div className="flex items-center gap-4">
          <a href="#about-section">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Info className="mr-2 h-4 w-4" />
              About
            </Button>
          </a>
          <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </div>
      </div>
    </header>
  );
}
