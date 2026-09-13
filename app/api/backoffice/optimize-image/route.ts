import { del, put } from "@vercel/blob"
import { NextResponse } from "next/server"
import sharp from "sharp"
import { requireBackofficeSession } from "@/lib/backoffice-auth"

// Uniform canvas size every uploaded image is normalized into. Images are never
// cropped: they are scaled to fit inside this square and centered on a neutral
// background, so every product/category/banner image renders consistently.
const CANVAS_SIZE = 1200
const CANVAS_BACKGROUND = "#ffffff"

function toWebpFileName(sourceUrl: string) {
  const fileName = sourceUrl.split("/").pop()?.split("?")[0] || "imagen"
  const withoutExtension = fileName.replace(/\.[^/.]+$/, "")
  const safeName = withoutExtension.replace(/[^a-zA-Z0-9_-]+/g, "-").toLowerCase() || "imagen"
  return `${safeName}.webp`
}

// Takes the URL of a raw image already uploaded to Blob (via the client
// upload flow), downloads it server-side, and returns an optimized WebP
// version. Receiving only a URL here — instead of the image bytes — keeps
// this request tiny, so it never runs into Vercel's Route Handler request
// body size limit. The outbound fetch to Blob storage has no such limit.
export async function POST(request: Request) {
  try {
    if (!(await requireBackofficeSession())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { url } = await request.json()

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "No se recibió la URL de la imagen" }, { status: 400 })
    }

    console.log("[v0] Optimize endpoint called for:", url)

    try {
      const sourceResponse = await fetch(url)
      if (!sourceResponse.ok) {
        throw new Error(`No se pudo descargar la imagen original (status ${sourceResponse.status})`)
      }

      const originalBuffer = Buffer.from(await sourceResponse.arrayBuffer())

      console.log("[v0] Original image size:", (originalBuffer.length / 1024).toFixed(2), "KB")

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

      const optimizedFileName = toWebpFileName(url)

      console.log(
        "[v0] Optimized image:",
        optimizedFileName,
        "Size:",
        (optimizedBuffer.length / 1024).toFixed(2),
        "KB",
      )

      const blob = await put(optimizedFileName, optimizedBuffer, {
        access: "public",
        addRandomSuffix: true,
        contentType: "image/webp",
      })

      console.log("[v0] Optimized upload successful:", blob.url)

      // Clean up the temporary raw upload now that the optimized copy exists.
      try {
        await del(url)
      } catch (cleanupError) {
        console.error("[v0] Error deleting raw upload (non-fatal):", cleanupError)
      }

      return NextResponse.json({
        url: blob.url,
        originalSize: originalBuffer.length,
        optimizedSize: optimizedBuffer.length,
      })
    } catch (processingError) {
      console.error("[v0] Error optimizing image:", processingError)
      console.error("[v0] Error details:", processingError instanceof Error ? processingError.message : "Unknown")
      return NextResponse.json({ error: "Failed to optimize image" }, { status: 500 })
    }
  } catch (error) {
    console.error("[v0] Unexpected error in optimize-image endpoint:", error)
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack")

    return NextResponse.json(
      {
        error: "Failed to optimize image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
