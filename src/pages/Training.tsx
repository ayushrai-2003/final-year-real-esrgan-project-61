import React, { useState, useEffect } from 'react';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import TrainingMetrics from "@/components/training/TrainingMetrics";
import { toast } from "sonner";
import { trainingService, Dataset } from "@/services/TrainingService";
import { DatasetList } from "@/components/training/DatasetList";

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

            <DatasetList
              datasets={datasets}
              isTraining={isTraining}
              onStartTraining={handleStartTraining}
            />

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
