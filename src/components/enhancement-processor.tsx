
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

  const startProcessing = () => {
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

    // Simulate processing stages with increasing progress
    let currentStageIndex = 0;
    const timer = setInterval(() => {
      setProgress((prev) => {
        const increment = Math.random() * 5 + 1;
        const newProgress = prev + increment;
        
        if (newProgress >= (currentStageIndex + 1) * (100 / stages.length)) {
          currentStageIndex = Math.min(currentStageIndex + 1, stages.length - 1);
          setCurrentStage(stages[currentStageIndex]);
        }
        
        if (newProgress >= 100) {
          clearInterval(timer);
          
          // Simulate completion after all stages
          setTimeout(() => {
            setIsProcessing(false);
            // For demo, we'll just use the original image as "enhanced"
            // In a real app, this would come from your backend
            const reader = new FileReader();
            reader.onload = () => {
              if (reader.result) {
                onProcessingComplete(reader.result.toString());
                toast.success("Image enhancement complete!");
              }
            };
            reader.readAsDataURL(inputImage);
          }, 500);
          return 100;
        }
        
        return newProgress;
      });
    }, 100);

    return () => clearInterval(timer);
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
