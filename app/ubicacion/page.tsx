import { ServerHeader } from "@/components/server-header"
import { SectionTitle } from "@/components/section-title"
import { BottomNav } from "@/components/bottom-nav"
import { MapPin, Clock } from "lucide-react"
import { getSiteConfig, getBusinessHours } from "@/lib/db"

const DAY_LABELS: Record<string, string> = {
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado",
  domingo: "Domingo",
}

export default async function UbicacionPage() {
  const address = (await getSiteConfig("store_location")) || "Sin dirección configurada"
  const hours = await getBusinessHours()

  const businessHoursLines = hours
    .filter((day) => day.is_open)
    .map((day) => {
      const label = DAY_LABELS[day.day_of_week] || day.day_of_week
      let line = `${label}: ${day.open_time} - ${day.close_time}`
      if (day.additional_open_time && day.additional_close_time) {
        line += ` y ${day.additional_open_time} - ${day.additional_close_time}`
      }
      return line
    })

  const businessHoursText =
    businessHoursLines.length > 0 ? businessHoursLines.join("\n") : "Horarios de atención no configurados"

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
              <p className="whitespace-pre-line">{businessHoursText}</p>
            </div>
          </div>
        </div>

        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden"></div>
      </div>
      <BottomNav />
    </main>
  )
}
