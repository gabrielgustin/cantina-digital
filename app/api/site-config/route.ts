import { NextResponse } from "next/server"
import { getAllSiteConfig } from "@/lib/db"

function formatWhatsAppUrl(value: string | undefined): string {
  if (!value) return "https://wa.me/5493512100007"

  // If it's already a valid WhatsApp URL, return it
  if (value.startsWith("https://wa.me/") || value.startsWith("http://wa.me/")) {
    return value
  }

  // Remove all non-numeric characters (spaces, dashes, parentheses, etc.)
  const cleanNumber = value.replace(/\D/g, "")

  // If the number is empty after cleaning, return default
  if (!cleanNumber) return "https://wa.me/5493512100007"

  // Format as WhatsApp URL
  return `https://wa.me/${cleanNumber}`
}

export async function GET() {
  try {
    const config = await getAllSiteConfig()

    console.log("[v0] Raw contact_whatsapp from database:", config.contact_whatsapp)

    const normalizedConfig = {
      logoUrl: config.store_logo || config.header_logo_url || "/images/logoitsvilada.jpg",
      siteName: config.site_name || "M&M Relojes", // Updated default site name
      instagramUrl: config.instagram_url || "https://www.instagram.com/boutiqueits",
      autogestivaUrl: config.autogestiva_url || "https://www.autogestiva.com.ar",
      whatsappUrl: formatWhatsAppUrl(config.contact_whatsapp),
      // Include all other config values as-is for backward compatibility
      ...config,
    }

    console.log("[v0] Formatted whatsappUrl:", normalizedConfig.whatsappUrl)

    return NextResponse.json(normalizedConfig)
  } catch (error) {
    console.error("Error fetching site config:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
