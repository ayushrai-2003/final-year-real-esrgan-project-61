
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Dataset } from '@/services/TrainingService';

interface DatasetCardProps {
  dataset: Dataset;
}

export const DatasetCard: React.FC<DatasetCardProps> = ({ dataset }) => {
  const getStatusText = (dataset: Dataset) => {
    switch (dataset.status) {
      case 'pending':
        return "Pending";
      case 'training':
        return "Training...";
      case 'testing':
        return "Testing...";
      case 'completed':
        return "Completed";
      case 'error':
        return "Error";
      default:
        return "";
    }
  };

  return (
    <div className="border border-gray-800 rounded-lg p-4 bg-esrgan-black-light/50">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-semibold text-white">{dataset.name}</h3>
          <p className="text-sm text-gray-400">{dataset.description}</p>
        </div>
        <div className="text-sm text-gray-400">
          {dataset.imageCount.toLocaleString()} images
        </div>
      </div>
      
      <div className="space-y-4 mt-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-300">Training Progress</span>
            <span className="text-gray-300">{Math.round(dataset.trainingProgress)}%</span>
          </div>
          <Progress value={dataset.trainingProgress} className="h-2 bg-gray-700" />
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-300">Testing Progress</span>
            <span className="text-gray-300">{Math.round(dataset.testingProgress)}%</span>
          </div>
          <Progress value={dataset.testingProgress} className="h-2 bg-gray-700" />
        </div>
        
        {dataset.accuracy > 0 && (
          <div className="text-sm text-gray-300 mt-2">
            <span className="font-semibold">Accuracy:</span> {dataset.accuracy.toFixed(2)}%
          </div>
        )}
        
        <div className="text-xs text-gray-400 mt-2">
          Status: <span className={dataset.status === 'error' ? 'text-red-500' : 'text-esrgan-orange'}>{getStatusText(dataset)}</span>
        </div>
      </div>
    </div>
  );
};
