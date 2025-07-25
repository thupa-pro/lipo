"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Camera,
  Smartphone,
  Glasses,
  Maximize,
  Minimize,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move3D,
  Layers,
  Sun,
  Moon,
  Volume2,
  Settings,
  Download,
  Share,
  MapPin,
  Ruler,
  Palette,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

interface ARObject {
  id: string;
  name: string;
  type: "tool" | "material" | "person" | "result";
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  color: string;
  opacity: number;
  animation?: "rotate" | "bounce" | "pulse" | "float";
  metadata?: Record<string, any>;
}

interface ARServiceViewerProps {
  serviceId: string;
  serviceType: string;
  location?: { lat: number; lng: number };
  onBooking?: () => void;
  className?: string;
}

export function ARServiceViewer({
  serviceId,
  serviceType,
  location,
  onBooking,
  className = ""
}: ARServiceViewerProps) {
  const t = useTranslations("ar");
  const locale = useLocale();
  
  const [isARActive, setIsARActive] = useState(false);
  const [isVRMode, setIsVRMode] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<"granted" | "denied" | "prompt">("prompt");
  const [objects, setObjects] = useState<ARObject[]>([]);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"ar" | "vr" | "3d">("ar");
  const [lighting, setLighting] = useState([0.8]);
  const [ambient, setAmbient] = useState([0.3]);
  const [zoom, setZoom] = useState([1.0]);
  const [isRecording, setIsRecording] = useState(false);
  const [roomScanProgress, setRoomScanProgress] = useState(0);
  const [measurements, setMeasurements] = useState<Array<{ start: any; end: any; distance: number }>>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const arSessionRef = useRef<any>(null);

  // Initialize AR/VR capabilities
  useEffect(() => {
    checkARVRSupport();
    initializeServiceObjects();
  }, [serviceType]);

  const checkARVRSupport = async () => {
    // Check WebXR support
    if ('xr' in navigator) {
      try {
        const isARSupported = await (navigator as any).xr.isSessionSupported('immersive-ar');
        const isVRSupported = await (navigator as any).xr.isSessionSupported('immersive-vr');
        console.log("AR supported:", isARSupported, "VR supported:", isVRSupported);
      } catch (error) {
        console.log("WebXR not available, using fallback AR");
      }
    }

    // Check camera permissions
    try {
      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      setCameraPermission(permission.state);
      
      permission.onchange = () => {
        setCameraPermission(permission.state);
      };
    } catch (error) {
      console.log("Permissions API not available");
    }
  };

  const initializeServiceObjects = () => {
    // Generate AR objects based on service type
    const serviceObjects: ARObject[] = [];

    switch (serviceType) {
      case "plumbing":
        serviceObjects.push(
          {
            id: "plumber",
            name: "Professional Plumber",
            type: "person",
            position: { x: 0, y: 0, z: -2 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            color: "#2563eb",
            opacity: 0.8,
            animation: "float"
          },
          {
            id: "tools",
            name: "Plumbing Tools",
            type: "tool",
            position: { x: -1, y: -0.5, z: -1.5 },
            rotation: { x: 0, y: 45, z: 0 },
            scale: { x: 0.8, y: 0.8, z: 0.8 },
            color: "#dc2626",
            opacity: 0.9,
            animation: "rotate"
          },
          {
            id: "pipes",
            name: "New Pipes",
            type: "material",
            position: { x: 1, y: -0.3, z: -1.8 },
            rotation: { x: 0, y: -30, z: 0 },
            scale: { x: 1.2, y: 0.3, z: 1.2 },
            color: "#059669",
            opacity: 0.7,
            animation: "pulse"
          }
        );
        break;

      case "cleaning":
        serviceObjects.push(
          {
            id: "cleaner",
            name: "Professional Cleaner",
            type: "person",
            position: { x: 0, y: 0, z: -2.5 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            color: "#7c3aed",
            opacity: 0.8,
            animation: "bounce"
          },
          {
            id: "equipment",
            name: "Cleaning Equipment",
            type: "tool",
            position: { x: -1.5, y: -0.8, z: -2 },
            rotation: { x: 0, y: 60, z: 0 },
            scale: { x: 0.6, y: 0.6, z: 0.6 },
            color: "#0891b2",
            opacity: 0.9
          },
          {
            id: "result",
            name: "Clean Result",
            type: "result",
            position: { x: 1.5, y: 0.5, z: -2.2 },
            rotation: { x: 0, y: -45, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            color: "#10b981",
            opacity: 0.6,
            animation: "pulse"
          }
        );
        break;

      case "gardening":
        serviceObjects.push(
          {
            id: "gardener",
            name: "Professional Gardener",
            type: "person",
            position: { x: 0, y: 0, z: -3 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            color: "#16a34a",
            opacity: 0.8,
            animation: "float"
          },
          {
            id: "plants",
            name: "New Plants",
            type: "material",
            position: { x: -1, y: -0.5, z: -2.5 },
            rotation: { x: 0, y: 30, z: 0 },
            scale: { x: 0.8, y: 0.8, z: 0.8 },
            color: "#22c55e",
            opacity: 0.9,
            animation: "bounce"
          },
          {
            id: "garden-tools",
            name: "Garden Tools",
            type: "tool",
            position: { x: 1, y: -0.3, z: -2.8 },
            rotation: { x: 0, y: -20, z: 0 },
            scale: { x: 0.7, y: 0.7, z: 0.7 },
            color: "#a3a3a3",
            opacity: 0.8
          }
        );
        break;

      default:
        serviceObjects.push({
          id: "service-preview",
          name: "Service Preview",
          type: "result",
          position: { x: 0, y: 0, z: -2 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          color: "#6366f1",
          opacity: 0.8,
          animation: "pulse"
        });
    }

    setObjects(serviceObjects);
  };

  const startARSession = async () => {
    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        await videoRef.current.play();
      }

      setIsARActive(true);
      startRoomScanning();

    } catch (error) {
      console.error("Error starting AR session:", error);
      setCameraPermission("denied");
    }
  };

  const stopARSession = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsARActive(false);
    setRoomScanProgress(0);
  };

  const startVRSession = async () => {
    try {
      if ('xr' in navigator) {
        const session = await (navigator as any).xr.requestSession('immersive-vr');
        arSessionRef.current = session;
        setIsVRMode(true);
        setViewMode("vr");
      }
    } catch (error) {
      console.error("VR not supported or failed to start:", error);
      // Fallback to 3D mode
      setViewMode("3d");
    }
  };

  const stopVRSession = () => {
    if (arSessionRef.current) {
      arSessionRef.current.end();
      arSessionRef.current = null;
    }
    setIsVRMode(false);
    setViewMode("ar");
  };

  const startRoomScanning = () => {
    // Simulate room scanning progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setRoomScanProgress(progress);
    }, 200);
  };

  const addMeasurement = (start: any, end: any) => {
    const distance = Math.sqrt(
      Math.pow(end.x - start.x, 2) +
      Math.pow(end.y - start.y, 2) +
      Math.pow(end.z - start.z, 2)
    );

    setMeasurements(prev => [...prev, { start, end, distance }]);
  };

  const captureARScene = async () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Draw video frame
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        
        // Draw AR objects overlay
        objects.forEach(obj => {
          drawARObject(ctx, obj);
        });
        
        // Convert to blob and download
        canvas.toBlob(blob => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ar-service-preview-${Date.now()}.png`;
            a.click();
            URL.revokeObjectURL(url);
          }
        });
      }
    }
  };

  const drawARObject = (ctx: CanvasRenderingContext2D, obj: ARObject) => {
    // Simple 2D representation of 3D objects for demo
    const x = (obj.position.x + 2) * (ctx.canvas.width / 4);
    const y = (1 - obj.position.y) * (ctx.canvas.height / 2);
    const size = 30 * obj.scale.x * zoom[0];

    ctx.globalAlpha = obj.opacity;
    ctx.fillStyle = obj.color;
    
    switch (obj.type) {
      case "person":
        // Draw person icon
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        break;
      case "tool":
        // Draw tool icon
        ctx.fillRect(x - size/2, y - size/2, size, size);
        break;
      case "material":
        // Draw material icon
        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.lineTo(x + size, y + size);
        ctx.lineTo(x - size, y + size);
        ctx.closePath();
        ctx.fill();
        break;
      case "result":
        // Draw result icon
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.stroke();
        break;
    }
    
    // Draw label
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#000";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(obj.name, x, y + size + 15);
  };

  const shareARExperience = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t("shareTitle"),
          text: t("shareText"),
          url: window.location.href
        });
      } catch (error) {
        console.log("Share failed:", error);
      }
    }
  };

  return (
    <Card className={`w-full max-w-4xl mx-auto ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            {t("title")} - {serviceType}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={isARActive ? "default" : "secondary"}>
              {isARActive ? t("arActive") : t("arInactive")}
            </Badge>
            {isVRMode && (
              <Badge variant="default" className="bg-purple-500">
                {t("vrMode")}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Permission Check */}
        {cameraPermission === "denied" && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm">
              {t("cameraPermissionDenied")}
            </p>
          </div>
        )}

        {/* AR/VR View */}
        <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          {/* Video Stream */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
            style={{ display: isARActive ? 'block' : 'none' }}
          />
          
          {/* 3D Fallback View */}
          {!isARActive && (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
              <div className="text-center text-white">
                <Glasses className="w-16 h-16 mx-auto mb-4 opacity-80" />
                <h3 className="text-xl font-semibold mb-2">{t("preview3D")}</h3>
                <p className="text-sm opacity-90">{t("clickStartAR")}</p>
              </div>
            </div>
          )}
          
          {/* AR Objects Overlay */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            style={{ display: isARActive ? 'block' : 'none' }}
          />
          
          {/* Room Scanning Progress */}
          {isARActive && roomScanProgress < 100 && (
            <div className="absolute top-4 left-4 right-4">
              <div className="bg-black/50 text-white p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">{t("scanningRoom")}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-violet-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${roomScanProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* AR Objects Info */}
          {isARActive && roomScanProgress >= 100 && (
            <div className="absolute top-4 left-4 space-y-2">
              {objects.map(obj => (
                <motion.div
                  key={obj.id}
                  className="bg-black/70 text-white p-2 rounded-lg text-sm cursor-pointer"
                  onClick={() => setSelectedObject(obj.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: obj.color }}
                    />
                    <span>{obj.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          {/* Measurements */}
          {measurements.length > 0 && (
            <div className="absolute top-4 right-4 space-y-2">
              <div className="bg-black/70 text-white p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Ruler className="w-4 h-4" />
                  <span className="text-sm font-medium">{t("measurements")}</span>
                </div>
                {measurements.map((measurement, index) => (
                  <div key={index} className="text-xs">
                    {measurement.distance.toFixed(2)}m
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* View Mode Controls */}
          <div className="space-y-3">
            <label className="text-sm font-medium">{t("viewMode")}</label>
            <div className="flex gap-2">
              <Button
                onClick={isARActive ? stopARSession : startARSession}
                disabled={cameraPermission === "denied"}
                variant={viewMode === "ar" ? "default" : "outline"}
                size="sm"
                className="flex-1"
              >
                <Camera className="w-4 h-4 mr-2" />
                AR
              </Button>
              
              <Button
                onClick={isVRMode ? stopVRSession : startVRSession}
                variant={viewMode === "vr" ? "default" : "outline"}
                size="sm"
                className="flex-1"
              >
                <Glasses className="w-4 h-4 mr-2" />
                VR
              </Button>
              
              <Button
                onClick={() => setViewMode("3d")}
                variant={viewMode === "3d" ? "default" : "outline"}
                size="sm"
                className="flex-1"
              >
                <Move3D className="w-4 h-4 mr-2" />
                3D
              </Button>
            </div>
          </div>

          {/* Lighting Controls */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Sun className="w-4 h-4" />
              {t("lighting")}: {Math.round(lighting[0] * 100)}%
            </label>
            <Slider
              value={lighting}
              onValueChange={setLighting}
              max={1}
              min={0}
              step={0.1}
              className="w-full"
            />
            
            <label className="text-sm font-medium flex items-center gap-2">
              <Moon className="w-4 h-4" />
              {t("ambient")}: {Math.round(ambient[0] * 100)}%
            </label>
            <Slider
              value={ambient}
              onValueChange={setAmbient}
              max={1}
              min={0}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Interaction Controls */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <ZoomIn className="w-4 h-4" />
              {t("zoom")}: {zoom[0].toFixed(1)}x
            </label>
            <Slider
              value={zoom}
              onValueChange={setZoom}
              max={3}
              min={0.5}
              step={0.1}
              className="w-full"
            />
            
            <div className="flex gap-2">
              <Button
                onClick={captureARScene}
                variant="outline"
                size="sm"
                className="flex-1"
                disabled={!isARActive}
              >
                <Download className="w-4 h-4 mr-2" />
                {t("capture")}
              </Button>
              
              <Button
                onClick={shareARExperience}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Share className="w-4 h-4 mr-2" />
                {t("share")}
              </Button>
            </div>
          </div>
        </div>

        {/* Object Properties */}
        {selectedObject && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {objects.find(obj => obj.id === selectedObject)?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">{t("type")}:</span>
                  <span className="ml-2">{objects.find(obj => obj.id === selectedObject)?.type}</span>
                </div>
                <div>
                  <span className="font-medium">{t("opacity")}:</span>
                  <span className="ml-2">{Math.round((objects.find(obj => obj.id === selectedObject)?.opacity || 0) * 100)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={onBooking}
            className="flex-1 bg-violet-600 hover:bg-violet-700"
            size="lg"
          >
            <MapPin className="w-4 h-4 mr-2" />
            {t("bookThisService")}
          </Button>
          
          <Button
            onClick={() => window.open("/help/ar-guide", "_blank")}
            variant="outline"
            size="lg"
          >
            <Settings className="w-4 h-4 mr-2" />
            {t("help")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}