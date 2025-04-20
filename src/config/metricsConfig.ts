
export const trainingMetrics = [
  { key: 'loss', name: 'Loss', color: '#ef4444' },
  { key: 'accuracy', name: 'Accuracy', color: '#22c55e' }
] as const;

export const qualityMetrics = [
  { key: 'psnr', name: 'PSNR', color: '#3b82f6' },
  { key: 'ssim', name: 'SSIM', color: '#a855f7' },
  { key: 'lpips', name: 'LPIPS', color: '#f59e0b' }
] as const;

export const imageQualityMetrics = [
  { key: 'sharpness', name: 'Sharpness', color: '#10b981' },
  { key: 'noiseReduction', name: 'Noise Reduction', color: '#6366f1' },
  { key: 'colorFidelity', name: 'Color Fidelity', color: '#ec4899' },
  { key: 'textureDetail', name: 'Texture Detail', color: '#8b5cf6' }
] as const;

export const plateMetrics = [
  { key: 'plateDetectionAccuracy', name: 'Plate Detection', color: '#f97316' },
  { key: 'plateRecognitionAccuracy', name: 'Plate Recognition', color: '#06b6d4' }
] as const;
