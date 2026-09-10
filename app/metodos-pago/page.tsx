"use client"

import { useState, useEffect } from "react"
import { ServerHeader } from "@/components/server-header"
import { SectionTitle } from "@/components/section-title"
import { BottomNav } from "@/components/bottom-nav"
import { PreviewButton } from "@/components/preview-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Loader2, Plus, Trash2, Edit2 } from "lucide-react"

interface PaymentMethod {
  id: number
  name: string
  is_active: boolean
}

export default function MetodosPagoPage() {
  const [loading, setLoading] = useState(true)
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [newMethod, setNewMethod] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState("")

  useEffect(() => {
    fetchMethods()
  }, [])

  const fetchMethods = async () => {
    try {
      const response = await fetch("/api/payment-methods")
      const result = await response.json()
      if (result.success) {
        setMethods(result.data)
      }
    } catch (error) {
      console.error("[v0] Error fetching payment methods:", error)
      toast.error("Error al cargar métodos de pago")
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!newMethod.trim()) {
      toast.error("Ingrese un nombre para el método de pago")
      return
    }

    try {
      const response = await fetch("/api/payment-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newMethod }),
      })

      const result = await response.json()
      if (result.success) {
        toast.success("Método agregado exitosamente")
        setNewMethod("")
        fetchMethods()
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      console.error("[v0] Error adding method:", error)
      toast.error("Error al agregar método")
    }
  }

  const handleToggle = async (method: PaymentMethod) => {
    try {
      const response = await fetch("/api/payment-methods", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...method, is_active: !method.is_active }),
      })

      const result = await response.json()
      if (result.success) {
        toast.success("Estado actualizado")
        fetchMethods()
      }
    } catch (error) {
      console.error("[v0] Error toggling method:", error)
      toast.error("Error al actualizar estado")
    }
  }

  const handleEdit = async (id: number) => {
    if (!editingName.trim()) {
      toast.error("Ingrese un nombre válido")
      return
    }

    try {
      const method = methods.find((m) => m.id === id)
      const response = await fetch("/api/payment-methods", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...method, name: editingName }),
      })

      const result = await response.json()
      if (result.success) {
        toast.success("Método actualizado")
        setEditingId(null)
        setEditingName("")
        fetchMethods()
      }
    } catch (error) {
      console.error("[v0] Error editing method:", error)
      toast.error("Error al editar método")
    }
  }

  const handleDelete = async (method: PaymentMethod) => {
    if (method.name === "Transferencia") {
      toast.error("No se puede eliminar el método Transferencia")
      return
    }

    if (!confirm("¿Está seguro de eliminar este método?")) return

    try {
      const response = await fetch("/api/payment-methods", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: method.id, name: method.name }),
      })

      const result = await response.json()
      if (result.success) {
        toast.success("Método eliminado")
        fetchMethods()
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      console.error("[v0] Error deleting method:", error)
      toast.error("Error al eliminar método")
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
      <SectionTitle title="Métodos de Pago" backUrl="/" />

      <div className="flex-1 p-6 bg-white space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Agregar nuevo método</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Nombre del método"
              value={newMethod}
              onChange={(e) => setNewMethod(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAdd()}
            />
            <Button onClick={handleAdd} className="bg-tupedido-blue">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Métodos disponibles</h3>
          {methods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
              {editingId === method.id ? (
                <div className="flex-1 flex gap-2">
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleEdit(method.id)}
                  />
                  <Button onClick={() => handleEdit(method.id)} size="sm">
                    Guardar
                  </Button>
                  <Button onClick={() => setEditingId(null)} size="sm" variant="outline">
                    Cancelar
                  </Button>
                </div>
              ) : (
                <>
                  <span className="font-medium">{method.name}</span>
                  <div className="flex items-center gap-2">
                    <Switch checked={method.is_active} onCheckedChange={() => handleToggle(method)} />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingId(method.id)
                        setEditingName(method.name)
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    {method.name !== "Transferencia" && (
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(method)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </main>
  )
}
