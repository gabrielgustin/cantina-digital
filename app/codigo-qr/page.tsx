"use client"

import { useState, useEffect } from "react"
import { ServerHeader } from "@/components/server-header"
import { SectionTitle } from "@/components/section-title"
import { BottomNav } from "@/components/bottom-nav"
import { PreviewButton } from "@/components/preview-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, Download } from "lucide-react"
import QRCode from "react-qr-code"

export default function CodigoQRPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [storeUrl, setStoreUrl] = useState("")

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await fetch("/api/site-config/qr_store_url")
      const result = await response.json()
      if (result.success && result.data) {
        setStoreUrl(result.data.config_value || "")
      }
    } catch (error) {
      console.error("[v0] Error fetching QR config:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!storeUrl.trim()) {
      toast.error("Ingrese una URL válida")
      return
    }

    setSaving(true)
    try {
      const response = await fetch("/api/site-config/qr_store_url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: storeUrl }),
      })

      const result = await response.json()
      if (result.success) {
        toast.success("URL guardada exitosamente")
      } else {
        toast.error("Error al guardar")
      }
    } catch (error) {
      console.error("[v0] Error saving QR config:", error)
      toast.error("Error al guardar URL")
    } finally {
      setSaving(false)
    }
  }

  const downloadQR = (id: string, filename: string) => {
    const svg = document.getElementById(id)
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL("image/png")

      const downloadLink = document.createElement("a")
      downloadLink.download = filename
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = "data:image/svg+xml;base64," + btoa(svgData)
  }

  if (loading) {
    return (
      <main className="flex flex-col min-h-screen pb-20">
        <ServerHeader />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-tupedido-blue" />
        </div>
        <BottomNav />
      </main>
    )
  }

  return (
    <main className="flex flex-col min-h-screen pb-20">
      <ServerHeader />
      <PreviewButton />
      <SectionTitle title="Códigos QR" backUrl="/" />

      <div className="flex-1 p-6 bg-white space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="store_url">URL de la tienda</Label>
            <Input
              id="store_url"
              type="url"
              placeholder="https://mitienda.com"
              value={storeUrl}
              onChange={(e) => setStoreUrl(e.target.value)}
            />
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full bg-tupedido-blue">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar URL"
            )}
          </Button>
        </div>

        {storeUrl && (
          <div className="space-y-4">
            <div className="p-6 border rounded-lg space-y-4">
              <h3 className="text-lg font-semibold text-center">QR de la Tienda</h3>
              <div className="flex justify-center bg-white p-4">
                <QRCode id="qr-store" value={storeUrl} size={200} />
              </div>
              <Button onClick={() => downloadQR("qr-store", "qr-tienda.png")} variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Descargar QR
              </Button>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  )
}
