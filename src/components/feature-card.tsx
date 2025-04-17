
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
}

export function FeatureCard({ title, description, icon: Icon, className }: FeatureCardProps) {
  return (
    <div className={cn(
      "rounded-xl border border-gray-800 bg-esrgan-black-light p-6 transition-all hover:border-esrgan-orange/50 hover:shadow-[0_0_15px_rgba(255,69,0,0.15)]",
      className
    )}>
      <div className="mb-4 inline-flex rounded-lg bg-esrgan-black p-3">
        <Icon className="h-6 w-6 text-esrgan-orange" />
      </div>
      <h3 className="mb-2 text-xl font-medium text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
