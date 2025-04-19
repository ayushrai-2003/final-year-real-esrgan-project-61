
import React from 'react';
import { MetricsChart } from './MetricsChart';

interface TrainingMetricsProps {
  trainingData: any[];
  currentEpoch: number;
}

const TrainingMetrics: React.FC<TrainingMetricsProps> = ({ trainingData, currentEpoch }) => {
  const trainingMetrics = [
    { key: 'loss', name: 'Loss', color: '#ef4444' },
    { key: 'accuracy', name: 'Accuracy', color: '#22c55e' }
  ];

  const qualityMetrics = [
    { key: 'psnr', name: 'PSNR', color: '#3b82f6' },
    { key: 'ssim', name: 'SSIM', color: '#a855f7' },
    { key: 'lpips', name: 'LPIPS', color: '#f59e0b' }
  ];

  const imageQualityMetrics = [
    { key: 'sharpness', name: 'Sharpness', color: '#10b981' },
    { key: 'noiseReduction', name: 'Noise Reduction', color: '#6366f1' },
    { key: 'colorFidelity', name: 'Color Fidelity', color: '#ec4899' },
    { key: 'textureDetail', name: 'Texture Detail', color: '#8b5cf6' }
  ];

  const plateMetrics = [
    { key: 'plateDetectionAccuracy', name: 'Plate Detection', color: '#f97316' },
    { key: 'plateRecognitionAccuracy', name: 'Plate Recognition', color: '#06b6d4' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricsChart
          title="Training Progress"
          data={trainingData}
          metrics={trainingMetrics}
        />
        <MetricsChart
          title="Quality Metrics"
          data={trainingData}
          metrics={qualityMetrics}
        />
      </div>

      {trainingData[0]?.sharpness !== undefined && (
        <MetricsChart
          title="Enhanced Image Quality Metrics"
          data={trainingData}
          metrics={imageQualityMetrics}
        />
      )}

      {trainingData[0]?.plateDetectionAccuracy !== undefined && (
        <MetricsChart
          title="License Plate Recognition Metrics"
          data={trainingData}
          metrics={plateMetrics}
        />
      )}
    </div>
  );
};

export default TrainingMetrics;
