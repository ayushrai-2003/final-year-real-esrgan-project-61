
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Play, TestTube } from "lucide-react";
import { Dataset } from "@/services/TrainingService";
import { DatasetCard } from "./DatasetCard";

interface DatasetListProps {
  datasets: Dataset[];
  isTraining: boolean;
  isTesting: boolean;
  onStartTraining: () => void;
  onStartTesting: () => void;
}

export const DatasetList: React.FC<DatasetListProps> = ({
  datasets,
  isTraining,
  isTesting,
  onStartTraining,
  onStartTesting,
}) => {
  return (
    <Card className="mb-8 bg-esrgan-black-light border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Dataset Training Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {datasets.map((dataset) => (
            <DatasetCard key={dataset.name} dataset={dataset} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Button
            className="w-full bg-esrgan-orange hover:bg-esrgan-orange/80"
            onClick={onStartTraining}
            disabled={isTraining || isTesting}
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
          
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={onStartTesting}
            disabled={isTraining || isTesting}
          >
            {isTesting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing in Progress...
              </>
            ) : (
              <>
                <TestTube className="mr-2 h-4 w-4" />
                Start Testing All Datasets
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
