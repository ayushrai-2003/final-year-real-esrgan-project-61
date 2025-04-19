
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dataset } from "@/services/TrainingService";

interface DatasetCardProps {
  dataset: Dataset;
}

export const DatasetCard: React.FC<DatasetCardProps> = ({ dataset }) => {
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

  return (
    <div className="space-y-2">
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
  );
};
