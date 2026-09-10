import { getAllSiteConfigOptimized } from "@/lib/db"
import { Header } from "./header"

export async function ServerHeader() {
  const config = await getAllSiteConfigOptimized()

  console.log("[v0] ServerHeader - Config from DB:", config)

  const logoUrl = config.store_logo || config.header_logo_url || null
  const instagramUrl = config.instagram_url || null
  const autogestivaUrl = config.autogestiva_url || null
  const facebookUrl = config.facebook_url || null
  const websiteUrl = config.website_url || null
  const address = config.address || null

  const rawWhatsapp = config.contact_whatsapp || null
  const whatsappUrl = rawWhatsapp ? `https://wa.me/${rawWhatsapp.replace(/[\s\-()]/g, "")}` : null

  console.log("[v0] ServerHeader - Passing to Header:", {
    instagramUrl,
    facebookUrl,
    websiteUrl,
    autogestivaUrl,
    whatsappUrl,
    hasAddress: !!address,
  })

  return (
    <Header
      logoUrl={logoUrl}
      siteName={config.site_name || "M&M Relojes"}
      instagramUrl={instagramUrl}
      facebookUrl={facebookUrl}
      websiteUrl={websiteUrl}
      autogestivaUrl={autogestivaUrl}
      whatsappUrl={whatsappUrl}
      hasAddress={!!address}
    />
  )
}
