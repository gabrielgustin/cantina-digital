"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, X, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GoogleMapsPicker } from "@/components/backoffice/google-maps-picker"
import { PreviewButton } from "@/components/backoffice/preview-button"
import { useStore } from "@/contexts/store-context"
import { useToast } from "@/hooks/use-toast"

export default function InformacionNegocioPage() {
  const { informacionNegocio, setInformacionNegocio } = useStore()
  const { toast } = useToast()
  const router = useRouter()
  const [formData, setFormData] = useState({
    logo: "",
    numeroWhatsApp: "",
    ubicacion: "",
    ubicacionLat: undefined as number | undefined,
    ubicacionLng: undefined as number | undefined,
    sitioWeb: "",
    instagram: "",
    facebook: "",
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        console.log("[v0] Fetching site config from API...")
        const response = await fetch("/api/backoffice/site-config")
        if (response.ok) {
          const config = await response.json()
          console.log("[v0] Site config received from API:", config)

          const loadedData = {
            logo: config.store_logo || "",
            numeroWhatsApp: config.contact_whatsapp || "",
            ubicacion: config.store_location || "",
            ubicacionLat: config.store_location_lat ? Number.parseFloat(config.store_location_lat) : undefined,
            ubicacionLng: config.store_location_lng ? Number.parseFloat(config.store_location_lng) : undefined,
            sitioWeb: config.website_url || "",
            instagram: config.instagram_url || "",
            facebook: config.facebook_url || "",
          }

          console.log("[v0] Loaded data mapped to formData:", loadedData)
          setFormData(loadedData)
          if (config.store_logo) {
            setLogoPreview(config.store_logo)
          }
        }
      } catch (error) {
        console.error("[v0] Error fetching config:", error)
      }
    }
    fetchConfig()
  }, [])

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleLogoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo de imagen válido",
        variant: "destructive",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen no debe superar los 5MB",
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const uploadResponse = await fetch("/api/backoffice/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error("Error al subir la imagen")
      }

      const { url } = await uploadResponse.json()
      console.log("[v0] Logo uploaded to Blob:", url)

      const configResponse = await fetch("/api/backoffice/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "store_logo",
          value: url,
          description: "Logo de la tienda",
        }),
      })

      if (!configResponse.ok) {
        throw new Error("Error al guardar el logo")
      }

      setLogoPreview(url)
      handleChange("logo", url)

      toast({
        title: "Logo actualizado",
        description: "El logo se ha subido correctamente",
      })
    } catch (error) {
      console.error("[v0] Error uploading logo:", error)
      toast({
        title: "Error",
        description: "No se pudo subir el logo. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveLogo = async () => {
    try {
      const response = await fetch("/api/backoffice/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "store_logo",
          value: "",
          description: "Logo de la tienda",
        }),
      })

      if (!response.ok) {
        throw new Error("Error al eliminar el logo")
      }

      setLogoPreview("")
      handleChange("logo", "")

      toast({
        title: "Logo eliminado",
        description: "El logo se ha eliminado correctamente",
      })
    } catch (error) {
      console.error("[v0] Error removing logo:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el logo",
        variant: "destructive",
      })
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(formData.sitioWeb)
    toast({
      title: "Link copiado",
      description: "El link de la tienda se ha copiado al portapapeles",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] handleSubmit called - starting save process")

    // Validación básica
    if (!formData.logo) {
      console.log("[v0] Validation failed: logo is empty")
      toast({
        title: "Error",
        description: "Por favor sube un logo antes de guardar",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    console.log("[v0] Validation passed, setting saving state to true")

    try {
      console.log("[v0] Saving business info to database...")

      const whatsappWithPrefix = formData.numeroWhatsApp.startsWith("+54")
        ? formData.numeroWhatsApp
        : `+54 ${formData.numeroWhatsApp.trim()}`

      const configData = {
        store_logo: formData.logo,
        contact_whatsapp: whatsappWithPrefix,
        store_location: formData.ubicacion,
        store_location_lat: formData.ubicacionLat?.toString() || "",
        store_location_lng: formData.ubicacionLng?.toString() || "",
        website_url: formData.sitioWeb,
        instagram_url: formData.instagram,
        facebook_url: formData.facebook,
      }

      console.log("[v0] Config data prepared:", configData)

      const response = await fetch("/api/backoffice/site-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configData),
      })

      console.log("[v0] API response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] API error response:", errorData)
        throw new Error("Error al guardar la configuración")
      }

      const responseData = await response.json()
      console.log("[v0] API response data:", responseData)
      console.log("[v0] Business info saved successfully")

      setInformacionNegocio(formData)

      toast({
        title: "Información guardada",
        description: "La información del negocio ha sido guardada correctamente en la base de datos",
      })

      console.log("[v0] Redirecting to backoffice home in 1 second...")
      setTimeout(() => {
        console.log("[v0] Executing redirect to /backoffice")
        router.push("/backoffice")
      }, 1000)
    } catch (error) {
      console.error("[v0] Error saving business info:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar la información. Intenta nuevamente.",
        variant: "destructive",
      })
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#1e4b8e] text-white">
        <div className="container mx-auto flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <Link href="/backoffice" className="text-white hover:text-gray-200">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-medium text-white">Información del negocio</h1>
          </div>
          <PreviewButton />
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Logo</label>
            <p className="text-xs text-gray-500">
              Te recomendamos que el logo tenga formato PNG con fondo transparente (si no cargas ninguno mostraremos el
              nombre de tu tienda).
            </p>

            {logoPreview && (
              <div className="mt-3 relative inline-block">
                <div className="relative w-48 h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={logoPreview || "/placeholder.svg"}
                    alt="Logo preview"
                    fill
                    className="object-contain p-4"
                    onError={() => {
                      setLogoPreview("")
                      toast({
                        title: "Error",
                        description: "No se pudo cargar la imagen",
                        variant: "destructive",
                      })
                    }}
                  />
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 rounded-full h-8 w-8 p-0"
                  onClick={handleRemoveLogo}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoSelect} className="hidden" />
            <Button
              variant="outline"
              className="mt-2 bg-gray-50 border-0 flex items-center"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {logoPreview ? "Cambiar imagen" : "Seleccionar imagen"}
                </>
              )}
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Número WhatsApp</label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-2 rounded-md border border-gray-300">
                +54
              </span>
              <Input
                placeholder="Ej: 9 11 1234 5678"
                value={formData.numeroWhatsApp.replace(/^\+54\s*/, "")}
                onChange={(e) => {
                  const value = e.target.value.replace(/^\+54\s*/, "")
                  setFormData({ ...formData, numeroWhatsApp: value })
                }}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Ubicación de tu tienda</label>
            <GoogleMapsPicker
              value={formData.ubicacion}
              onChange={(address, lat, lng) => {
                setFormData({
                  ...formData,
                  ubicacion: address,
                  ubicacionLat: lat,
                  ubicacionLng: lng,
                })
              }}
              placeholder="Buscar dirección de tu tienda..."
            />
            <p className="text-xs text-gray-500">
              Ingresa la dirección completa de tu tienda. Puedes usar Google Maps para obtener la dirección exacta.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Links</h2>
            <p className="text-sm text-gray-500 mb-4">
              Opcional. Configura los links de tu página web y/o redes sociales como Instagram, Facebook o Twitter. Los
              usuarios podrán visualizarlos en el menú lateral de tu Tienda.
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Sitio Web</label>
                <Input
                  placeholder="https://www.tusitio.com"
                  value={formData.sitioWeb}
                  onChange={(e) => handleChange("sitioWeb", e.target.value)}
                  className="bg-gray-50 border-0"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Instagram</label>
                <Input
                  placeholder="https://www.instagram.com/tuusuario"
                  value={formData.instagram}
                  onChange={(e) => handleChange("instagram", e.target.value)}
                  className="bg-gray-50 border-0"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Facebook</label>
                <Input
                  placeholder="https://www.facebook.com/tuusuario"
                  value={formData.facebook}
                  onChange={(e) => handleChange("facebook", e.target.value)}
                  className="bg-gray-50 border-0"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Link href="/backoffice">
            <Button variant="outline" className="border-0 bg-gray-50">
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          </Link>
          <Button className="bg-[#1e4b8e] hover:bg-[#163a70]" onClick={handleSubmit} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Guardar
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
