
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Loader2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ProcessorProps {
  inputImage: File | null;
  onProcessingComplete: (enhancedImageUrl: string) => void;
}

export function EnhancementProcessor({ inputImage, onProcessingComplete }: ProcessorProps) {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);

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

    const stages = [
      "Analyzing image",
      "Applying ESRGAN model",
      "Enhancing details",
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
        
        if (newProgress >= (currentStageIndex + 1) * 25) {
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
      <div className="w-full mt-6 animate-fade-in">
        <Button 
          onClick={startProcessing} 
          className="w-full bg-esrgan-orange hover:bg-esrgan-orange/80 py-6"
        >
          <Loader2 className="mr-2 h-5 w-5" />
          Start Enhancement Process
        </Button>
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

      <p className="text-sm italic text-gray-400">
        {inputImage.type.includes('license') || inputImage.name.toLowerCase().includes('plate') ?
          "Applying specialized license plate enhancement algorithms..." :
          "Please wait while our AI enhances your image for optimal quality..."
        }
      </p>
    </div>
  );
}
