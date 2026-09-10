import { ServerHeader } from "@/components/server-header"
import { SectionTitle } from "@/components/section-title"
import { BottomNav } from "@/components/bottom-nav"
import { ExternalLink } from "lucide-react"

export default function SitioWebPage() {
  return (
    <main className="flex flex-col min-h-screen pb-20">
      <ServerHeader />
      <SectionTitle title="Sitio web" backUrl="/" />
      <div className="flex-1 p-6 bg-white">
        <h2 className="text-2xl font-bold mb-4">Nuestro Sitio Web</h2>
        <p className="mb-6">Visita nuestro sitio web completo para conocer más sobre nuestros productos y servicios.</p>

        <div className="bg-gray-100 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-3">Sitio web oficial</h3>
          <a
            href="https://www.tupedido.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-tupedido-blue font-semibold"
          >
            www.tupedido.com
            <ExternalLink className="ml-2" size={18} />
          </a>
        </div>

        <h3 className="text-xl font-semibold mb-3">Características de nuestro sitio</h3>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>Catálogo completo de productos</li>
          <li>Blog con noticias y artículos sobre vapeo</li>
          <li>Guías de compra y recomendaciones</li>
          <li>Preguntas frecuentes</li>
          <li>Política de privacidad y términos de servicio</li>
        </ul>

        <div className="bg-tupedido-blue text-white p-4 rounded-lg">
          <h3 className="font-semibold mb-2">¿Necesitas ayuda?</h3>
          <p>
            Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos a través de nuestro sitio web o
            por teléfono.
          </p>
        </div>
      </div>
      <BottomNav />
    </main>
  )
}
