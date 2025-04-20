
import React from 'react';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col bg-esrgan-black">
      <Header />
      
      <main className="flex-1 flex items-center justify-center">
        <div className="container">
          <div className="mx-auto max-w-md text-center">
            <h1 className="text-9xl font-bold text-esrgan-orange">404</h1>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Page not found</h2>
            <p className="mt-6 text-base leading-7 text-gray-400">
              Sorry, we couldn't find the page you're looking for.
            </p>
            <div className="mt-10 flex items-center justify-center gap-6">
              <Link to="/">
                <Button className="bg-esrgan-orange hover:bg-esrgan-orange/80">
                  <Home className="mr-2 h-4 w-4" />
                  Go back home
                </Button>
              </Link>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800" onClick={() => window.history.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go back
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
