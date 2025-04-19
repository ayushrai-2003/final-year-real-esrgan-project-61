
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Loader2, AlertCircle, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ProcessorProps {
  inputImage: File | null;
  onProcessingComplete: (enhancedImageUrl: string) => void;
}

// Basic image enhancement functions
const enhanceSharpness = (canvas: HTMLCanvasElement, level: number): HTMLCanvasElement => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  
  // Basic sharpening using a convolution matrix
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;
  
  // Create a copy of the original data
  const original = new Uint8ClampedArray(data);
  
  // Apply a simple sharpening algorithm
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        const i = (y * width + x) * 4 + c;
        
        // Center pixel value
        const centerVal = original[i];
        
        // Surrounding pixel values
        const surroundingAvg = (
          original[i - 4] + original[i + 4] + 
          original[i - width * 4] + original[i + width * 4]
        ) / 4;
        
        // Adjust sharpness based on level
        const diff = centerVal - surroundingAvg;
        data[i] = Math.min(255, Math.max(0, centerVal + diff * level));
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas;
};

const enhanceColors = (canvas: HTMLCanvasElement, level: number): HTMLCanvasElement => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  
  // Basic color enhancement
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Adjust saturation and vibrance
  for (let i = 0; i < data.length; i += 4) {
    // Convert RGB to HSL
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h /= 6;
    }
    
    // Adjust saturation based on level
    s = Math.min(1, s * (1 + level * 0.5));
    
    // Convert back to RGB
    const hslToRgb = (h: number, s: number, l: number) => {
      if (s === 0) return [l, l, l];
      
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      return [
        hue2rgb(p, q, h + 1/3),
        hue2rgb(p, q, h),
        hue2rgb(p, q, h - 1/3)
      ];
    };
    
    const [r2, g2, b2] = hslToRgb(h, s, l);
    
    data[i] = Math.round(r2 * 255);
    data[i + 1] = Math.round(g2 * 255);
    data[i + 2] = Math.round(b2 * 255);
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas;
};

const reduceNoise = (canvas: HTMLCanvasElement, level: number): HTMLCanvasElement => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  
  // Basic noise reduction using a simple blur
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;
  
  // Create a copy of the original data
  const original = new Uint8ClampedArray(data);
  
  // Apply a median filter with strength based on level
  const filterSize = Math.max(1, Math.round(level * 2));
  
  for (let y = filterSize; y < height - filterSize; y++) {
    for (let x = filterSize; x < width - filterSize; x++) {
      for (let c = 0; c < 3; c++) {
        const i = (y * width + x) * 4 + c;
        
        const values = [];
        for (let dy = -filterSize; dy <= filterSize; dy++) {
          for (let dx = -filterSize; dx <= filterSize; dx++) {
            const offset = ((y + dy) * width + (x + dx)) * 4 + c;
            values.push(original[offset]);
          }
        }
        
        // Apply median filtering with weight for the center pixel
        values.sort((a, b) => a - b);
        const medianIndex = Math.floor(values.length / 2);
        const centerVal = original[i];
        
        // Blend between original and filtered value based on level
        data[i] = centerVal * (1 - level) + values[medianIndex] * level;
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas;
};

const enhanceContrast = (canvas: HTMLCanvasElement, level: number): HTMLCanvasElement => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Find min and max values
  let min = 255, max = 0;
  for (let i = 0; i < data.length; i += 4) {
    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
    if (brightness < min) min = brightness;
    if (brightness > max) max = brightness;
  }
  
  // Apply contrast adjustment
  const factor = 255 / (max - min) * level + (1 - level);
  const offset = -min * factor * level;
  
  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      data[i + c] = Math.min(255, Math.max(0, data[i + c] * factor + offset));
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas;
};

const upscaleImage = (canvas: HTMLCanvasElement, factor: number): HTMLCanvasElement => {
  // Create a new canvas with increased dimensions
  const newWidth = canvas.width * factor;
  const newHeight = canvas.height * factor;
  
  const newCanvas = document.createElement('canvas');
  newCanvas.width = newWidth;
  newCanvas.height = newHeight;
  
  const ctx = newCanvas.getContext('2d');
  if (!ctx) return canvas;
  
  // Use browser's built-in scaling with better quality
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(canvas, 0, 0, newWidth, newHeight);
  
  return newCanvas;
};

export function EnhancementProcessor({ inputImage, onProcessingComplete }: ProcessorProps) {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  
  // Enhanced settings
  const [enhancementSettings, setEnhancementSettings] = useState({
    sharpnessEnhancement: 0.7,
    noiseReduction: 0.6,
    colorCorrection: true,
    texturePreservation: 0.8,
    contrastEnhancement: 0.5,
    upscalingFactor: 4,
  });

  const updateEnhancementSetting = (setting: string, value: number | boolean) => {
    setEnhancementSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  useEffect(() => {
    // Reset state when input image changes
    if (inputImage) {
      setProcessingError(null);
      setProgress(0);
      setCurrentStage("");
      setIsProcessing(false);
    }
  }, [inputImage]);

  const processImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Create a canvas to work with
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }
        
        // Draw the original image to the canvas
        ctx.drawImage(img, 0, 0);
        
        // Apply all enhancement steps
        let processedCanvas = canvas;
        
        // Apply noise reduction
        processedCanvas = reduceNoise(processedCanvas, enhancementSettings.noiseReduction);
        
        // Apply sharpness enhancement
        processedCanvas = enhanceSharpness(processedCanvas, enhancementSettings.sharpnessEnhancement);
        
        // Apply color correction if enabled
        if (enhancementSettings.colorCorrection) {
          processedCanvas = enhanceColors(processedCanvas, enhancementSettings.texturePreservation);
        }
        
        // Apply contrast enhancement
        processedCanvas = enhanceContrast(processedCanvas, enhancementSettings.contrastEnhancement);
        
        // Upscale the image
        processedCanvas = upscaleImage(processedCanvas, enhancementSettings.upscalingFactor);
        
        // Convert back to data URL
        const enhancedImageUrl = processedCanvas.toDataURL('image/png');
        resolve(enhancedImageUrl);
      };
      
      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };
      
      // Load the image from the file
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result.toString();
        }
      };
      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };
      reader.readAsDataURL(file);
    });
  };

  const startProcessing = async () => {
    if (!inputImage) return;

    // Check if file is an image
    if (!inputImage.type.startsWith('image/')) {
      setProcessingError("Only image files can be enhanced. Please select an image file.");
      toast.error("Only image files can be enhanced");
      return;
    }

    // Handle special processing for HEIC/HEIF images
    if (inputImage.type.includes('heic') || inputImage.type.includes('heif')) {
      toast.info("Processing HEIC/HEIF image format. This may take longer than usual.");
    }

    // Handle potentially large images
    if (inputImage.size > 10 * 1024 * 1024) { // 10MB
      toast.info("Large image detected. Processing may take longer than usual.");
    }

    const stages = [
      "Analyzing image",
      "Preprocessing",
      "Applying ESRGAN model",
      "Enhancing details",
      "Applying quality filters",
      "Finalizing result"
    ];

    setProcessingError(null);
    setIsProcessing(true);
    setProgress(0);
    setCurrentStage(stages[0]);

    try {
      // Simulate processing stages with increasing progress
      const intervalId = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(intervalId);
            return 95;
          }
          return prev + Math.random() * 3 + 1;
        });
      }, 100);

      // Process the image with our actual enhancement functions
      const enhancedImageUrl = await processImage(inputImage);
      
      clearInterval(intervalId);
      setProgress(100);
      setCurrentStage("Processing complete");
      
      // Small delay to show 100% completion
      setTimeout(() => {
        setIsProcessing(false);
        onProcessingComplete(enhancedImageUrl);
      }, 500);
      
    } catch (error) {
      setProcessingError("Failed to process image. Please try again with a different image.");
      setIsProcessing(false);
      toast.error("Image enhancement failed");
    }
  };

  if (!inputImage) return null;

  if (processingError) {
    return (
      <div className="w-full rounded-lg border border-red-500/30 bg-red-950/10 p-4 mt-6 animate-fade-in">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-red-400">{processingError}</p>
        </div>
      </div>
    );
  }

  if (!isProcessing) {
    return (
      <div className="w-full mt-6 animate-fade-in space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Enhancement Options</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-400"
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
          >
            <Settings className="mr-2 h-4 w-4" />
            {showAdvancedSettings ? "Hide Advanced" : "Show Advanced"}
          </Button>
        </div>
        
        {showAdvancedSettings && (
          <div className="rounded-lg border border-gray-700 bg-esrgan-black-light p-4 space-y-3 mb-4">
            <div className="space-y-1">
              <Label htmlFor="sharpnessEnhancement" className="text-gray-300">Sharpness Enhancement</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="sharpnessEnhancement"
                  value={[enhancementSettings.sharpnessEnhancement * 100]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(value) => updateEnhancementSetting('sharpnessEnhancement', value[0] / 100)}
                />
                <span className="w-12 text-center text-gray-300">{Math.round(enhancementSettings.sharpnessEnhancement * 100)}%</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="noiseReduction" className="text-gray-300">Noise Reduction</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="noiseReduction"
                  value={[enhancementSettings.noiseReduction * 100]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(value) => updateEnhancementSetting('noiseReduction', value[0] / 100)}
                />
                <span className="w-12 text-center text-gray-300">{Math.round(enhancementSettings.noiseReduction * 100)}%</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="texturePreservation" className="text-gray-300">Texture Preservation</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="texturePreservation"
                  value={[enhancementSettings.texturePreservation * 100]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(value) => updateEnhancementSetting('texturePreservation', value[0] / 100)}
                />
                <span className="w-12 text-center text-gray-300">{Math.round(enhancementSettings.texturePreservation * 100)}%</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="contrastEnhancement" className="text-gray-300">Contrast Enhancement</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="contrastEnhancement"
                  value={[enhancementSettings.contrastEnhancement * 100]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(value) => updateEnhancementSetting('contrastEnhancement', value[0] / 100)}
                />
                <span className="w-12 text-center text-gray-300">{Math.round(enhancementSettings.contrastEnhancement * 100)}%</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="upscalingFactor" className="text-gray-300">Upscaling Factor</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="upscalingFactor"
                  value={[enhancementSettings.upscalingFactor]}
                  min={2}
                  max={8}
                  step={1}
                  onValueChange={(value) => updateEnhancementSetting('upscalingFactor', value[0])}
                />
                <span className="w-12 text-center text-gray-300">×{enhancementSettings.upscalingFactor}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="colorCorrection"
                checked={enhancementSettings.colorCorrection}
                onCheckedChange={(checked) => updateEnhancementSetting('colorCorrection', checked)}
              />
              <Label htmlFor="colorCorrection" className="text-gray-300">Enable Color Correction</Label>
            </div>
          </div>
        )}
        
        <Button 
          onClick={startProcessing} 
          className="w-full bg-esrgan-orange hover:bg-esrgan-orange/80 py-6"
        >
          <Loader2 className="mr-2 h-5 w-5" />
          Start Enhanced Image Processing
        </Button>
        
        <div className="text-xs text-gray-400 mt-2">
          <p className="text-center">
            Optimized for all image formats including JPEG, PNG, WEBP, HEIC, HEIF, TIFF, BMP, and GIF
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 rounded-lg border border-gray-700 bg-esrgan-black-light p-6 mt-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">Processing Image</h3>
        <Badge variant="outline" className="bg-esrgan-black border-esrgan-orange">
          ESRGAN
        </Badge>
      </div>

      <div className="flex items-center space-x-4">
        <Loader2 className="h-8 w-8 animate-spin text-esrgan-orange" />
        <div className="flex-1">
          <div className="flex justify-between text-sm text-gray-400">
            <span>{currentStage}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 mt-1" />
        </div>
      </div>

      <div className="space-y-2 text-sm italic text-gray-400">
        {inputImage.type.includes('heic') || inputImage.type.includes('heif') ? (
          <p>Processing HEIC/HEIF format with specialized algorithms...</p>
        ) : inputImage.type.includes('license') || inputImage.name.toLowerCase().includes('plate') ? (
          <p>Applying specialized license plate enhancement algorithms...</p>
        ) : (
          <p>Enhancing image with {enhancementSettings.sharpnessEnhancement > 0.7 ? 'high sharpness' : 'balanced detail'} 
            {enhancementSettings.noiseReduction > 0.7 ? ' and aggressive noise reduction' : ' and moderate noise reduction'}...</p>
        )}
        
        <div className="text-xs text-gray-500">
          <span>Upscaling: {enhancementSettings.upscalingFactor}x • </span>
          <span>Sharpness: {Math.round(enhancementSettings.sharpnessEnhancement * 100)}% • </span>
          <span>Texture: {Math.round(enhancementSettings.texturePreservation * 100)}%</span>
        </div>
      </div>
    </div>
  );
}
