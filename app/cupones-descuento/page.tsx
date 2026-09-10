"use client"

import { useState, useEffect } from "react"
import { ServerHeader } from "@/components/server-header"
import { SectionTitle } from "@/components/section-title"
import { BottomNav } from "@/components/bottom-nav"
import { PreviewButton } from "@/components/preview-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, Plus, Trash2, Edit2 } from "lucide-react"

interface Coupon {
  id: number
  code: string
  discount_value: number
  discount_type: "percentage" | "fixed"
  start_date: string
  end_date: string
  is_active: boolean
}

export default function CuponesDescuentoPage() {
  const [loading, setLoading] = useState(true)
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    code: "",
    discount_value: "",
    discount_type: "percentage" as "percentage" | "fixed",
    start_date: "",
    end_date: "",
    is_active: true,
  })

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      const response = await fetch("/api/coupons")
      const result = await response.json()
      if (result.success) {
        setCoupons(result.data)
      }
    } catch (error) {
      console.error("[v0] Error fetching coupons:", error)
      toast.error("Error al cargar cupones")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      code: "",
      discount_value: "",
      discount_type: "percentage",
      start_date: "",
      end_date: "",
      is_active: true,
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async () => {
    if (!formData.code || !formData.discount_value || !formData.start_date || !formData.end_date) {
      toast.error("Complete todos los campos")
      return
    }

    try {
      const url = editingId ? "/api/coupons" : "/api/coupons"
      const method = editingId ? "PUT" : "POST"
      const body = editingId ? { ...formData, id: editingId } : formData

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const result = await response.json()
      if (result.success) {
        toast.success(editingId ? "Cupón actualizado" : "Cupón creado")
        resetForm()
        fetchCoupons()
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      console.error("[v0] Error saving coupon:", error)
      toast.error("Error al guardar cupón")
    }
  }

  const handleEdit = (coupon: Coupon) => {
    setFormData({
      code: coupon.code,
      discount_value: coupon.discount_value.toString(),
      discount_type: coupon.discount_type,
      start_date: coupon.start_date.split("T")[0],
      end_date: coupon.end_date.split("T")[0],
      is_active: coupon.is_active,
    })
    setEditingId(coupon.id)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Está seguro de eliminar este cupón?")) return

    try {
      const response = await fetch("/api/coupons", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      const result = await response.json()
      if (result.success) {
        toast.success("Cupón eliminado")
        fetchCoupons()
      }
    } catch (error) {
      console.error("[v0] Error deleting coupon:", error)
      toast.error("Error al eliminar cupón")
    }
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
      <SectionTitle title="Cupones de Descuento" backUrl="/" />

      <div className="flex-1 p-6 bg-white space-y-6">
        {!showForm ? (
          <>
            <Button onClick={() => setShowForm(true)} className="w-full bg-tupedido-blue">
              <Plus className="mr-2 h-4 w-4" />
              Crear Nuevo Cupón
            </Button>

            <div className="space-y-4">
              {coupons.map((coupon) => (
                <div key={coupon.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-lg">{coupon.code}</p>
                      <p className="text-sm text-gray-600">
                        {coupon.discount_type === "percentage"
                          ? `${coupon.discount_value}%`
                          : `$${coupon.discount_value}`}{" "}
                        de descuento
                      </p>
                      <p className="text-xs text-gray-500">
                        Válido: {new Date(coupon.start_date).toLocaleDateString()} -{" "}
                        {new Date(coupon.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${coupon.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                      >
                        {coupon.is_active ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(coupon)}>
                      <Edit2 className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(coupon.id)}>
                      <Trash2 className="h-4 w-4 mr-1 text-red-500" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{editingId ? "Editar Cupón" : "Nuevo Cupón"}</h3>

            <div>
              <Label htmlFor="code">Código</Label>
              <Input
                id="code"
                placeholder="DESCUENTO10"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              />
            </div>

            <div>
              <Label htmlFor="discount_type">Tipo de descuento</Label>
              <Select
                value={formData.discount_type}
                onValueChange={(value: "percentage" | "fixed") => setFormData({ ...formData, discount_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Porcentaje (%)</SelectItem>
                  <SelectItem value="fixed">Monto fijo ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="discount_value">Valor del descuento</Label>
              <Input
                id="discount_value"
                type="number"
                placeholder={formData.discount_type === "percentage" ? "10" : "1000"}
                value={formData.discount_value}
                onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Fecha inicio</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="end_date">Fecha fin</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">Cupón activo</Label>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmit} className="flex-1 bg-tupedido-blue">
                {editingId ? "Actualizar" : "Crear"} Cupón
              </Button>
              <Button onClick={resetForm} variant="outline" className="flex-1 bg-transparent">
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  )
}
