
import React from 'react';
import { MetricsChart } from './MetricsChart';
import {
  trainingMetrics,
  qualityMetrics,
  imageQualityMetrics,
  plateMetrics,
  type MetricConfig
} from '@/config/metricsConfig';

interface TrainingMetricsProps {
  trainingData: any[];
  currentEpoch: number;
}

const TrainingMetrics: React.FC<TrainingMetricsProps> = ({ trainingData, currentEpoch }) => {
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
