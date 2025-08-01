import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Upload, Image as ImageIcon, AlertCircle, Check } from "lucide-react";
import {
  uploadListingImages,
  deleteListingImage,
  validateImageFile,
  optimizeImageForUpload,
  extractImagePathFromUrl,
  ImageUploadResult
} from "@/lib/listings/image-upload";

interface ImageUploadProps {
  userId: string;
  existingImages: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
}

interface UploadingImage {
  file: File;
  progress: number;
  url?: string;
  error?: string;
}

export function ImageUpload({
  userId,
  existingImages,
  onImagesChange,
  maxImages = 10,
  className = "",
}: ImageUploadProps) {
  const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (existingImages.length + acceptedFiles.length > maxImages) {
        alert(`You can only upload up to ${maxImages} images.`);
        return;
      }

      setIsUploading(true);

      // Initialize uploading state
      const initialUploading = acceptedFiles.map((file) => ({
        file,
        progress: 0,
      }));
      setUploadingImages(initialUploading);

      try {
        // Optimize images before upload
        const optimizedFiles = await Promise.all(
          acceptedFiles.map((file) => optimizeImageForUpload(file)),
        );

        // Upload images
        const results = await uploadListingImages(optimizedFiles, userId);

        // Process results
        const successfulUploads = results
          .filter((result) => !result.error)
          .map((result) => result.url);

        if (successfulUploads.length > 0) {
          onImagesChange([...existingImages, ...successfulUploads]);
        }

        // Show errors for failed uploads
        const errors = results.filter((result) => result.error);
        if (errors.length > 0) {
          alert(
            `Some images failed to upload:\n${errors.map((e) => e.error).join("\n")}`,
          );
        }
      } catch (error) {
        console.error("Error uploading images:", error);
        alert("Failed to upload images. Please try again.");
      } finally {
        setIsUploading(false);
        setUploadingImages([]);
      }
    },
    [userId, existingImages, maxImages, onImagesChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"],
    },
    maxFiles: maxImages - existingImages.length,
    disabled: isUploading,
  });

  const handleRemoveImage = async (imageUrl: string, index: number) => {
    const imagePath = extractImagePathFromUrl(imageUrl);

    if (imagePath) {
      // Delete from storage
      const success = await deleteListingImage(imagePath);
      if (!success) {
        alert("Failed to delete image. Please try again.");
        return;
      }
    }

    // Remove from state
    const newImages = existingImages.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const canUploadMore = existingImages.length < maxImages && !isUploading;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      {canUploadMore && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            {isUploading ? (
              <UIIcons.Loader2 className="w-8 h-8 text-blue-500 animate-spin" / />
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
            <div className="text-sm text-gray-600">
              {isUploading ? (
                "Uploading images..."
              ) : isDragActive ? (
                "Drop images here"
              ) : (
                <>
                  <span className="font-medium">Click to upload</span> or drag
                  and drop
                  <br />
                  <span className="text-xs">PNG, JPG, WebP up to 5MB each</span>
                </>
              )}
            </div>
            <div className="text-xs text-gray-500">
              {existingImages.length}/{maxImages} images uploaded
            </div>
          </div>
        </div>
      )}

      {/* Uploading Progress */}
      {uploadingImages.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploading images...</h4>
          {uploadingImages.map((upload, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2 bg-gray-50 rounded"
            >
              <ImageIcon className="w-4 h-4 text-gray-400" />
              <div className="flex-1">
                <div className="text-sm font-medium truncate">
                  {upload.file.name}
                </div>
                <Progress value={upload.progress} className="h-1 mt-1" />
              </div>
              {upload.error ? (
                <AlertCircle className="w-4 h-4 text-red-500" />
              ) : upload.url ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <UIIcons.Loader2 className="w-4 h-4 animate-spin text-blue-500" / />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded images</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {existingImages.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={imageUrl}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveImage(imageUrl, index)}
                >
                  <X className="w-3 h-3" />
                </Button>
                {index === 0 && (
                  <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    Featured
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            The first image will be used as the featured image for your listing.
          </p>
        </div>
      )}

      {/* Image Limit Warning */}
      {existingImages.length >= maxImages && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">
              You've reached the maximum of {maxImages} images. Remove some to
              upload more.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
