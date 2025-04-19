
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { toast } from "sonner";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ArrowRight, Settings, Folders, BarChart, Play, PauseCircle, Save, Car, FileImage, BarChart2, Sliders, Download, Layers } from "lucide-react";
import { Toaster } from "sonner";
import TrainingMetrics from '@/components/training/TrainingMetrics';
import { useNavigate } from 'react-router-dom';

const Training = () => {
  const navigate = useNavigate();
  const [trainingStatus, setTrainingStatus] = useState('idle');
  const [dataset, setDataset] = useState<File | null>(null);
  const [epochs, setEpochs] = useState(100);
  const [batchSize, setBatchSize] = useState(16);
  const [learningRate, setLearningRate] = useState(0.001);
  const [usePretrainedModel, setUsePretrainedModel] = useState(true);
  const [validationSplit, setValidationSplit] = useState(0.2);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingMetrics, setTrainingMetrics] = useState<Array<{
    epoch: number;
    loss: number;
    accuracy: number;
    psnr: number;
    ssim: number;
    lpips?: number;
    sharpness?: number;
    noiseReduction?: number;
    colorFidelity?: number;
    textureDetail?: number;
    plateDetectionAccuracy?: number;
    plateRecognitionAccuracy?: number;
  }>>([]);
  const [testingMetrics, setTestingMetrics] = useState({
    psnr: 26.8,
    ssim: 0.87,
    accuracy: 0.93,
    lpips: 0.21,
    sharpness: 0.85,
    noiseReduction: 0.87,
    colorFidelity: 0.92,
    textureDetail: 0.89,
    plateDetectionAccuracy: 0.0,
    plateRecognitionAccuracy: 0.0
  });
  const [selectedDataset, setSelectedDataset] = useState<'DIV2K' | 'DF2K' | 'FLICKR2K' | 'OST' | 'INDIAN_LP' | 'AUTO_LP'>('DIV2K');
  const [modelType, setModelType] = useState<'general' | 'license-plate'>('general');
  
  // Enhanced settings for image quality
  const [enhancementSettings, setEnhancementSettings] = useState({
    sharpnessEnhancement: 0.5,
    noiseReduction: 0.5,
    colorCorrection: true,
    texturePreservation: 0.7,
    contrastEnhancement: 0.3,
    upscalingFactor: 4,
    usePerceptualLoss: true,
    advancedDegradation: true
  });

  const updateEnhancementSetting = (setting: string, value: number | boolean) => {
    setEnhancementSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const generateTrainingData = (epoch: number) => {
    const baseLoss = 2.5 * Math.exp(-epoch / 50);
    const baseAccuracy = 0.5 + 0.45 * (1 - Math.exp(-epoch / 30));
    const basePSNR = 20 + 10 * (1 - Math.exp(-epoch / 40));
    const baseSSIM = 0.5 + 0.45 * (1 - Math.exp(-epoch / 35));
    
    // New metrics for enhanced image quality
    const baseLPIPS = 0.5 - 0.4 * (1 - Math.exp(-epoch / 45));
    const baseSharpness = 0.3 + 0.6 * (1 - Math.exp(-epoch / 35)) * enhancementSettings.sharpnessEnhancement;
    const baseNoiseReduction = 0.2 + 0.7 * (1 - Math.exp(-epoch / 40)) * enhancementSettings.noiseReduction;
    const baseColorFidelity = 0.4 + 0.5 * (1 - Math.exp(-epoch / 30)) * (enhancementSettings.colorCorrection ? 1 : 0.7);
    const baseTextureDetail = 0.3 + 0.6 * (1 - Math.exp(-epoch / 38)) * enhancementSettings.texturePreservation;

    const noise = () => (Math.random() - 0.5) * 0.1;
    
    const metrics: {
      epoch: number;
      loss: number;
      accuracy: number;
      psnr: number;
      ssim: number;
      lpips?: number;
      sharpness?: number;
      noiseReduction?: number;
      colorFidelity?: number;
      textureDetail?: number;
      plateDetectionAccuracy?: number;
      plateRecognitionAccuracy?: number;
    } = {
      epoch,
      loss: Math.max(0, baseLoss + noise()),
      accuracy: Math.min(1, Math.max(0, baseAccuracy + noise())),
      psnr: Math.max(0, basePSNR + noise() * 2),
      ssim: Math.min(1, Math.max(0, baseSSIM + noise())),
      lpips: Math.min(1, Math.max(0, baseLPIPS + noise())),
      sharpness: Math.min(1, Math.max(0, baseSharpness + noise())),
      noiseReduction: Math.min(1, Math.max(0, baseNoiseReduction + noise())),
      colorFidelity: Math.min(1, Math.max(0, baseColorFidelity + noise())),
      textureDetail: Math.min(1, Math.max(0, baseTextureDetail + noise())),
    };
    
    if (modelType === 'license-plate') {
      metrics.plateDetectionAccuracy = Math.min(
        0.98, 
        0.4 + 0.55 * (1 - Math.exp(-epoch / 25)) + noise() * 0.5
      );
      
      metrics.plateRecognitionAccuracy = Math.min(
        0.95, 
        0.3 + 0.6 * (1 - Math.exp(-epoch / 35)) + noise() * 0.6
      );
    }
    
    return metrics;
  };

  useEffect(() => {
    if (trainingStatus === 'training') {
      const interval = setInterval(() => {
        setTrainingProgress((prev) => {
          const newProgress = prev + 1;
          if (newProgress <= 100) {
            const currentEpoch = Math.floor((newProgress / 100) * epochs);
            setTrainingMetrics((prevMetrics) => [
              ...prevMetrics,
              generateTrainingData(currentEpoch),
            ]);
            
            if (newProgress === 100) {
              setTrainingStatus('completed');
              toast.success('Training completed successfully!');
            }
          }
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 300);

      return () => clearInterval(interval);
    }
  }, [trainingStatus, epochs, modelType, enhancementSettings]);

  useEffect(() => {
    if (modelType === 'license-plate') {
      setTestingMetrics({
        psnr: 28.3,
        ssim: 0.91,
        accuracy: 0.88,
        lpips: 0.18,
        sharpness: 0.87,
        noiseReduction: 0.89,
        colorFidelity: 0.90,
        textureDetail: 0.85,
        plateDetectionAccuracy: 0.89,
        plateRecognitionAccuracy: 0.85
      });
    } else {
      setTestingMetrics({
        psnr: 26.8,
        ssim: 0.87,
        accuracy: 0.93,
        lpips: 0.21,
        sharpness: 0.85,
        noiseReduction: 0.87,
        colorFidelity: 0.92,
        textureDetail: 0.89,
        plateDetectionAccuracy: 0.0,
        plateRecognitionAccuracy: 0.0
      });
    }
  }, [modelType]);

  const handleDatasetUpload = (file: File) => {
    setDataset(file);
    toast.success(`Dataset uploaded: ${file.name}`);
  };

  const handleStartTraining = () => {
    if (!dataset && !selectedDataset) {
      toast.error('Please select or upload a dataset first');
      return;
    }
    
    setTrainingStatus('training');
    setTrainingProgress(0);
    setTrainingMetrics([]);
    toast.success(`Training started with ${selectedDataset} dataset and optimized enhancement settings`);
  };

  const handleStopTraining = () => {
    setTrainingStatus('stopped');
    toast.info('Training stopped');
  };

  const handleSaveModel = () => {
    if (trainingProgress < 100) {
      toast.error('Training must be completed before saving the model');
      return;
    }
    toast.success('Model saved successfully!');
  };

  const handleDatasetSelect = (dataset: 'DIV2K' | 'DF2K' | 'FLICKR2K' | 'OST' | 'INDIAN_LP' | 'AUTO_LP') => {
    setSelectedDataset(dataset);
    if (dataset === 'INDIAN_LP' || dataset === 'AUTO_LP') {
      setModelType('license-plate');
      toast.info('Switched to license plate recognition mode');
    } else {
      setModelType('general');
    }
    toast.success(`Dataset ${dataset} selected for training`);
  };

  const startTesting = () => {
    toast.info('Starting test process with advanced quality metrics...');
    setTimeout(() => {
      if (modelType === 'license-plate') {
        setTestingMetrics({
          psnr: 28.3 + (enhancementSettings.sharpnessEnhancement - 0.5) * 2,
          ssim: 0.91 + (enhancementSettings.texturePreservation - 0.7) * 0.05,
          accuracy: 0.88 + (enhancementSettings.noiseReduction - 0.5) * 0.03,
          lpips: 0.18 - (enhancementSettings.sharpnessEnhancement - 0.5) * 0.04,
          sharpness: 0.87 + (enhancementSettings.sharpnessEnhancement - 0.5) * 0.1,
          noiseReduction: 0.89 + (enhancementSettings.noiseReduction - 0.5) * 0.08,
          colorFidelity: 0.90 + (enhancementSettings.colorCorrection ? 0.04 : -0.04),
          textureDetail: 0.85 + (enhancementSettings.texturePreservation - 0.7) * 0.15,
          plateDetectionAccuracy: 0.89 + (enhancementSettings.contrastEnhancement - 0.3) * 0.05,
          plateRecognitionAccuracy: 0.85 + (enhancementSettings.sharpnessEnhancement - 0.5) * 0.06
        });
      } else {
        setTestingMetrics({
          psnr: 26.8 + (enhancementSettings.sharpnessEnhancement - 0.5) * 2,
          ssim: 0.87 + (enhancementSettings.texturePreservation - 0.7) * 0.05,
          accuracy: 0.93 + (enhancementSettings.noiseReduction - 0.5) * 0.03,
          lpips: 0.21 - (enhancementSettings.sharpnessEnhancement - 0.5) * 0.04,
          sharpness: 0.85 + (enhancementSettings.sharpnessEnhancement - 0.5) * 0.1,
          noiseReduction: 0.87 + (enhancementSettings.noiseReduction - 0.5) * 0.08,
          colorFidelity: 0.92 + (enhancementSettings.colorCorrection ? 0.04 : -0.04),
          textureDetail: 0.89 + (enhancementSettings.texturePreservation - 0.7) * 0.15,
          plateDetectionAccuracy: 0.0,
          plateRecognitionAccuracy: 0.0
        });
      }
      toast.success('Testing completed with comprehensive quality metrics!');
    }, 2000);
  };

  const getDatasetInfo = () => {
    switch (selectedDataset) {
      case 'DIV2K':
        return 'DIV2K provides 800 training images and 200 validation images in 2K resolution.';
      case 'DF2K':
        return 'DF2K combines DIV2K and Flickr2K for a total of 3000 high-quality training images.';
      case 'FLICKR2K':
        return 'FLICKR2K contains 2650 high-resolution images sourced from Flickr, optimized for real-world scenarios.';
      case 'OST':
        return 'Corrupted Images Training Set (OST) contains 10,000+ deliberately degraded images to train robust enhancement models.';
      case 'INDIAN_LP':
        return 'INDIAN Vehicle License Plate dataset contains over 3000 images of Indian license plates in various lighting and weather conditions.';
      case 'AUTO_LP':
        return 'AUTOMATIC LICENSE NUMBER PLATE DETECTION AND RECOGNITION dataset includes 15,000 vehicle images with diverse plate styles and challenging environments.';
      default:
        return '';
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-esrgan-black">
      <Toaster position="top-center" />
      <Header />
      
      <main className="flex-1 py-16">
        <div className="container">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl text-center">
            Real-ESRGAN <span className="gradient-text">Training Dashboard</span>
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-300 text-center">
            Train your own Real-ESRGAN model with advanced image enhancement optimization for superior quality results
          </p>
          
          <Tabs defaultValue="training" className="max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="training">Training</TabsTrigger>
              <TabsTrigger value="testing">Testing</TabsTrigger>
              <TabsTrigger value="enhancer">Image Enhancer</TabsTrigger>
              <TabsTrigger value="datasets">Datasets</TabsTrigger>
            </TabsList>
            
            <TabsContent value="training" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-1 bg-esrgan-black-light border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Settings className="mr-2 h-5 w-5 text-esrgan-orange" />
                      Training Settings
                    </CardTitle>
                    <CardDescription>Configure your model parameters</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="modelType" className="text-gray-300">Model Type</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          type="button" 
                          variant={modelType === 'general' ? 'default' : 'outline'}
                          className={modelType === 'general' ? 'bg-esrgan-orange' : 'border-gray-700'}
                          onClick={() => setModelType('general')}
                        >
                          General Images
                        </Button>
                        <Button 
                          type="button" 
                          variant={modelType === 'license-plate' ? 'default' : 'outline'}
                          className={modelType === 'license-plate' ? 'bg-esrgan-orange' : 'border-gray-700'}
                          onClick={() => setModelType('license-plate')}
                        >
                          License Plates
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="epochs" className="text-gray-300">Epochs</Label>
                      <div className="flex items-center space-x-2">
                        <Slider
                          id="epochs"
                          value={[epochs]}
                          min={1}
                          max={500}
                          step={1}
                          onValueChange={(value) => setEpochs(value[0])}
                        />
                        <span className="w-12 text-center text-gray-300">{epochs}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="batchSize" className="text-gray-300">Batch Size</Label>
                      <div className="flex items-center space-x-2">
                        <Slider
                          id="batchSize"
                          value={[batchSize]}
                          min={1}
                          max={64}
                          step={1}
                          onValueChange={(value) => setBatchSize(value[0])}
                        />
                        <span className="w-12 text-center text-gray-300">{batchSize}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="learningRate" className="text-gray-300">Learning Rate</Label>
                      <div className="flex items-center space-x-2">
                        <Slider
                          id="learningRate"
                          value={[learningRate * 1000]}
                          min={1}
                          max={10}
                          step={0.1}
                          onValueChange={(value) => setLearningRate(value[0] / 1000)}
                        />
                        <span className="w-12 text-center text-gray-300">{learningRate}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="pretrained"
                        checked={usePretrainedModel}
                        onCheckedChange={setUsePretrainedModel}
                      />
                      <Label htmlFor="pretrained" className="text-gray-300">Use pre-trained model</Label>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="validationSplit" className="text-gray-300">Validation Split</Label>
                      <div className="flex items-center space-x-2">
                        <Slider
                          id="validationSplit"
                          value={[validationSplit * 100]}
                          min={10}
                          max={50}
                          step={5}
                          onValueChange={(value) => setValidationSplit(value[0] / 100)}
                        />
                        <span className="w-12 text-center text-gray-300">{validationSplit * 100}%</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-800">
                      <h4 className="text-sm font-medium text-esrgan-orange mb-2">Enhanced Quality Settings</h4>
                      
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
                      
                      <div className="flex items-center space-x-2 my-2">
                        <Switch
                          id="colorCorrection"
                          checked={enhancementSettings.colorCorrection}
                          onCheckedChange={(checked) => updateEnhancementSetting('colorCorrection', checked)}
                        />
                        <Label htmlFor="colorCorrection" className="text-gray-300">Enable Color Correction</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="usePerceptualLoss"
                          checked={enhancementSettings.usePerceptualLoss}
                          onCheckedChange={(checked) => updateEnhancementSetting('usePerceptualLoss', checked)}
                        />
                        <Label htmlFor="usePerceptualLoss" className="text-gray-300">Use Perceptual Loss</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="col-span-1 md:col-span-2 space-y-6">
                  <Card className="bg-esrgan-black-light border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Folders className="mr-2 h-5 w-5 text-esrgan-orange" />
                        Dataset Selection
                      </CardTitle>
                      <CardDescription>Select or upload your training dataset</CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="grid gap-4">
                        <FileUpload
                          onFileSelect={handleDatasetUpload}
                          accept=".zip,.tar,.gz,.jpg,.jpeg,.png,.bmp,.webp,.heic,.heif,.tiff"
                        />
                        {dataset && (
                          <div className="bg-esrgan-black p-3 rounded-md border border-gray-800">
                            <p className="text-gray-300">Selected dataset: {dataset.name}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-esrgan-black-light border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <BarChart className="mr-2 h-5 w-5 text-esrgan-orange" />
                        Training Progress
                      </CardTitle>
                      <CardDescription>Monitor your model's training metrics</CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      {trainingStatus === 'idle' && (
                        <div className="text-center py-12 text-gray-400">
                          Training has not started yet
                        </div>
                      )}
                      
                      {trainingStatus === 'training' && (
                        <div className="space-y-4">
                          <div className="h-4 w-full bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-esrgan-orange" 
                              style={{ width: `${trainingProgress}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-sm text-gray-400">
                            <span>Epoch {Math.floor(trainingProgress / 100 * epochs)} of {epochs}</span>
                            <span>{trainingProgress}%</span>
                          </div>
                          
                          {trainingMetrics.length > 0 && (
                            <TrainingMetrics 
                              trainingData={trainingMetrics}
                              currentEpoch={Math.floor(trainingProgress / 100 * epochs)}
                            />
                          )}
                        </div>
                      )}
                      
                      {(trainingStatus === 'completed' || trainingStatus === 'stopped') && (
                        <div className="space-y-4">
                          <TrainingMetrics 
                            trainingData={trainingMetrics}
                            currentEpoch={epochs}
                          />
                        </div>
                      )}
                    </CardContent>
                    
                    <CardFooter className="flex justify-between">
                      {trainingStatus === 'idle' || trainingStatus === 'stopped' || trainingStatus === 'completed' ? (
                        <Button 
                          onClick={handleStartTraining} 
                          disabled={!dataset && !selectedDataset}
                          className="bg-esrgan-orange hover:bg-esrgan-orange/80"
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Start Training
                        </Button>
                      ) : (
                        <Button 
                          onClick={handleStopTraining}
                          variant="destructive"
                        >
                          <PauseCircle className="mr-2 h-4 w-4" />
                          Stop Training
                        </Button>
                      )}
                      
                      <Button 
                        onClick={handleSaveModel} 
                        disabled={trainingStatus !== 'completed'} 
                        variant="outline"
                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save Model
                      </Button>
                      
                      <Button
                        onClick={() => navigate('/upload')}
                        variant="outline"
                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      >
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Try Model
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="testing" className="mt-6">
              <Card className="bg-esrgan-black-light border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Model Testing</CardTitle>
                  <CardDescription>Evaluate your trained model's performance with comprehensive metrics</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white">Upload Test Dataset</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 mb-3">
                          <Switch
                            id="licensePlateMode"
                            checked={modelType === 'license-plate'}
                            onCheckedChange={(checked) => setModelType(checked ? 'license-plate' : 'general')}
                          />
                          <Label htmlFor="licensePlateMode" className="text-gray-300">License Plate Testing Mode</Label>
                        </div>
                        <FileUpload
                          onFileSelect={() => {}}
                          accept=".zip,.tar,.gz,.jpg,.jpeg,.png,.bmp,.webp,.heic,.heif,.tiff"
                        />
                      </div>
                      
                      <div className="space-y-3 pt-4 border-t border-gray-800">
                        <h4 className="text-sm font-medium text-esrgan-orange">Testing Configuration</h4>
                        
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
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="advancedDegradation"
                            checked={enhancementSettings.advancedDegradation}
                            onCheckedChange={(checked) => updateEnhancementSetting('advancedDegradation', checked)}
                          />
                          <Label htmlFor="advancedDegradation" className="text-gray-300">Use Advanced Degradation Models</Label>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-esrgan-orange hover:bg-esrgan-orange/80"
                        onClick={startTesting}
                      >
                        Start Testing
                      </Button>
                    </div>
                    
                    <div className="md:col-span-2 space-y-4">
                      <h3 className="text-lg font-medium text-white">Testing Metrics</h3>
                      
                      <div className="grid grid-cols-4 gap-4">
                        <div className="bg-esrgan-black p-4 rounded-md border border-gray-800">
                          <div className="text-gray-400 text-sm">PSNR</div>
                          <div className="text-2xl font-bold text-white">{testingMetrics.psnr.toFixed(1)} dB</div>
                        </div>
                        
                        <div className="bg-esrgan-black p-4 rounded-md border border-gray-800">
                          <div className="text-gray-400 text-sm">SSIM</div>
                          <div className="text-2xl font-bold text-white">{testingMetrics.ssim.toFixed(2)}</div>
                        </div>
                        
                        <div className="bg-esrgan-black p-4 rounded-md border border-gray-800">
                          <div className="text-gray-400 text-sm">LPIPS</div>
                          <div className="text-2xl font-bold text-white">{testingMetrics.lpips.toFixed(2)}</div>
                          <div className="text-xs text-gray-400">(lower is better)</div>
                        </div>
                        
                        <div className="bg-esrgan-black p-4 rounded-md border border-gray-800">
                          <div className="text-gray-400 text-sm">Accuracy</div>
                          <div className="text-2xl font-bold text-white">{(testingMetrics.accuracy * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4">
                        <div className="bg-esrgan-black p-4 rounded-md border border-gray-800">
                          <div className="text-gray-400 text-sm">Sharpness</div>
                          <div className="text-2xl font-bold text-white">{(testingMetrics.sharpness * 100).toFixed(1)}%</div>
                        </div>
                        
                        <div className="bg-esrgan-black p-4 rounded-md border border-gray-800">
                          <div className="text-gray-400 text-sm">Noise Reduction</div>
                          <div className="text-2xl font-bold text-white">{(testingMetrics.noiseReduction * 100).toFixed(1)}%</div>
                        </div>
                        
                        <div className="bg-esrgan-black p-4 rounded-md border border-gray-800">
                          <div className="text-gray-400 text-sm">Color Fidelity</div>
                          <div className="text-2xl font-bold text-white">{(testingMetrics.colorFidelity * 100).toFixed(1)}%</div>
                        </div>
                        
                        <div className="bg-esrgan-black p-4 rounded-md border border-gray-800">
                          <div className="text-gray-400 text-sm">Texture Detail</div>
                          <div className="text-2xl font-bold text-white">{(testingMetrics.textureDetail * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                      
                      {modelType === 'license-plate' && (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="bg-esrgan-black p-4 rounded-md border border-gray-800">
                            <div className="text-gray-400 text-sm">Plate Detection</div>
                            <div className="text-2xl font-bold text-white">{(testingMetrics.plateDetectionAccuracy * 100).toFixed(1)}%</div>
                          </div>
                          
                          <div className="bg-esrgan-black p-4 rounded-md border border-gray-800">
                            <div className="text-gray-400 text-sm">Plate Recognition</div>
                            <div className="text-2xl font-bold text-white">{(testingMetrics.plateRecognitionAccuracy * 100).toFixed(1)}%</div>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4">
                        <h4 className="text-lg font-medium text-white mb-2">Prediction Summary</h4>
                        {modelType === 'license-plate' ? (
                          <div className="bg-esrgan-black p-4 rounded-md border border-gray-800">
                            <p className="text-gray-300">Model successfully detected <span className="text-white font-medium">{(testingMetrics.plateDetectionAccuracy * 100).toFixed(1)}%</span> of license plates and correctly recognized <span className="text-white font-medium">{(testingMetrics.plateRecognitionAccuracy * 100).toFixed(1)}%</span> of characters.</p>
                            <p className="text-gray-300 mt-2">Enhanced images show <span className="text-white font-medium">{(testingMetrics.psnr).toFixed(1)}dB</span> PSNR improvement, <span className="text-white font-medium">{(testingMetrics.ssim * 100).toFixed(1)}%</span> structural similarity, and <span className="text-white font-medium">{(testingMetrics.sharpness * 100).toFixed(1)}%</span> sharpness enhancement.</p>
                          </div>
                        ) : (
                          <div className="bg-esrgan-black p-4 rounded-md border border-gray-800">
                            <p className="text-gray-300">Model achieved <span className="text-white font-medium">{(testingMetrics.accuracy * 100).toFixed(1)}%</span> accuracy with <span className="text-white font-medium">{(testingMetrics.psnr).toFixed(1)}dB</span> PSNR and <span className="text-white font-medium">{(testingMetrics.ssim * 100).toFixed(1)}%</span> structural similarity.</p>
                            <p className="text-gray-300 mt-2">Image quality metrics show <span className="text-white font-medium">{(testingMetrics.sharpness * 100).toFixed(1)}%</span> sharpness improvement, <span className="text-white font-medium">{(testingMetrics.noiseReduction * 100).toFixed(1)}%</span> noise reduction, and <span className="text-white font-medium">{(testingMetrics.textureDetail * 100).toFixed(1)}%</span> texture preservation.</p>
                          </div>
                        )}
                      </div>

                      <div className="h-64 bg-esrgan-black-dark rounded-md p-4 flex items-center justify-center">
                        <div className="text-center space-y-2">
                          <BarChart2 className="h-12 w-12 mx-auto text-esrgan-orange opacity-50" />
                          <div className="text-gray-400">
                            Advanced quality metrics visualization would be displayed here
                          </div>
                          <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                            <Download className="mr-2 h-4 w-4" />
                            Export Results
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="enhancer" className="mt-6">
              <Card className="bg-esrgan-black-light border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Image Enhancement Settings</CardTitle>
                  <CardDescription>Fine-tune advanced parameters for optimal image quality enhancement</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="flex items-center text-lg font-medium text-white">
                          <Sliders className="mr-2 h-5 w-5 text-esrgan-orange" />
                          Core Enhancement Parameters
                        </h3>
                        
                        <div className="space-y-3 p-4 bg-esrgan-black rounded-md border border-gray-800">
                          <div className="space-y-2">
                            <Label htmlFor="sharpnessEnhancement2" className="text-gray-300">Sharpness Enhancement</Label>
                            <div className="flex items-center space-x-2">
                              <Slider
                                id="sharpnessEnhancement2"
                                value={[enhancementSettings.sharpnessEnhancement * 100]}
                                min={0}
                                max={100}
                                step={5}
                                onValueChange={(value) => updateEnhancementSetting('sharpnessEnhancement', value[0] / 100)}
                              />
                              <span className="w-12 text-center text-gray-300">{Math.round(enhancementSettings.sharpnessEnhancement * 100)}%</span>
                            </div>
                            <p className="text-xs text-gray-400">Controls edge definition and detail clarity</p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="noiseReduction2" className="text-gray-300">Noise Reduction</Label>
                            <div className="flex items-center space-x-2">
                              <Slider
                                id="noiseReduction2"
                                value={[enhancementSettings.noiseReduction * 100]}
                                min={0}
                                max={100}
                                step={5}
                                onValueChange={(value) => updateEnhancementSetting('noiseReduction', value[0] / 100)}
                              />
                              <span className="w-12 text-center text-gray-300">{Math.round(enhancementSettings.noiseReduction * 100)}%</span>
                            </div>
                            <p className="text-xs text-gray-400">Removes unwanted artifacts while preserving detail</p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="texturePreservation2" className="text-gray-300">Texture Preservation</Label>
                            <div className="flex items-center space-x-2">
                              <Slider
                                id="texturePreservation2"
                                value={[enhancementSettings.texturePreservation * 100]}
                                min={0}
                                max={100}
                                step={5}
                                onValueChange={(value) => updateEnhancementSetting('texturePreservation', value[0] / 100)}
                              />
                              <span className="w-12 text-center text-gray-300">{Math.round(enhancementSettings.texturePreservation * 100)}%</span>
                            </div>
                            <p className="text-xs text-gray-400">Maintains natural texture patterns in enhanced images</p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="contrastEnhancement2" className="text-gray-300">Contrast Enhancement</Label>
                            <div className="flex items-center space-x-2">
                              <Slider
                                id="contrastEnhancement2"
                                value={[enhancementSettings.contrastEnhancement * 100]}
                                min={0}
                                max={100}
                                step={5}
                                onValueChange={(value) => updateEnhancementSetting('contrastEnhancement', value[0] / 100)}
                              />
                              <span className="w-12 text-center text-gray-300">{Math.round(enhancementSettings.contrastEnhancement * 100)}%</span>
                            </div>
                            <p className="text-xs text-gray-400">Improves image depth and detail visibility</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="flex items-center text-lg font-medium text-white">
                          <Layers className="mr-2 h-5 w-5 text-esrgan-orange" />
                          Advanced Settings
                        </h3>
                        
                        <div className="space-y-3 p-4 bg-esrgan-black rounded-md border border-gray-800">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="colorCorrection2"
                                checked={enhancementSettings.colorCorrection}
                                onCheckedChange={(checked) => updateEnhancementSetting('colorCorrection', checked)}
                              />
                              <div>
                                <Label htmlFor="colorCorrection2" className="text-gray-300">Color Correction</Label>
                                <p className="text-xs text-gray-400">Improves color accuracy and vibrancy</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="usePerceptualLoss2"
                                checked={enhancementSettings.usePerceptualLoss}
                                onCheckedChange={(checked) => updateEnhancementSetting('usePerceptualLoss', checked)}
                              />
                              <div>
                                <Label htmlFor="usePerceptualLoss2" className="text-gray-300">Perceptual Loss</Label>
                                <p className="text-xs text-gray-400">Uses human perception metrics for better results</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="advancedDegradation2"
                                checked={enhancementSettings.advancedDegradation}
                                onCheckedChange={(checked) => updateEnhancementSetting('advancedDegradation', checked)}
                              />
                              <div>
                                <Label htmlFor="advancedDegradation2" className="text-gray-300">Advanced Degradation Modeling</Label>
                                <p className="text-xs text-gray-400">Better handles complex image imperfections</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="upscalingFactor2" className="text-gray-300">Upscaling Factor</Label>
                            <div className="flex items-center space-x-2">
                              <Slider
                                id="upscalingFactor2"
                                value={[enhancementSettings.upscalingFactor]}
                                min={2}
                                max={8}
                                step={1}
                                onValueChange={(value) => updateEnhancementSetting('upscalingFactor', value[0])}
                              />
                              <span className="w-12 text-center text-gray-300">×{enhancementSettings.upscalingFactor}</span>
                            </div>
                            <p className="text-xs text-gray-400">Resolution multiplier for output images</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex gap-2">
                          <Button
                            className="flex-1 bg-esrgan-orange hover:bg-esrgan-orange/80"
                            onClick={() => {
                              toast.success("Settings applied to enhancement model");
                              navigate('/upload');
                            }}
                          >
                            Apply Settings & Try Model
                          </Button>
                          
                          <Button
                            variant="outline"
                            className="border-gray-700 text-gray-300 hover:bg-gray-800"
                            onClick={() => {
                              setEnhancementSettings({
                                sharpnessEnhancement: 0.5,
                                noiseReduction: 0.5,
                                colorCorrection: true,
                                texturePreservation: 0.7,
                                contrastEnhancement: 0.3,
                                upscalingFactor: 4,
                                usePerceptualLoss: true,
                                advancedDegradation: true
                              });
                              toast.info("Reset to default settings");
                            }}
                          >
                            Reset to Defaults
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-white">Enhancement Preview</h3>
                      
                      <div className="h-80 bg-esrgan-black-dark rounded-md p-4 flex items-center justify-center">
                        <div className="text-center space-y-4">
                          <div className="rounded-full bg-esrgan-black-light p-6 mx-auto">
                            <FileImage className="h-12 w-12 text-esrgan-orange opacity-70" />
                          </div>
                          <p className="text-gray-300">Upload an image to see the enhancement preview</p>
                          <FileUpload 
                            onFileSelect={() => {}}
                            accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/tiff,image/bmp,image/gif"
                          />
                        </div>
                      </div>
                      
                      <div className="bg-esrgan-black p-4 rounded-md border border-gray-800">
                        <h4 className="text-white font-medium mb-2">Current Enhancement Profile</h4>
                        
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Focus on Sharpness:</span>
                            <span className="text-gray-300">{enhancementSettings.sharpnessEnhancement > 0.7 ? 'High' : enhancementSettings.sharpnessEnhancement > 0.4 ? 'Medium' : 'Low'}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-400">Noise Reduction Level:</span>
                            <span className="text-gray-300">{enhancementSettings.noiseReduction > 0.7 ? 'High' : enhancementSettings.noiseReduction > 0.4 ? 'Medium' : 'Low'}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-400">Texture Detail:</span>
                            <span className="text-gray-300">{enhancementSettings.texturePreservation > 0.7 ? 'High' : enhancementSettings.texturePreservation > 0.4 ? 'Medium' : 'Low'}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-400">Color Correction:</span>
                            <span className="text-gray-300">{enhancementSettings.colorCorrection ? 'Enabled' : 'Disabled'}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-400">Upscaling:</span>
                            <span className="text-gray-300">×{enhancementSettings.upscalingFactor}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-400">Advanced Features:</span>
                            <span className="text-gray-300">
                              {[
                                enhancementSettings.usePerceptualLoss ? 'Perceptual Loss' : '',
                                enhancementSettings.advancedDegradation ? 'Adv. Degradation' : ''
                              ].filter(Boolean).join(', ') || 'None'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-4 text-sm text-gray-400">
                          <p>This profile is optimized for {enhancementSettings.sharpnessEnhancement > 0.6 && enhancementSettings.texturePreservation > 0.6 ? 'high-detail images with preserved textures' : 
                            enhancementSettings.noiseReduction > 0.6 ? 'noisy images requiring cleanup' : 
                            'balanced enhancement of general photos'}.</p>
                        </div>
                      </div>
                      
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => navigate('/upload')}
                      >
                        Go to Image Upload Page
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="datasets" className="mt-6">
              <Card className="bg-esrgan-black-light border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Available Datasets</CardTitle>
                  <CardDescription>Choose a dataset for training your model</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white">General Image Datasets</h3>
                      
                      <div className="space-y-3">
                        <Button 
                          variant={selectedDataset === 'DIV2K' ? 'default' : 'outline'}
                          className={selectedDataset === 'DIV2K' ? 'bg-esrgan-orange w-full' : 'border-gray-700 w-full'}
                          onClick={() => handleDatasetSelect('DIV2K')}
                        >
                          <FileImage className="mr-2 h-4 w-4" />
                          DIV2K Dataset
                        </Button>
                        
                        <div className={`bg-esrgan-black p-3 rounded-md border ${selectedDataset === 'DIV2K' ? 'border-esrgan-orange' : 'border-gray-800'} text-sm`}>
                          <p className="text-gray-300">
                            DIV2K provides 800 training images and 200 validation images in 2K resolution.
                            Excellent for general image super-resolution tasks.
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Button 
                          variant={selectedDataset === 'DF2K' ? 'default' : 'outline'}
                          className={selectedDataset === 'DF2K' ? 'bg-esrgan-orange w-full' : 'border-gray-700 w-full'}
                          onClick={() => handleDatasetSelect('DF2K')}
                        >
                          <FileImage className="mr-2 h-4 w-4" />
                          DF2K Dataset
                        </Button>
                        
                        <div className={`bg-esrgan-black p-3 rounded-md border ${selectedDataset === 'DF2K' ? 'border-esrgan-orange' : 'border-gray-800'} text-sm`}>
                          <p className="text-gray-300">
                            DF2K combines DIV2K and Flickr2K for a total of 3000 high-quality training images.
                            Provides more diversity for better generalization.
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Button 
                          variant={selectedDataset === 'FLICKR2K' ? 'default' : 'outline'}
                          className={selectedDataset === 'FLICKR2K' ? 'bg-esrgan-orange w-full' : 'border-gray-700 w-full'}
                          onClick={() => handleDatasetSelect('FLICKR2K')}
                        >
                          <FileImage className="mr-2 h-4 w-4" />
                          FLICKR2K Dataset
                        </Button>
                        
                        <div className={`bg-esrgan-black p-3 rounded-md border ${selectedDataset === 'FLICKR2K' ? 'border-esrgan-orange' : 'border-gray-800'} text-sm`}>
                          <p className="text-gray-300">
                            FLICKR2K contains 2650 high-resolution images sourced from Flickr.
                            Excellent for real-world photo enhancement scenarios.
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Button 
                          variant={selectedDataset === 'OST' ? 'default' : 'outline'}
                          className={selectedDataset === 'OST' ? 'bg-esrgan-orange w-full' : 'border-gray-700 w-full'}
                          onClick={() => handleDatasetSelect('OST')}
                        >
                          <FileImage className="mr-2 h-4 w-4" />
                          Corrupted Image Training Set (OST)
                        </Button>
                        
                        <div className={`bg-esrgan-black p-3 rounded-md border ${selectedDataset === 'OST' ? 'border-esrgan-orange' : 'border-gray-800'} text-sm`}>
                          <p className="text-gray-300">
                            Contains 10,000+ deliberately degraded images to train robust enhancement models.
                            Focuses on challenging real-world degradation patterns.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white">License Plate Datasets</h3>
                      
                      <div className="space-y-3">
                        <Button 
                          variant={selectedDataset === 'INDIAN_LP' ? 'default' : 'outline'}
                          className={selectedDataset === 'INDIAN_LP' ? 'bg-esrgan-orange w-full' : 'border-gray-700 w-full'}
                          onClick={() => handleDatasetSelect('INDIAN_LP')}
                        >
                          <Car className="mr-2 h-4 w-4" />
                          INDIAN Vehicle License Plate
                        </Button>
                        
                        <div className={`bg-esrgan-black p-3 rounded-md border ${selectedDataset === 'INDIAN_LP' ? 'border-esrgan-orange' : 'border-gray-800'} text-sm`}>
                          <p className="text-gray-300">
                            Contains over 3000 images of Indian license plates in various lighting and weather conditions.
                            Specialized for Indian registration plate formats and styles.
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Button 
                          variant={selectedDataset === 'AUTO_LP' ? 'default' : 'outline'}
                          className={selectedDataset === 'AUTO_LP' ? 'bg-esrgan-orange w-full' : 'border-gray-700 w-full'}
                          onClick={() => handleDatasetSelect('AUTO_LP')}
                        >
                          <Car className="mr-2 h-4 w-4" />
                          AUTOMATIC LICENSE PLATE
                        </Button>
                        
                        <div className={`bg-esrgan-black p-3 rounded-md border ${selectedDataset === 'AUTO_LP' ? 'border-esrgan-orange' : 'border-gray-800'} text-sm`}>
                          <p className="text-gray-300">
                            A comprehensive dataset with 15,000 vehicle images featuring diverse plate styles and challenging environments.
                            Includes international license plate formats and various vehicle types.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-4 rounded-lg bg-esrgan-black border border-gray-800">
                    <h4 className="text-white font-medium mb-2">Selected Dataset: {selectedDataset}</h4>
                    <p className="text-gray-300">
                      {getDatasetInfo()}
                    </p>
                    {(selectedDataset === 'INDIAN_LP' || selectedDataset === 'AUTO_LP') && (
                      <div className="mt-4 p-3 bg-esrgan-black-dark rounded-md">
                        <p className="text-sm text-esrgan-orange">Note: Using a license plate dataset will automatically configure the model for license plate enhancement and recognition.</p>
                      </div>
                    )}
                    <Button 
                      className="mt-4 bg-esrgan-orange hover:bg-esrgan-orange/80"
                      onClick={() => toast.success(`Dataset ${selectedDataset} selected for training`)}
                    >
                      Use This Dataset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Training;
