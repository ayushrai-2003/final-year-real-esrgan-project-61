
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

interface MetricsProps {
  trainingData: {
    epoch: number;
    loss: number;
    accuracy: number;
    psnr: number;
    ssim: number;
    lpips?: number;
    sharpness?: number;
    noiseReduction?: number;
    colorFidelity?: number;
    textureDetail?: number;
    plateDetectionAccuracy?: number;
    plateRecognitionAccuracy?: number;
  }[];
  currentEpoch: number;
}

const TrainingMetrics = ({ trainingData, currentEpoch }: MetricsProps) => {
  const config = {
    loss: {
      label: 'Loss',
      theme: {
        light: '#ef4444',
        dark: '#ef4444',
      },
    },
    accuracy: {
      label: 'Accuracy',
      theme: {
        light: '#22c55e',
        dark: '#22c55e',
      },
    },
    psnr: {
      label: 'PSNR',
      theme: {
        light: '#3b82f6',
        dark: '#3b82f6',
      },
    },
    ssim: {
      label: 'SSIM',
      theme: {
        light: '#a855f7',
        dark: '#a855f7',
      },
    },
    lpips: {
      label: 'LPIPS',
      theme: {
        light: '#f59e0b',
        dark: '#f59e0b',
      },
    },
    sharpness: {
      label: 'Sharpness',
      theme: {
        light: '#10b981',
        dark: '#10b981',
      },
    },
    noiseReduction: {
      label: 'Noise Reduction',
      theme: {
        light: '#6366f1',
        dark: '#6366f1',
      },
    },
    colorFidelity: {
      label: 'Color Fidelity',
      theme: {
        light: '#ec4899',
        dark: '#ec4899',
      },
    },
    textureDetail: {
      label: 'Texture Detail',
      theme: {
        light: '#8b5cf6',
        dark: '#8b5cf6',
      },
    },
    plateDetectionAccuracy: {
      label: 'Plate Detection',
      theme: {
        light: '#f97316',
        dark: '#f97316',
      },
    },
    plateRecognitionAccuracy: {
      label: 'Plate Recognition',
      theme: {
        light: '#06b6d4',
        dark: '#06b6d4',
      },
    },
  };

  const hasImageQualityMetrics = trainingData.length > 0 && (
    trainingData[0].sharpness !== undefined || 
    trainingData[0].noiseReduction !== undefined || 
    trainingData[0].colorFidelity !== undefined || 
    trainingData[0].textureDetail !== undefined
  );

  const hasLpips = trainingData.length > 0 && trainingData[0].lpips !== undefined;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-esrgan-black-light border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Training Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]" config={config}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trainingData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="epoch" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <ChartTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="loss" name="Loss" stroke="#ef4444" dot={false} />
                  <Line type="monotone" dataKey="accuracy" name="Accuracy" stroke="#22c55e" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-esrgan-black-light border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Quality Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]" config={config}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trainingData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="epoch" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <ChartTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="psnr" name="PSNR" stroke="#3b82f6" dot={false} />
                  <Line type="monotone" dataKey="ssim" name="SSIM" stroke="#a855f7" dot={false} />
                  {hasLpips && <Line type="monotone" dataKey="lpips" name="LPIPS" stroke="#f59e0b" dot={false} />}
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {hasImageQualityMetrics && (
        <Card className="bg-esrgan-black-light border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Enhanced Image Quality Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]" config={config}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trainingData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="epoch" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <ChartTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sharpness" name="Sharpness" stroke="#10b981" dot={false} />
                  <Line type="monotone" dataKey="noiseReduction" name="Noise Reduction" stroke="#6366f1" dot={false} />
                  <Line type="monotone" dataKey="colorFidelity" name="Color Fidelity" stroke="#ec4899" dot={false} />
                  <Line type="monotone" dataKey="textureDetail" name="Texture Detail" stroke="#8b5cf6" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {trainingData.length > 0 && trainingData[0].plateDetectionAccuracy !== undefined && (
        <Card className="bg-esrgan-black-light border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">License Plate Recognition Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]" config={config}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trainingData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="epoch" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <ChartTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="plateDetectionAccuracy" name="Plate Detection" stroke="#f97316" dot={false} />
                  <Line type="monotone" dataKey="plateRecognitionAccuracy" name="Plate Recognition" stroke="#06b6d4" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrainingMetrics;
