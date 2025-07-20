import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EmailService } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { message: "Verification token is required" },
        { status: 400 }
      );
    }

    // Find user with this verification token
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        status: 'PENDING_VERIFICATION',
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // Update user status and clear verification token
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        status: 'ACTIVE',
        emailVerified: new Date(),
        emailVerificationToken: null,
      },
    });

    // Send welcome email
    const emailService = EmailService.getInstance();
    await emailService.sendWelcomeEmail(user.email, user.name || 'User', user.role);

    return NextResponse.json(
      { 
        message: "Email verified successfully! Welcome to ServiceHub.",
        userId: user.id 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}