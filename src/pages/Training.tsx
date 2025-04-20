
import React from 'react';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import TrainingMetrics from "@/components/training/TrainingMetrics";
import { DatasetList } from "@/components/training/DatasetList";
import { useTraining } from "@/hooks/useTraining";

export default function Training() {
  const { 
    datasets, 
    isTraining, 
    isTesting, 
    currentEpoch, 
    startTraining, 
    startTesting,
    generateDatasetAccuracyData
  } = useTraining();

  return (
    <div className="flex min-h-screen flex-col bg-esrgan-black">
      <Header />
      
      <main className="flex-1 py-20">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-white mb-4">Model Training Dashboard</h1>
              <p className="text-gray-400">Train and test the model on multiple datasets to improve enhancement accuracy</p>
            </div>

            <DatasetList
              datasets={datasets}
              isTraining={isTraining}
              isTesting={isTesting}
              onStartTraining={startTraining}
              onStartTesting={startTesting}
            />

            <TrainingMetrics
              trainingData={generateSampleTrainingData(currentEpoch)}
              currentEpoch={currentEpoch}
              datasetAccuracyData={generateDatasetAccuracyData()}
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
      testLoss: Math.max(0.9 - (i * 0.06) + (Math.random() * 0.15), 0.15),
      testAccuracy: Math.min(0.55 + (i * 0.025) + (Math.random() * 0.05), 0.95),
      psnr: Math.min(25 + (i * 0.5) + (Math.random() * 2), 35),
      ssim: Math.min(0.7 + (i * 0.02) + (Math.random() * 0.05), 0.95),
      lpips: Math.max(0.3 - (i * 0.02) + (Math.random() * 0.03), 0.05),
    });
  }
  return data;
};
