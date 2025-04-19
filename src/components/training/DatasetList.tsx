
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Play } from "lucide-react";
import { Dataset } from "@/services/TrainingService";
import { DatasetCard } from "./DatasetCard";

interface DatasetListProps {
  datasets: Dataset[];
  isTraining: boolean;
  onStartTraining: () => void;
}

export const DatasetList: React.FC<DatasetListProps> = ({
  datasets,
  isTraining,
  onStartTraining,
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

        <Button
          className="w-full mt-8 bg-esrgan-orange hover:bg-esrgan-orange/80"
          onClick={onStartTraining}
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
  );
};
