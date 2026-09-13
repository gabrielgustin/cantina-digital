import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import sharp from "sharp"
import { requireBackofficeSession } from "@/lib/backoffice-auth"

// Uniform canvas size every uploaded image is normalized into. Images are never
// cropped: they are scaled to fit inside this square and centered on a neutral
// background, so every product/category/banner image renders consistently.
const CANVAS_SIZE = 1200
const CANVAS_BACKGROUND = "#ffffff"

function toWebpFileName(originalName: string) {
  const withoutExtension = originalName.replace(/\.[^/.]+$/, "")
  const safeName = withoutExtension.replace(/[^a-zA-Z0-9_-]+/g, "-").toLowerCase() || "imagen"
  return `${safeName}.webp`
}

export async function POST(request: Request) {
  try {
    if (!(await requireBackofficeSession())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    console.log("[v0] Upload endpoint called")

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.log("[v0] No file provided in request")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      console.log("[v0] Invalid file type:", file.type)
      return NextResponse.json({ error: "Invalid file type. Only images are allowed." }, { status: 400 })
    }

    console.log("[v0] Original file:", file.name, "Type:", file.type, "Size:", (file.size / 1024).toFixed(2), "KB")

    try {
      const originalBuffer = Buffer.from(await file.arrayBuffer())

      // Normalize every upload to the same square canvas using "contain" so the
      // full image is always visible (never cropped), then convert to WebP to
      // minimize storage size.
      const optimizedBuffer = await sharp(originalBuffer)
        .resize(CANVAS_SIZE, CANVAS_SIZE, {
          fit: "contain",
          background: CANVAS_BACKGROUND,
        })
        .webp({ quality: 82 })
        .toBuffer()

      const optimizedFileName = toWebpFileName(file.name)

      console.log(
        "[v0] Optimized image:",
        optimizedFileName,
        "Size:",
        (optimizedBuffer.length / 1024).toFixed(2),
        "KB",
      )

      console.log("[v0] Uploading to Blob:", optimizedFileName)

      const blob = await put(optimizedFileName, optimizedBuffer, {
        access: "public",
        addRandomSuffix: true,
        contentType: "image/webp",
      })

      console.log("[v0] Upload successful:", blob.url)

      return NextResponse.json({
        url: blob.url,
        originalSize: file.size,
        optimizedSize: optimizedBuffer.length,
      })
    } catch (blobError) {
      console.error("[v0] Error uploading to Blob:", blobError)
      console.error("[v0] Blob error details:", blobError instanceof Error ? blobError.message : "Unknown")
      return NextResponse.json({ error: "Failed to upload to storage" }, { status: 500 })
    }
  } catch (error) {
    console.error("[v0] Unexpected error in upload endpoint:", error)
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack")

    return NextResponse.json(
      {
        error: "Failed to upload image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
