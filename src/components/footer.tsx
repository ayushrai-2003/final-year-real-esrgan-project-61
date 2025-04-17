
import React from 'react';

export function Footer() {
  return (
    <footer className="w-full border-t border-gray-800 bg-esrgan-black py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-esrgan-orange to-red-600"></div>
            <span className="text-sm font-medium gradient-text">Real-ESRGAN Enhancer</span>
          </div>
          <p className="text-xs text-gray-400">
            Final Year Project - Image Quality Enhancement using ESRGAN
          </p>
        </div>
        
        <div className="flex flex-col items-center gap-1 text-center md:items-end md:text-right">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} - All rights reserved
          </p>
          <p className="text-xs text-gray-500">
            Powered by ESRGAN - Enhanced Super-Resolution Generative Adversarial Network
          </p>
        </div>
      </div>
    </footer>
  );
}
