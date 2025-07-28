import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Wifi, Bluetooth, Zap, Thermometer, Lightbulb, Camera, Lock, Smartphone, Tv, Speaker, Fan, Droplets, Gauge, Bell, Plus, Minus, RotateCcw, Power, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

interface IoTDevice {
  id: string;
  name: string;
  type: "light" | "thermostat" | "security" | "camera" | "lock" | "speaker" | "tv" | "appliance" | "sensor";
  brand: string;
  model: string;
  room: string;
  status: "online" | "offline" | "updating";
  isConnected: boolean;
  batteryLevel?: number;
  lastSeen: Date;
  capabilities: string[];
  settings: Record<string, any>;
  serviceIntegration?: {
    canControl: boolean;
    requiredForService: boolean;
    automationRules: string[];
  };
}

interface SmartHomeIntegrationProps {
  serviceType: string;
  onDeviceControl?: (deviceId: string, action: string, value?: any) => void;
  onAutomationSetup?: (rules: any[]) => void;
  className?: string;
}

export function SmartHomeIntegration({
  serviceType,
  onDeviceControl,
  onAutomationSetup,
  className = ""
}: SmartHomeIntegrationProps) {
  const t = useTranslations("iot");
  const locale = useLocale();
  
  const [devices, setDevices] = useState<IoTDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [automationRules, setAutomationRules] = useState<any[]>([]);
  const [isSettingUpAutomation, setIsSettingUpAutomation] = useState(false);
  const [homeLayout, setHomeLayout] = useState<Record<string, string[]>>({});
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [energyUsage, setEnergyUsage] = useState<Record<string, number>>({});

  const scanInterval = useRef<NodeJS.Timeout | null>(null);
  const websocket = useRef<WebSocket | null>(null);

  // Initialize IoT connection
  useEffect(() => {
    initializeIoTConnection();
    discoverDevices();
    setupAutomationForService();
    
    return () => {
      if (scanInterval.current) {
        clearInterval(scanInterval.current);
      }
      if (websocket.current) {
        websocket.current.close();
      }
    };
  }, [serviceType]);

  const initializeIoTConnection = () => {
    // Initialize WebSocket for real-time device communication
    try {
      websocket.current = new WebSocket(process.env.NEXT_PUBLIC_IOT_WEBSOCKET_URL || 'ws://localhost:8080/iot');
      
      websocket.current.onopen = () => {
        console.log('IoT WebSocket connected');
      };
      
      websocket.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleIoTMessage(data);
      };
      
      websocket.current.onerror = (error) => {
        console.error('IoT WebSocket error:', error);
      };
    } catch (error) {
      console.log('WebSocket not available, using polling');
      startDevicePolling();
    }
  };

  const handleIoTMessage = (data: any) => {
    switch (data.type) {
      case 'device_update':
        updateDevice(data.device);
        break;
      case 'automation_triggered':
        handleAutomationTrigger(data.automation);
        break;
      case 'emergency_alert':
        setEmergencyMode(true);
        break;
      case 'energy_update':
        setEnergyUsage(prev => ({ ...prev, [data.deviceId]: data.usage }));
        break;
    }
  };

  const discoverDevices = async () => {
    setIsScanning(true);
    
    try {
      // Simulate discovering IoT devices
      const mockDevices: IoTDevice[] = [
        {
          id: "philips-hue-living",
          name: "Living Room Lights",
          type: "light",
          brand: "Philips",
          model: "Hue Smart Bulb",
          room: "Living Room",
          status: "online",
          isConnected: true,
          lastSeen: new Date(),
          capabilities: ["brightness", "color", "schedule"],
          settings: { brightness: 80, color: "#ffffff", schedule: null },
          serviceIntegration: {
            canControl: true,
            requiredForService: serviceType === "cleaning",
            automationRules: ["turn_on_during_service", "adjust_for_cleaning"]
          }
        },
        {
          id: "nest-thermostat",
          name: "Main Thermostat",
          type: "thermostat",
          brand: "Google",
          model: "Nest Learning Thermostat",
          room: "Hallway",
          status: "online",
          isConnected: true,
          lastSeen: new Date(),
          capabilities: ["temperature", "schedule", "eco_mode"],
          settings: { temperature: 72, mode: "auto", schedule: "home" },
          serviceIntegration: {
            canControl: true,
            requiredForService: serviceType === "hvac",
            automationRules: ["adjust_for_service", "energy_saving"]
          }
        },
        {
          id: "ring-doorbell",
          name: "Front Door Camera",
          type: "camera",
          brand: "Ring",
          model: "Video Doorbell Pro",
          room: "Front Door",
          status: "online",
          isConnected: true,
          batteryLevel: 85,
          lastSeen: new Date(),
          capabilities: ["video", "motion_detection", "two_way_audio"],
          settings: { recording: true, motionSensitivity: "medium" },
          serviceIntegration: {
            canControl: false,
            requiredForService: true,
            automationRules: ["notify_service_arrival", "record_service"]
          }
        },
        {
          id: "august-smart-lock",
          name: "Front Door Lock",
          type: "lock",
          brand: "August",
          model: "Smart Lock Pro",
          room: "Front Door",
          status: "online",
          isConnected: true,
          batteryLevel: 65,
          lastSeen: new Date(),
          capabilities: ["lock", "unlock", "temporary_access"],
          settings: { autoLock: true, autoLockDelay: 30 },
          serviceIntegration: {
            canControl: true,
            requiredForService: true,
            automationRules: ["grant_service_access", "secure_after_service"]
          }
        },
        {
          id: "ecobee-sensor",
          name: "Kitchen Sensor",
          type: "sensor",
          brand: "Ecobee",
          model: "Room Sensor",
          room: "Kitchen",
          status: "online",
          isConnected: true,
          batteryLevel: 45,
          lastSeen: new Date(),
          capabilities: ["temperature", "occupancy", "humidity"],
          settings: { alerts: true, privacy: false },
          serviceIntegration: {
            canControl: false,
            requiredForService: serviceType === "cleaning",
            automationRules: ["detect_service_presence", "monitor_conditions"]
          }
        },
        {
          id: "sonos-speaker",
          name: "Kitchen Speaker",
          type: "speaker",
          brand: "Sonos",
          model: "One SL",
          room: "Kitchen",
          status: "online",
          isConnected: true,
          lastSeen: new Date(),
          capabilities: ["music", "volume", "grouping"],
          settings: { volume: 30, groupedWith: [] },
          serviceIntegration: {
            canControl: true,
            requiredForService: false,
            automationRules: ["pause_during_service", "service_notifications"]
          }
        }
      ];

      // Add platform-specific devices based on service type
      if (serviceType === "security") {
        mockDevices.push({
          id: "adt-security-panel",
          name: "Security System",
          type: "security",
          brand: "ADT",
          model: "Command Panel",
          room: "Hallway",
          status: "online",
          isConnected: true,
          lastSeen: new Date(),
          capabilities: ["arm", "disarm", "partial_arm", "emergency"],
          settings: { armed: false, mode: "home" },
          serviceIntegration: {
            canControl: true,
            requiredForService: true,
            automationRules: ["disarm_for_service", "rearm_after_service"]
          }
        });
      }

      setDevices(mockDevices);
      
      // Group devices by room
      const layout: Record<string, string[]> = {};
      mockDevices.forEach(device => {
        if (!layout[device.room]) {
          layout[device.room] = [];
        }
        layout[device.room].push(device.id);
      });
      setHomeLayout(layout);
      
    } catch (error) {
      console.error('Error discovering devices:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const setupAutomationForService = () => {
    const rules = [];
    
    switch (serviceType) {
      case "cleaning":
        rules.push(
          {
            id: "cleaning-prep",
            name: "Prepare for Cleaning Service",
            trigger: "service_arrival",
            actions: [
              { type: "lights", action: "turn_on", brightness: 100 },
              { type: "music", action: "pause" },
              { type: "hvac", action: "adjust", temperature: 70 }
            ]
          },
          {
            id: "cleaning-complete",
            name: "Post-Cleaning Setup",
            trigger: "service_complete",
            actions: [
              { type: "lights", action: "restore_previous" },
              { type: "music", action: "resume" },
              { type: "hvac", action: "restore_schedule" }
            ]
          }
        );
        break;
        
      case "security":
        rules.push(
          {
            id: "security-service",
            name: "Security Service Access",
            trigger: "service_scheduled",
            actions: [
              { type: "security", action: "disarm" },
              { type: "lock", action: "unlock_temporary" },
              { type: "camera", action: "start_recording" }
            ]
          }
        );
        break;
        
      case "hvac":
        rules.push(
          {
            id: "hvac-service-prep",
            name: "HVAC Service Preparation",
            trigger: "service_arrival",
            actions: [
              { type: "hvac", action: "system_off" },
              { type: "sensors", action: "monitor_air_quality" },
              { type: "lights", action: "turn_on_work_areas" }
            ]
          }
        );
        break;
    }
    
    setAutomationRules(rules);
  };

  const controlDevice = async (deviceId: string, action: string, value?: any) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device) return;

    try {
      // Send command via WebSocket or HTTP
      const command = {
        deviceId,
        action,
        value,
        timestamp: new Date().toISOString()
      };

      if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
        websocket.current.send(JSON.stringify(command));
      } else {
        // Fallback to HTTP API
        await fetch('/api/iot/control', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(command)
        });
      }

      // Update local state optimistically
      setDevices(prev => prev.map(d => 
        d.id === deviceId 
          ? { ...d, settings: { ...d.settings, [action]: value }, lastSeen: new Date() }
          : d
      ));

      if (onDeviceControl) {
        onDeviceControl(deviceId, action, value);
      }

    } catch (error) {
      console.error('Error controlling device:', error);
    }
  };

  const updateDevice = (updatedDevice: IoTDevice) => {
    setDevices(prev => prev.map(d => 
      d.id === updatedDevice.id ? { ...updatedDevice, lastSeen: new Date() } : d
    ));
  };

  const startDevicePolling = () => {
    scanInterval.current = setInterval(() => {
      // Poll device status
      devices.forEach(device => {
        // Simulate random status updates
        if (Math.random() < 0.1) {
          const randomUpdate = {
            ...device,
            status: Math.random() < 0.95 ? "online" : "offline" as const,
            batteryLevel: device.batteryLevel ? Math.max(0, device.batteryLevel - Math.random() * 2) : undefined
          };
          updateDevice(randomUpdate);
        }
      });
    }, 5000);
  };

  const triggerAutomation = async (ruleId: string) => {
    const rule = automationRules.find(r => r.id === ruleId);
    if (!rule) return;

    setIsSettingUpAutomation(true);
    
    try {
      for (const action of rule.actions) {
        await executeAutomationAction(action);
      }
      
      if (onAutomationSetup) {
        onAutomationSetup([rule]);
      }
    } catch (error) {
      console.error('Error executing automation:', error);
    } finally {
      setIsSettingUpAutomation(false);
    }
  };

  const executeAutomationAction = async (action: any) => {
    switch (action.type) {
      case "lights":
        const lightDevices = devices.filter(d => d.type === "light");
        for (const device of lightDevices) {
          await controlDevice(device.id, action.action, action.brightness);
        }
        break;
        
      case "hvac":
        const hvacDevices = devices.filter(d => d.type === "thermostat");
        for (const device of hvacDevices) {
          await controlDevice(device.id, action.action, action.temperature);
        }
        break;
        
      case "security":
        const securityDevices = devices.filter(d => d.type === "security");
        for (const device of securityDevices) {
          await controlDevice(device.id, action.action);
        }
        break;
    }
  };

  const handleAutomationTrigger = (automation: any) => {
    // Handle incoming automation triggers
    console.log('Automation triggered:', automation);
  };

  const getDeviceIcon = (device: IoTDevice) => {
    switch (device.type) {
      case "light": return <Lightbulb className="w-5 h-5" />;
      case "thermostat": return <Thermometer className="w-5 h-5" />;
      case "security": return <OptimizedIcon name="Shield" className="w-5 h-5" />;
      case "camera": return <Camera className="w-5 h-5" />;
      case "lock": return <Lock className="w-5 h-5" />;
      case "speaker": return <Speaker className="w-5 h-5" />;
      case "tv": return <Tv className="w-5 h-5" />;
      case "sensor": return <Gauge className="w-5 h-5" />;
      default: return <NavigationIcons.Home className="w-5 h-5" / />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "text-green-500";
      case "offline": return "text-red-500";
      case "updating": return "text-yellow-500";
      default: return "text-gray-500";
    }
  };

  return (
    <Card className={`w-full max-w-6xl mx-auto ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <NavigationIcons.Home className="w-5 h-5" / />
            {t("title")} - {serviceType}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={devices.filter(d => d.isConnected).length > 0 ? "default" : "secondary"}>
              {devices.filter(d => d.isConnected).length} {t("devicesConnected")}
            </Badge>
            {emergencyMode && (
              <Badge variant="destructive">
                <UIIcons.AlertTriangle className="w-3 h-3 mr-1" / />
                {t("emergencyMode")}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            onClick={() => discoverDevices()}
            disabled={isScanning}
            variant="outline"
            className="h-20 flex-col"
          >
            {isScanning ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Wifi className="w-6 h-6" />
              </motion.div>
            ) : (
              <Wifi className="w-6 h-6" />
            )}
            <span className="text-sm mt-2">{t("scanDevices")}</span>
          </Button>

          <Button
            onClick={() => triggerAutomation("cleaning-prep")}
            disabled={isSettingUpAutomation}
            variant="outline"
            className="h-20 flex-col"
          >
            <Zap className="w-6 h-6" />
            <span className="text-sm mt-2">{t("setupService")}</span>
          </Button>

          <Button
            onClick={() => setEmergencyMode(!emergencyMode)}
            variant={emergencyMode ? "destructive" : "outline"}
            className="h-20 flex-col"
          >
            <UIIcons.AlertTriangle className="w-6 h-6" / />
            <span className="text-sm mt-2">{t("emergency")}</span>
          </Button>

          <Button
            variant="outline"
            className="h-20 flex-col"
          >
            <Activity className="w-6 h-6" />
            <span className="text-sm mt-2">{t("monitoring")}</span>
          </Button>
        </div>

        {/* Devices by Room */}
        <div className="space-y-6">
          {Object.entries(homeLayout).map(([room, deviceIds]) => (
            <Card key={room}>
              <CardHeader>
                <CardTitle className="text-lg">{room}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {deviceIds.map(deviceId => {
                    const device = devices.find(d => d.id === deviceId);
                    if (!device) return null;

                    return (
                      <Card
                        key={device.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedDevice === device.id ? 'ring-2 ring-violet-500' : ''
                        }`}
                        onClick={() => setSelectedDevice(device.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {getDeviceIcon(device)}
                              <span className="font-medium text-sm">{device.name}</span>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${
                              device.status === 'online' ? 'bg-green-500' : 
                              device.status === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
                            }`} />
                          </div>

                          <div className="space-y-2 text-xs text-gray-600">
                            <div className="flex justify-between">
                              <span>{device.brand} {device.model}</span>
                              <span className={getStatusColor(device.status)}>
                                {device.status}
                              </span>
                            </div>

                            {device.batteryLevel && (
                              <div className="flex justify-between">
                                <span>{t("battery")}</span>
                                <span>{device.batteryLevel}%</span>
                              </div>
                            )}

                            {device.serviceIntegration?.requiredForService && (
                              <Badge variant="secondary" className="text-xs">
                                {t("requiredForService")}
                              </Badge>
                            )}
                          </div>

                          {/* Quick Controls */}
                          <div className="mt-3 flex gap-2">
                            {device.type === "light" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  controlDevice(device.id, "toggle");
                                }}
                              >
                                <Power className="w-3 h-3" />
                              </Button>
                            )}

                            {device.type === "lock" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  controlDevice(device.id, "unlock");
                                }}
                              >
                                <Lock className="w-3 h-3" />
                              </Button>
                            )}

                            {device.capabilities.includes("schedule") && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  controlDevice(device.id, "schedule");
                                }}
                              >
                                <Bell className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Device Details */}
        {selectedDevice && (
          <Card>
            <CardHeader>
              <CardTitle>
                {devices.find(d => d.id === selectedDevice)?.name} {t("controls")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const device = devices.find(d => d.id === selectedDevice);
                if (!device) return null;

                return (
                  <div className="space-y-4">
                    {/* Light Controls */}
                    {device.type === "light" && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">{t("brightness")}</label>
                          <span>{device.settings.brightness}%</span>
                        </div>
                        <Slider
                          value={[device.settings.brightness]}
                          onValueChange={(value) => controlDevice(device.id, "brightness", value[0])}
                          max={100}
                          min={0}
                          step={1}
                        />
                      </div>
                    )}

                    {/* Thermostat Controls */}
                    {device.type === "thermostat" && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">{t("temperature")}</label>
                          <span>{device.settings.temperature}°F</span>
                        </div>
                        <Slider
                          value={[device.settings.temperature]}
                          onValueChange={(value) => controlDevice(device.id, "temperature", value[0])}
                          max={85}
                          min={60}
                          step={1}
                        />
                      </div>
                    )}

                    {/* Service Integration Settings */}
                    {device.serviceIntegration && (
                      <div className="space-y-3">
                        <h4 className="font-medium">{t("serviceIntegration")}</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{t("canControl")}</span>
                            <Switch
                              checked={device.serviceIntegration.canControl}
                              onCheckedChange={(checked) => {
                                // Update service integration settings
                              }}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{t("requiredForService")}</span>
                            <Badge variant={device.serviceIntegration.requiredForService ? "default" : "secondary"}>
                              {device.serviceIntegration.requiredForService ? t("yes") : t("no")}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}

        {/* Automation Rules */}
        {automationRules.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t("automationRules")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {automationRules.map(rule => (
                  <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h5 className="font-medium">{rule.name}</h5>
                      <p className="text-sm text-gray-600">{rule.actions.length} {t("actions")}</p>
                    </div>
                    <Button
                      onClick={() => triggerAutomation(rule.id)}
                      disabled={isSettingUpAutomation}
                      size="sm"
                    >
                      {t("trigger")}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}