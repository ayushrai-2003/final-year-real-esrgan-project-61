
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ProcessorProps {
  inputImage: File | null;
  onProcessingComplete: (enhancedImageUrl: string) => void;
}

// This is a mock implementation - in a real app you would connect to a backend API
export function EnhancementProcessor({ inputImage, onProcessingComplete }: ProcessorProps) {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!inputImage) return;

    const stages = [
      "Analyzing image",
      "Applying ESRGAN model",
      "Enhancing details",
      "Finalizing result"
    ];

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
  }, [inputImage, onProcessingComplete]);

  if (!inputImage || !isProcessing) return null;

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
        Please wait while our AI enhances your image for optimal quality...
      </p>
    </div>
  );
}
