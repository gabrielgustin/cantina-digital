"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function VerificarConfigPage() {
  const [config, setConfig] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConfig = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/backoffice/site-config")
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      const data = await response.json()
      console.log("[v0] Config data from database:", data)
      setConfig(data)
    } catch (err) {
      console.error("[v0] Error fetching config:", err)
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConfig()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/backoffice">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Verificar Configuración</h1>
            </div>
            <Button onClick={fetchConfig} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Recargar
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Datos en site_config (Base de Datos Neon)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <div className="text-center py-8 text-gray-500">Cargando datos...</div>}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                <strong>Error:</strong> {error}
              </div>
            )}

            {!loading && !error && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                  <strong>Total de entradas:</strong> {Object.keys(config).length}
                </div>

                <div className="space-y-3">
                  {Object.entries(config).map(([key, value]) => (
                    <div key={key} className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="flex flex-col gap-2">
                        <div className="font-semibold text-gray-700">{key}</div>
                        <div className="text-sm text-gray-600 break-all">
                          {value || <span className="text-gray-400 italic">(vacío)</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {Object.keys(config).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No hay datos en site_config. Ve a "Información del negocio" para agregar datos.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">Instrucciones para la otra app:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-800">
            <li>
              Verifica que use la misma variable de entorno:{" "}
              <code className="bg-yellow-100 px-1 rounded">NEON_NEON_DATABASE_URL</code>
            </li>
            <li>
              Asegúrate de que lea de la tabla <code className="bg-yellow-100 px-1 rounded">site_config</code>
            </li>
            <li>
              Los datos se guardan como pares clave-valor en las columnas{" "}
              <code className="bg-yellow-100 px-1 rounded">config_key</code> y{" "}
              <code className="bg-yellow-100 px-1 rounded">config_value</code>
            </li>
            <li>Haz un redeploy de la otra app después de verificar las variables de entorno</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
