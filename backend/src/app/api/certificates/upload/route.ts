import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";

export const runtime = "nodejs";

const spacesClient = new S3Client({
  endpoint: process.env.DO_SPACES_ENDPOINT!,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET!,
  },
  forcePathStyle: false,
});

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PDF, JPG, PNG, and WEBP files are allowed" },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `certificates/${timestamp}-${sanitizedFilename}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET!,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      ACL: "public-read",
      Metadata: {
        "original-filename": file.name,
        "uploaded-at": new Date().toISOString(),
      },
    });

    await spacesClient.send(uploadCommand);

    const bucketName = process.env.DO_SPACES_BUCKET!;
    const region = process.env.DO_SPACES_REGION || "tor1";
    const fileUrl = `https://${bucketName}.${region}.digitaloceanspaces.com/${key}`;

    const fileType = file.type === "application/pdf" ? "pdf" : "image";

    return NextResponse.json({
      filename: file.name,
      fileUrl,
      fileType,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
