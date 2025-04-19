
import React, { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TrainingMetrics } from "@/components/training/TrainingMetrics";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  BookOpen, 
  HardDrive, 
  BarChartHorizontal, 
  Upload, 
  Download, 
  PlayCircle, 
  PauseCircle,
  Settings,
  Database,
  Cog,
  Layers,
  Check,
  FileText,
  ImagePlus,
  Zap
} from "lucide-react";
import { ImageComparison } from "@/components/image-comparison";

const Training = () => {
  const [trainingFiles, setTrainingFiles] = useState<File[]>([]);
  const [validationFiles, setValidationFiles] = useState<File[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [totalEpochs, setTotalEpochs] = useState(10);
  const [modelName, setModelName] = useState("");
  const [trainingStartTime, setTrainingStartTime] = useState<Date | null>(null);
  const [trainingEndTime, setTrainingEndTime] = useState<Date | null>(null);
  const [trainingComplete, setTrainingComplete] = useState(false);
  const [testResults, setTestResults] = useState<null | {
    psnr: number;
    ssim: number;
    lpips: number;
    beforeImage: string;
    afterImage: string;
  }>(null);
  
  // Advanced training parameters
  const [trainingParameters, setTrainingParameters] = useState({
    learningRate: 0.0001,
    batchSize: 16,
    epochs: 10,
    usePretrainedModel: true,
    useMixedPrecision: true,
    useDataAugmentation: true,
    validationSplit: 0.2,
    optimizerType: "adam"
  });

  // Update training parameter
  const updateTrainingParameter = (param: string, value: any) => {
    setTrainingParameters(prev => ({
      ...prev,
      [param]: value
    }));
    
    // Special handling for epochs
    if (param === 'epochs') {
      setTotalEpochs(Number(value));
    }
  };

  // Handle file selection for training dataset
  const handleTrainingFileSelect = (file: File) => {
    setTrainingFiles(prev => [...prev, file]);
    toast.success(`Added training file: ${file.name}`);
  };

  // Handle file selection for validation dataset
  const handleValidationFileSelect = (file: File) => {
    setValidationFiles(prev => [...prev, file]);
    toast.success(`Added validation file: ${file.name}`);
  };

  // Start the training process
  const startTraining = () => {
    if (trainingFiles.length === 0) {
      toast.error("Please upload training files first");
      return;
    }
    
    if (modelName.trim() === "") {
      toast.error("Please provide a name for your model");
      return;
    }
    
    setIsTraining(true);
    setTrainingProgress(0);
    setCurrentEpoch(0);
    setTrainingComplete(false);
    setTestResults(null);
    setTrainingStartTime(new Date());
    setTrainingEndTime(null);
    
    toast.success("Training started successfully");
    
    // Simulate training progress
    const trainingInterval = setInterval(() => {
      setTrainingProgress(prev => {
        const epochSize = 100 / totalEpochs;
        const currentEpochProgress = prev % epochSize;
        const newProgress = prev + (Math.random() * 0.5) + 0.1;
        
        // If we've completed this epoch
        if (currentEpochProgress + (Math.random() * 0.5) + 0.1 >= epochSize) {
          setCurrentEpoch(curr => {
            const newEpoch = curr + 1;
            if (newEpoch >= totalEpochs) {
              clearInterval(trainingInterval);
              setTrainingEndTime(new Date());
              setIsTraining(false);
              setTrainingComplete(true);
              toast.success("Training completed successfully!");
            }
            return newEpoch;
          });
        }
        
        if (newProgress >= 100) {
          clearInterval(trainingInterval);
          setTrainingEndTime(new Date());
          setIsTraining(false);
          setTrainingComplete(true);
          toast.success("Training completed successfully!");
          return 100;
        }
        
        return newProgress;
      });
    }, 300);
    
    return () => clearInterval(trainingInterval);
  };

  // Pause the training process
  const pauseTraining = () => {
    setIsTraining(false);
    toast.info("Training paused");
  };

  // Resume the training process
  const resumeTraining = () => {
    setIsTraining(true);
    toast.info("Training resumed");
    startTraining();
  };

  // Test the trained model
  const testModel = () => {
    if (!trainingComplete) {
      toast.error("You need to complete training before testing");
      return;
    }
    
    toast.info("Testing model on validation dataset...");
    
    // Simulate processing delay
    setTimeout(() => {
      // Generate a sample test result
      const testImage = trainingFiles[0] || validationFiles[0];
      
      if (testImage) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const originalImageUrl = e.target.result.toString();
            
            // Create a canvas to apply simple enhancements for the "after" image
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              
              if (ctx) {
                // Draw the original image
                ctx.drawImage(img, 0, 0);
                
                // Apply some enhancements to simulate the model's output
                // Increase contrast and saturation
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                
                for (let i = 0; i < data.length; i += 4) {
                  // Enhance brightness and contrast
                  for (let j = 0; j < 3; j++) {
                    data[i + j] = 255 * Math.pow((data[i + j] / 255), 0.8);
                  }
                  
                  // Enhance saturation
                  const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                  data[i] = data[i] + (data[i] - avg) * 0.5;
                  data[i + 1] = data[i + 1] + (data[i + 1] - avg) * 0.5;
                  data[i + 2] = data[i + 2] + (data[i + 2] - avg) * 0.5;
                }
                
                ctx.putImageData(imageData, 0, 0);
                
                // Get the enhanced image URL
                const enhancedImageUrl = canvas.toDataURL('image/png');
                
                // Set the test results
                setTestResults({
                  psnr: 28.3 + Math.random() * 4, // 28-32 is a good PSNR range
                  ssim: 0.82 + Math.random() * 0.15, // 0.8-0.95 is a good SSIM range
                  lpips: 0.15 - Math.random() * 0.1, // Lower is better for LPIPS (0.05-0.2)
                  beforeImage: originalImageUrl,
                  afterImage: enhancedImageUrl
                });
                
                toast.success("Testing completed! View results below.");
              }
            };
            img.src = originalImageUrl;
          }
        };
        reader.readAsDataURL(testImage);
      } else {
        toast.error("No images available for testing");
      }
    }, 2000);
  };

  // Format time duration in hours, minutes, seconds
  const formatDuration = (start: Date | null, end: Date | null) => {
    if (!start || !end) return "00:00:00";
    
    const durationMs = end.getTime() - start.getTime();
    const seconds = Math.floor((durationMs / 1000) % 60);
    const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Get estimated time remaining
  const getEstimatedTimeRemaining = () => {
    if (!isTraining || !trainingStartTime) return "00:00:00";
    
    const elapsedMs = new Date().getTime() - trainingStartTime.getTime();
    const progressPercent = trainingProgress / 100;
    
    if (progressPercent <= 0) return "Calculating...";
    
    const totalEstimatedMs = elapsedMs / progressPercent;
    const remainingMs = totalEstimatedMs - elapsedMs;
    
    const seconds = Math.floor((remainingMs / 1000) % 60);
    const minutes = Math.floor((remainingMs / (1000 * 60)) % 60);
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-esrgan-black">
      <Header />
      
      <main className="flex-1">
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-5xl">
              <h1 className="mb-6 text-3xl font-bold text-white">
                ESRGAN Model Training
              </h1>
              <p className="mb-10 text-gray-300">
                Train your own custom ESRGAN model for specific image enhancement tasks. Upload your dataset, configure parameters, and train a model that works best for your specific use case.
              </p>
              
              <Tabs defaultValue="training" className="w-full">
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="training" className="data-[state=active]:bg-esrgan-orange data-[state=active]:text-white">
                    <Layers className="mr-2 h-4 w-4" />
                    Training
                  </TabsTrigger>
                  <TabsTrigger value="parameters" className="data-[state=active]:bg-esrgan-orange data-[state=active]:text-white">
                    <Settings className="mr-2 h-4 w-4" />
                    Parameters
                  </TabsTrigger>
                  <TabsTrigger value="results" className="data-[state=active]:bg-esrgan-orange data-[state=active]:text-white">
                    <BarChartHorizontal className="mr-2 h-4 w-4" />
                    Results
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="training" className="space-y-8 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="rounded-xl border border-gray-800 bg-esrgan-black-light p-6 shadow-lg">
                      <h3 className="mb-6 text-xl font-medium text-white flex items-center">
                        <Upload className="mr-2 h-5 w-5 text-esrgan-orange" />
                        Training Dataset
                      </h3>
                      
                      <FileUpload
                        onFileSelect={handleTrainingFileSelect}
                        accept="image/*"
                        multiple={true}
                        className="mb-4"
                      />
                      
                      {trainingFiles.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium text-white mb-2">Uploaded Training Files ({trainingFiles.length})</h4>
                          <div className="max-h-32 overflow-y-auto bg-esrgan-black rounded-md p-2">
                            {trainingFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between py-1 border-b border-gray-800 last:border-0">
                                <div className="flex items-center">
                                  <FileText className="h-4 w-4 text-gray-400 mr-2" />
                                  <span className="text-sm text-gray-300 truncate max-w-[200px]">{file.name}</span>
                                </div>
                                <span className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="rounded-xl border border-gray-800 bg-esrgan-black-light p-6 shadow-lg">
                      <h3 className="mb-6 text-xl font-medium text-white flex items-center">
                        <HardDrive className="mr-2 h-5 w-5 text-esrgan-orange" />
                        Validation Dataset
                      </h3>
                      
                      <FileUpload
                        onFileSelect={handleValidationFileSelect}
                        accept="image/*"
                        multiple={true}
                        className="mb-4"
                      />
                      
                      {validationFiles.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium text-white mb-2">Uploaded Validation Files ({validationFiles.length})</h4>
                          <div className="max-h-32 overflow-y-auto bg-esrgan-black rounded-md p-2">
                            {validationFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between py-1 border-b border-gray-800 last:border-0">
                                <div className="flex items-center">
                                  <FileText className="h-4 w-4 text-gray-400 mr-2" />
                                  <span className="text-sm text-gray-300 truncate max-w-[200px]">{file.name}</span>
                                </div>
                                <span className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="rounded-xl border border-gray-800 bg-esrgan-black-light p-6 shadow-lg">
                    <h3 className="mb-6 text-xl font-medium text-white flex items-center">
                      <Cog className="mr-2 h-5 w-5 text-esrgan-orange" />
                      Model Configuration
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="model-name" className="text-gray-300">
                          Model Name
                        </Label>
                        <Input
                          id="model-name"
                          placeholder="e.g., my-license-plate-model"
                          className="mt-1 bg-esrgan-black border-gray-700 focus:border-esrgan-orange focus:ring-esrgan-orange/30"
                          value={modelName}
                          onChange={(e) => setModelName(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="epochs" className="text-gray-300">
                          Epochs
                        </Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Slider
                            id="epochs"
                            value={[trainingParameters.epochs]}
                            min={1}
                            max={50}
                            step={1}
                            onValueChange={(value) => updateTrainingParameter('epochs', value[0])}
                            disabled={isTraining}
                          />
                          <span className="w-12 text-center text-gray-300">{trainingParameters.epochs}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mt-6">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="pretrained"
                          checked={trainingParameters.usePretrainedModel}
                          onCheckedChange={(checked) => updateTrainingParameter('usePretrainedModel', checked)}
                          disabled={isTraining}
                        />
                        <Label htmlFor="pretrained" className="text-gray-300">
                          Use Pretrained Model
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="data-augmentation"
                          checked={trainingParameters.useDataAugmentation}
                          onCheckedChange={(checked) => updateTrainingParameter('useDataAugmentation', checked)}
                          disabled={isTraining}
                        />
                        <Label htmlFor="data-augmentation" className="text-gray-300">
                          Data Augmentation
                        </Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-xl border border-gray-800 bg-esrgan-black-light p-6 shadow-lg">
                    <h3 className="mb-6 text-xl font-medium text-white flex items-center">
                      <PlayCircle className="mr-2 h-5 w-5 text-esrgan-orange" />
                      Training Controls
                    </h3>
                    
                    {(!isTraining && !trainingComplete) && (
                      <Button 
                        className="w-full bg-esrgan-orange hover:bg-esrgan-orange/80 py-6"
                        onClick={startTraining}
                        disabled={trainingFiles.length === 0 || modelName.trim() === ""}
                      >
                        <PlayCircle className="mr-2 h-5 w-5" />
                        Start Training
                      </Button>
                    )}
                    
                    {isTraining && (
                      <>
                        <div className="mb-6">
                          <div className="flex justify-between items-center mb-2">
                            <div className="text-gray-300">
                              Training Progress ({Math.floor(trainingProgress)}%)
                            </div>
                            <div className="text-gray-400 text-sm">
                              Epoch {currentEpoch}/{totalEpochs}
                            </div>
                          </div>
                          <Progress value={trainingProgress} className="h-2" />
                          
                          <div className="flex justify-between mt-2 text-xs text-gray-400">
                            <div>Elapsed: {formatDuration(trainingStartTime, new Date())}</div>
                            <div>Remaining: {getEstimatedTimeRemaining()}</div>
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full border-gray-700 text-white hover:bg-gray-800"
                          variant="outline"
                          onClick={pauseTraining}
                        >
                          <PauseCircle className="mr-2 h-5 w-5" />
                          Pause Training
                        </Button>
                      </>
                    )}
                    
                    {(!isTraining && trainingComplete) && (
                      <>
                        <div className="mb-6">
                          <div className="flex justify-between items-center mb-2">
                            <div className="text-green-400 font-medium flex items-center">
                              <Check className="mr-1 h-4 w-4" />
                              Training Complete!
                            </div>
                            <div className="text-gray-400 text-sm">
                              {totalEpochs} epochs in {formatDuration(trainingStartTime, trainingEndTime)}
                            </div>
                          </div>
                          <Progress value={100} className="h-2 bg-gray-800 text-green-500" />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                          <Button 
                            className="flex-1 bg-esrgan-orange hover:bg-esrgan-orange/80"
                            onClick={testModel}
                          >
                            <Zap className="mr-2 h-5 w-5" />
                            Test Model
                          </Button>
                          
                          <Button 
                            className="flex-1 border-gray-700 text-white hover:bg-gray-800"
                            variant="outline"
                          >
                            <Download className="mr-2 h-5 w-5" />
                            Download Model
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="parameters" className="animate-fade-in">
                  <div className="rounded-xl border border-gray-800 bg-esrgan-black-light p-6 shadow-lg">
                    <h3 className="mb-6 text-xl font-medium text-white flex items-center">
                      <Settings className="mr-2 h-5 w-5 text-esrgan-orange" />
                      Advanced Training Parameters
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <Label htmlFor="learningRate" className="text-gray-300">Learning Rate</Label>
                        <div className="flex items-center gap-4">
                          <Slider
                            id="learningRate"
                            value={[Math.log10(trainingParameters.learningRate) * -1]}
                            min={2}
                            max={6}
                            step={0.1}
                            onValueChange={(value) => updateTrainingParameter('learningRate', Math.pow(10, -value[0]))}
                            disabled={isTraining}
                            className="flex-1"
                          />
                          <span className="text-sm text-gray-300 w-16 text-right">{trainingParameters.learningRate.toExponential(2)}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="batchSize" className="text-gray-300">Batch Size</Label>
                        <div className="flex items-center gap-4">
                          <Slider
                            id="batchSize"
                            value={[trainingParameters.batchSize]}
                            min={1}
                            max={64}
                            step={1}
                            onValueChange={(value) => updateTrainingParameter('batchSize', value[0])}
                            disabled={isTraining}
                            className="flex-1"
                          />
                          <span className="text-sm text-gray-300 w-8 text-right">{trainingParameters.batchSize}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="validationSplit" className="text-gray-300">Validation Split</Label>
                        <div className="flex items-center gap-4">
                          <Slider
                            id="validationSplit"
                            value={[trainingParameters.validationSplit * 100]}
                            min={5}
                            max={30}
                            step={5}
                            onValueChange={(value) => updateTrainingParameter('validationSplit', value[0] / 100)}
                            disabled={isTraining}
                            className="flex-1"
                          />
                          <span className="text-sm text-gray-300 w-8 text-right">{Math.round(trainingParameters.validationSplit * 100)}%</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="optimizer" className="text-gray-300">Optimizer</Label>
                        <Select 
                          value={trainingParameters.optimizerType}
                          onValueChange={(value) => updateTrainingParameter('optimizerType', value)}
                          disabled={isTraining}
                        >
                          <SelectTrigger className="bg-esrgan-black border-gray-700 focus:ring-esrgan-orange/30">
                            <SelectValue placeholder="Select optimizer" />
                          </SelectTrigger>
                          <SelectContent className="bg-esrgan-black border-gray-700">
                            <SelectItem value="adam">Adam</SelectItem>
                            <SelectItem value="sgd">SGD</SelectItem>
                            <SelectItem value="rmsprop">RMSprop</SelectItem>
                            <SelectItem value="adagrad">Adagrad</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="mixedPrecision"
                          checked={trainingParameters.useMixedPrecision}
                          onCheckedChange={(checked) => updateTrainingParameter('useMixedPrecision', checked)}
                          disabled={isTraining}
                        />
                        <Label htmlFor="mixedPrecision" className="text-gray-300">
                          Use Mixed Precision Training
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="dataAugmentation"
                          checked={trainingParameters.useDataAugmentation}
                          onCheckedChange={(checked) => updateTrainingParameter('useDataAugmentation', checked)}
                          disabled={isTraining}
                        />
                        <Label htmlFor="dataAugmentation" className="text-gray-300">
                          Enable Data Augmentation
                        </Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-xl border border-gray-800 bg-esrgan-black-light p-6 shadow-lg mt-6">
                    <h3 className="mb-6 text-xl font-medium text-white flex items-center">
                      <Database className="mr-2 h-5 w-5 text-esrgan-orange" />
                      Model Architecture
                    </h3>
                    
                    <div className="w-full h-80 overflow-hidden rounded-lg bg-esrgan-black border border-gray-700 p-4 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="mb-4">
                            <Layers className="h-16 w-16 mx-auto text-esrgan-orange opacity-30" />
                          </div>
                          <p className="text-gray-400">ESRGAN Architecture</p>
                          <p className="text-xs text-gray-500 mt-2">23 Residual-in-Residual Dense Blocks</p>
                          <p className="text-xs text-gray-500">Enhanced Perceptual Loss Function</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="results" className="animate-fade-in">
                  {(!trainingComplete) ? (
                    <div className="rounded-xl border border-gray-800 bg-esrgan-black-light p-8 shadow-lg">
                      <div className="text-center py-16">
                        <BarChartHorizontal className="h-16 w-16 mx-auto text-gray-600 mb-4" />
                        <h3 className="text-xl font-medium text-gray-400">No Training Results Yet</h3>
                        <p className="text-gray-500 mt-2">
                          Train your model first to see performance metrics and test results here.
                        </p>
                        
                        <Button 
                          className="mt-8 bg-esrgan-orange hover:bg-esrgan-orange/80"
                          onClick={() => document.querySelector('[data-value="training"]')?.dispatchEvent(new MouseEvent('click'))}
                        >
                          Go to Training
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="rounded-xl border border-gray-800 bg-esrgan-black-light p-6 shadow-lg">
                        <h3 className="mb-6 text-xl font-medium text-white flex items-center">
                          <BarChartHorizontal className="mr-2 h-5 w-5 text-esrgan-orange" />
                          Training Metrics
                        </h3>
                        
                        <div className="mb-6">
                          <div className="flex justify-between items-center mb-2">
                            <div className="text-green-400 font-medium flex items-center">
                              <Check className="mr-1 h-4 w-4" />
                              {modelName} Model
                            </div>
                            <div className="text-gray-400 text-sm">
                              {totalEpochs} epochs • {formatDuration(trainingStartTime, trainingEndTime)} training time
                            </div>
                          </div>
                        </div>
                        
                        <div className="h-64 mb-4">
                          <TrainingMetrics />
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                          <div className="bg-esrgan-black rounded-lg p-4 border border-gray-800 text-center">
                            <div className="text-2xl font-bold text-esrgan-orange">98.2%</div>
                            <div className="text-xs text-gray-400">Training Accuracy</div>
                          </div>
                          
                          <div className="bg-esrgan-black rounded-lg p-4 border border-gray-800 text-center">
                            <div className="text-2xl font-bold text-esrgan-orange">96.8%</div>
                            <div className="text-xs text-gray-400">Validation Accuracy</div>
                          </div>
                          
                          <div className="bg-esrgan-black rounded-lg p-4 border border-gray-800 text-center">
                            <div className="text-2xl font-bold text-esrgan-orange">0.047</div>
                            <div className="text-xs text-gray-400">Final Loss</div>
                          </div>
                          
                          <div className="bg-esrgan-black rounded-lg p-4 border border-gray-800 text-center">
                            <div className="text-2xl font-bold text-esrgan-orange">23.4M</div>
                            <div className="text-xs text-gray-400">Parameters</div>
                          </div>
                        </div>
                      </div>
                      
                      {testResults ? (
                        <div className="rounded-xl border border-gray-800 bg-esrgan-black-light p-6 shadow-lg">
                          <h3 className="mb-6 text-xl font-medium text-white flex items-center">
                            <ImagePlus className="mr-2 h-5 w-5 text-esrgan-orange" />
                            Model Testing Results
                          </h3>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                              <h4 className="text-lg font-medium text-white mb-4">Visual Comparison</h4>
                              <ImageComparison
                                beforeImage={testResults.beforeImage}
                                afterImage={testResults.afterImage}
                                className="aspect-video w-full rounded-lg overflow-hidden shadow-lg"
                              />
                            </div>
                            
                            <div>
                              <h4 className="text-lg font-medium text-white mb-4">Performance Metrics</h4>
                              
                              <div className="space-y-6">
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-gray-300">PSNR (Peak Signal-to-Noise Ratio)</span>
                                    <span className="text-white font-medium">{testResults.psnr.toFixed(2)} dB</span>
                                  </div>
                                  <Progress value={(testResults.psnr - 25) * 20} className="h-2" />
                                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Poor (&lt;25dB)</span>
                                    <span>Excellent (&gt;30dB)</span>
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-gray-300">SSIM (Structural Similarity Index)</span>
                                    <span className="text-white font-medium">{testResults.ssim.toFixed(3)}</span>
                                  </div>
                                  <Progress value={testResults.ssim * 100} className="h-2" />
                                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Poor (0.7)</span>
                                    <span>Excellent (1.0)</span>
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-gray-300">LPIPS (Perceptual Similarity)</span>
                                    <span className="text-white font-medium">{testResults.lpips.toFixed(3)}</span>
                                  </div>
                                  <Progress value={(0.3 - testResults.lpips) * 100 / 0.3} className="h-2" />
                                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Excellent (0.0)</span>
                                    <span>Poor (0.3)</span>
                                  </div>
                                </div>
                                
                                <div className="bg-green-950/30 text-green-400 rounded-lg p-4 border border-green-900/50">
                                  <div className="flex items-center mb-2">
                                    <Check className="h-5 w-5 mr-2" />
                                    <h4 className="font-medium">Overall Assessment</h4>
                                  </div>
                                  <p className="text-sm">
                                    Your model performs very well on enhancement tasks, with excellent PSNR and SSIM scores.
                                    The perceptual quality (LPIPS) shows good visual fidelity to the ground truth images.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-center mt-8">
                            <Button className="bg-esrgan-orange hover:bg-esrgan-orange/80">
                              <Download className="mr-2 h-4 w-4" />
                              Download Model Weights (.pth)
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-gray-800 bg-esrgan-black-light p-6 shadow-lg">
                          <div className="text-center py-8">
                            <ImagePlus className="h-12 w-12 mx-auto text-gray-600 mb-4" />
                            <h3 className="text-xl font-medium text-gray-400">No Test Results Yet</h3>
                            <p className="text-gray-500 mt-2 max-w-md mx-auto">
                              Test your trained model to see visual comparisons and quantitative metrics.
                            </p>
                            
                            <Button 
                              className="mt-6 bg-esrgan-orange hover:bg-esrgan-orange/80"
                              onClick={testModel}
                            >
                              <Zap className="mr-2 h-4 w-4" />
                              Test Model Now
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Training;
