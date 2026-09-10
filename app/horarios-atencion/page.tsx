"use client"

import { useState, useEffect } from "react"
import { ServerHeader } from "@/components/server-header"
import { SectionTitle } from "@/components/section-title"
import { BottomNav } from "@/components/bottom-nav"
import { PreviewButton } from "@/components/preview-button"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface BusinessHours {
  monday: boolean
  tuesday: boolean
  wednesday: boolean
  thursday: boolean
  friday: boolean
  saturday: boolean
  sunday: boolean
  main_start_time: string
  main_end_time: string
  additional_start_time: string | null
  additional_end_time: string | null
  allow_orders_when_closed: boolean
}

export default function HorariosAtencionPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hours, setHours] = useState<BusinessHours>({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: false,
    main_start_time: "09:00",
    main_end_time: "18:00",
    additional_start_time: null,
    additional_end_time: null,
    allow_orders_when_closed: false,
  })

  useEffect(() => {
    fetchHours()
  }, [])

  const fetchHours = async () => {
    try {
      const response = await fetch("/api/business-hours")
      const result = await response.json()
      if (result.success) {
        setHours(result.data)
      }
    } catch (error) {
      console.error("[v0] Error fetching hours:", error)
      toast.error("Error al cargar horarios")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/business-hours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hours),
      })

      const result = await response.json()
      if (result.success) {
        toast.success("Horarios guardados exitosamente")
      } else {
        toast.error(result.error || "Error al guardar")
      }
    } catch (error) {
      console.error("[v0] Error saving hours:", error)
      toast.error("Error al guardar horarios")
    } finally {
      setSaving(false)
    }
  }

  const days = [
    { key: "monday", label: "Lunes" },
    { key: "tuesday", label: "Martes" },
    { key: "wednesday", label: "Miércoles" },
    { key: "thursday", label: "Jueves" },
    { key: "friday", label: "Viernes" },
    { key: "saturday", label: "Sábado" },
    { key: "sunday", label: "Domingo" },
  ]

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
      <SectionTitle title="Horarios de Atención" backUrl="/" />

      <div className="flex-1 p-6 bg-white space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Días de atención</h3>
          {days.map((day) => (
            <div key={day.key} className="flex items-center justify-between">
              <Label htmlFor={day.key}>{day.label}</Label>
              <Switch
                id={day.key}
                checked={hours[day.key as keyof BusinessHours] as boolean}
                onCheckedChange={(checked) => setHours({ ...hours, [day.key]: checked })}
              />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Horario principal</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="main_start">Apertura</Label>
              <Input
                id="main_start"
                type="time"
                value={hours.main_start_time}
                onChange={(e) => setHours({ ...hours, main_start_time: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="main_end">Cierre</Label>
              <Input
                id="main_end"
                type="time"
                value={hours.main_end_time}
                onChange={(e) => setHours({ ...hours, main_end_time: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Horario adicional (opcional)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="add_start">Apertura</Label>
              <Input
                id="add_start"
                type="time"
                value={hours.additional_start_time || ""}
                onChange={(e) => setHours({ ...hours, additional_start_time: e.target.value || null })}
              />
            </div>
            <div>
              <Label htmlFor="add_end">Cierre</Label>
              <Input
                id="add_end"
                type="time"
                value={hours.additional_end_time || ""}
                onChange={(e) => setHours({ ...hours, additional_end_time: e.target.value || null })}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <Label htmlFor="allow_closed">Permitir pedidos fuera de horario</Label>
          <Switch
            id="allow_closed"
            checked={hours.allow_orders_when_closed}
            onCheckedChange={(checked) => setHours({ ...hours, allow_orders_when_closed: checked })}
          />
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full bg-tupedido-blue">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar Horarios"
          )}
        </Button>
      </div>

      <BottomNav />
    </main>
  )
}
