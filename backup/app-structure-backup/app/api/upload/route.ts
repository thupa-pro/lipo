import { NextRequest, NextResponse } from "next/server";
import { ClerkBackendAuth } from "@/lib/auth/clerk-backend";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import sharp from "sharp";

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: NextRequest) {
  try {
    const user = await ClerkBackendAuth.getCurrentUser();
    
    if (!user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string || 'OTHER';

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "File too large. Maximum size is 10MB" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { message: "Invalid file type. Only images are allowed" },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    try {
      await mkdir(UPLOAD_DIR, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const filename = `${session.user.id}_${timestamp}.${fileExtension}`;
    const filepath = join(UPLOAD_DIR, filename);

    // Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Optimize image using sharp
    let processedBuffer: Buffer;
    try {
      processedBuffer = await sharp(buffer)
        .resize(1200, 1200, { 
          fit: 'inside', 
          withoutEnlargement: true 
        })
        .jpeg({ 
          quality: 85,
          progressive: true 
        })
        .toBuffer();
    } catch (error) {
      // If sharp fails, use original buffer
      processedBuffer = buffer;
    }

    // Save file
    await writeFile(filepath, processedBuffer);

    // Save file record to database
    const fileRecord = await prisma.fileUpload.create({
      data: {
        userId: session.user.id,
        filename,
        originalName: file.name,
        mimeType: file.type,
        size: processedBuffer.length,
        url: `/uploads/${filename}`,
        type: type as any,
      },
    });

    return NextResponse.json({
      id: fileRecord.id,
      url: fileRecord.url,
      filename: fileRecord.filename,
      size: fileRecord.size,
      type: fileRecord.type,
    }, { status: 201 });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await ClerkBackendAuth.getCurrentUser();
    
    if (!user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '20');

    const whereClause: any = {
      userId: session.user.id,
    };

    if (type) {
      whereClause.type = type;
    }

    const files = await prisma.fileUpload.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ files }, { status: 200 });
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await ClerkBackendAuth.getCurrentUser();
    
    if (!user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('id');

    if (!fileId) {
      return NextResponse.json(
        { message: "File ID required" },
        { status: 400 }
      );
    }

    // Find and delete file record
    const fileRecord = await prisma.fileUpload.findFirst({
      where: {
        id: fileId,
        userId: session.user.id, // Ensure user owns the file
      },
    });

    if (!fileRecord) {
      return NextResponse.json(
        { message: "File not found" },
        { status: 404 }
      );
    }

    // Delete file from filesystem
    try {
      const filepath = join(UPLOAD_DIR, fileRecord.filename);
      await require('fs').promises.unlink(filepath);
    } catch (error) {
      console.warn('Could not delete file from filesystem:', error);
    }

    // Delete record from database
    await prisma.fileUpload.delete({
      where: { id: fileId },
    });

    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}