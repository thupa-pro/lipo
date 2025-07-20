import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { EmailService } from "@/lib/email";
import { generateVerificationToken } from "@/lib/tokens";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json();

    // Validate input
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate email verification token
    const verificationToken = generateVerificationToken();

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        emailVerificationToken: verificationToken,
        status: 'PENDING_VERIFICATION',
      },
    });

    // Create user profile
    await prisma.userProfile.create({
      data: {
        userId: user.id,
        firstName: name.split(" ")[0],
        lastName: name.split(" ").slice(1).join(" "),
      },
    });

    // Send verification email
    const emailService = EmailService.getInstance();
    const emailResult = await emailService.sendVerificationEmail(
      email,
      verificationToken,
      name
    );

    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error);
      // Don't fail registration if email fails in development
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { message: "User created but failed to send verification email" },
          { status: 201 }
        );
      }
    }

    return NextResponse.json(
      { 
        message: "User created successfully. Please check your email to verify your account.",
        userId: user.id,
        emailSent: emailResult.success 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}