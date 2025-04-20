
import { useState, useEffect } from 'react';
import { trainingService, Dataset } from '@/services/TrainingService';
import { toast } from 'sonner';

export const useTraining = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [currentEpoch, setCurrentEpoch] = useState(0);

  useEffect(() => {
    setDatasets(trainingService.getDatasets());
  }, []);

  const startTraining = async () => {
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

  const startTesting = async () => {
    setIsTesting(true);
    try {
      await trainingService.testAll((updatedDatasets) => {
        setDatasets(updatedDatasets);
      });
      toast.success("Testing completed successfully!");
    } catch (error) {
      toast.error("An error occurred during testing");
    } finally {
      setIsTesting(false);
    }
  };

  const generateDatasetAccuracyData = () => {
    return datasets.map(dataset => ({
      name: dataset.name,
      accuracy: dataset.accuracy
    }));
  };

  return {
    datasets,
    isTraining,
    isTesting,
    currentEpoch,
    startTraining,
    startTesting,
    generateDatasetAccuracyData
  };
};
