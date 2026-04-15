# Investigación Técnica — Rediseño Lexinton.com.ar
> **Uso interno** · Fecha: Julio 2025 · Stack objetivo: Next.js 14 + Tokko Broker API + Vercel

---

## 1. Contexto del proyecto

El sitio actual de **Lexinton Real Estate** (`lexinton.com.ar`) está construido sobre WordPress 6.x con el theme **Houzez** y el plugin **Tokko Broker** gestionado por la agencia **Optimun** (partner certificado de Tokko). El objetivo es reemplazar ese sitio por una aplicación Next.js 14 (App Router) completamente custom, manteniendo la sincronización con el CRM Tokko Broker como fuente única de verdad para propiedades y leads.

**Demo actual:** `ricardobing/lexinton-demo` en GitHub, desplegado en Vercel (auto-deploy en `main`). Commit base: `47d2a42`.

---

## 2. Tokko Broker — Arquitectura de la API

### 2.1 Modelo mental

```
┌─────────────────────────────────────────────────┐
│              TOKKO BROKER (CRM)                 │
│  - Fuente de propiedades (alta/baja/edición)    │
│  - CRM de leads (consultas de clientes)         │
│  - Portal propio (para agencias sin dev propio) │
└────────────┬───────────────────┬────────────────┘
             │  GET propiedades  │  POST consultas
             ▼                   ▼
┌────────────────────────────────────────────────┐
│         Next.js 14 (lexinton.com.ar)           │
│  - Server Components / ISR                     │
│  - Route Handlers (/api/*)                     │
│  - Client Components (filtros, mapa, form)     │
└────────────────────────────────────────────────┘
             │
             ▼
        Vercel Edge Network (CDN + serverless)
```

**No se necesita base de datos propia.** Tokko es el sistema de registro. La app Next.js consume la API como read-only para mostrar propiedades, y escribe leads vía POST al endpoint `/contact/`.

### 2.2 Autenticación

- Cada agencia tiene una **API KEY** única generada desde el panel de Tokko.
- La key se usa como query param (`key=`) o como header según el endpoint.
- **Lexinton debe proveer su API KEY** desde su cuenta en `tokkobroker.com`.
- La key de prueba pública disponible en la documentación es: `4a4d4727-f26d-4ec0-b902-42be4a09a102` (read-only, datos de agencia demo).
- En Next.js la key se almacena como variable de entorno: `TOKKO_API_KEY` (nunca expuesta al cliente).

### 2.3 Requerimientos de registro (para portales externos)

Si Lexinton quiere que el sitio funcione como "portal integrado" (para que leads aparezcan en el CRM identificados como provenientes del sitio propio):

| Requerimiento | Detalle |
|---|---|
| API KEY | Proporcionada por Tokko al suscriptor |
| Logotipo del portal | SVG 220×90 o PNG 440×180 |
| URL de publicación dinámica | Ej: `https://lexinton.com.ar/propiedades/$publication_id$` |
| Contacto comercial | Email para soporte entre Tokko y el portal |

---

## 3. Endpoints de la API — Referencia completa

**Base URL:** `https://www.tokkobroker.com/api/v1/`  
**Base URL (portales externos):** `https://tokkobroker.com/portals/simple_portal/api/v1/`

### 3.1 `/property` — Listado de propiedades

**Endpoint principal para el sitio:**

```bash
# Todas las propiedades publicables
GET https://www.tokkobroker.com/api/v1/property/?format=json&key=API_KEY&lang=es-AR

# Con paginación (máx. 1000 por request, recomendado: 20-50)
GET /api/v1/property/?format=json&key=API_KEY&limit=20&offset=0

# Propiedades actualizadas desde una fecha
GET /api/v1/property/?format=json&key=API_KEY&filter=updated&date_from=2025-01-01T00:00:00

# Propiedades eliminadas desde una fecha
GET /api/v1/property/?format=json&key=API_KEY&filter=deleted&date_from=2025-01-01T00:00:00

# Ordenar por fecha de última modificación
GET /api/v1/property/?format=json&key=API_KEY&order_by=-deleted_at

# Solo unidades de emprendimientos modificadas
GET /api/v1/property/?format=json&key=API_KEY&development__isnull=false
```

**Alternativa para portales externos (más simple):**

```bash
GET https://tokkobroker.com/portals/simple_portal/api/v1/freeportals/?api_key=API_KEY&format=json&lang=es-AR
```

**Filtros disponibles (query params):**

| Param | Tipo | Descripción |
|---|---|---|
| `company_id` | integer | Filtra por sucursal/empresa |
| `publication_id` | string (`x_x_x_x`) | Busca una propiedad específica |
| `country` | char[2] ISO 3166 | Filtra por país |
| `limit` | integer | Resultados por página |
| `offset` | integer | Paginación |
| `order_by` | string | Campo de ordenamiento |
| `branch_id` | integer | Filtrar desarrollos por sucursal |

**⚠️ Límites importantes:**
- Máximo 1000 propiedades por request
- Timeout del servidor: 30 segundos
- Recomendado: páginas de 20 propiedades como máximo

---

### 3.2 `/contact` — Envío de leads al CRM

**Endpoint crítico:** toda consulta recibida por el sitio debe enviarse aquí para que ingrese al CRM de Tokko.

```bash
POST https://tokkobroker.com/portals/simple_portal/api/v1/contact/
Content-Type: application/json

{
  "publication_id": "2_1_693_101419",
  "api_key": "API_KEY",
  "name": "Juan Pérez",
  "mail": "juan@email.com",
  "comment": "Quisiera más información sobre esta propiedad",
  "phone": "1123456789",
  "cellphone": "1123456789"
}
```

**Variables:**

| Campo | Requerido | Descripción |
|---|---|---|
| `publication_id` | ✅ | ID de la publicación de Tokko |
| `api_key` | ✅ | API KEY de la agencia |
| `name` | ✅ | Nombre del interesado |
| `mail` | ✅ | Email del interesado |
| `comment` | ✅ | Mensaje/consulta |
| `phone` | ❌ | Teléfono fijo |
| `cellphone` | ❌ | Celular |
| `company` | ❌ | Empresa del interesado |

**Respuestas:**

| Código | Significado |
|---|---|
| `OK` | Lead registrado exitosamente en CRM |
| `ERROR 100` | API key inválida |
| `ERROR 200` | `publication_id` no existe |
| `ERROR 201` | La empresa no tiene el portal activado |
| `ERROR 300` | Faltan parámetros requeridos |

**Para consultas generales (sin propiedad específica):** enviar sin `publication_id` o con un ID de propiedad genérica de la agencia.

---

### 3.3 `/development` — Emprendimientos

```bash
# Lista de desarrollos/emprendimientos
GET https://www.tokkobroker.com/api/v1/development/?format=json&lang=es_ar&key=API_KEY

# Filtrar por sucursal
GET /api/v1/development/?format=json&lang=es_ar&key=API_KEY&branch_id=ID_SUCURSAL
```

Los emprendimientos (proyectos nuevos en construcción o pozo) tienen una estructura similar a las propiedades pero con campos adicionales de avance de obra, tipologías y unidades.

---

### 3.4 Búsqueda del lado cliente (Search)

Tokko no tiene un endpoint de búsqueda server-side robusto. El patrón recomendado en su documentación es:

1. Cargar todas las propiedades (o un set amplio) en el servidor.
2. Construir un objeto `data` con los filtros:

```json
{
  "current_localization_id": 0,
  "current_localization_type": "country",
  "price_from": 0,
  "price_to": 999999999,
  "operation_types": [1, 2, 3],
  "property_types": [1, 2, 3, 4, 5],
  "currency": "ANY",
  "filters": []
}
```

**Operation types:**
- `1` → Venta
- `2` → Alquiler
- `3` → Alquiler temporal

**Property types:**
- `1` → Terreno
- `2` → Departamento
- `3` → Casa
- `4` → Casa de fin de semana
- `5` → Oficina
- `6` → Amarra
- `7` → Local comercial
- `8` → Edificio comercial

**Recomendación para Next.js:** usar `searchParams` en Server Components para filtrar en el servidor antes de renderizar, evitando cargar todo el JSON al cliente.

---

## 4. Estructura de datos de una propiedad (JSON)

```json
{
  "reference_code": "ref001",
  "status": 2,
  "property_type": 3,
  "description": "Hermoso departamento en Palermo...",
  "publication_title": "Departamento - Palermo",
  "publication_title_en": "Apartment - Palermo",
  "street": "Echeverría",
  "number": "100",
  "apartment": "B",
  "floor": "2",
  "location": "24683",
  "geo_lat": "-34.575199272373",
  "geo_long": "-58.4458019693",
  "updated_at": "2025-06-13 00:01:03",
  "address": "Echeverría 100 piso 2 depto B",
  "fake_address": "Echeverría al 100",
  "operations": [
    {
      "type": 1,
      "prices": [
        { "currency": "USD", "price": 530000, "period": "" },
        { "currency": "ARS", "price": 2000000, "period": "" }
      ]
    }
  ],
  "images": [
    { "url": "https://cdn.tokkobroker.com/imagen.jpg", "is_blueprint": false, "description": "" }
  ],
  "services": [1, 2, 3],
  "attributes": [
    { "code": "total_surface", "value": "254" },
    { "code": "room_amount", "value": "3" },
    { "code": "bathroom_amount", "value": "2" },
    { "code": "suite_amount", "value": "1" },
    { "code": "parking_lot_amount", "value": "1" },
    { "code": "expenses", "value": "45000" }
  ]
}
```

**Campos de Información Básica:**

| Campo | Descripción | Tipo |
|---|---|---|
| `suite_amount` | Dormitorios | int |
| `room_amount` | Ambientes | int |
| `bathroom_amount` | Baños | int |
| `toilet_amount` | Toilettes | int |
| `situation` | Situación (ej: "Habitada") | string |
| `property_condition` | Estado (ej: "muy bueno") | string |
| `age` | Antigüedad en años | int |
| `expenses` | Expensas | int |
| `dispositions` | Disposición (ej: "Frente") | string |
| `orientation` | Orientación (ej: "norte") | string |
| `floors_amount` | Pisos | int |
| `parking_lot_amount` | Cocheras | int |
| `zonification` | Restricción / Zonificación | string |
| `publication_title` | Título en el portal | string |
| `address` | Dirección real | string |
| `fake_address` | Dirección ficticia (para publicar) | string |

---

## 5. Estrategia de implementación en Next.js 14

### 5.1 Arquitectura de rutas

```
app/
├── page.tsx                   → Homepage (Server Component, ISR)
├── propiedades/
│   ├── page.tsx               → Listado + buscador (Server Component + Client filters)
│   └── [id]/
│       └── page.tsx           → Ficha individual (SSG + ISR)
├── emprendimientos/
│   ├── page.tsx               → Listado de emprendimientos
│   └── [id]/
│       └── page.tsx           → Detalle de emprendimiento
├── contacto/
│   └── page.tsx               → Formulario de contacto general
└── api/
    └── contact/
        └── route.ts           → Route Handler → POST a Tokko API (server-side, oculta la API key)
```

### 5.2 Caching y revalidación (ISR)

```typescript
// lib/tokko.ts — Fetcher centralizado con ISR
export async function getProperties(params?: TokkoSearchParams) {
  const url = buildTokkoUrl('/property/', params)
  const res = await fetch(url, {
    next: { revalidate: 300 }, // Revalidar cada 5 minutos
  })
  if (!res.ok) throw new Error('Tokko API error')
  return res.json() as Promise<TokkoPropertyList>
}

// Para la ficha individual: revalidar cada hora
export async function getPropertyById(id: string) {
  const res = await fetch(buildTokkoUrl('/property/', { publication_id: id }), {
    next: { revalidate: 3600 },
  })
  return res.json()
}
```

**Estrategia de revalidación:**
- **Homepage (destacados):** `revalidate: 300` (5 min)
- **Listado de propiedades:** `revalidate: 300` (5 min)
- **Ficha individual:** `revalidate: 3600` (1 hora) + On-demand revalidation si se configura webhook de Tokko
- **Emprendimientos:** `revalidate: 86400` (24 hs, cambian raramente)

### 5.3 Protección de la API Key

La API KEY nunca debe exponerse al browser. Todo fetch a Tokko se hace en Server Components o en Route Handlers:

```typescript
// app/api/contact/route.ts
export async function POST(request: Request) {
  const body = await request.json()
  
  const response = await fetch(
    'https://tokkobroker.com/portals/simple_portal/api/v1/contact/',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...body,
        api_key: process.env.TOKKO_API_KEY, // ← solo disponible en servidor
      }),
    }
  )
  
  const data = await response.json()
  return Response.json(data)
}
```

### 5.4 Tipado TypeScript

```typescript
// types/tokko.ts
export interface TokkoProperty {
  id: number
  publication_id: string
  reference_code: string
  status: number
  property_type: number
  description: string
  publication_title: string
  street: string
  number: string
  floor?: string
  apartment?: string
  location: string
  geo_lat: string
  geo_long: string
  updated_at: string
  address: string
  fake_address: string
  operations: TokkoOperation[]
  images: TokkoImage[]
  services: number[]
  attributes: TokkoAttribute[]
}

export interface TokkoOperation {
  type: number // 1=venta, 2=alquiler, 3=alquiler temporal
  prices: TokkoPrice[]
}

export interface TokkoPrice {
  currency: 'USD' | 'ARS' | 'EUR'
  price: number
  period?: string
}

export interface TokkoImage {
  url: string
  is_blueprint: boolean
  description?: string
}

export interface TokkoAttribute {
  code: string
  value: string
}

export interface TokkoContactPayload {
  publication_id?: string
  name: string
  mail: string
  comment: string
  phone?: string
  cellphone?: string
}
```

### 5.5 Generación de rutas estáticas (SSG)

```typescript
// app/propiedades/[id]/page.tsx
export async function generateStaticParams() {
  const properties = await getProperties({ limit: 500 })
  return properties.objects.map((p) => ({ id: p.publication_id }))
}
```

Esto pre-genera las fichas de hasta 500 propiedades en build time. Las nuevas propiedades se renderizarán on-demand y se cachearán (ISR).

### 5.6 SEO técnico

```typescript
// Metadata dinámica por propiedad
export async function generateMetadata({ params }) {
  const property = await getPropertyById(params.id)
  return {
    title: `${property.publication_title} | Lexinton Real Estate`,
    description: property.description?.slice(0, 155),
    openGraph: {
      images: [{ url: property.images[0]?.url }],
    },
  }
}
```

**Sitemap dinámico:** `/app/sitemap.ts` que consulta todas las propiedades activas y genera el XML.

---

## 6. Variables de entorno necesarias

```env
# .env.local
TOKKO_API_KEY=tu_api_key_de_tokko
TOKKO_BASE_URL=https://www.tokkobroker.com/api/v1
TOKKO_PORTAL_URL=https://tokkobroker.com/portals/simple_portal/api/v1

# Analytics (opcional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Vercel
VERCEL_URL=lexinton.com.ar
```

---

## 7. Integraciones adicionales

### 7.1 Cliengo (Chatbot)

El sitio actual usa Cliengo. La integración es vía snippet JavaScript (no API). Se incluye en `app/layout.tsx` como Script de Next.js:

```tsx
import Script from 'next/script'

<Script
  src="https://widget.cliengo.com/static/loader.js"
  strategy="lazyOnload"
  data-cliengo-id="TU_CLIENGO_ID"
/>
```

Cliengo tiene integración nativa con Tokko Broker: los leads capturados por el chatbot se sincronizan automáticamente con el CRM de Tokko si ambas integraciones están activas en la cuenta del cliente. **Lexinton debe verificar si tiene esta integración configurada en su cuenta de Cliengo.**

### 7.2 Make.com (automatización)

Make.com (ex-Integromat) permite automatizar flujos entre Tokko y otras plataformas. Casos de uso relevantes:
- **Lead → Email/WhatsApp:** Cuando llega un lead a Tokko, Make lo detecta vía webhook y envía notificación al asesor asignado.
- **Lead → Google Sheets:** Registro de consultas en planilla para reportes.
- **Lead → Email marketing:** Derivar leads a Mailchimp o similar para nurturing.

La integración Make ↔ Tokko se configura usando el webhook de Tokko Broker (`/feedback` endpoint) o el polling periódico de la API de contactos. No tiene connector nativo en el marketplace de Make (sin módulo oficial), pero funciona perfectamente con el módulo HTTP genérico.

### 7.3 WhatsApp Business

El sitio incluirá un botón flotante de WhatsApp (ya implementado en `MobileSticky.tsx`). Para el tracking de conversiones, se puede configurar como evento de Google Analytics y/o conectar con Make.

### 7.4 Google Analytics / Tag Manager

Integrar `@next/third-parties` para GA4 o GTM con `strategy="afterInteractive"`. Esto permite que Lexinton mida:
- Vistas de propiedades individuales
- Búsquedas realizadas
- Formularios enviados
- Clics en WhatsApp

---

## 8. Comparativa de mercado

### 8.1 Ecosistema de sitios Tokko en Argentina

| Proveedor | Tipo | Precio aprox. | Ownership del código |
|---|---|---|---|
| **Tokko (plantilla propia)** | Template SaaS | Incluido en plan | ❌ No |
| **Brokian** | SaaS | ARS 95,685–127,740/mes | ❌ No |
| **Optimun** (agencia) | Desarrollo custom | Consultar | Parcial |
| **MediaHaus** | Desarrollo custom | Consultar | Sí |
| **Gam** | Desarrollo custom | Consultar | Sí |
| **Nuestro desarrollo** | Next.js custom | USD 3,200–3,800 único | ✅ **Sí, 100%** |

### 8.2 Análisis Brokian (competidor directo más comparable)

- Plan "Inmobiliaria": **ARS 95,685/mes** ≈ USD 83/mes (al cambio actual)
- Plan "Inmobiliaria Plus": **ARS 127,740/mes** ≈ USD 111/mes
- **En 3 años:** USD 3,000–4,000 gastados sin poseer el código
- Con nuestro desarrollo: pago único, código propio, hosting en Vercel Free Tier (USD 0)

### 8.3 Ventajas de la solución Next.js custom vs. SaaS

| Aspecto | SaaS (Brokian, etc.) | Next.js custom |
|---|---|---|
| Diseño | Templates predefinidos | 100% custom, diferenciador |
| Performance (LCP) | Variable | < 2.5s (optimizado) |
| SEO técnico | Básico | Control total |
| Integración Tokko | Conectada | Conectada |
| Costo mensual | USD 83–111/mes | ~USD 0 (Vercel free) |
| Ownership | No | **Sí** |
| Escalabilidad | Limitada al plan | Ilimitada |
| Analytics custom | Limitado | GA4 / GTM completo |

---

## 9. Stack técnico del proyecto

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | Next.js (App Router) | 14.2.x |
| Lenguaje | TypeScript | 5.x |
| Estilos | Tailwind CSS | 3.4.x |
| Animaciones | Framer Motion | 11.x |
| Tipografías | Instrument Serif + Inter | Google Fonts (next/font) |
| Hosting | Vercel | Free / Pro |
| CI/CD | GitHub Actions (via Vercel) | Auto-deploy |
| Imágenes | next/image | Optimización automática |
| API | Tokko Broker REST | v1 |
| Analytics | Google Analytics 4 | - |

**Design tokens (Tailwind):**

| Token | Color |
|---|---|
| `lx-ink` | `#111111` |
| `lx-stone` | `#7a7570` |
| `lx-cream` | `#f8f6f2` |
| `lx-parchment` | `#f0ede6` |
| `lx-accent` | `#3d5a6c` |
| `lx-line` | `#ddd9d0` |

---

## 10. Riesgos técnicos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| API KEY no disponible al inicio | Media | Bloqueante | Usar key de prueba pública en dev, solicitar real key en Fase 0 |
| Rate limiting / timeout de Tokko | Baja | Media | Paginación de 20-50 props, retry logic, ISR cache |
| Propiedades sin fotos | Alta | Baja | Placeholder image fallback en PropertyCard |
| Cambio de estructura JSON de Tokko | Muy baja | Alta | Definir tipos TypeScript robustos + tests de integración |
| Imágenes de Tokko sin HTTPS | Baja | Baja | `next.config.js` con `remotePatterns` para dominios de Tokko |
| Tokko down durante build | Baja | Media | `try/catch` con fallback a cache previo |

**Configuración de imágenes remotas:**

```js
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.tokkobroker.com' },
      { protocol: 'https', hostname: 'tokkobroker.com' },
      { protocol: 'http', hostname: 'tokkobroker.com' }, // legado
    ],
  },
}
```

---

*Documento generado en julio 2025 en base a investigación directa de la documentación oficial de Tokko Broker (developers.tokkobroker.com), análisis del ecosistema de mercado argentino y el demo funcional ya construido.*
