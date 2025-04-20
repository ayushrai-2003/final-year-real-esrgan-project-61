
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DatasetAccuracyChartProps {
  data: Array<{
    name: string;
    accuracy: number;
  }>;
}

export const DatasetAccuracyChart: React.FC<DatasetAccuracyChartProps> = ({ data }) => {
  // Filter out datasets with no accuracy data yet
  const validData = data.filter(item => item.accuracy > 0);
  
  return (
    <Card className="bg-esrgan-black-light border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Dataset Accuracy Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        {validData.length > 0 ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={validData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis 
                  stroke="#9CA3AF"
                  domain={[80, 100]} 
                  tickFormatter={(value) => `${value}%`} 
                />
                <Tooltip 
                  formatter={(value) => [`${Number(value).toFixed(2)}%`, 'Accuracy']}
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#e5e7eb' }}
                />
                <Legend />
                <Bar 
                  dataKey="accuracy" 
                  name="Accuracy" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-400">
            No accuracy data available yet. Run tests to generate data.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
