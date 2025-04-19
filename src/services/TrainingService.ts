
export type Dataset = {
  name: string;
  description: string;
  imageCount: number;
  trainingProgress: number;
  status: 'pending' | 'training' | 'completed' | 'error';
};

class TrainingService {
  private datasets: Dataset[] = [
    {
      name: "DIV2K",
      description: "High-quality 2K resolution images",
      imageCount: 1000,
      trainingProgress: 0,
      status: 'pending'
    },
    {
      name: "DF2K",
      description: "Combined DIV2K and Flickr2K dataset",
      imageCount: 3450,
      trainingProgress: 0,
      status: 'pending'
    },
    {
      name: "INDIAN_LP",
      description: "Indian License Plate dataset",
      imageCount: 5000,
      trainingProgress: 0,
      status: 'pending'
    },
    {
      name: "AUTO_LP",
      description: "Automatic License Plate Detection dataset",
      imageCount: 10000,
      trainingProgress: 0,
      status: 'pending'
    }
  ];

  public async trainDataset(dataset: Dataset, onProgress: (progress: number) => void): Promise<void> {
    dataset.status = 'training';
    
    // Simulate training process with realistic delays and metrics
    const totalEpochs = 100;
    const batchSize = 32;
    const totalBatches = Math.floor(dataset.imageCount / batchSize);
    
    for (let epoch = 0; epoch < totalEpochs; epoch++) {
      for (let batch = 0; batch < totalBatches; batch++) {
        // Simulate training delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Calculate and update progress
        const progress = ((epoch * totalBatches + batch) / (totalEpochs * totalBatches)) * 100;
        dataset.trainingProgress = Math.min(progress, 100);
        onProgress(dataset.trainingProgress);
      }
    }
    
    dataset.status = 'completed';
  }

  public async trainAll(onDatasetProgress: (datasets: Dataset[]) => void): Promise<void> {
    for (const dataset of this.datasets) {
      await this.trainDataset(dataset, () => {
        onDatasetProgress([...this.datasets]);
      });
    }
  }

  public getDatasets(): Dataset[] {
    return this.datasets;
  }
}

export const trainingService = new TrainingService();
