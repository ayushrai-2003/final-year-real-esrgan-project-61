
import React from 'react';
import { Button } from "@/components/ui/button";
import { Github, Info } from "lucide-react";

export function Header() {
  return (
    <header className="w-full border-b border-gray-800 bg-esrgan-black">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-esrgan-orange to-red-600"></div>
          <span className="text-xl font-bold gradient-text">
            ImageEnhancer.AI
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Info className="mr-2 h-4 w-4" />
            About
          </Button>
          <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </div>
      </div>
    </header>
  );
}
