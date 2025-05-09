
import React from "react";

export interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  allowMultiple?: boolean;
  className?: string;
  showSupportedTypes?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = "image/*",
  allowMultiple = true,
  className,
  showSupportedTypes = true,
}) => {
  return (
    <div className={className}>
      <input
        type="file"
        accept={accept}
        multiple={allowMultiple}
        onChange={(e) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
              onFileSelect(files[i]);
            }
          }
        }}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        {allowMultiple ? 'Choose files' : 'Choose file'}
      </label>
      
      {showSupportedTypes && (
        <p className="mt-2 text-xs text-gray-400">
          Supported formats: JPG, PNG, WEBP, HEIC, HEIF, TIFF, BMP, GIF
          {allowMultiple && " (Multiple files supported)"}
        </p>
      )}
    </div>
  );
};
