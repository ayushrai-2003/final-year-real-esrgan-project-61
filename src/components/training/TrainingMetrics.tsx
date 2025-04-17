
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
  };

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
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrainingMetrics;
