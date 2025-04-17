
import React, { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ImageComparisonProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
}

export function ImageComparison({ beforeImage, afterImage, className }: ImageComparisonProps) {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const newPosition = Math.min(100, Math.max(0, (x / rect.width) * 100));
      setPosition(newPosition);
    }
  }, [isDragging]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging) {
      const touch = e.touches[0];
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
      const newPosition = Math.min(100, Math.max(0, (x / rect.width) * 100));
      setPosition(newPosition);
    }
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);
    return () => {
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, [handleDragEnd]);

  return (
    <div 
      className={cn(
        'relative select-none overflow-hidden rounded-lg border border-gray-800', 
        className,
        isDragging && 'cursor-grabbing'
      )}
      onMouseMove={(e) => handleMouseMove(e as unknown as MouseEvent)}
      onTouchMove={(e) => handleTouchMove(e as unknown as TouchEvent)}
    >
      <div className="relative h-full w-full">
        {/* After Image (Bottom Layer) */}
        <img
          src={afterImage}
          alt="Enhanced"
          className="h-full w-full object-cover"
        />

        {/* Before Image (Clipped Layer) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <img
            src={beforeImage}
            alt="Original"
            className="h-full w-auto min-w-full object-cover"
            style={{ maxWidth: 'none', width: `${10000 / position}%`, position: 'absolute', left: 0 }}
          />
        </div>

        {/* Draggable Slider */}
        <div
          className="absolute inset-y-0"
          style={{ left: `${position}%` }}
        >
          <div className="absolute inset-y-0 -translate-x-1/2 w-1 bg-esrgan-orange" />
          
          <button
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            <div className="w-1 h-6 bg-esrgan-black rounded-full" />
          </button>

          <div className="absolute top-4 -translate-x-1/2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
            Original
          </div>
          
          <div className="absolute bottom-4 -translate-x-1/2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
            Enhanced
          </div>
        </div>
      </div>
    </div>
  );
}
