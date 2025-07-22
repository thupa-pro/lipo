import { createClient } from "@/lib/supabase/client";

export interface ImageUploadResult {
  url: string;
  path: string;
  error?: string;
}

function sanitizeForFilename(input: string): string {
  // Only allow alphanumeric, dash, underscore, and dot
  return input.replace(/[^a-zA-Z0-9._-]/g, "");
}

export async function uploadListingImages(
  files: File[],
  userId: string,
): Promise<ImageUploadResult[]> {
  const supabase = createClient();
  const results: ImageUploadResult[] = [];

  // Sanitize userId for use in file path
  const safeUserId = sanitizeForFilename(userId);

  for (const file of files) {
    try {
      // Validate file
      const validationError = validateImageFile(file);
      if (validationError) {
        results.push({
          url: "",
          path: "",
          error: validationError,
        });
        continue;
      }

      // Generate unique, safe filename
      const fileExt = sanitizeForFilename(file.name.split(".").pop()?.toLowerCase() || "jpg");
      const fileName = `${safeUserId}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("listing-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        results.push({
          url: "",
          path: "",
          error: `Upload failed: ${error.message}`,
        });
        continue;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("listing-images").getPublicUrl(fileName);

      results.push({
        url: publicUrl,
        path: fileName,
        error: undefined,
      });
    } catch (error) {
      results.push({
        url: "",
        path: "",
        error: `Unexpected error: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    }
  }

  return results;
}

export async function deleteListingImage(imagePath: string): Promise<boolean> {
  const supabase = createClient();

  try {
    const { error } = await supabase.storage
      .from("listing-images")
      .remove([imagePath]);

    if (error) {
      console.error("Error deleting image:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Unexpected error deleting image:", error);
    return false;
  }
}

export async function deleteListingImages(
  imagePaths: string[],
): Promise<boolean> {
  const supabase = createClient();

  try {
    const { error } = await supabase.storage
      .from("listing-images")
      .remove(imagePaths);

    if (error) {
      console.error("Error deleting images:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Unexpected error deleting images:", error);
    return false;
  }
}

export function validateImageFile(file: File): string | null {
  // Check file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return "Invalid file type. Please upload JPEG, PNG, WebP, or GIF images.";
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return "File size too large. Please upload images smaller than 5MB.";
  }

  // Check file name
  if (file.name.length > 100) {
    return "Filename too long. Please rename your file.";
  }

  return null;
}

export function extractImagePathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split("/");

    // Find the bucket name and extract everything after it
    const bucketIndex = pathSegments.findIndex(
      (segment) => segment === "listing-images",
    );
    if (bucketIndex === -1) return null;

    return pathSegments.slice(bucketIndex + 1).join("/");
  } catch {
    return null;
  }
}

export async function optimizeImageForUpload(file: File): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions (max 1200px width/height)
      const maxDimension = 1200;
      let { width, height } = img;

      if (width > height && width > maxDimension) {
        height = (height * maxDimension) / width;
        width = maxDimension;
      } else if (height > maxDimension) {
        width = (width * maxDimension) / height;
        height = maxDimension;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const optimizedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(optimizedFile);
          } else {
            resolve(file); // Fallback to original
          }
        },
        "image/jpeg",
        0.85, // 85% quality
      );
    };

    img.onerror = () => resolve(file); // Fallback to original
    img.src = URL.createObjectURL(file);
  });
}

// Utility to get image dimensions
export function getImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(img.src);
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
      URL.revokeObjectURL(img.src);
    };

    img.src = URL.createObjectURL(file);
  });
}
