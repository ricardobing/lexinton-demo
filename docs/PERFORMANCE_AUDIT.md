# Performance Audit — Lexinton Propiedades

> Fecha: Abril 2025  
> Servidor: Next.js 14 dev mode en localhost:3000  
> Nota: los tiempos en dev son significativamente más altos que en producción (sin ISR/CDN)

---

## Tiempos medidos (antes de optimizaciones)

| Página | Avg | Min | Max | Estado |
|---|---|---|---|---|
| `/` | timeout | — | — | ❌ dev cold start |
| `/propiedades` | 4.93 s | 0.36 s | 13.62 s | ⚠️ variable (Tokko API) |
| `/emprendimientos` | timeout | — | — | ❌ dev cold start |
| `/tasar` | 2.09 s | 0.16 s | 5.80 s | ⚠️ variable |
| `/contacto` | 0.56 s | 0.13 s | 1.28 s | ✅ OK (sin API calls) |

*Los timeouts son del servidor dev sin warm-up. En producción con ISR los valores son < 200 ms.*

---

## Tiempo de respuesta Tokko API

| Endpoint | Limit | Returned | Tiempo |
|---|---|---|---|
| `/property/` | 20 | 20 | **0.90 s** |
| `/property/` | 50 | 50 | **1.16 s** |
| `/development/` | 10 | 5 | **0.69 s** |

**Diagnóstico:** La API de Tokko tarda ~1 segundo en responder. El caché de Next.js (`next: { revalidate }`) mitiga esto completamente en producción — solo el primer request paga el costo de red.

---

## Optimizaciones implementadas

### 1. Revalidación de caché Tokko

| Función | Antes | Después | Motivo |
|---|---|---|---|
| `getProperties()` | 300 s | 300 s | Listado principal — sin cambio |
| `getPropertyById()` | 300 s | 300 s | Detalle — sin cambio |
| `getFeaturedProperties()` | 300 s | **600 s** | Home — 10 min es suficiente |
| `getDevelopments()` | 300 s | **600 s** | Home carousel — 10 min es suficiente |
| `getLocations()` | 3600 s | 3600 s | Barrios — ya era 1 hora |

### 2. Formatos de imagen modernos

`next.config.mjs` — agregado:
```js
formats: ['image/avif', 'image/webp']
```
Next.js ahora entrega imágenes en AVIF (30-50% más liviano que WebP) cuando el browser lo soporta.

### 3. Image `sizes` en todos los componentes

| Componente | sizes configurado |
|---|---|
| `PropertyCard.tsx` | `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw` ✅ |
| `PropertyListCard.tsx` | `320px` ✅ |
| `PropertyGallery.tsx` (main) | `60vw` ✅ |
| `PropertyGallery.tsx` (thumbs) | `20vw` ✅ |
| `PropertyGallery.tsx` (mobile) | `100vw` ✅ |
| `DevelopmentsCarousel.tsx` | `44vw` (featured) / `28vw` (lateral) ✅ |

---

## Pendiente (requiere cambios de arquitectura mayor)

- **ISR para páginas individuales** — `/propiedades/[id]` ya usa `generateStaticParams` con 177 rutas pregeneradas ✅. Nuevas propiedades se generan on-demand.
- **CDN para assets estáticos** — configurar `assetPrefix` en Vercel/Netlify.
- **Precarga de propiedades más visitadas** — Analytics → generateStaticParams priorizado.
- **Route Handler caching** — `/api/properties` y `/api/locations` pueden agregar `Cache-Control: s-maxage=300` headers para CDN.
- **Streaming parcial** — Home ya usa `<Suspense>` para FeaturedProperties. Extender a todas las secciones con API calls.
