
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
import { ArrowRight, Settings, Folders, BarChart, Play, PauseCircle, Save, Car, FileImage } from "lucide-react";
import { Toaster } from "sonner";
import TrainingMetrics from '@/components/training/TrainingMetrics';

const Training = () => {
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
    plateDetectionAccuracy?: number;
    plateRecognitionAccuracy?: number;
  }>>([]);
  const [testingMetrics, setTestingMetrics] = useState({
    psnr: 26.8,
    ssim: 0.87,
    accuracy: 0.93,
    plateDetectionAccuracy: 0.89,
    plateRecognitionAccuracy: 0.85
  });
  const [selectedDataset, setSelectedDataset] = useState<'DIV2K' | 'DF2K' | 'INDIAN_LP' | 'AUTO_LP'>('DIV2K');
  const [modelType, setModelType] = useState<'general' | 'license-plate'>('general');

  const generateTrainingData = (epoch: number) => {
    const baseLoss = 2.5 * Math.exp(-epoch / 50);
    const baseAccuracy = 0.5 + 0.45 * (1 - Math.exp(-epoch / 30));
    const basePSNR = 20 + 10 * (1 - Math.exp(-epoch / 40));
    const baseSSIM = 0.5 + 0.45 * (1 - Math.exp(-epoch / 35));

    const noise = () => (Math.random() - 0.5) * 0.1;
    
    const metrics: {
      epoch: number;
      loss: number;
      accuracy: number;
      psnr: number;
      ssim: number;
      plateDetectionAccuracy?: number;
      plateRecognitionAccuracy?: number;
    } = {
      epoch,
      loss: Math.max(0, baseLoss + noise()),
      accuracy: Math.min(1, Math.max(0, baseAccuracy + noise())),
      psnr: Math.max(0, basePSNR + noise() * 2),
      ssim: Math.min(1, Math.max(0, baseSSIM + noise())),
    };
    
    // Add license plate specific metrics if using license plate model
    if (modelType === 'license-plate') {
      // Plate detection starts lower but improves faster in early epochs
      metrics.plateDetectionAccuracy = Math.min(
        0.98, 
        0.4 + 0.55 * (1 - Math.exp(-epoch / 25)) + noise() * 0.5
      );
      
      // Plate recognition is more challenging, improves more slowly
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
          }
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 300);

      return () => clearInterval(interval);
    }
  }, [trainingStatus, epochs, modelType]);

  // Update testingMetrics when model type changes
  useEffect(() => {
    if (modelType === 'license-plate') {
      setTestingMetrics({
        psnr: 28.3,
        ssim: 0.91,
        accuracy: 0.88,
        plateDetectionAccuracy: 0.89,
        plateRecognitionAccuracy: 0.85
      });
    } else {
      setTestingMetrics({
        psnr: 26.8,
        ssim: 0.87,
        accuracy: 0.93,
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
    setTrainingStatus('training');
    setTrainingProgress(0);
    setTrainingMetrics([]);
    toast.success(`Training started with ${selectedDataset} dataset`);
  };

  const handleStopTraining = () => {
    setTrainingStatus('stopped');
    toast.info('Training stopped');
  };

  const handleSaveModel = () => {
    toast.success('Model saved successfully!');
  };

  const getDatasetInfo = () => {
    switch (selectedDataset) {
      case 'DIV2K':
        return 'DIV2K provides 800 training images and 200 validation images in 2K resolution.';
      case 'DF2K':
        return 'DF2K combines DIV2K and Flickr2K for a total of 3000 high-quality training images.';
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
            Train your own Real-ESRGAN model for image enhancement with high-quality datasets, including license plate recognition
          </p>
          
          <Tabs defaultValue="training" className="max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="training">Training</TabsTrigger>
              <TabsTrigger value="testing">Testing</TabsTrigger>
              <TabsTrigger value="process">Process Overview</TabsTrigger>
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
                  </CardContent>
                </Card>
                
                <div className="col-span-1 md:col-span-2 space-y-6">
                  <Card className="bg-esrgan-black-light border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Folders className="mr-2 h-5 w-5 text-esrgan-orange" />
                        Dataset Upload
                      </CardTitle>
                      <CardDescription>Upload your training dataset (supports zip, tar, gz, and various image formats)</CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <FileUpload
                        onFileSelect={handleDatasetUpload}
                        accept=".zip,.tar,.gz,.jpg,.jpeg,.png,.bmp,.webp"
                      />
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
                          disabled={!dataset}
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
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="testing" className="mt-6">
              <Card className="bg-esrgan-black-light border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Model Testing</CardTitle>
                  <CardDescription>Evaluate your trained model's performance</CardDescription>
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
                          accept=".zip,.tar,.gz,.jpg,.jpeg,.png,.bmp,.webp"
                        />
                      </div>
                      <Button className="w-full bg-esrgan-orange hover:bg-esrgan-orange/80">
                        Start Testing
                      </Button>
                    </div>
                    
                    <div className="md:col-span-2 space-y-4">
                      <h3 className="text-lg font-medium text-white">Testing Metrics</h3>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-esrgan-black p-4 rounded-md border border-gray-800">
                          <div className="text-gray-400 text-sm">PSNR</div>
                          <div className="text-2xl font-bold text-white">{testingMetrics.psnr} dB</div>
                        </div>
                        
                        <div className="bg-esrgan-black p-4 rounded-md border border-gray-800">
                          <div className="text-gray-400 text-sm">SSIM</div>
                          <div className="text-2xl font-bold text-white">{testingMetrics.ssim}</div>
                        </div>
                        
                        <div className="bg-esrgan-black p-4 rounded-md border border-gray-800">
                          <div className="text-gray-400 text-sm">Accuracy</div>
                          <div className="text-2xl font-bold text-white">{(testingMetrics.accuracy * 100).toFixed(1)}%</div>
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
                            <p className="text-gray-300 mt-2">Enhanced images show <span className="text-white font-medium">{(testingMetrics.psnr).toFixed(1)}dB</span> PSNR improvement and <span className="text-white font-medium">{(testingMetrics.ssim * 100).toFixed(1)}%</span> structural similarity.</p>
                          </div>
                        ) : (
                          <div className="bg-esrgan-black p-4 rounded-md border border-gray-800">
                            <p className="text-gray-300">Model achieved <span className="text-white font-medium">{(testingMetrics.accuracy * 100).toFixed(1)}%</span> accuracy with <span className="text-white font-medium">{(testingMetrics.psnr).toFixed(1)}dB</span> PSNR and <span className="text-white font-medium">{(testingMetrics.ssim * 100).toFixed(1)}%</span> structural similarity.</p>
                          </div>
                        )}
                      </div>

                      <div className="h-64 bg-esrgan-black-dark rounded-md p-4">
                        <div className="text-center text-gray-400 py-24">
                          Test results visualization would be displayed here
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="process" className="mt-6">
              <Card className="bg-esrgan-black-light border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Training Process Overview</CardTitle>
                  <CardDescription>Understanding the Real-ESRGAN training workflow for images and license plates</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="grid gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white">1. Real-ESRGAN Technology</h3>
                      <div className="rounded-lg bg-esrgan-black p-4 border border-gray-800">
                        <p className="text-gray-300">
                          Real-ESRGAN is an enhanced version of ESRGAN that introduces:
                        </p>
                        <ul className="list-disc list-inside mt-2 space-y-2 text-gray-300 ml-4">
                          <li>Pure synthetic data training scheme</li>
                          <li>High-order degradation modeling</li>
                          <li>U-Net discriminator with spectral normalization</li>
                          <li>Enhanced perceptual loss and improved sharpness</li>
                          <li>Specialized pipeline for license plate enhancement and recognition</li>
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white">2. License Plate Processing</h3>
                      <div className="rounded-lg bg-esrgan-black p-4 border border-gray-800">
                        <p className="text-gray-300">
                          The license plate recognition pipeline involves:
                        </p>
                        <ul className="list-disc list-inside mt-2 space-y-2 text-gray-300 ml-4">
                          <li>Super-resolution enhancement of low-quality vehicle images</li>
                          <li>Plate detection using specialized region proposal networks</li>
                          <li>Character segmentation and recognition with OCR</li>
                          <li>Special handling of different plate formats across various countries</li>
                          <li>Support for various lighting conditions and viewing angles</li>
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white">3. Training Process</h3>
                      <div className="rounded-lg bg-esrgan-black p-4 border border-gray-800">
                        <p className="text-gray-300">
                          The Real-ESRGAN training process involves:
                        </p>
                        <ul className="list-disc list-inside mt-2 space-y-2 text-gray-300 ml-4">
                          <li>Synthetic degradation pipeline for realistic training data</li>
                          <li>Second-order degradation modeling for better restoration</li>
                          <li>Enhanced network architecture with improved stability</li>
                          <li>Training with mixed synthetic and real-world data</li>
                          <li>Special augmentation techniques for license plate images</li>
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white">4. Evaluation</h3>
                      <div className="rounded-lg bg-esrgan-black p-4 border border-gray-800">
                        <p className="text-gray-300">
                          Model evaluation includes both quantitative metrics (PSNR, SSIM) and 
                          qualitative assessment of restored images, with particular focus on:
                        </p>
                        <ul className="list-disc list-inside mt-2 space-y-2 text-gray-300 ml-4">
                          <li>Texture quality and sharpness</li>
                          <li>Artifact suppression</li>
                          <li>Color fidelity</li>
                          <li>Character recognition accuracy (for license plates)</li>
                          <li>Overall perceptual quality</li>
                        </ul>
                      </div>
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
                          onClick={() => setSelectedDataset('DIV2K')}
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
                          onClick={() => setSelectedDataset('DF2K')}
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
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white">License Plate Datasets</h3>
                      
                      <div className="space-y-3">
                        <Button 
                          variant={selectedDataset === 'INDIAN_LP' ? 'default' : 'outline'}
                          className={selectedDataset === 'INDIAN_LP' ? 'bg-esrgan-orange w-full' : 'border-gray-700 w-full'}
                          onClick={() => {
                            setSelectedDataset('INDIAN_LP');
                            setModelType('license-plate');
                          }}
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
                          onClick={() => {
                            setSelectedDataset('AUTO_LP');
                            setModelType('license-plate');
                          }}
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
