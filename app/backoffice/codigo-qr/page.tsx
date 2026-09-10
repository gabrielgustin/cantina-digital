"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStore } from "@/contexts/store-context"
import { useToast } from "@/hooks/use-toast"

export default function CodigoQRPage() {
  const { informacionNegocio } = useStore()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("tienda")
  const qrCodeUrl = "/qr-code.png"

  const tiendaUrl = informacionNegocio.linkTienda || "https://tupedido.app/mi-tienda"

  const handleDownload = () => {
    // En una implementación real, aquí se descargaría el QR
    toast({
      title: "QR descargado",
      description: "El código QR ha sido descargado correctamente",
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center px-6 py-4 border-b border-gray-100 bg-[#1e4b8e] text-white">
        <Link href="/backoffice" className="text-white hover:text-gray-200 mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-medium text-white">Código QR</h1>
      </header>

      {/* Content */}
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white border border-gray-100 rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Código QR</h2>
          

          <Tabs defaultValue="tienda" className="mb-6">
            <TabsList className="grid grid-cols-2 bg-gray-50">
              <TabsTrigger value="tienda" onClick={() => setActiveTab("tienda")}>
                QR Tienda
              </TabsTrigger>
              <TabsTrigger value="menu" onClick={() => setActiveTab("menu")}>
                QR Menú Digital
              </TabsTrigger>
            </TabsList>
            <TabsContent value="tienda" className="pt-6">
              <div className="flex flex-col items-center">
                <div className="border border-gray-200 p-4 rounded-lg mb-4">
                  <Image
                    src={qrCodeUrl || "/placeholder.svg"}
                    alt="QR Code"
                    width={200}
                    height={200}
                    className="mx-auto"
                  />
                </div>
                
                <Button variant="outline" className="flex items-center gap-2" onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                  Descargar código QR
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="menu" className="pt-6">
              <div className="flex flex-col items-center">
                <div className="border border-gray-200 p-4 rounded-lg mb-4">
                  <Image
                    src={qrCodeUrl || "/placeholder.svg"}
                    alt="QR Code Menu"
                    width={200}
                    height={200}
                    className="mx-auto"
                  />
                </div>
                
                <Button variant="outline" className="flex items-center gap-2" onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                  Descargar código QR
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
