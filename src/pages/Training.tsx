import React, { useState } from 'react';
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
import { ArrowRight, Settings, Folders, BarChart, Play, PauseCircle, Save, Code } from "lucide-react";
import { ModelTrainingCode } from "@/components/model-training-code";

const Training = () => {
  const [trainingStatus, setTrainingStatus] = useState('idle');
  const [dataset, setDataset] = useState<File | null>(null);
  const [epochs, setEpochs] = useState(100);
  const [batchSize, setBatchSize] = useState(16);
  const [learningRate, setLearningRate] = useState(0.001);
  const [usePretrainedModel, setUsePretrainedModel] = useState(true);
  const [validationSplit, setValidationSplit] = useState(0.2);
  const [trainingProgress, setTrainingProgress] = useState(0);
  
  // Mock data for charts
  const trainingLoss = Array.from({ length: 10 }, (_, i) => ({
    epoch: i + 1,
    loss: 0.5 - (0.4 * i / 10)
  }));
  
  const testingMetrics = {
    psnr: 28.7,
    ssim: 0.82,
    accuracy: 0.89
  };
  
  const handleDatasetUpload = (file: File) => {
    setDataset(file);
  };
  
  const handleStartTraining = () => {
    // In a real app, you would call a backend API to start training
    setTrainingStatus('training');
    
    // Mock training progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setTrainingProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTrainingStatus('completed');
      }
    }, 300);
  };
  
  const handleStopTraining = () => {
    setTrainingStatus('stopped');
  };
  
  const handleSaveModel = () => {
    // In a real app, you would call a backend API to save the trained model
    // For now, we'll just show a toast message
    toast.success('Model saved successfully!');
  };
  
  return (
    <div className="flex min-h-screen flex-col bg-esrgan-black">
      <Toaster position="top-center" />
      <Header />
      
      <main className="flex-1 py-16">
        <div className="container">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl text-center">
            ESRGAN <span className="gradient-text">Training Dashboard</span>
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-300 text-center">
            Train your own ESRGAN model for image enhancement with custom datasets and parameters
          </p>
          
          <Tabs defaultValue="training" className="max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="training">Training</TabsTrigger>
              <TabsTrigger value="testing">Testing</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
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
                      <CardDescription>Upload your training dataset (zip file containing image pairs)</CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <FileUpload
                        onFileSelect={handleDatasetUpload}
                        accept=".zip,.tar,.gz"
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
                        </div>
                      )}
                      
                      {(trainingStatus === 'completed' || trainingStatus === 'stopped') && (
                        <div className="space-y-4">
                          <div className="h-48 bg-esrgan-black-dark rounded-md p-4">
                            {/* In a real app, you would render a chart library here */}
                            <div className="text-center text-gray-400 py-16">
                              Training loss graph would be displayed here
                            </div>
                          </div>
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
                      <FileUpload
                        onFileSelect={() => {}}
                        accept=".zip,.tar,.gz"
                      />
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
            
            <TabsContent value="code" className="mt-6">
              <div className="space-y-4">
                <div className="bg-esrgan-black-light rounded-xl border border-gray-800 p-6">
                  <h3 className="mb-4 text-xl font-medium text-white flex items-center">
                    <Code className="mr-2 h-5 w-5 text-esrgan-orange" />
                    Implementation Code
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Below is the sample Python code to train and test your ESRGAN model. You can copy and adapt 
                    this code for your own implementation.
                  </p>
                </div>
                
                <ModelTrainingCode />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Training;
