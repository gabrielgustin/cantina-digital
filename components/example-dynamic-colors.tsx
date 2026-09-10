"use client"

/**
 * Example component showing how to use dynamic colors from the database
 * 
 * Usage in your components:
 * 1. Use bg-[var(--color-primario)] for backgrounds
 * 2. Use text-[var(--color-acento)] for text colors
 * 3. Use border-[var(--color-secundario)] for borders
 * 
 * The colors are loaded from the site_config table and injected as CSS variables
 */

export function ExampleDynamicColors() {
  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Ejemplos de Colores Dinámicos</h2>
      
      {/* Primary color example */}
      <div className="bg-[var(--color-primario)] text-white p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Color Primario</h3>
        <p>Este contenedor usa el color primario desde la base de datos</p>
        <code className="text-sm">bg-[var(--color-primario)]</code>
      </div>

      {/* Secondary color example */}
      <div className="bg-[var(--color-secundario)] text-white p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Color Secundario</h3>
        <p>Este contenedor usa el color secundario desde la base de datos</p>
        <code className="text-sm">bg-[var(--color-secundario)]</code>
      </div>

      {/* Accent color button */}
      <button className="bg-[var(--color-acento)] hover:opacity-90 text-white px-6 py-3 rounded-lg font-semibold transition-opacity">
        Botón con Color de Acento
      </button>

      {/* Background color example */}
      <div className="bg-[var(--color-fondo)] text-[var(--color-texto)] p-6 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-2">Fondo y Texto</h3>
        <p>Este contenedor usa los colores de fondo y texto desde la base de datos</p>
        <code className="text-sm block mt-2">bg-[var(--color-fondo)] text-[var(--color-texto)]</code>
      </div>

      {/* Card with border */}
      <div className="border-2 border-[var(--color-primario)] p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-[var(--color-primario)] mb-2">
          Borde Dinámico
        </h3>
        <p className="text-[var(--color-texto)]">
          Esta tarjeta tiene un borde que usa el color primario
        </p>
        <code className="text-sm block mt-2">border-[var(--color-primario)]</code>
      </div>

      {/* Mixed colors example */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Paleta de Colores</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="w-full h-24 bg-[var(--color-primario)] rounded-lg mb-2"></div>
            <p className="text-sm font-medium">Primario</p>
          </div>
          <div className="text-center">
            <div className="w-full h-24 bg-[var(--color-secundario)] rounded-lg mb-2"></div>
            <p className="text-sm font-medium">Secundario</p>
          </div>
          <div className="text-center">
            <div className="w-full h-24 bg-[var(--color-acento)] rounded-lg mb-2"></div>
            <p className="text-sm font-medium">Acento</p>
          </div>
          <div className="text-center">
            <div className="w-full h-24 bg-[var(--color-fondo)] rounded-lg mb-2 border"></div>
            <p className="text-sm font-medium">Fondo</p>
          </div>
          <div className="text-center">
            <div className="w-full h-24 bg-[var(--color-texto)] rounded-lg mb-2"></div>
            <p className="text-sm font-medium">Texto</p>
          </div>
        </div>
      </div>
    </div>
  )
}
