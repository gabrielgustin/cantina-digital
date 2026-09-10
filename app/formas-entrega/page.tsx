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
import { Loader2, Plus, Trash2, Edit2, GripVertical } from "lucide-react"

interface DeliveryMethod {
  id: number
  name: string
  is_active: boolean
  display_order: number
}

export default function FormasEntregaPage() {
  const [loading, setLoading] = useState(true)
  const [methods, setMethods] = useState<DeliveryMethod[]>([])
  const [newMethod, setNewMethod] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState("")

  useEffect(() => {
    fetchMethods()
  }, [])

  const fetchMethods = async () => {
    try {
      const response = await fetch("/api/delivery-methods")
      const result = await response.json()
      if (result.success) {
        setMethods(result.data)
      }
    } catch (error) {
      console.error("[v0] Error fetching delivery methods:", error)
      toast.error("Error al cargar formas de entrega")
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!newMethod.trim()) {
      toast.error("Ingrese un nombre para la forma de entrega")
      return
    }

    try {
      const response = await fetch("/api/delivery-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newMethod }),
      })

      const result = await response.json()
      if (result.success) {
        toast.success("Forma de entrega agregada")
        setNewMethod("")
        fetchMethods()
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      console.error("[v0] Error adding method:", error)
      toast.error("Error al agregar forma de entrega")
    }
  }

  const handleToggle = async (method: DeliveryMethod) => {
    try {
      const response = await fetch("/api/delivery-methods", {
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
      const response = await fetch("/api/delivery-methods", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...method, name: editingName }),
      })

      const result = await response.json()
      if (result.success) {
        toast.success("Forma de entrega actualizada")
        setEditingId(null)
        setEditingName("")
        fetchMethods()
      }
    } catch (error) {
      console.error("[v0] Error editing method:", error)
      toast.error("Error al editar forma de entrega")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Está seguro de eliminar esta forma de entrega?")) return

    try {
      const response = await fetch("/api/delivery-methods", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      const result = await response.json()
      if (result.success) {
        toast.success("Forma de entrega eliminada")
        fetchMethods()
      }
    } catch (error) {
      console.error("[v0] Error deleting method:", error)
      toast.error("Error al eliminar forma de entrega")
    }
  }

  const moveMethod = async (index: number, direction: "up" | "down") => {
    const newMethods = [...methods]
    const targetIndex = direction === "up" ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= newMethods.length) return // Swap
    ;[newMethods[index], newMethods[targetIndex]] = [newMethods[targetIndex], newMethods[index]]

    // Update display_order
    newMethods.forEach((method, idx) => {
      method.display_order = idx
    })

    setMethods(newMethods)

    // Save to database
    try {
      await Promise.all(
        newMethods.map((method) =>
          fetch("/api/delivery-methods", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(method),
          }),
        ),
      )
      toast.success("Orden actualizado")
    } catch (error) {
      console.error("[v0] Error updating order:", error)
      toast.error("Error al actualizar orden")
      fetchMethods() // Reload on error
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
      <SectionTitle title="Formas de Entrega" backUrl="/" />

      <div className="flex-1 p-6 bg-white space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Agregar nueva forma de entrega</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Nombre de la forma de entrega"
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
          <h3 className="text-lg font-semibold">Formas disponibles</h3>
          {methods.map((method, index) => (
            <div key={method.id} className="flex items-center gap-2 p-4 border rounded-lg">
              <div className="flex flex-col gap-1">
                <button onClick={() => moveMethod(index, "up")} disabled={index === 0} className="disabled:opacity-30">
                  <GripVertical className="h-4 w-4" />
                </button>
              </div>

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
                  <span className="flex-1 font-medium">{method.name}</span>
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
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(method.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
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
