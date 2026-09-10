import { ServerHeader } from "@/components/server-header"
import { SectionTitle } from "@/components/section-title"
import { BottomNav } from "@/components/bottom-nav"
import { MapPin, Clock } from "lucide-react"
import { getSiteConfig } from "@/lib/db"

export default async function UbicacionPage() {
  const address = (await getSiteConfig("address")) || "Valle Escondido Camino a la Calera, Km 7.5, Córdoba"
  const businessHours = (await getSiteConfig("business_hours")) || "Lunes a Viernes: 08:00 - 17:00"

  return (
    <main className="flex flex-col min-h-screen pb-20">
      <ServerHeader />
      <SectionTitle title="Ubicación" backUrl="/" />
      <div className="flex-1 p-6 bg-white">
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <div className="flex items-start mb-4">
            <MapPin className="text-tupedido-blue mr-3 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">Dirección</h3>
              <p>{address}</p>
            </div>
          </div>

          <div className="flex items-start mb-4">
            <Clock className="text-tupedido-blue mr-3 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">Horario de atención</h3>
              <p className="whitespace-pre-line">{businessHours}</p>
            </div>
          </div>
        </div>

        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden"></div>
      </div>
      <BottomNav />
    </main>
  )
}
