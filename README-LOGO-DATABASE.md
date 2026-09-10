# Configuración del Logo desde Base de Datos

## Resumen

El logo del header ahora se carga dinámicamente desde la base de datos Neon usando la tabla `site_config`.

## Estructura de la Base de Datos

### Tabla: `site_config`

\`\`\`sql
CREATE TABLE site_config (
  id SERIAL PRIMARY KEY,
  config_key VARCHAR(100) UNIQUE NOT NULL,
  config_value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Configuraciones disponibles:

- **`header_logo_url`**: URL del logo principal en el header
- **`site_name`**: Nombre del sitio (usado como alt text)

## Cómo Funciona

### 1. Para páginas Server Component (la mayoría)

Usa `<ServerHeader />` que carga automáticamente el logo desde la base de datos:

\`\`\`tsx
import { ServerHeader } from "@/components/server-header"

export default function MyPage() {
  return (
    <main>
      <ServerHeader />
      {/* resto del contenido */}
    </main>
  )
}
\`\`\`

**Páginas actualizadas:**
- ✅ `app/page.tsx` (Home)
- ✅ `app/informacion/page.tsx`
- ✅ `app/ubicacion/page.tsx`
- ✅ `app/sitio-web/page.tsx`
- ✅ `app/productos/[categoryId]/page.tsx`

### 2. Para páginas Client Component

Usa `<Header />` con valores por defecto (las páginas client no pueden usar async):

\`\`\`tsx
"use client"
import { Header } from "@/components/header"

export default function MyClientPage() {
  return (
    <main>
      <Header />
      {/* resto del contenido */}
    </main>
  )
}
\`\`\`

**Páginas con Header estático:**
- `app/carrito/page.tsx`
- `app/finalizar-pedido/page.tsx`
- `app/productos/[categoryId]/[productId]/page.tsx`

## Cómo Actualizar el Logo

### Opción 1: Ejecutar script SQL

\`\`\`bash
# Ejecuta el script desde v0
scripts/005-add-site-config.sql
\`\`\`

### Opción 2: Actualizar manualmente en la base de datos

\`\`\`sql
-- Actualizar el logo
UPDATE site_config 
SET config_value = '/images/nuevo-logo.png'
WHERE config_key = 'header_logo_url';

-- Actualizar el nombre del sitio
UPDATE site_config 
SET config_value = 'Nuevo Nombre'
WHERE config_key = 'site_name';
\`\`\`

### Opción 3: Usar Vercel Blob (Recomendado para producción)

1. Sube la imagen a Vercel Blob
2. Obtén la URL del blob (ej: `https://blob.vercel-storage.com/...`)
3. Actualiza la base de datos con esa URL

\`\`\`sql
UPDATE site_config 
SET config_value = 'https://blob.vercel-storage.com/tu-logo-abc123.png'
WHERE config_key = 'header_logo_url';
\`\`\`

## Funciones de Base de Datos

### `getSiteConfig(key: string)`

Obtiene un valor de configuración específico:

\`\`\`typescript
const logoUrl = await getSiteConfig('header_logo_url')
\`\`\`

### `getAllSiteConfig()`

Obtiene todas las configuraciones como objeto:

\`\`\`typescript
const config = await getAllSiteConfig()
// { header_logo_url: '/images/logo.png', site_name: 'ITS Boutique' }
\`\`\`

## Valores por Defecto

Si la base de datos no está disponible o no tiene valores configurados:

- **Logo**: `/images/logoitsvilada.png`
- **Nombre**: `ITS Boutique`

## Notas Importantes

- El logo se cachea automáticamente con `revalidate: 60` en las páginas
- Las páginas client component usan valores estáticos por limitaciones de Next.js
- Para cambios inmediatos, reinicia el servidor de desarrollo
