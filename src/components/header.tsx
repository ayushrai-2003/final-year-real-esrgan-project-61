
import React from 'react';
import { Button } from "@/components/ui/button";
import { Github, Info, Cpu } from "lucide-react";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="w-full border-b border-gray-800 bg-esrgan-black shadow-md sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-esrgan-orange to-red-600"></div>
            <Cpu className="h-6 w-6 text-esrgan-orange mr-2" />
            <span className="text-xl font-bold gradient-text">
              Real-ESRGAN Enhancer
            </span>
          </Link>
        </div>
        
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
                Home
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/training" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
                Training
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/upload" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
                Upload
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/about" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
                About
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/contact" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
                Contact
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        <div className="flex items-center gap-4">
          <Link to="/about">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Info className="mr-2 h-4 w-4" />
              About
            </Button>
          </Link>
          <a 
            href="https://github.com/ayushrai-2003" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}
