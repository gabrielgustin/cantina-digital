"use client"

import { getAllSiteConfigOptimized } from "@/lib/db"
import { SideMenuClient } from "./side-menu-client"

export async function SideMenuServer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const config = await getAllSiteConfigOptimized()

  console.log("[v0] Site config from database:", config)

  const instagramUrl = config.instagram_url || null
  const autogestivaUrl = config.autogestiva_url || null
  const rawWhatsapp = config.contact_whatsapp || null
  const address = config.address || null

  console.log("[v0] Instagram URL:", instagramUrl)
  console.log("[v0] Autogestiva URL:", autogestivaUrl)
  console.log("[v0] Raw WhatsApp:", rawWhatsapp)
  console.log("[v0] Address:", address)

  const whatsappUrl = rawWhatsapp ? `https://wa.me/${rawWhatsapp.replace(/[\s\-$$$$]/g, "")}` : null

  console.log("[v0] Final whatsappUrl:", whatsappUrl)

  return (
    <SideMenuClient
      isOpen={isOpen}
      onClose={onClose}
      instagramUrl={instagramUrl}
      autogestivaUrl={autogestivaUrl}
      whatsappUrl={whatsappUrl}
      hasAddress={!!address}
    />
  )
}
