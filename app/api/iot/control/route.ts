import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const IoTControlSchema = z.object({
  deviceId: z.string(),
  action: z.string(),
  value: z.any().optional(),
  timestamp: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deviceId, action, value, timestamp } = IoTControlSchema.parse(body);

    // Simulate IoT device control
    // In a real implementation, this would communicate with actual IoT platforms
    const deviceTypes: Record<string, string[]> = {
      "philips-hue-living": ["brightness", "color", "toggle", "schedule"],
      "nest-thermostat": ["temperature", "mode", "schedule"],
      "ring-doorbell": ["recording", "motion_sensitivity"],
      "august-smart-lock": ["lock", "unlock", "temporary_access"],
      "ecobee-sensor": ["alerts", "privacy"],
      "sonos-speaker": ["volume", "play", "pause", "group"],
      "adt-security-panel": ["arm", "disarm", "partial_arm", "emergency"]
    };

    const allowedActions = deviceTypes[deviceId] || [];
    
    if (!allowedActions.includes(action)) {
      return NextResponse.json(
        { error: `Action '${action}' not supported for device '${deviceId}'` },
        { status: 400 }
      );
    }

    // Simulate device response based on device type and action
    let response: any = {
      deviceId,
      action,
      value,
      status: "success",
      timestamp: new Date().toISOString(),
    };

    // Device-specific logic
    switch (deviceId) {
      case "philips-hue-living":
        if (action === "brightness") {
          response.newBrightness = value;
        } else if (action === "toggle") {
          response.newState = Math.random() > 0.5 ? "on" : "off";
        }
        break;

      case "nest-thermostat":
        if (action === "temperature") {
          response.newTemperature = value;
          response.estimatedReachTime = "15 minutes";
        }
        break;

      case "august-smart-lock":
        if (action === "unlock") {
          response.unlockDuration = value || 300; // 5 minutes default
          response.accessCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        }
        break;

      case "ring-doorbell":
        if (action === "recording") {
          response.recordingStatus = value ? "enabled" : "disabled";
        }
        break;

      default:
        response.message = `Command executed on ${deviceId}`;
    }

    // Log the control action for analytics and security
    console.log(`IoT Control: ${deviceId} -> ${action} = ${value}`);

    // Simulate some latency
    await new Promise(resolve => setTimeout(resolve, 200));

    return NextResponse.json(response);

  } catch (error) {
    console.error("IoT control error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request format", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to control IoT device" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const deviceId = url.searchParams.get("deviceId");

    if (!deviceId) {
      return NextResponse.json(
        { error: "Device ID is required" },
        { status: 400 }
      );
    }

    // Mock device status
    const deviceStatus = {
      deviceId,
      status: "online",
      lastSeen: new Date().toISOString(),
      batteryLevel: Math.floor(Math.random() * 100),
      signalStrength: Math.floor(Math.random() * 100),
      firmwareVersion: "1.2.3",
      uptime: Math.floor(Math.random() * 86400), // seconds
    };

    return NextResponse.json(deviceStatus);

  } catch (error) {
    console.error("IoT status error:", error);
    return NextResponse.json(
      { error: "Failed to get device status" },
      { status: 500 }
    );
  }
}