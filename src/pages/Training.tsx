
import React, { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DatasetList } from "@/components/training/DatasetList";
import TrainingMetrics from "@/components/training/TrainingMetrics";
import { useTraining } from "@/hooks/useTraining";
import { trainingService } from "@/services/TrainingService";

const Training = () => {
  const { datasets, isTraining, isTesting, currentEpoch, startTraining, startTesting, generateDatasetAccuracyData } = useTraining();
  const [trainingData, setTrainingData] = useState<any[]>([]);

  useEffect(() => {
    // Load training data
    setTrainingData(trainingService.getTrainingData());
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-esrgan-black">
      <Header />
      
      <main className="flex-1 py-16">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <h1 className="mb-2 text-3xl font-bold text-white">Model Training</h1>
            <p className="mb-8 text-gray-400">
              Monitor and control the training process of our ESRGAN model across different datasets.
            </p>
            
            <DatasetList 
              datasets={datasets}
              isTraining={isTraining}
              isTesting={isTesting}
              onStartTraining={startTraining}
              onStartTesting={startTesting}
            />
            
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Training Metrics</h2>
              <TrainingMetrics 
                trainingData={trainingData}
                currentEpoch={currentEpoch}
                datasetAccuracyData={generateDatasetAccuracyData()}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Training;
