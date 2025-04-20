
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export interface EnhancementOptions {
  sharpness: number;
  noiseReduction: number;
  colorBoost: number;
  detailEnhancement: number;
  scale: number;
  width: number;
  height: number;
}

interface EnhancementSettingsProps {
  options: EnhancementOptions;
  onOptionsChange: (options: EnhancementOptions) => void;
}

export const EnhancementSettings: React.FC<EnhancementSettingsProps> = ({
  options,
  onOptionsChange,
}) => {
  const updateOption = (key: keyof EnhancementOptions, value: number) => {
    onOptionsChange({
      ...options,
      [key]: value,
    });
  };

  const handleResolutionChange = (dimension: 'width' | 'height', value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      onOptionsChange({
        ...options,
        [dimension]: numValue,
      });
    }
  };

  return (
    <Card className="bg-esrgan-black-light border-gray-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg">Enhancement Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="sharpness" className="text-gray-200">Sharpness</Label>
              <span className="text-sm text-gray-400">{options.sharpness}</span>
            </div>
            <Slider
              id="sharpness"
              min={0}
              max={100}
              step={1}
              value={[options.sharpness]}
              onValueChange={(values) => updateOption('sharpness', values[0])}
              className="[&_[role=slider]]:bg-esrgan-orange"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="noiseReduction" className="text-gray-200">Noise Reduction</Label>
              <span className="text-sm text-gray-400">{options.noiseReduction}</span>
            </div>
            <Slider
              id="noiseReduction"
              min={0}
              max={100}
              step={1}
              value={[options.noiseReduction]}
              onValueChange={(values) => updateOption('noiseReduction', values[0])}
              className="[&_[role=slider]]:bg-esrgan-orange"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="colorBoost" className="text-gray-200">Color Boost</Label>
              <span className="text-sm text-gray-400">{options.colorBoost}</span>
            </div>
            <Slider
              id="colorBoost"
              min={0}
              max={100}
              step={1}
              value={[options.colorBoost]}
              onValueChange={(values) => updateOption('colorBoost', values[0])}
              className="[&_[role=slider]]:bg-esrgan-orange"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="detailEnhancement" className="text-gray-200">Detail Enhancement</Label>
              <span className="text-sm text-gray-400">{options.detailEnhancement}</span>
            </div>
            <Slider
              id="detailEnhancement"
              min={0}
              max={100}
              step={1}
              value={[options.detailEnhancement]}
              onValueChange={(values) => updateOption('detailEnhancement', values[0])}
              className="[&_[role=slider]]:bg-esrgan-orange"
            />
          </div>
        </div>

        <Separator className="bg-gray-800" />

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="scale" className="text-gray-200">Upscale Factor</Label>
            <Select
              value={options.scale.toString()}
              onValueChange={(value) => updateOption('scale', parseInt(value))}
            >
              <SelectTrigger id="scale" className="border-gray-700 bg-gray-900 text-gray-200">
                <SelectValue placeholder="Select scale" />
              </SelectTrigger>
              <SelectContent className="border-gray-700 bg-gray-900 text-gray-200">
                <SelectItem value="2">2x</SelectItem>
                <SelectItem value="4">4x</SelectItem>
                <SelectItem value="8">8x</SelectItem>
                <SelectItem value="16">16x</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width" className="text-gray-200">Width (px)</Label>
              <Input
                id="width"
                type="number"
                value={options.width}
                onChange={(e) => handleResolutionChange('width', e.target.value)}
                className="border-gray-700 bg-gray-900 text-gray-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height" className="text-gray-200">Height (px)</Label>
              <Input
                id="height"
                type="number"
                value={options.height}
                onChange={(e) => handleResolutionChange('height', e.target.value)}
                className="border-gray-700 bg-gray-900 text-gray-200"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
