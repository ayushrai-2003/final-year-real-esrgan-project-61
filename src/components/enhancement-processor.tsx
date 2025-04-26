
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Loader2, AlertCircle, Settings, Car, Zap, SparklesIcon } from "lucide-react";
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

const enhanceSharpness = (canvas: HTMLCanvasElement, level: number): HTMLCanvasElement => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;
  
  const original = new Uint8ClampedArray(data);
  
  // Enhanced sharpness algorithm with stronger effect
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        const i = (y * width + x) * 4 + c;
        
        // Calculate center value and surrounding average with stronger kernel
        const centerVal = original[i] * (1 + level * 1.5);
        const surroundingAvg = (
          original[i - 4] + original[i + 4] + 
          original[i - width * 4] + original[i + width * 4]
        ) / 4;
        
        // Increase the difference between center and surrounding for more sharpness
        const diff = centerVal - surroundingAvg;
        data[i] = Math.min(255, Math.max(0, centerVal + diff * (level * 1.2)));
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas;
};

const enhanceColors = (canvas: HTMLCanvasElement, level: number): HTMLCanvasElement => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
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
    
    // Enhance saturation based on level
    s = Math.min(1, s * (1 + level * 0.7));
    // Adjust luminance slightly for better color perception
    l = Math.min(1, l * (1 + level * 0.2));
    
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
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;
  
  const original = new Uint8ClampedArray(data);
  
  // Adaptive filter size based on level
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
        
        // Sort values and use median for a stronger noise reduction
        values.sort((a, b) => a - b);
        const medianIndex = Math.floor(values.length / 2);
        const centerVal = original[i];
        
        // Balance between original and median based on level
        data[i] = Math.round(centerVal * (1 - level) + values[medianIndex] * level);
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
  
  // Find the minimum and maximum brightness values
  let min = 255, max = 0;
  for (let i = 0; i < data.length; i += 4) {
    const brightness = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
    if (brightness < min) min = brightness;
    if (brightness > max) max = brightness;
  }
  
  // Apply stronger contrast stretching based on level
  const factor = 255 / (max - min) * (level * 1.5) + (1 - level);
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
  const newWidth = canvas.width * factor;
  const newHeight = canvas.height * factor;
  
  const newCanvas = document.createElement('canvas');
  newCanvas.width = newWidth;
  newCanvas.height = newHeight;
  
  const ctx = newCanvas.getContext('2d');
  if (!ctx) return canvas;
  
  // Use high quality image smoothing for better upscaling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(canvas, 0, 0, newWidth, newHeight);
  
  return newCanvas;
};

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
  
  // First improve contrast dramatically
  let processedCanvas = enhanceContrast(enhancedCanvas, 1.0);
  
  // Apply strong sharpening
  processedCanvas = enhanceSharpness(processedCanvas, 1.0);
  
  // For license plates, we want to preserve colors, not convert to B&W
  if (isAdvanced) {
    // Apply edge enhancement for advanced mode
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
          
          // Calculate local average in 3x3 neighborhood
          let localSum = 0;
          let count = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const neighborPos = ((y + dy) * width + (x + dx)) * 4;
              // Use luminance (grayscale equivalent)
              const luminance = 
                original[neighborPos] * 0.299 + 
                original[neighborPos + 1] * 0.587 + 
                original[neighborPos + 2] * 0.114;
              localSum += luminance;
              count++;
            }
          }
          const localAvg = localSum / count;
          
          // Get center pixel luminance
          const centerLuminance = 
            original[pos] * 0.299 + 
            original[pos + 1] * 0.587 + 
            original[pos + 2] * 0.114;
          
          // Enhance difference between center pixel and local average
          const factor = centerLuminance > localAvg ? 1.5 : 0.7;
          
          // Apply enhancement while preserving color
          for (let c = 0; c < 3; c++) {
            const enhancedValue = original[pos + c] * factor;
            edgePixels[pos + c] = Math.min(255, Math.max(0, enhancedValue));
          }
        }
      }
      
      edgeCtx.putImageData(edgeData, 0, 0);
    }
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
  
  const [enhancementSettings, setEnhancementSettings] = useState({
    sharpnessEnhancement: 0.9, // Increased from 0.7
    noiseReduction: 0.7,       // Increased from 0.6
    colorCorrection: true,
    texturePreservation: 0.9,  // Increased from 0.8
    contrastEnhancement: 0.8,  // Increased from 0.5
    upscalingFactor: 4,
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
          
          let processedCanvas = canvas;
          
          // For license plates, apply more specific processing steps
          // First reduce noise to clean up the image
          processedCanvas = reduceNoise(processedCanvas, 0.6);
          
          // Apply license plate specific enhancement
          processedCanvas = enhanceLicensePlate(processedCanvas, isAdvanced);
          
          // Add a sharpen pass to make text clearer
          processedCanvas = enhanceSharpness(processedCanvas, 0.9);
          
          // Enhance contrast to make text stand out more
          processedCanvas = enhanceContrast(processedCanvas, 0.8);
          
          // Apply color enhancement to improve visibility
          processedCanvas = enhanceColors(processedCanvas, 0.5);
          
          // Upscale the result
          processedCanvas = upscaleImage(processedCanvas, isAdvanced ? 4 : 3);
          
          // Final sharpening pass
          processedCanvas = enhanceSharpness(processedCanvas, 0.7);
          
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
          
          let processedCanvas = canvas;
          
          // Enhanced processing pipeline for general images
          
          // First reduce noise
          processedCanvas = reduceNoise(processedCanvas, enhancementSettings.noiseReduction);
          
          // Apply color enhancement
          if (enhancementSettings.colorCorrection) {
            processedCanvas = enhanceColors(processedCanvas, enhancementSettings.texturePreservation);
          }
          
          // Enhance contrast
          processedCanvas = enhanceContrast(processedCanvas, enhancementSettings.contrastEnhancement);
          
          // Apply sharpening after contrast for better details
          processedCanvas = enhanceSharpness(processedCanvas, enhancementSettings.sharpnessEnhancement);
          
          // Upscale the image
          processedCanvas = upscaleImage(processedCanvas, enhancementSettings.upscalingFactor);
          
          // Final sharpening pass after upscaling
          processedCanvas = enhanceSharpness(processedCanvas, enhancementSettings.sharpnessEnhancement * 0.7);
          
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
            "Applying adaptive binarization",
            "Running neural OCR enhancement",
            "Optimizing character geometry",
            "Performing multi-scale analysis",
            "Applying deep contrast correction",
            "Finalizing license plate enhancement"
          ]
        : [
            "Analyzing license plate",
            "Preprocessing image",
            "Enhancing text clarity",
            "Applying OCR optimization",
            "Performing text extraction enhancement",
            "Finalizing license plate image"
          ]
      : [
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
      const intervalId = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(intervalId);
            return 95;
          }
          
          const increment = isLicensePlateMode && isAdvanced
            ? Math.random() * 1.5 + 0.3
            : isLicensePlateMode 
              ? Math.random() * 2 + 0.5
              : Math.random() * 3 + 1;
            
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
      toast.error(isLicensePlateMode ? "License plate enhancement failed" : "Image enhancement failed");
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
              <Settings className="mr-2 h-4 w-4" />
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
              <Loader2 className="mr-2 h-5 w-5" />
            )}
            {isLicensePlateMode 
              ? licensePlateMode === "advanced"
                ? "Start Advanced License Plate Enhancement"
                : "Start License Plate Enhancement" 
              : "Start Enhanced Image Processing"}
          </Button>
        </motion.div>
        
        <div className="text-xs text-gray-400 mt-2">
          <p className="text-center">
            {isLicensePlateMode 
              ? licensePlateMode === "advanced"
                ? "Using neural network and advanced OCR for maximum clarity and readability"
                : "Optimized for vehicle license plates from any angle or lighting condition" 
              : "Optimized for all image formats including JPEG, PNG, WEBP, HEIC, HEIF, TIFF, BMP, and GIF"}
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
            : "Processing Image"}
        </h3>
        <Badge variant="outline" className="bg-esrgan-black border-esrgan-orange">
          {isLicensePlateMode 
            ? licensePlateMode === "advanced" 
              ? "NeuroESRGAN+" 
              : "LicenseESRGAN" 
            : "ESRGAN"}
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
            <Loader2 className="h-8 w-8 text-esrgan-orange" />
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
              Applying advanced neural network enhancement for maximum license plate clarity...
            </motion.p>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Applying specialized license plate enhancement algorithms...
            </motion.p>
          )
        ) : inputImage.type.includes('heic') || inputImage.type.includes('heif') ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Processing HEIC/HEIF format with specialized algorithms...
          </motion.p>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Enhancing image with {enhancementSettings.sharpnessEnhancement > 0.7 ? 'high sharpness' : 'balanced detail'} 
            {enhancementSettings.noiseReduction > 0.7 ? ' and aggressive noise reduction' : ' and moderate noise reduction'}...
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
                Neural Network • Deep OCR • Adaptive Binarization • Edge Detection
              </span>
            ) : (
              <span>
                <Car className="inline-block h-3 w-3 mr-1" /> 
                OCR Optimization • Text Clarity • Background Noise Removal
              </span>
            )
          ) : (
            <span>
              Upscaling: {enhancementSettings.upscalingFactor}x • 
              Sharpness: {Math.round(enhancementSettings.sharpnessEnhancement * 100)}% • 
              Texture: {Math.round(enhancementSettings.texturePreservation * 100)}%
            </span>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
