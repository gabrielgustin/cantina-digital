"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Home,
  ShoppingCart,
  Search,
  Menu,
  RotateCcw,
  ChevronRight,
  Instagram,
  Facebook,
  Globe,
  MessageCircle,
} from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function ColoresAppPage() {
  const coloresPredeterminados = {
    primario: "#1e4b8e", // Azul oscuro - headers, títulos
    secundario: "#FFDAB9", // Melocotón/peach - fondos secundarios
    fondo: "#f9fafb", // Gris muy claro - fondo principal
    texto: "#1f2937", // Gris oscuro - texto principal
  }

  const [colores, setColores] = useState(coloresPredeterminados)
  const [guardando, setGuardando] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [vistaActual, setVistaActual] = useState<"home" | "productos" | "detalle">("home")
  const { toast } = useToast()
  const router = useRouter()
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>("Categoria 1")
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    cargarColores()
  }, [])

  const cargarColores = async () => {
    try {
      const response = await fetch("/api/backoffice/site-config")
      if (response.ok) {
        const configs = await response.json()

        const coloresConfig: any = {}

        Object.keys(configs).forEach((key) => {
          if (key.startsWith("color_")) {
            const colorKey = key.replace("color_", "")
            coloresConfig[colorKey] = configs[key]
          }
        })

        if (Object.keys(coloresConfig).length > 0) {
          setColores((prev) => ({ ...prev, ...coloresConfig }))
        }
      }
    } catch (error) {
      console.error("[v0] Error loading colors:", error)
    } finally {
      setCargando(false)
    }
  }

  const handleColorChange = (tipo: string, valor: string) => {
    setColores((prev) => ({
      ...prev,
      [tipo]: valor,
    }))
  }

  const handleGuardar = async () => {
    setGuardando(true)
    try {
      const response = await fetch("/api/backoffice/site-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          color_primario: colores.primario,
          color_secundario: colores.secundario,
          color_fondo: colores.fondo,
          color_texto: colores.texto,
        }),
      })

      if (response.ok) {
        toast({
          title: "Colores guardados",
          description: "Los colores se han actualizado exitosamente.",
        })

        setTimeout(() => {
          router.push("/")
        }, 1500)
      } else {
        throw new Error("Error al guardar colores")
      }
    } catch (error) {
      console.error("[v0] Error saving colors:", error)
      toast({
        title: "Error",
        description: "No se pudieron guardar los colores. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setGuardando(false)
    }
  }

  const handleRestablecer = () => {
    setColores(coloresPredeterminados)
    toast({
      title: "Colores restablecidos",
      description: "Se han restaurado los colores predeterminados.",
    })
  }

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen)
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e4b8e] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando configuración de colores...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1e4b8e] text-white">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/backoffice">
              <Button variant="ghost" className="text-white hover:bg-white/10 p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Personalización de Colores</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <p className="text-gray-600">
            Personaliza los colores principales de tu tienda. Los cambios se muestran en tiempo real en la vista previa.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Configuración de Colores</h2>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="primario" className="text-sm font-medium text-gray-700 mb-2 block">
                    Color Primario
                  </Label>
                  <p className="text-xs text-gray-500 mb-3">
                    Headers, navbar, títulos de sección y elementos destacados de navegación
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      id="primario"
                      value={colores.primario}
                      onChange={(e) => handleColorChange("primario", e.target.value)}
                      className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={colores.primario}
                      onChange={(e) => handleColorChange("primario", e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="secundario" className="text-sm font-medium text-gray-700 mb-2 block">
                    Color Secundario
                  </Label>
                  <p className="text-xs text-gray-500 mb-3">
                    Fondos secundarios, áreas de contraste suave y elementos de UI complementarios
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      id="secundario"
                      value={colores.secundario}
                      onChange={(e) => handleColorChange("secundario", e.target.value)}
                      className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={colores.secundario}
                      onChange={(e) => handleColorChange("secundario", e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="fondo" className="text-sm font-medium text-gray-700 mb-2 block">
                    Color de Fondo
                  </Label>
                  <p className="text-xs text-gray-500 mb-3">
                    Fondo principal, tarjetas de productos, tarjetas de categorías, modales y diálogos
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      id="fondo"
                      value={colores.fondo}
                      onChange={(e) => handleColorChange("fondo", e.target.value)}
                      className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={colores.fondo}
                      onChange={(e) => handleColorChange("fondo", e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="texto" className="text-sm font-medium text-gray-700 mb-2 block">
                    Color de Texto
                  </Label>
                  <p className="text-xs text-gray-500 mb-3">
                    Títulos de productos, descripciones, contenido general y labels
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      id="texto"
                      value={colores.texto}
                      onChange={(e) => handleColorChange("texto", e.target.value)}
                      className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={colores.texto}
                      onChange={(e) => handleColorChange("texto", e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button onClick={handleGuardar} disabled={guardando} className="w-full bg-[#1e4b8e] hover:bg-[#163a6f]">
                  {guardando ? "Guardando..." : "Guardar Cambios"}
                </Button>

                <Button
                  onClick={handleRestablecer}
                  variant="outline"
                  className="w-full mt-3 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restablecer Colores
                </Button>
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Vista Previa en Tiempo Real</h2>
              <p className="text-sm text-gray-600 mb-4">
                Navega por la demo de la aplicación para ver cómo se aplican los colores en tiempo real.
              </p>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setVistaActual("home")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    vistaActual === "home" ? "bg-[#1e4b8e] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Inicio
                </button>
                <button
                  onClick={() => setVistaActual("productos")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    vistaActual === "productos"
                      ? "bg-[#1e4b8e] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Productos
                </button>
                <button
                  onClick={() => setVistaActual("detalle")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    vistaActual === "detalle"
                      ? "bg-[#1e4b8e] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Producto
                </button>
              </div>

              <div className="border-2 border-gray-300 rounded-3xl p-4 bg-gray-100 shadow-xl">
                <div
                  className="bg-white rounded-2xl overflow-hidden shadow-lg relative"
                  style={{ backgroundColor: colores.fondo }}
                >
                  {menuOpen && (
                    <div className="absolute inset-0 bg-black/50 z-40 rounded-2xl" onClick={() => setMenuOpen(false)} />
                  )}

                  <div
                    className={`${
                      menuOpen ? "translate-x-0" : "-translate-x-full"
                    } absolute left-0 top-0 bottom-0 w-64 transition-transform duration-300 ease-in-out z-50 rounded-l-2xl`}
                    style={{ backgroundColor: colores.primario }}
                  >
                    <div className="p-6 space-y-2">
                      <button
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 w-full text-left py-2 hover:opacity-80 transition-opacity"
                      >
                        <Home className="h-6 w-6" style={{ color: colores.fondo }} />
                        <span className="text-lg font-open-sans font-medium" style={{ color: colores.fondo }}>
                          Inicio
                        </span>
                      </button>

                      <button
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 w-full text-left py-2 hover:opacity-80 transition-opacity"
                      >
                        <Instagram className="h-6 w-6" style={{ color: colores.fondo }} />
                        <span className="text-lg font-open-sans font-medium" style={{ color: colores.fondo }}>
                          Instagram
                        </span>
                      </button>

                      <button
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 w-full text-left py-2 hover:opacity-80 transition-opacity"
                      >
                        <Facebook className="h-6 w-6" style={{ color: colores.fondo }} />
                        <span className="text-lg font-open-sans font-medium" style={{ color: colores.fondo }}>
                          Facebook
                        </span>
                      </button>

                      <button
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 w-full text-left py-2 hover:opacity-80 transition-opacity"
                      >
                        <Globe className="h-6 w-6" style={{ color: colores.fondo }} />
                        <span className="text-lg font-open-sans font-medium" style={{ color: colores.fondo }}>
                          Sitio Web
                        </span>
                      </button>

                      <button
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 w-full text-left py-2 hover:opacity-80 transition-opacity"
                      >
                        <MessageCircle className="h-6 w-6" style={{ color: colores.fondo }} />
                        <span className="text-lg font-open-sans font-medium" style={{ color: colores.fondo }}>
                          WhatsApp
                        </span>
                      </button>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="border-2 rounded-lg p-4 mb-4 text-center" style={{ borderColor: colores.fondo }}>
                        <p className="text-base font-open-sans font-semibold" style={{ color: colores.fondo }}>
                          ¿Quiero una tienda así para mi negocio!
                        </p>
                      </div>
                      <button
                        onClick={() => setMenuOpen(false)}
                        className="w-full py-3 rounded-lg font-open-sans font-medium"
                        style={{ backgroundColor: colores.fondo, color: colores.primario }}
                      >
                        Cerrar
                      </button>
                    </div>
                  </div>

                  {vistaActual === "home" && (
                    <>
                      <div
                        className="px-4 py-4 flex items-center justify-between border-b"
                        style={{ backgroundColor: colores.fondo }}
                      >
                        <button onClick={() => setMenuOpen(true)}>
                          <Menu className="h-6 w-6" style={{ color: colores.primario }} />
                        </button>
                        <Search className="h-6 w-6" style={{ color: colores.primario }} />
                      </div>

                      <div
                        className="px-4 py-4 flex items-center gap-3"
                        style={{ backgroundColor: colores.secundario }}
                      >
                        <span className="text-3xl">😴</span>
                        <div>
                          <p className="text-base font-semibold font-open-sans" style={{ color: colores.texto }}>
                            En este momento estamos cerrados
                          </p>
                          <p className="text-sm font-open-sans" style={{ color: colores.texto, opacity: 0.8 }}>
                            Hacé click para consultar nuestros horarios.
                          </p>
                        </div>
                      </div>

                      <div className="w-full py-4 px-4" style={{ backgroundColor: colores.primario }}>
                        <h2 className="text-3xl font-bold title-font text-white">Categorías</h2>
                      </div>

                      <div className="p-4 space-y-4">
                        <button
                          onClick={() => {
                            setCategoriaSeleccionada("Categoria 1")
                            setVistaActual("productos")
                          }}
                          className="w-full rounded-2xl shadow-md p-4 flex items-center gap-4 transition-transform hover:scale-[1.02]"
                          style={{ backgroundColor: colores.fondo }}
                        >
                          <div className="w-20 h-20 flex-shrink-0 bg-gray-200 rounded-lg shadow-inner"></div>
                          <div className="flex-1 text-left">
                            <h3 className="text-xl font-bold font-open-sans" style={{ color: colores.primario }}>
                              Categoria 1
                            </h3>
                          </div>
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: colores.primario }}
                          >
                            <ChevronRight className="h-6 w-6" style={{ color: colores.fondo }} />
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setCategoriaSeleccionada("Categoria 2")
                            setVistaActual("productos")
                          }}
                          className="w-full rounded-2xl shadow-md p-4 flex items-center gap-4 transition-transform hover:scale-[1.02]"
                          style={{ backgroundColor: colores.fondo }}
                        >
                          <div className="w-20 h-20 flex-shrink-0 bg-gray-200 rounded-lg shadow-inner"></div>
                          <div className="flex-1 text-left">
                            <h3 className="text-xl font-bold font-open-sans" style={{ color: colores.primario }}>
                              Categoria 2
                            </h3>
                          </div>
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: colores.primario }}
                          >
                            <ChevronRight className="h-6 w-6" style={{ color: colores.fondo }} />
                          </div>
                        </button>
                      </div>

                      <div
                        className="border-t px-6 py-3 flex items-center justify-around"
                        style={{ backgroundColor: colores.fondo }}
                      >
                        <Home className="h-6 w-6" style={{ color: colores.primario }} />
                        <ShoppingCart className="h-6 w-6" style={{ color: colores.primario }} />
                      </div>
                    </>
                  )}

                  {vistaActual === "productos" && (
                    <>
                      <div
                        className="flex items-center justify-between p-4"
                        style={{ backgroundColor: colores.primario }}
                      >
                        <button onClick={handleMenuClick} className="text-white">
                          <Menu className="w-6 h-6" />
                        </button>
                        <Search className="w-6 h-6 text-white" />
                      </div>

                      <div
                        className="flex items-center gap-3 px-4 py-3"
                        style={{ backgroundColor: colores.secundario }}
                      >
                        <span className="text-2xl">😴</span>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: colores.texto }}>
                            En este momento estamos cerrados
                          </p>
                          <p className="text-xs" style={{ color: colores.texto }}>
                            Hacé click para consultar nuestros horarios.
                          </p>
                        </div>
                      </div>

                      <div className="px-4 py-3" style={{ backgroundColor: colores.primario }}>
                        <h2 className="text-3xl font-bold title-font text-white">{categoriaSeleccionada}</h2>
                      </div>

                      <div className="px-4 py-3 border-b" style={{ backgroundColor: colores.fondo }}>
                        <div className="flex items-center gap-2 overflow-x-auto">
                          <button
                            className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap"
                            style={{ backgroundColor: colores.primario, color: colores.fondo }}
                          >
                            Todos
                          </button>
                          <button
                            className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border"
                            style={{ color: colores.texto, borderColor: colores.primario }}
                          >
                            {"Subcategoria 1"}
                          </button>
                          <button
                            className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border"
                            style={{ color: colores.texto, borderColor: colores.primario }}
                          >
                            Subcategoria 2
                          </button>
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <button
                          onClick={() => setVistaActual("detalle")}
                          className="w-full rounded-xl p-4 shadow-sm border flex items-center gap-3"
                          style={{ backgroundColor: colores.fondo }}
                        >
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0"></div>
                          <div className="flex-1 min-w-0 text-left">
                            <h3 className="font-semibold text-sm mb-0.5 truncate" style={{ color: colores.texto }}>
                              Producto 1
                            </h3>
                            <p className="text-xs mb-1" style={{ color: colores.texto, opacity: 0.6 }}>
                              {"Subcategoria 1"}
                            </p>
                            <p className="text-base font-bold" style={{ color: colores.texto }}>
                              $100
                            </p>
                          </div>
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: colores.primario }}
                          >
                            <ChevronRight className="h-5 w-5" style={{ color: colores.fondo }} />
                          </div>
                        </button>

                        <div
                          className="rounded-xl p-4 shadow-sm border flex items-center gap-3"
                          style={{ backgroundColor: colores.fondo }}
                        >
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm mb-0.5 truncate" style={{ color: colores.texto }}>
                              Producto 2
                            </h3>
                            <p className="text-xs mb-1" style={{ color: colores.texto, opacity: 0.6 }}>
                              Subcategoria 2
                            </p>
                            <p className="text-base font-bold" style={{ color: colores.texto }}>
                              $200
                            </p>
                          </div>
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: colores.primario }}
                          >
                            <ChevronRight className="h-5 w-5" style={{ color: colores.fondo }} />
                          </div>
                        </div>
                      </div>

                      <div
                        className="border-t px-6 py-3 flex items-center justify-around"
                        style={{ backgroundColor: colores.fondo }}
                      >
                        <button onClick={() => setVistaActual("home")}>
                          <Home className="h-6 w-6" style={{ color: colores.primario }} />
                        </button>
                        <ShoppingCart className="h-6 w-6" style={{ color: colores.primario }} />
                      </div>
                    </>
                  )}

                  {vistaActual === "detalle" && (
                    <>
                      <div
                        className="flex items-center justify-between p-4"
                        style={{ backgroundColor: colores.primario }}
                      >
                        <button onClick={handleMenuClick} className="text-white">
                          <Menu className="w-6 h-6" />
                        </button>
                      </div>

                      <div
                        className="flex items-center gap-3 px-4 py-3"
                        style={{ backgroundColor: colores.secundario }}
                      >
                        <span className="text-2xl">😴</span>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: colores.texto }}>
                            En este momento estamos cerrados
                          </p>
                          <p className="text-xs" style={{ color: colores.texto }}>
                            Hacé click para consultar nuestros horarios.
                          </p>
                        </div>
                      </div>

                      <div className="px-4 py-3" style={{ backgroundColor: colores.primario }}>
                        <h2 className="text-3xl font-bold title-font text-white">Producto</h2>
                      </div>

                      <div className="p-6">
                        <div className="w-full h-48 bg-gray-100 rounded-2xl mb-4"></div>
                      </div>

                      <div className="px-6 pb-6">
                        <h1 className="text-2xl font-bold font-open-sans mb-2" style={{ color: colores.texto }}>
                          Producto 1
                        </h1>
                        <p className="text-sm font-open-sans mb-4" style={{ color: colores.texto, opacity: 0.6 }}>
                          {"Subcategoria 1"}
                        </p>

                        <div className="mb-6">
                          <p className="text-3xl font-bold font-open-sans" style={{ color: colores.texto }}>
                            $100
                          </p>
                        </div>

                        <div className="mb-6">
                          <h3 className="text-sm font-semibold font-open-sans mb-2" style={{ color: colores.texto }}>
                            Descripción
                          </h3>
                          <p
                            className="text-sm leading-relaxed font-open-sans"
                            style={{ color: colores.texto, opacity: 0.7 }}
                          >
                            {"Descripcion del producto"}
                          </p>
                        </div>

                        <button
                          className="w-full py-4 rounded-xl font-semibold font-open-sans text-lg transition-opacity hover:opacity-90"
                          style={{ backgroundColor: colores.primario, color: colores.fondo }}
                        >
                          Agregar al Carrito
                        </button>
                      </div>

                      <div
                        className="border-t px-6 py-3 flex items-center justify-around"
                        style={{ backgroundColor: colores.fondo }}
                      >
                        <button onClick={() => setVistaActual("home")}>
                          <Home className="h-6 w-6" style={{ color: colores.primario }} />
                        </button>
                        <ShoppingCart className="h-6 w-6" style={{ color: colores.primario }} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
