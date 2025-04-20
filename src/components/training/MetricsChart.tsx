
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { type MetricConfig } from '@/config/metricsConfig';

interface MetricsChartProps {
  title: string;
  data: any[];
  metrics: MetricConfig[];
}

export const MetricsChart: React.FC<MetricsChartProps> = ({ title, data, metrics }) => {
  const chartConfig = metrics.reduce((acc, metric) => {
    acc[metric.key] = {
      color: metric.color,
      label: metric.name,
    };
    return acc;
  }, {} as Record<string, { color: string; label: string; }>);

  return (
    <Card className="bg-esrgan-black-light border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[300px]" config={chartConfig}>
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="epoch" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <ChartTooltip />
            <Legend />
            {metrics.map((metric) => (
              <Line
                key={metric.key}
                type="monotone"
                dataKey={metric.key}
                name={metric.name}
                stroke={metric.color}
                dot={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
