
export type MetricConfig = {
  key: string;
  name: string;
  color: string;
};

export const trainingMetrics: MetricConfig[] = [
  { key: 'loss', name: 'Loss', color: '#ef4444' },
  { key: 'accuracy', name: 'Accuracy', color: '#22c55e' }
];

export const qualityMetrics: MetricConfig[] = [
  { key: 'psnr', name: 'PSNR', color: '#3b82f6' },
  { key: 'ssim', name: 'SSIM', color: '#a855f7' },
  { key: 'lpips', name: 'LPIPS', color: '#f59e0b' }
];

export const imageQualityMetrics: MetricConfig[] = [
  { key: 'sharpness', name: 'Sharpness', color: '#10b981' },
  { key: 'noiseReduction', name: 'Noise Reduction', color: '#6366f1' },
  { key: 'colorFidelity', name: 'Color Fidelity', color: '#ec4899' },
  { key: 'textureDetail', name: 'Texture Detail', color: '#8b5cf6' }
];

export const plateMetrics: MetricConfig[] = [
  { key: 'plateDetectionAccuracy', name: 'Plate Detection', color: '#f97316' },
  { key: 'plateRecognitionAccuracy', name: 'Plate Recognition', color: '#06b6d4' }
];
