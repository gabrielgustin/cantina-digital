"use client"
import Image from "next/image"
import Link from "next/link"
import { Grid3X3, Briefcase, Info, Clock, CreditCard, Ticket, QrCode, Package, ExternalLink } from "lucide-react"
import { Card } from "@/components/ui/card"
import { PreviewButton } from "@/components/backoffice/preview-button"
import { SignOutButton } from "@/components/backoffice/sign-out-button"

export default function BackofficeHome() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1e4b8e] text-white relative">
        <div className="container mx-auto flex items-center justify-between gap-2 px-4 py-3 md:px-6 md:py-4">
          <div className="min-w-0">
            <Image
              src="/images/logoautogestiva.png"
              alt="Autogestiva"
              width={500}
              height={100}
              className="h-10 w-auto md:h-20"
              priority
            />
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <PreviewButton />
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 pt-8 pb-8 flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {/* Todo lo que necesitas */}
          <div className="mb-8 mt-4 md:mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/backoffice/categorias">
                <Card className="p-6 flex flex-col items-center justify-center text-center h-[120px] hover:shadow-sm transition-shadow border border-[#1e4b8e]">
                  <Grid3X3 className="h-8 w-8 text-[#1e4b8e] mb-2" />
                  <h3 className="font-medium text-gray-700">Categorías</h3>
                </Card>
              </Link>

              <Link href="/backoffice/productos">
                <Card className="p-6 flex flex-col items-center justify-center text-center h-[120px] hover:shadow-sm transition-shadow border border-[#1e4b8e]">
                  <Briefcase className="h-8 w-8 text-[#1e4b8e] mb-2" />
                  <h3 className="font-medium text-gray-700">Productos</h3>
                </Card>
              </Link>
            </div>
          </div>

          {/* Personaliza tu tienda */}
          <div>
            <h2 className="text-xl font-medium text-[#1e4b8e] mb-6">Personaliza tu tienda</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/backoffice/informacion-negocio">
                <div className="bg-gray-50 rounded-lg p-4 flex items-center hover:bg-gray-100 transition-colors">
                  <div className="bg-gray-200 p-2 rounded-lg mr-4">
                    <Info className="h-5 w-5 text-[#1e4b8e]" />
                  </div>
                  <span className="font-medium text-gray-700">Información del negocio</span>
                </div>
              </Link>

              <Link href="/backoffice/formas-entrega">
                <div className="bg-gray-50 rounded-lg p-4 flex items-center hover:bg-gray-100 transition-colors">
                  <div className="bg-gray-200 p-2 rounded-lg mr-4">
                    <Package className="h-5 w-5 text-[#1e4b8e]" />
                  </div>
                  <span className="font-medium text-gray-700">Formas de entrega</span>
                </div>
              </Link>

              <Link href="/backoffice/horarios-atencion">
                <div className="bg-gray-50 rounded-lg p-4 flex items-center hover:bg-gray-100 transition-colors">
                  <div className="bg-gray-200 p-2 rounded-lg mr-4">
                    <Clock className="h-5 w-5 text-[#1e4b8e]" />
                  </div>
                  <span className="font-medium text-gray-700">Horarios de atención</span>
                </div>
              </Link>

              <Link href="/backoffice/metodos-pago">
                <div className="bg-gray-50 rounded-lg p-4 flex items-center hover:bg-gray-100 transition-colors">
                  <div className="bg-gray-200 p-2 rounded-lg mr-4">
                    <CreditCard className="h-5 w-5 text-[#1e4b8e]" />
                  </div>
                  <span className="font-medium text-gray-700">Métodos de pago</span>
                </div>
              </Link>

              <Link href="/backoffice/cupones-descuento">
                <div className="bg-gray-50 rounded-lg p-4 flex items-center hover:bg-gray-100 transition-colors">
                  <div className="bg-gray-200 p-2 rounded-lg mr-4">
                    <Ticket className="h-5 w-5 text-[#1e4b8e]" />
                  </div>
                  <span className="font-medium text-gray-700">Cupones de descuento</span>
                </div>
              </Link>

              <Link href="/backoffice/codigo-qr">
                <div className="bg-gray-50 rounded-lg p-4 flex items-center hover:bg-gray-100 transition-colors">
                  <div className="bg-gray-200 p-2 rounded-lg mr-4">
                    <QrCode className="h-5 w-5 text-[#1e4b8e]" />
                  </div>
                  <span className="font-medium text-gray-700">Código QR</span>
                </div>
              </Link>

              <Link href="/backoffice/banner-promocional">
                <div className="bg-gray-50 rounded-lg p-4 flex items-center hover:bg-gray-100 transition-colors">
                  <div className="bg-gray-200 p-2 rounded-lg mr-4">
                    <Package className="h-5 w-5 text-[#1e4b8e]" />
                  </div>
                  <span className="font-medium text-gray-700">Banner Promocional</span>
                </div>
              </Link>

              <Link href="/backoffice/colores-app">
                <div className="bg-gray-50 rounded-lg p-4 flex items-center hover:bg-gray-100 transition-colors">
                  <div className="bg-gray-200 p-2 rounded-lg mr-4">
                    <svg className="h-5 w-5 text-[#1e4b8e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                      />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-700">Colores de la App</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[350px]">
          {/* Conoce más sobre Autogestiva */}
          <div className="bg-[#1e4b8e] text-white p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-6 flex items-center">Conoce más sobre Autogestiva</h3>

            <div className="space-y-4">
              <Link
                href="https://www.autogestiva.com.ar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:underline"
              >
                <ExternalLink className="h-5 w-5 mr-4" />
                Visita nuestro sitio web
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
