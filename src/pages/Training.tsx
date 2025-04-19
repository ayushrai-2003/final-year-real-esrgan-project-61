
import React, { useState, useEffect } from 'react';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TrainingMetrics } from "@/components/training/TrainingMetrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Play, Check, AlertCircle } from "lucide-react";
import { trainingService, Dataset } from "@/services/TrainingService";

export default function Training() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  
  useEffect(() => {
    setDatasets(trainingService.getDatasets());
  }, []);

  const handleStartTraining = async () => {
    setIsTraining(true);
    try {
      await trainingService.trainAll((updatedDatasets) => {
        setDatasets(updatedDatasets);
        const completedCount = updatedDatasets.filter(d => d.status === 'completed').length;
        setCurrentEpoch(Math.floor((completedCount / updatedDatasets.length) * 100));
      });
      toast.success("Training completed successfully!");
    } catch (error) {
      toast.error("An error occurred during training");
    } finally {
      setIsTraining(false);
    }
  };

  const getStatusBadge = (status: Dataset['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'training':
        return <Badge variant="secondary" className="bg-blue-500 text-white">Training</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-green-500 text-white">Completed</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
    }
  };

  const generateSampleTrainingData = (epochs: number) => {
    const data = [];
    for (let i = 0; i <= epochs; i++) {
      data.push({
        epoch: i,
        loss: Math.max(0.8 - (i * 0.07) + (Math.random() * 0.1), 0.1),
        accuracy: Math.min(0.6 + (i * 0.03) + (Math.random() * 0.05), 0.98),
        psnr: Math.min(25 + (i * 0.5) + (Math.random() * 2), 35),
        ssim: Math.min(0.7 + (i * 0.02) + (Math.random() * 0.05), 0.95),
        lpips: Math.max(0.3 - (i * 0.02) + (Math.random() * 0.03), 0.05),
      });
    }
    return data;
  };

  return (
    <div className="flex min-h-screen flex-col bg-esrgan-black">
      <Header />
      
      <main className="flex-1 py-20">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-white mb-4">Model Training Dashboard</h1>
              <p className="text-gray-400">Train the model on multiple datasets to improve enhancement accuracy</p>
            </div>

            <Card className="mb-8 bg-esrgan-black-light border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Dataset Training Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {datasets.map((dataset) => (
                    <div key={dataset.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-white">{dataset.name}</h3>
                          <p className="text-sm text-gray-400">{dataset.description}</p>
                        </div>
                        {getStatusBadge(dataset.status)}
                      </div>
                      <Progress value={dataset.trainingProgress} className="h-2" />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{dataset.imageCount.toLocaleString()} images</span>
                        <span>{Math.round(dataset.trainingProgress)}% complete</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full mt-8 bg-esrgan-orange hover:bg-esrgan-orange/80"
                  onClick={handleStartTraining}
                  disabled={isTraining}
                >
                  {isTraining ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Training in Progress...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Start Training All Datasets
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <TrainingMetrics
              trainingData={generateSampleTrainingData(currentEpoch)}
              currentEpoch={currentEpoch}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
