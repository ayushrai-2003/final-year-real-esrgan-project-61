import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, FileIcon, ImageIcon, FileText, FileSpreadsheet, FileVideo, File, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  className?: string;
  showSupportedTypes?: boolean;
}

export function FileUpload({ 
  onFileSelect, 
  accept = "*", // Changed to accept all file types
  className,
  showSupportedTypes = true
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getFileTypeIcon = (file: File) => {
    const type = file.type;
    
    if (type.startsWith('image/')) return <ImageIcon className="h-5 w-5 text-blue-400" />;
    if (type.startsWith('video/')) return <FileVideo className="h-5 w-5 text-purple-400" />;
    if (type.startsWith('text/')) return <FileText className="h-5 w-5 text-yellow-400" />;
    if (type === 'application/pdf') return <File className="h-5 w-5 text-red-400" />; // Changed from FilePdf to File
    if (type.includes('spreadsheet') || type.includes('excel')) return <FileSpreadsheet className="h-5 w-5 text-green-400" />;
    return <FileIcon className="h-5 w-5 text-gray-400" />;
  };

  const handleFile = (file: File) => {
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
      
      // Create preview URL for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        // For non-image files, clear any existing preview
        setPreview(null);
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const isImageFile = selectedFile?.type.startsWith('image/');

  return (
    <div className={cn("w-full", className)}>
      {!selectedFile ? (
        <div
          className={cn(
            "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all",
            dragActive 
              ? "border-esrgan-orange bg-esrgan-orange/10" 
              : "border-gray-600 hover:border-esrgan-orange/50 hover:bg-esrgan-black-light",
            className
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="rounded-full bg-esrgan-black-light p-4">
              <Upload
                className="h-8 w-8 text-esrgan-orange"
                strokeWidth={1.5}
              />
            </div>
            <div className="space-y-1">
              <p className="text-xl font-medium text-white">
                Drag & drop your file here
              </p>
              {showSupportedTypes && (
                <p className="text-sm text-gray-400">
                  Supports all file types (Images, PDFs, Documents, etc.)
                </p>
              )}
            </div>
            <Button
              type="button"
              onClick={handleButtonClick}
              className="bg-esrgan-orange hover:bg-esrgan-orange/80"
            >
              Browse Files
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-lg border border-gray-700">
          <div className="aspect-video w-full overflow-hidden bg-esrgan-black-light">
            {isImageFile && preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="rounded-full bg-esrgan-black p-4 mb-4">
                  {getFileTypeIcon(selectedFile)}
                </div>
                <p className="text-gray-300">File selected: {selectedFile.name}</p>
                {!isImageFile && (
                  <p className="text-yellow-500 flex items-center mt-2">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Preview not available for this file type
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="absolute right-2 top-2 z-10">
            <Button
              type="button"
              size="icon"
              variant="destructive"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between bg-esrgan-black-light p-3">
            <div className="flex items-center space-x-2">
              {getFileTypeIcon(selectedFile)}
              <span className="text-sm font-medium text-gray-300 truncate max-w-[200px]">
                {selectedFile.name}
              </span>
            </div>
            <span className="text-xs text-gray-400">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
