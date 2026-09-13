import { upload } from "@vercel/blob/client"

// Generous ceiling for the raw file. It is no longer bound by Vercel's
// ~4.5MB Route Handler request body limit because the file now goes
// directly from the browser to Blob storage instead of through our server.
const MAX_FILE_SIZE = 20 * 1024 * 1024

export class ImageUploadError extends Error {}

/**
 * Uploads an image for the backoffice in two steps:
 * 1. The raw file is sent directly from the browser to Blob storage using a
 *    short-lived client token, bypassing the request body size limit that
 *    Vercel enforces on Route Handlers/Server Actions (~4.5MB). This is what
 *    started failing once server-side optimization was introduced and phone
 *    photos (commonly 4-8MB) began exceeding that limit.
 * 2. The server is asked to resize/convert that upload to WebP by receiving
 *    only its URL (a tiny JSON payload) and fetching the bytes itself, which
 *    has no such body-size restriction.
 */
export async function uploadBackofficeImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new ImageUploadError("Por favor selecciona un archivo de imagen válido")
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new ImageUploadError("La imagen no debe superar los 20MB")
  }

  const rawBlob = await upload(file.name, file, {
    access: "public",
    handleUploadUrl: "/api/backoffice/upload/client-token",
  })

  const optimizeResponse = await fetch("/api/backoffice/optimize-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: rawBlob.url }),
  })

  if (!optimizeResponse.ok) {
    const errorData = await optimizeResponse.json().catch(() => ({}))
    throw new ImageUploadError(errorData.error || "Error al optimizar la imagen")
  }

  const data = await optimizeResponse.json()

  if (!data.url) {
    throw new ImageUploadError("No se recibió la URL de la imagen optimizada")
  }

  return data.url as string
}
