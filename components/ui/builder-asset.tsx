"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface BuilderAssetProps {
  src: string;
  alt?: string;
  className?: string;
  variant?: "hero" | "card" | "thumbnail" | "gallery";
  overlay?: boolean;
  children?: React.ReactNode;
  fallback?: string;
  priority?: boolean;
  sizes?: string;
  aspectRatio?: "square" | "video" | "photo" | "golden" | "cinema";
  animate?: boolean;
  loading?: "lazy" | "eager";
}

const variantClasses = {
  hero: "asset-hero min-h-[60vh] lg:min-h-[70vh]",
  card: "asset-card min-h-[40vh]",
  thumbnail: "asset-thumbnail min-h-[20vh]",
  gallery: "asset-container min-h-[30vh]"
};

const aspectRatioClasses = {
  square: "aspect-square",
  video: "aspect-video",
  photo: "aspect-photo",
  golden: "aspect-golden",
  cinema: "aspect-cinema"
};

export function BuilderAsset({
  src,
  alt = "",
  className,
  variant = "card",
  overlay = false,
  children,
  fallback = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  aspectRatio,
  animate = true,
  loading = "lazy"
}: BuilderAssetProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    setImageSrc(src);
    setHasError(false);
    setImageLoaded(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(fallback);
    }
  };

  const handleLoad = () => {
    setImageLoaded(true);
  };

  const containerClasses = cn(
    "asset-container relative overflow-hidden rounded-lg",
    variantClasses[variant],
    aspectRatio && aspectRatioClasses[aspectRatio],
    className
  );

  const imageComponent = (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      className={cn(
        "object-cover transition-all duration-700",
        imageLoaded ? "opacity-100" : "opacity-0",
        animate && "hover:scale-105"
      )}
      onLoad={handleLoad}
      onError={handleError}
      priority={priority}
      sizes={sizes}
      loading={priority ? undefined : loading}
    />
  );

  const content = (
    <div className={containerClasses}>
      {/* Loading Skeleton */}
      {!imageLoaded && (
        <Skeleton className="absolute inset-0 rounded-lg loading-skeleton" />
      )}
      
      {/* Image */}
      {imageComponent}
      
      {/* Overlay */}
      {overlay && (
        <div className="asset-overlay" />
      )}
      
      {/* Content */}
      {children && (
        <div className="asset-content">
          {children}
        </div>
      )}
      
      {/* Accessibility Enhancement */}
      <div className="sr-only" aria-live="polite">
        {imageLoaded ? `Image loaded: ${alt}` : "Loading image..."}
      </div>
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}

// Enhanced Gallery Component for Builder Assets
interface BuilderGalleryProps {
  assets: Array<{
    src: string;
    alt?: string;
    title?: string;
    description?: string;
  }>;
  columns?: 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  variant?: "masonry" | "grid" | "carousel";
  className?: string;
}

export function BuilderGallery({
  assets,
  columns = 3,
  gap = "md",
  variant = "grid",
  className
}: BuilderGalleryProps) {
  const gapClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6"
  };

  if (variant === "masonry") {
    return (
      <div className={cn(
        `columns-${columns}`,
        gapClasses[gap],
        "space-y-4",
        className
      )}>
        {assets.map((asset, index) => (
          <BuilderAsset
            key={index}
            src={asset.src}
            alt={asset.alt || `Gallery item ${index + 1}`}
            variant="gallery"
            className="break-inside-avoid mb-4"
            animate={true}
          >
            {(asset.title || asset.description) && (
              <div className="p-4">
                {asset.title && (
                  <h3 className="font-semibold text-lg mb-2">{asset.title}</h3>
                )}
                {asset.description && (
                  <p className="text-sm opacity-90">{asset.description}</p>
                )}
              </div>
            )}
          </BuilderAsset>
        ))}
      </div>
    );
  }

  return (
    <div className={cn(
      `grid grid-cols-1 md:grid-cols-${columns}`,
      gapClasses[gap],
      className
    )}>
      {assets.map((asset, index) => (
        <BuilderAsset
          key={index}
          src={asset.src}
          alt={asset.alt || `Gallery item ${index + 1}`}
          variant="gallery"
          animate={true}
        >
          {(asset.title || asset.description) && (
            <div className="p-4">
              {asset.title && (
                <h3 className="font-semibold text-lg mb-2">{asset.title}</h3>
              )}
              {asset.description && (
                <p className="text-sm opacity-90">{asset.description}</p>
              )}
            </div>
          )}
        </BuilderAsset>
      ))}
    </div>
  );
}

// Hero Asset Component specifically for Builder.io assets
interface BuilderHeroProps {
  src: string;
  alt?: string;
  title: string;
  subtitle?: string;
  description?: string;
  cta?: {
    text: string;
    href: string;
    variant?: "primary" | "secondary";
  };
  className?: string;
}

export function BuilderHero({
  src,
  alt,
  title,
  subtitle,
  description,
  cta,
  className
}: BuilderHeroProps) {
  return (
    <BuilderAsset
      src={src}
      alt={alt}
      variant="hero"
      overlay={true}
      className={className}
      priority={true}
      animate={false}
    >
      <div className="max-w-4xl mx-auto text-center">
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg opacity-90 mb-4"
          >
            {subtitle}
          </motion.p>
        )}
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl lg:text-6xl font-bold mb-6"
        >
          {title}
        </motion.h1>
        
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl opacity-90 mb-8 max-w-2xl mx-auto"
          >
            {description}
          </motion.p>
        )}
        
        {cta && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <a
              href={cta.href}
              className={cn(
                "inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold transition-all duration-300",
                cta.variant === "secondary" 
                  ? "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm" 
                  : "bg-white text-black hover:bg-gray-100"
              )}
            >
              {cta.text}
            </a>
          </motion.div>
        )}
      </div>
    </BuilderAsset>
  );
}
