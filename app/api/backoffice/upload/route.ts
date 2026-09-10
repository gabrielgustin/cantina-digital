import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
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
      console.log("[v0] Uploading to Blob:", file.name)

      const blob = await put(file.name, file, {
        access: "public",
        addRandomSuffix: true,
        contentType: file.type,
      })

      console.log("[v0] Upload successful:", blob.url)

      return NextResponse.json({
        url: blob.url,
        originalSize: file.size,
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
