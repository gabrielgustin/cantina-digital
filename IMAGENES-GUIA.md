# Guía para Gestión de Imágenes

## Problema Actual
La base de datos contenía URLs base64 muy largas que causaban problemas de rendimiento (lag).

## Solución Implementada

### 1. Script de Corrección (004-fix-image-urls.sql)
- Limpia todas las URLs base64 de la base de datos
- Reemplaza con placeholders optimizados
- Ejecutar este script para corregir datos existentes

### 2. Validación en Código
- `lib/db.ts`: Sanitiza URLs al obtener datos de la base de datos
- `utils/image-utils.ts`: Valida y cachea URLs de imágenes
- Rechaza automáticamente URLs base64 o muy largas

## Recomendación: Usar Vercel Blob

Para una solución profesional de gestión de imágenes:

### Paso 1: Agregar Integración Blob
\`\`\`bash
# En tu proyecto Vercel
vercel blob add
\`\`\`

### Paso 2: Subir Imágenes
\`\`\`typescript
import { put } from '@vercel/blob'

// Ejemplo de subida
const blob = await put('categoria-imagen.jpg', file, {
  access: 'public',
})

// Guardar blob.url en la base de datos
await sql`
  UPDATE categories 
  SET image_url = ${blob.url}
  WHERE id = 'categoria-id'
`
\`\`\`

### Paso 3: Usar URLs de Blob
Las URLs de Blob son:
- Optimizadas automáticamente
- Servidas desde CDN global
- Rápidas y eficientes
- Formato: `https://[hash].public.blob.vercel-storage.com/[filename]`

## Mejores Prácticas

### ❌ NO HACER:
- Guardar imágenes base64 en la base de datos
- Usar URLs muy largas (>500 caracteres)
- Subir imágenes sin optimizar

### ✅ HACER:
- Usar Vercel Blob para almacenar imágenes
- Guardar solo las URLs en la base de datos
- Usar placeholders mientras se cargan las imágenes
- Optimizar imágenes antes de subirlas (WebP, tamaño adecuado)

## Formato de URLs Válidas

\`\`\`typescript
// ✅ URLs válidas
'/images/producto.jpg'                    // Ruta local
'https://blob.vercel.com/abc123.jpg'      // Vercel Blob
'https://example.com/image.png'           // URL externa

// ❌ URLs inválidas (se reemplazan automáticamente)
'data:image/png;base64,iVBORw0KG...'     // Base64
'https://very-long-url-over-500-chars...' // Muy larga
