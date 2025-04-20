
// Simulated training service

export interface Dataset {
  name: string;
  description: string;
  imageCount: number;
  trainingProgress: number;
  testingProgress: number;
  accuracy: number;
  status: 'pending' | 'training' | 'testing' | 'completed' | 'error';
}

// Mock datasets
const DATASETS: Dataset[] = [
  {
    name: 'DIV2K',
    description: 'High-quality 2K resolution images',
    imageCount: 1000,
    trainingProgress: 100,
    testingProgress: 100,
    accuracy: 95.8,
    status: 'completed'
  },
  {
    name: 'DF2K',
    description: 'Combined DIV2K and Flickr2K dataset',
    imageCount: 3450,
    trainingProgress: 85,
    testingProgress: 70,
    accuracy: 92.3,
    status: 'testing'
  },
  {
    name: 'INDIAN_LP',
    description: 'Indian license plate dataset',
    imageCount: 5280,
    trainingProgress: 65,
    testingProgress: 40,
    accuracy: 89.7,
    status: 'training'
  },
  {
    name: 'AUTO_LP',
    description: 'International license plate dataset',
    imageCount: 10500,
    trainingProgress: 30,
    testingProgress: 0,
    accuracy: 0,
    status: 'training'
  }
];

// Mock training data
const TRAINING_DATA = Array.from({ length: 50 }, (_, i) => ({
  epoch: i + 1,
  loss: 100 / (i + 5) + Math.random() * 0.5,
  accuracy: 80 + (i / 5) + Math.random() * 0.5,
  testLoss: 100 / (i + 4) + Math.random() * 0.8,
  testAccuracy: 75 + (i / 5) + Math.random() * 0.8,
  psnr: 20 + (i / 10) + Math.random() * 0.3,
  ssim: 0.6 + (i / 500) + Math.random() * 0.01,
  lpips: 0.3 - (i / 500) + Math.random() * 0.01,
  sharpness: 60 + (i / 2) + Math.random() * 2,
  noiseReduction: 50 + (i / 3) + Math.random() * 2,
  colorFidelity: 70 + (i / 4) + Math.random() * 2,
  textureDetail: 65 + (i / 3) + Math.random() * 2,
  ...(i > 10 ? {
    plateDetectionAccuracy: 82 + (i / 10) + Math.random() * 0.5,
    plateRecognitionAccuracy: 78 + (i / 12) + Math.random() * 0.5
  } : {})
}));

// Simulate training progress updates
const updateDatasetProgress = (
  datasets: Dataset[],
  callback: (updatedDatasets: Dataset[]) => void
) => {
  let updatedDatasets = [...datasets];
  let interval: NodeJS.Timeout;
  
  let step = 0;
  const maxSteps = 25;
  
  interval = setInterval(() => {
    updatedDatasets = updatedDatasets.map(dataset => {
      if (dataset.status === 'training' && dataset.trainingProgress < 100) {
        const increment = Math.random() * 5 + 1;
        const newProgress = Math.min(100, dataset.trainingProgress + increment);
        
        return {
          ...dataset,
          trainingProgress: newProgress,
          status: newProgress >= 100 ? 'completed' : 'training'
        };
      }
      return dataset;
    });
    
    callback([...updatedDatasets]);
    
    step++;
    if (step >= maxSteps) {
      clearInterval(interval);
      callback([...updatedDatasets]);
    }
  }, 500);
  
  return () => clearInterval(interval);
};

// Simulate testing progress updates
const updateDatasetTestingProgress = (
  datasets: Dataset[],
  callback: (updatedDatasets: Dataset[]) => void
) => {
  let updatedDatasets = [...datasets];
  let interval: NodeJS.Timeout;
  
  let step = 0;
  const maxSteps = 20;
  
  interval = setInterval(() => {
    updatedDatasets = updatedDatasets.map(dataset => {
      if (dataset.trainingProgress >= 50 && dataset.testingProgress < 100) {
        const increment = Math.random() * 7 + 1;
        const newProgress = Math.min(100, dataset.testingProgress + increment);
        
        let newAccuracy = dataset.accuracy;
        if (newProgress >= 100 && dataset.accuracy === 0) {
          newAccuracy = 80 + Math.random() * 15;
        }
        
        return {
          ...dataset,
          testingProgress: newProgress,
          accuracy: newAccuracy,
          status: newProgress >= 100 ? 'completed' : 'testing'
        };
      }
      return dataset;
    });
    
    callback([...updatedDatasets]);
    
    step++;
    if (step >= maxSteps) {
      clearInterval(interval);
      callback([...updatedDatasets]);
    }
  }, 600);
  
  return () => clearInterval(interval);
};

class TrainingService {
  private datasets: Dataset[] = [...DATASETS];
  private trainingData = [...TRAINING_DATA];
  
  getDatasets(): Dataset[] {
    return [...this.datasets];
  }
  
  getTrainingData(): any[] {
    return [...this.trainingData];
  }
  
  async trainAll(progressCallback: (datasets: Dataset[]) => void): Promise<void> {
    return new Promise((resolve) => {
      const cleanup = updateDatasetProgress(this.datasets, (updatedDatasets) => {
        this.datasets = updatedDatasets;
        progressCallback(this.datasets);
      });
      
      // Resolve after some time to simulate completion
      setTimeout(() => {
        cleanup();
        resolve();
      }, 15000);
    });
  }
  
  async testAll(progressCallback: (datasets: Dataset[]) => void): Promise<void> {
    return new Promise((resolve) => {
      const cleanup = updateDatasetTestingProgress(this.datasets, (updatedDatasets) => {
        this.datasets = updatedDatasets;
        progressCallback(this.datasets);
      });
      
      // Resolve after some time to simulate completion
      setTimeout(() => {
        cleanup();
        resolve();
      }, 12000);
    });
  }
}

export const trainingService = new TrainingService();
