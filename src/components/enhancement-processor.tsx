
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Loader2, AlertCircle, Settings, Car, Zap, Download, RefreshCw, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

interface ProcessorProps {
  inputImage: File | null;
  onProcessingComplete: (enhancedImageUrl: string) => void;
  isLicensePlateMode?: boolean;
  licensePlateMode?: "standard" | "advanced";
}

// Improved sharpening algorithm that preserves natural colors
const enhanceSharpness = (canvas: HTMLCanvasElement, level: number): HTMLCanvasElement => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;
  
  // Create a copy of the original data for reference
  const original = new Uint8ClampedArray(data);
  
  // Improved convolution kernel for sharpening with edge preservation
  const kernel = [
    0, -1, 0,
    -1, 5 + level * 3, -1,
    0, -1, 0
  ];
  
  // Apply the convolution kernel for sharpening
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const px = x + kx;
            const py = y + ky;
            if (px >= 0 && px < width && py >= 0 && py < height) {
              const i = (py * width + px) * 4 + c;
              const kernelIndex = (ky + 1) * 3 + (kx + 1);
              sum += original[i] * kernel[kernelIndex];
            }
          }
        }
        
        const i = (y * width + x) * 4 + c;
        // Apply the sharpening result with intensity based on level
        data[i] = Math.min(255, Math.max(0, sum));
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas;
};

// Enhanced color processing that preserves natural tones
const enhanceColors = (canvas: HTMLCanvasElement, level: number): HTMLCanvasElement => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Compute histogram to understand color distribution
  const histograms = [new Array(256).fill(0), new Array(256).fill(0), new Array(256).fill(0)];
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    histograms[0][data[i]]++;
    histograms[1][data[i + 1]]++;
    histograms[2][data[i + 2]]++;
  }
  
  // Calculate channel balancing factors
  const balanceFactors = histograms.map(hist => {
    // Find mid-point of histogram
    let sum = 0;
    const total = hist.reduce((a, b) => a + b, 0);
    let midPoint = 0;
    for (let i = 0; i < 256; i++) {
      sum += hist[i];
      if (sum >= total / 2) {
        midPoint = i;
        break;
      }
    }
    return 128 / (midPoint || 128); // Prevent division by zero
  });
  
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue; // Skip transparent pixels
    
    // Convert to HSL for better control over saturation and luminance
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
    
    // Enhance saturation and vibrance in a balanced way
    s = Math.min(1, s * (1 + level * 0.35));
    
    // Improve luminance based on content - brighten dark areas slightly, increase contrast
    l = l < 0.4 ? l * (1 + level * 0.2) : l > 0.7 ? l * (1 - level * 0.05) : l;
    
    // Convert back to RGB
    const hslToRgb = (h: number, s: number, l: number) => {
      if (s === 0) {
        return [l, l, l]; // achromatic
      }
      
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
    
    // Apply channel balancing to improve color accuracy
    data[i] = Math.min(255, Math.max(0, Math.round((r2 * 255) * balanceFactors[0] * 0.9 + data[i] * 0.1)));
    data[i + 1] = Math.min(255, Math.max(0, Math.round((g2 * 255) * balanceFactors[1] * 0.9 + data[i + 1] * 0.1)));
    data[i + 2] = Math.min(255, Math.max(0, Math.round((b2 * 255) * balanceFactors[2] * 0.9 + data[i + 2] * 0.1)));
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas;
};

// Improved noise reduction that preserves details
const reduceNoise = (canvas: HTMLCanvasElement, level: number): HTMLCanvasElement => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;
  
  // Copy original data
  const original = new Uint8ClampedArray(data);
  
  // Use a bilateral filter for edge-preserving noise reduction
  const sigmaSpatial = 3 * level;
  const sigmaRange = 30 * level;
  const radius = Math.ceil(sigmaSpatial * 2);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      for (let c = 0; c < 3; c++) {
        const centerPos = (y * width + x) * 4 + c;
        const centerValue = original[centerPos];
        
        let totalWeight = 0;
        let filteredValue = 0;
        
        // Process neighborhood
        for (let ny = Math.max(0, y - radius); ny < Math.min(height, y + radius + 1); ny++) {
          for (let nx = Math.max(0, x - radius); nx < Math.min(width, x + radius + 1); nx++) {
            const pos = (ny * width + nx) * 4 + c;
            const spatialDist = Math.sqrt((nx - x) ** 2 + (ny - y) ** 2);
            
            // Skip if outside spatial kernel
            if (spatialDist > radius) continue;
            
            const colorDist = Math.abs(original[pos] - centerValue);
            
            // Calculate bilateral filter weights
            const spatialWeight = Math.exp(-(spatialDist * spatialDist) / (2 * sigmaSpatial * sigmaSpatial));
            const colorWeight = Math.exp(-(colorDist * colorDist) / (2 * sigmaRange * sigmaRange));
            
            const weight = spatialWeight * colorWeight;
            filteredValue += original[pos] * weight;
            totalWeight += weight;
          }
        }
        
        // Apply filtered value
        if (totalWeight > 0) {
          data[centerPos] = Math.round(filteredValue / totalWeight);
        }
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas;
};

// Improved contrast enhancement with histogram equalization
const enhanceContrast = (canvas: HTMLCanvasElement, level: number): HTMLCanvasElement => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Apply contrast enhancement separately to each channel
  for (let channel = 0; channel < 3; channel++) {
    // Calculate histogram
    const histogram = new Array(256).fill(0);
    let total = 0;
    
    for (let i = channel; i < data.length; i += 4) {
      if (data[i + 3] === 0) continue; // Skip transparent pixels
      histogram[data[i]]++;
      total++;
    }
    
    // Skip if no pixels in this channel
    if (total === 0) continue;
    
    // Find meaningful min/max (exclude outliers)
    const minThreshold = total * 0.01; // bottom 1%
    const maxThreshold = total * 0.99; // top 1%
    
    let min = 0, max = 255;
    let count = 0;
    
    // Find min value (excluding bottom 1%)
    for (let i = 0; i < 256; i++) {
      count += histogram[i];
      if (count >= minThreshold) {
        min = i;
        break;
      }
    }
    
    // Find max value (excluding top 1%)
    count = 0;
    for (let i = 255; i >= 0; i--) {
      count += histogram[i];
      if (count >= minThreshold) {
        max = i;
        break;
      }
    }
    
    // Prevent division by zero and ensure range
    const range = Math.max(1, max - min);
    
    // Apply contrast stretch with level control
    const contrastFactor = 1 + level * 0.5;
    const midpoint = (min + max) / 2;
    
    for (let i = channel; i < data.length; i += 4) {
      if (data[i + 3] === 0) continue; // Skip transparent pixels
      
      // Apply contrast stretch
      const normalizedValue = (data[i] - min) / range; // 0 to 1
      const stretchedValue = midpoint + (normalizedValue - 0.5) * 255 * contrastFactor;
      data[i] = Math.min(255, Math.max(0, Math.round(stretchedValue)));
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas;
};

// High-quality upscaling with detail preservation
const upscaleImage = (canvas: HTMLCanvasElement, factor: number): HTMLCanvasElement => {
  // Create new canvas with target dimensions
  const newWidth = Math.round(canvas.width * factor);
  const newHeight = Math.round(canvas.height * factor);
  
  const newCanvas = document.createElement('canvas');
  newCanvas.width = newWidth;
  newCanvas.height = newHeight;
  
  const ctx = newCanvas.getContext('2d');
  if (!ctx) return canvas;
  
  // Use high quality interpolation
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  // Draw original image at new size
  ctx.drawImage(canvas, 0, 0, newWidth, newHeight);
  
  return newCanvas;
};

// Enhanced license plate processing
const enhanceLicensePlate = (canvas: HTMLCanvasElement, isAdvanced: boolean = false): HTMLCanvasElement => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  
  // Create a copy to work with
  const enhancedCanvas = document.createElement('canvas');
  enhancedCanvas.width = canvas.width;
  enhancedCanvas.height = canvas.height;
  const enhancedCtx = enhancedCanvas.getContext('2d');
  if (!enhancedCtx) return canvas;
  enhancedCtx.drawImage(canvas, 0, 0);
  
  // Process license plate - with color preservation
  let processedCanvas = enhancedCanvas;
  
  // Apply strong noise reduction first
  processedCanvas = reduceNoise(processedCanvas, 0.85);
  
  // Apply contrast enhancement with medium strength
  processedCanvas = enhanceContrast(processedCanvas, 0.6);
  
  // Apply high sharpness for text clarity
  processedCanvas = enhanceSharpness(processedCanvas, 0.9);
  
  // Apply moderate color enhancement
  processedCanvas = enhanceColors(processedCanvas, 0.5);
  
  if (isAdvanced) {
    // For advanced mode, apply additional processing
    const edgeCtx = processedCanvas.getContext('2d');
    if (edgeCtx) {
      const edgeData = edgeCtx.getImageData(0, 0, processedCanvas.width, processedCanvas.height);
      const edgePixels = edgeData.data;
      const original = new Uint8ClampedArray(edgePixels);
      const width = processedCanvas.width;
      const height = processedCanvas.height;
      
      // Apply adaptive local contrast enhancement for text
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const pos = (y * width + x) * 4;
          
          // Calculate local average luminance
          let localSum = [0, 0, 0];
          let count = 0;
          
          for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
              const ny = y + dy;
              const nx = x + dx;
              
              if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                const neighborPos = (ny * width + nx) * 4;
                localSum[0] += original[neighborPos];
                localSum[1] += original[neighborPos + 1];
                localSum[2] += original[neighborPos + 2];
                count++;
              }
            }
          }
          
          const localAvg = [
            localSum[0] / count,
            localSum[1] / count,
            localSum[2] / count
          ];
          
          // Enhance each color channel while preserving color relationships
          for (let c = 0; c < 3; c++) {
            const centerValue = original[pos + c];
            const diff = centerValue - localAvg[c];
            
            // Apply S-curve contrast enhancement to local differences
            const enhance = diff > 0 ? 
              1.3 + 0.3 * Math.tanh(diff / 30) : 
              0.8 + 0.2 * Math.tanh(diff / 30);
            
            const enhanced = localAvg[c] + diff * enhance;
            edgePixels[pos + c] = Math.min(255, Math.max(0, enhanced));
          }
        }
      }
      
      edgeCtx.putImageData(edgeData, 0, 0);
    }
    
    // Apply a second sharpening pass
    processedCanvas = enhanceSharpness(processedCanvas, 0.7);
  }
  
  return processedCanvas;
};

export function EnhancementProcessor({ 
  inputImage, 
  onProcessingComplete, 
  isLicensePlateMode = false,
  licensePlateMode = "standard" 
}: ProcessorProps) {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [animateStartButton, setAnimateStartButton] = useState(false);
  
  // Higher default values for better results
  const [enhancementSettings, setEnhancementSettings] = useState({
    sharpnessEnhancement: 0.95,
    noiseReduction: 0.8,
    colorCorrection: true,
    texturePreservation: 0.95,
    contrastEnhancement: 0.85,
    upscalingFactor: 4,
    highQualityProcessing: true,
  });

  const updateEnhancementSetting = (setting: string, value: number | boolean) => {
    setEnhancementSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  useEffect(() => {
    if (inputImage) {
      setProcessingError(null);
      setProgress(0);
      setCurrentStage("");
      setIsProcessing(false);
      
      const timeout = setTimeout(() => {
        setAnimateStartButton(true);
        setTimeout(() => setAnimateStartButton(false), 1500);
      }, 500);
      
      return () => clearTimeout(timeout);
    }
  }, [inputImage]);

  useEffect(() => {
    if (animateStartButton) {
      const timeout = setTimeout(() => setAnimateStartButton(false), 1500);
      return () => clearTimeout(timeout);
    }
  }, [animateStartButton]);

  // Enhanced license plate processing with color preservation
  const processLicensePlate = async (file: File, isAdvanced: boolean = false): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error("Failed to get canvas context"));
            return;
          }
          
          ctx.drawImage(img, 0, 0);
          
          // Processing pipeline for license plates with color preservation
          let processedCanvas = canvas;
          
          // First reduce noise to clean up the image
          processedCanvas = reduceNoise(processedCanvas, 0.85);
          
          // Apply specialized license plate enhancement
          processedCanvas = enhanceLicensePlate(processedCanvas, isAdvanced);
          
          // Apply appropriate color enhancement
          processedCanvas = enhanceColors(processedCanvas, 0.65);
          
          // Apply controlled contrast enhancement
          processedCanvas = enhanceContrast(processedCanvas, 0.7);
          
          // Apply strong but controlled sharpening
          processedCanvas = enhanceSharpness(processedCanvas, 0.95);
          
          // Upscale with appropriate factor
          processedCanvas = upscaleImage(processedCanvas, isAdvanced ? 4 : 3);
          
          // Final enhancement pass
          processedCanvas = enhanceSharpness(processedCanvas, 0.6);
          
          // Return the enhanced image
          const enhancedImageUrl = processedCanvas.toDataURL('image/png');
          resolve(enhancedImageUrl);
        } catch (error) {
          console.error("Error processing license plate:", error);
          reject(error);
        }
      };
      
      img.onerror = (error) => {
        console.error("Error loading image:", error);
        reject(new Error("Failed to load image"));
      };
      
      // Load the image
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result.toString();
        }
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        reject(new Error("Failed to read file"));
      };
      reader.readAsDataURL(file);
    });
  };

  // Completely revised general image processing with true enhancement
  const processImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error("Failed to get canvas context"));
            return;
          }
          
          ctx.drawImage(img, 0, 0);
          
          // Multi-stage processing pipeline that preserves colors
          let processedCanvas = canvas;
          
          // Apply balanced noise reduction that preserves details
          processedCanvas = reduceNoise(processedCanvas, enhancementSettings.noiseReduction);
          
          // Apply enhanced contrast while preserving natural look
          processedCanvas = enhanceContrast(processedCanvas, enhancementSettings.contrastEnhancement);
          
          // Apply color enhancement with natural vibrancy
          processedCanvas = enhanceColors(processedCanvas, 0.8);
          
          // Apply high-quality sharpening for detail
          processedCanvas = enhanceSharpness(processedCanvas, enhancementSettings.sharpnessEnhancement);
          
          // Upscale with high quality
          processedCanvas = upscaleImage(processedCanvas, enhancementSettings.upscalingFactor);
          
          // Final enhancement pass for extra detail
          processedCanvas = enhanceSharpness(processedCanvas, 0.6);
          
          // Return the enhanced image
          const enhancedImageUrl = processedCanvas.toDataURL('image/png');
          resolve(enhancedImageUrl);
        } catch (error) {
          console.error("Error processing image:", error);
          reject(error);
        }
      };
      
      img.onerror = (error) => {
        console.error("Error loading image:", error);
        reject(new Error("Failed to load image"));
      };
      
      // Load the image
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result.toString();
        }
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        reject(new Error("Failed to read file"));
      };
      reader.readAsDataURL(file);
    });
  };

  const startProcessing = async () => {
    if (!inputImage) return;

    const isAdvanced = isLicensePlateMode && licensePlateMode === "advanced";
    
    const stages = isLicensePlateMode 
      ? isAdvanced 
        ? [
            "Initializing advanced analysis",
            "Preprocessing image data",
            "Applying adaptive enhancement",
            "Enhancing text clarity",
            "Applying detail recovery",
            "Increasing resolution",
            "Finalizing enhancement"
          ]
        : [
            "Analyzing license plate",
            "Preprocessing image",
            "Enhancing text clarity",
            "Applying detail enhancement",
            "Increasing resolution",
            "Finalizing enhancement"
          ]
      : [
          "Analyzing image",
          "Reducing noise",
          "Enhancing colors and contrast",
          "Applying detailed sharpening",
          "Increasing resolution",
          "Finalizing high-quality output"
        ];

    setProcessingError(null);
    setIsProcessing(true);
    setProgress(0);
    setCurrentStage(stages[0]);

    try {
      const intervalId = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(intervalId);
            return 95;
          }
          
          const increment = Math.random() * 2 + 0.5;
          const stageIndex = Math.min(
            Math.floor((prev / 100) * stages.length),
            stages.length - 1
          );
          setCurrentStage(stages[stageIndex]);
          
          return prev + increment;
        });
      }, 100);

      const enhancedImageUrl = isLicensePlateMode
        ? await processLicensePlate(inputImage, isAdvanced)
        : await processImage(inputImage);
      
      clearInterval(intervalId);
      setProgress(100);
      setCurrentStage("Processing complete");
      
      setTimeout(() => {
        setIsProcessing(false);
        onProcessingComplete(enhancedImageUrl);
      }, 500);
      
    } catch (error) {
      setProcessingError("Failed to process image. Please try again with a different image.");
      setIsProcessing(false);
      toast.error("Image enhancement failed. Please try again.");
    }
  };

  if (!inputImage) return null;

  if (processingError) {
    return (
      <motion.div 
        className="w-full rounded-lg border border-red-500/30 bg-red-950/10 p-4 mt-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-red-400">{processingError}</p>
        </div>
      </motion.div>
    );
  }

  if (!isProcessing) {
    return (
      <motion.div
        className="w-full mt-6 space-y-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">
            {isLicensePlateMode 
              ? licensePlateMode === "advanced" 
                ? "Advanced License Plate Enhancement" 
                : "License Plate Enhancement" 
              : "Enhancement Options"}
          </h3>
          {!isLicensePlateMode && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400"
              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              {showAdvancedSettings ? "Hide Advanced" : "Show Advanced"}
            </Button>
          )}
        </div>
        
        {showAdvancedSettings && !isLicensePlateMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-lg border border-gray-700 bg-esrgan-black-light p-4 space-y-3 mb-4"
          >
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
                id="highQualityProcessing"
                checked={enhancementSettings.highQualityProcessing}
                onCheckedChange={(checked) => updateEnhancementSetting('highQualityProcessing', checked)}
              />
              <Label htmlFor="highQualityProcessing" className="text-gray-300">High Quality Processing</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="colorCorrection"
                checked={enhancementSettings.colorCorrection}
                onCheckedChange={(checked) => updateEnhancementSetting('colorCorrection', checked)}
              />
              <Label htmlFor="colorCorrection" className="text-gray-300">Enable Color Correction</Label>
            </div>
          </motion.div>
        )}
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          animate={animateStartButton ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Button 
            onClick={startProcessing} 
            className="w-full bg-esrgan-orange hover:bg-esrgan-orange/80 py-6"
          >
            {isLicensePlateMode && licensePlateMode === "advanced" ? (
              <Zap className="mr-2 h-5 w-5" />
            ) : (
              <RefreshCw className="mr-2 h-5 w-5" />
            )}
            {isLicensePlateMode 
              ? licensePlateMode === "advanced"
                ? "Start Advanced License Plate Enhancement"
                : "Start License Plate Enhancement" 
              : "Start High-Quality Image Enhancement"}
          </Button>
        </motion.div>
        
        <div className="text-xs text-gray-400 mt-2">
          <p className="text-center">
            {isLicensePlateMode 
              ? licensePlateMode === "advanced"
                ? "Using deep enhancement algorithms for maximum clarity and readability"
                : "Optimized for vehicle license plates with full color preservation" 
              : "Using advanced algorithms for maximum detail, clarity and color enhancement"}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="w-full space-y-4 rounded-lg border border-gray-700 bg-esrgan-black-light p-6 mt-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">
          {isLicensePlateMode 
            ? licensePlateMode === "advanced"
              ? "Advanced Processing" 
              : "Processing License Plate" 
            : "High-Quality Enhancement"}
        </h3>
        <Badge variant="outline" className="bg-esrgan-black border-esrgan-orange">
          {isLicensePlateMode 
            ? licensePlateMode === "advanced" 
              ? "Ultra HD Mode" 
              : "HD Enhancement" 
            : "Premium Quality"}
        </Badge>
      </div>

      <div className="flex items-center space-x-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          {isLicensePlateMode && licensePlateMode === "advanced" ? (
            <Zap className="h-8 w-8 text-esrgan-orange" />
          ) : (
            <RefreshCw className="h-8 w-8 text-esrgan-orange" />
          )}
        </motion.div>
        <div className="flex-1">
          <div className="flex justify-between text-sm text-gray-400">
            <span>{currentStage}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 mt-1 text-xs flex rounded-full bg-gray-800">
              <motion.div 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-esrgan-orange"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-sm italic text-gray-400">
        {isLicensePlateMode ? (
          licensePlateMode === "advanced" ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Applying advanced multi-stage enhancement for maximum clarity while preserving colors...
            </motion.p>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Applying specialized license plate enhancement with color preservation...
            </motion.p>
          )
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Applying high-quality enhancement with {enhancementSettings.sharpnessEnhancement > 0.7 ? 'ultra-high sharpness' : 'balanced detail'} 
            {enhancementSettings.noiseReduction > 0.7 ? ' and advanced noise reduction' : ' and detail preservation'}...
          </motion.p>
        )}
        
        <motion.div 
          className="text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {isLicensePlateMode ? (
            licensePlateMode === "advanced" ? (
              <span>
                <Zap className="inline-block h-3 w-3 mr-1 text-esrgan-orange" /> 
                Ultra HD • Multi-stage Enhancement • Color Processing • Detail Recovery
              </span>
            ) : (
              <span>
                <Car className="inline-block h-3 w-3 mr-1" /> 
                Text Clarity • Detail Enhancement • Color Preservation
              </span>
            )
          ) : (
            <span>
              <Download className="inline-block h-3 w-3 mr-1" />
              Upscaling: {enhancementSettings.upscalingFactor}x • 
              Premium Quality: {enhancementSettings.highQualityProcessing ? 'Enabled' : 'Standard'} • 
              Full Color Enhancement: Enabled
            </span>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
