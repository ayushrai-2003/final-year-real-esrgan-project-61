
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export function ModelTrainingCode() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (codeName: string, code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(codeName);
      toast.success("Code copied to clipboard");
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const pythonTrainingCode = `
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import transforms
from datasets import EsrganDataset
from models import RRDBNet
import os
import argparse
import time

# Parse command line arguments
parser = argparse.ArgumentParser()
parser.add_argument('--batch_size', type=int, default=16, help='training batch size')
parser.add_argument('--epochs', type=int, default=100, help='number of epochs to train for')
parser.add_argument('--lr', type=float, default=0.0001, help='learning rate')
parser.add_argument('--pretrained', action='store_true', help='use pretrained model')
parser.add_argument('--dataset', type=str, required=True, help='path to dataset')
parser.add_argument('--save_dir', type=str, default='./weights', help='where to save models')
args = parser.parse_args()

# Device configuration
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Create save directory if it doesn't exist
os.makedirs(args.save_dir, exist_ok=True)

# Transforms
transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
])

# Load dataset
train_dataset = EsrganDataset(args.dataset, transform=transform, train=True)
val_dataset = EsrganDataset(args.dataset, transform=transform, train=False)

train_loader = DataLoader(train_dataset, batch_size=args.batch_size, shuffle=True, num_workers=4)
val_loader = DataLoader(val_dataset, batch_size=args.batch_size, shuffle=False, num_workers=4)

# Initialize model
model = RRDBNet(3, 3, 64, 23, 0.2).to(device)
if args.pretrained:
    model.load_state_dict(torch.load(f'{args.save_dir}/pretrained_esrgan.pth'))
    print("Loaded pretrained model")

# Loss function and optimizer
criterion_pixel = nn.L1Loss()
criterion_content = nn.MSELoss()
optimizer = optim.Adam(model.parameters(), lr=args.lr)

# Training loop
for epoch in range(args.epochs):
    model.train()
    train_loss = 0
    start_time = time.time()

    for i, (lr_imgs, hr_imgs) in enumerate(train_loader):
        lr_imgs = lr_imgs.to(device)
        hr_imgs = hr_imgs.to(device)

        # Forward pass
        sr_imgs = model(lr_imgs)
        
        # Calculate losses
        loss_pixel = criterion_pixel(sr_imgs, hr_imgs)
        
        # Backpropagation
        optimizer.zero_grad()
        loss_pixel.backward()
        optimizer.step()
        
        train_loss += loss_pixel.item()
        
        # Print progress
        if (i + 1) % 10 == 0:
            print(f"Epoch [{epoch+1}/{args.epochs}], Step [{i+1}/{len(train_loader)}], Loss: {loss_pixel.item():.4f}")
    
    # Validation
    model.eval()
    val_loss = 0
    with torch.no_grad():
        for lr_imgs, hr_imgs in val_loader:
            lr_imgs = lr_imgs.to(device)
            hr_imgs = hr_imgs.to(device)
            sr_imgs = model(lr_imgs)
            loss = criterion_pixel(sr_imgs, hr_imgs)
            val_loss += loss.item()
    
    # Print epoch results
    train_loss /= len(train_loader)
    val_loss /= len(val_loader)
    epoch_time = time.time() - start_time
    print(f"Epoch [{epoch+1}/{args.epochs}] completed in {epoch_time:.2f}s - Train Loss: {train_loss:.4f}, Val Loss: {val_loss:.4f}")
    
    # Save model
    if (epoch + 1) % 10 == 0:
        torch.save(model.state_dict(), f'{args.save_dir}/esrgan_epoch_{epoch+1}.pth')

# Save final model
torch.save(model.state_dict(), f'{args.save_dir}/esrgan_final.pth')
print("Training completed!")
  `.trim();

  const pythonTestingCode = `
import torch
import torchvision.transforms as transforms
from torch.utils.data import DataLoader
from PIL import Image
import os
import numpy as np
from models import RRDBNet
from datasets import TestDataset
import argparse
from skimage.metrics import structural_similarity as ssim
from skimage.metrics import peak_signal_noise_ratio as psnr

# Parse command line arguments
parser = argparse.ArgumentParser()
parser.add_argument('--model_path', type=str, required=True, help='path to trained model')
parser.add_argument('--test_dir', type=str, required=True, help='path to test images')
parser.add_argument('--output_dir', type=str, default='./results', help='where to save results')
args = parser.parse_args()

# Device configuration
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Create output directory if it doesn't exist
os.makedirs(args.output_dir, exist_ok=True)

# Load model
model = RRDBNet(3, 3, 64, 23, 0.2).to(device)
model.load_state_dict(torch.load(args.model_path))
model.eval()

# Test dataset
test_dataset = TestDataset(args.test_dir, transform=transforms.ToTensor())
test_loader = DataLoader(test_dataset, batch_size=1, shuffle=False)

# Test metrics
total_psnr = 0
total_ssim = 0

# Process test images
with torch.no_grad():
    for i, (lr_img, hr_img, img_name) in enumerate(test_loader):
        lr_img = lr_img.to(device)
        hr_img = hr_img.to(device)
        
        # Generate super-resolution image
        sr_img = model(lr_img)
        
        # Convert tensors to numpy arrays for metric calculation
        sr_img_np = sr_img.squeeze(0).cpu().numpy().transpose(1, 2, 0)
        hr_img_np = hr_img.squeeze(0).cpu().numpy().transpose(1, 2, 0)
        
        # Calculate metrics
        img_psnr = psnr(hr_img_np, sr_img_np)
        img_ssim = ssim(hr_img_np, sr_img_np, multichannel=True)
        
        total_psnr += img_psnr
        total_ssim += img_ssim
        
        # Save output image
        sr_img_denorm = (sr_img.cpu().squeeze(0).permute(1, 2, 0).numpy() + 1) / 2
        sr_img_denorm = np.clip(sr_img_denorm, 0, 1)
        sr_img_pil = Image.fromarray((sr_img_denorm * 255).astype(np.uint8))
        sr_img_pil.save(os.path.join(args.output_dir, f"SR_{img_name[0]}"))
        
        print(f"Processed image {i+1}/{len(test_loader)} - PSNR: {img_psnr:.2f}dB, SSIM: {img_ssim:.4f}")

# Print average metrics
avg_psnr = total_psnr / len(test_loader)
avg_ssim = total_ssim / len(test_loader)
print(f"Average PSNR: {avg_psnr:.2f}dB, Average SSIM: {avg_ssim:.4f}")
  `.trim();

  const datasetCode = `
import os
import glob
import random
import numpy as np
from PIL import Image
import torch
from torch.utils.data import Dataset

class EsrganDataset(Dataset):
    def __init__(self, root_dir, transform=None, train=True, val_split=0.2):
        """
        Args:
            root_dir (string): Directory with all the images.
            transform (callable, optional): Optional transform to be applied on a sample.
            train (bool): If True, creates dataset from training set, otherwise creates from val set.
            val_split (float): Percentage of the dataset to use as validation.
        """
        self.root_dir = root_dir
        self.transform = transform
        self.train = train
        
        # Get all HR image paths
        self.hr_paths = sorted(glob.glob(os.path.join(root_dir, 'HR/*.png')))
        self.lr_paths = sorted(glob.glob(os.path.join(root_dir, 'LR/*.png')))
        
        # Split into train and validation sets
        n_samples = len(self.hr_paths)
        split_idx = int(n_samples * (1 - val_split))
        
        if train:
            self.hr_paths = self.hr_paths[:split_idx]
            self.lr_paths = self.lr_paths[:split_idx]
        else:
            self.hr_paths = self.hr_paths[split_idx:]
            self.lr_paths = self.lr_paths[split_idx:]

    def __len__(self):
        return len(self.hr_paths)

    def __getitem__(self, idx):
        # Load LR and HR images
        lr_img = Image.open(self.lr_paths[idx]).convert('RGB')
        hr_img = Image.open(self.hr_paths[idx]).convert('RGB')
        
        # Apply transformations
        if self.transform:
            lr_img = self.transform(lr_img)
            hr_img = self.transform(hr_img)
            
        return lr_img, hr_img

class TestDataset(Dataset):
    def __init__(self, root_dir, transform=None):
        """
        Args:
            root_dir (string): Directory with all the test images.
            transform (callable, optional): Optional transform to be applied on a sample.
        """
        self.root_dir = root_dir
        self.transform = transform
        
        # Get all LR and HR image paths
        self.lr_paths = sorted(glob.glob(os.path.join(root_dir, 'LR/*.png')))
        self.hr_paths = sorted(glob.glob(os.path.join(root_dir, 'HR/*.png')))
        
        assert len(self.lr_paths) == len(self.hr_paths), "Number of LR and HR images must match"

    def __len__(self):
        return len(self.lr_paths)

    def __getitem__(self, idx):
        # Load images
        lr_img = Image.open(self.lr_paths[idx]).convert('RGB')
        hr_img = Image.open(self.hr_paths[idx]).convert('RGB')
        
        # Get image name for saving results
        img_name = os.path.basename(self.lr_paths[idx])
        
        # Apply transformations
        if self.transform:
            lr_img = self.transform(lr_img)
            hr_img = self.transform(hr_img)
            
        return lr_img, hr_img, img_name
  `.trim();

  return (
    <div className="bg-esrgan-black-light rounded-xl border border-gray-800">
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-xl font-medium text-white">Training & Testing Code</h3>
        <p className="text-sm text-gray-400 mt-1">
          Sample code to train and test your ESRGAN model
        </p>
      </div>
      
      <Tabs defaultValue="training" className="p-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
          <TabsTrigger value="dataset">Dataset</TabsTrigger>
        </TabsList>
        
        <TabsContent value="training" className="mt-4 relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2"
            onClick={() => handleCopy('training', pythonTrainingCode)}
          >
            {copied === 'training' ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          
          <pre className="bg-esrgan-black p-4 rounded-md overflow-x-auto text-sm text-gray-300">
            <code>{pythonTrainingCode}</code>
          </pre>
        </TabsContent>
        
        <TabsContent value="testing" className="mt-4 relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2"
            onClick={() => handleCopy('testing', pythonTestingCode)}
          >
            {copied === 'testing' ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          
          <pre className="bg-esrgan-black p-4 rounded-md overflow-x-auto text-sm text-gray-300">
            <code>{pythonTestingCode}</code>
          </pre>
        </TabsContent>
        
        <TabsContent value="dataset" className="mt-4 relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2"
            onClick={() => handleCopy('dataset', datasetCode)}
          >
            {copied === 'dataset' ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          
          <pre className="bg-esrgan-black p-4 rounded-md overflow-x-auto text-sm text-gray-300">
            <code>{datasetCode}</code>
          </pre>
        </TabsContent>
      </Tabs>
    </div>
  );
}
