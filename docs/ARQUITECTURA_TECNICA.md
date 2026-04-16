# Lexinton Web — Arquitectura Técnica Completa

**Stack:** Next.js 14.2 · App Router · TypeScript · Tailwind CSS  
**Repo:** `c:\tmp\lexinton-web`  
**Deploy target:** `lexinton.com.ar`  

---

## 1. Estructura de rutas

```
app/
├── layout.tsx              ← Layout global: Navbar + Footer + MobileSticky + WhatsApp + Cliengo
├── page.tsx                ← Home (/)
├── propiedades/
│   ├── page.tsx            ← Listado (/propiedades)
│   └── [id]/page.tsx       ← Detalle de propiedad (/propiedades/[slug-id])
├── emprendimientos/page.tsx ← (/emprendimientos)
├── inversor/page.tsx        ← (/inversor)
├── contacto/page.tsx        ← (/contacto)
├── tasar/page.tsx           ← (/tasar)
├── quiero-vender/page.tsx   ← (/quiero-vender)
├── sitemap.xml/route.ts     ← Sitemap automático
└── api/
    ├── leads/route.ts       ← POST /api/leads  ← formularios de páginas institucionales
    ├── contact/route.ts     ← POST /api/contact ← formulario de detalle de propiedad
    ├── properties/route.ts  ← GET /api/properties (proxy interno)
    └── locations/route.ts   ← GET /api/locations (proxy interno)
```

### Componentes clave

```
components/
├── Navbar.tsx              ← Header fijo con menú mobile
├── Footer.tsx              ← Footer con links y datos de sucursales
├── MobileSticky.tsx        ← Barra fija inferior en mobile (WhatsApp + Tasar)
├── WhatsAppButton.tsx      ← Botón flotante WhatsApp (fixed bottom-24 right-5)
├── CliengoScript.tsx       ← Widget de chat Cliengo (lazyOnload)
├── LeadForm.tsx            ← Formulario reutilizable para todas las páginas
├── PropertyCard.tsx        ← Tarjeta de propiedad (grids)
└── properties/
    ├── PropertyContact.tsx ← Formulario de contacto en detalle de propiedad
    ├── PropertyGallery.tsx ← Galería con lightbox (yet-another-react-lightbox)
    └── PropertySearch.tsx  ← Buscador con filtros
```

---

## 2. Integración con Tokko Broker CRM

### Credenciales
- **API Key:** en `.env.local` como `TOKKO_API_KEY`
- **Base URL:** `https://www.tokkobroker.com/api/v1/`
- **Endpoint web contacts:** `POST /web_contact/`

### Flujo de datos

```
Browser → Next.js Server Component → lib/tokko/queries.ts → Tokko API
                                                         ↓
                                               Datos cacheados (revalidate: 300s)
```

### Archivos de integración

| Archivo | Función |
|---|---|
| `lib/tokko/client.ts` | Fetch base con headers y error handling |
| `lib/tokko/queries.ts` | Funciones de consulta: getProperties, getPropertyById, getDevelopments... |
| `lib/tokko/utils.ts` | Helpers: formatear precio, área, dirección, fotos, coordenadas |
| `lib/tokko/types.ts` | Interfaces TypeScript de todos los objetos de Tokko |

### Propiedades disponibles en la API

- **171 propiedades activas** (en venta + alquiler)
- **5 emprendimientos** activos con `display_on_web: true`
- Fotos alojadas en `https://static.tokkobroker.com/` (con watermark de Lexinton)
- Coordenadas GPS disponibles en la mayoría de propiedades

### Filtros disponibles en `/propiedades`

| Parámetro URL | Descripción |
|---|---|
| `operation=Sale\|Rent` | Tipo de operación |
| `type=N` | ID de tipo de propiedad |
| `location=N` | ID de barrio |
| `minRooms=N` | Ambientes mínimos |
| `orderBy=price_asc\|price_desc\|newest` | Orden |

---

## 3. Sistema de formularios y leads

### Concepto general

Cada página del sitio tiene un formulario que envía leads directamente al CRM de Tokko. El lead aparece en el panel del cliente en **tiempo real**.

### Endpoint unificado: `POST /api/leads`

```typescript
// Body del request
{
  nombre: string        // requerido
  email: string         // requerido
  telefono?: string
  mensaje?: string
  tipo: LeadFormTipo    // "Tasación" | "Quiero Vender" | "Inversores" | "Emprendimientos" | "Contacto" | "Home"
  propiedad_id?: number // solo para formularios de propiedad específica
  extra?: string        // campos adicionales (presupuesto, plazo, barrio, etc.)
}
```

### Endpoint de propiedad: `POST /api/contact`

Usado exclusivamente por `PropertyContact` (detalle de propiedad). Envía al CRM con el ID de la propiedad.

### Tags en Tokko

El sistema de formularios usa **tags** de Tokko para segmentar leads por origen. En el panel de Tokko se puede filtrar por tag para ver de qué página vino cada consulta:

| Página | Tag enviado a Tokko |
|---|---|
| Home (CTA section) | `"Home"` |
| /emprendimientos | `"Emprendimientos"` |
| /inversor | `"Inversores"` |
| /tasar | `"Tasación"` |
| /quiero-vender | `"Quiero Vender"` |
| /contacto | `"Contacto"` |
| /propiedades/[id] | sin tag (propiedad_id específico) |

### Componente LeadForm

El componente `LeadForm` es reutilizable con estas props:

```typescript
interface LeadFormProps {
  tipo: LeadFormTipo           // tag del lead en Tokko
  showTipoSelector?: boolean   // dropdown "¿En qué te podemos ayudar?"
  showPresupuesto?: boolean    // campo presupuesto en USD (para inversores)
  showPlazo?: boolean          // campo plazo de venta (para quiero-vender)
  showBarrio?: boolean         // campo barrio (para tasación/quiero-vender)
  showTipoPropiedad?: boolean  // campo tipo de propiedad
  messagePlaceholder?: string
  theme?: 'dark' | 'light'    // 'dark' = sobre fondo oscuro, 'light' = sobre fondo claro
}
```

### Dónde ver los leads en Tokko

El cliente accede a su panel en `https://lexinton.tokkobroker.com/` y puede ver todos los leads en:
- **CRM → Contactos** → filtrando por tag para segmentar por origen de página

---

## 4. SEO

### Metadata por página

Todas las páginas tienen `metadata` con:
- `title` optimizado para keywords locales
- `description` descriptiva
- `alternates.canonical` → URL canónica absoluta

### Sitemap automático

`/sitemap.xml` se genera automáticamente en `app/sitemap.xml/route.ts`. Incluye:
- Página home
- Todas las propiedades activas con `display_on_web: true`
- Páginas institucionales
- Se revalida cada 24 hs

### robots.txt

- `/propiedades` con filtros → `noindex` (evita contenido duplicado)
- Todas las demás páginas → `index: true`

### Canonical

Cada página tiene su canonical absoluta. Las páginas de propiedades usan slugs:
```
/propiedades/departamento-palermo-19554
```
El formato es `{tipo}-{barrio}-{id}` para que sea amigable para SEO.

---

## 5. Cliengo — Estado y configuración

### Estado actual

**El script de Cliengo está instalado y activo.**

- **API Key:** `bc0cc2ac-721e-4454-86ad-3f216db21ea2`
- **Carga:** `strategy="lazyOnload"` — carga después de que la página es interactiva (no bloquea LCP ni TBT)
- **Posición:** widget en la esquina inferior derecha (configurado desde el panel de Cliengo)

### Lo que hace el código

```tsx
// components/CliengoScript.tsx
<Script id="cliengo-widget" strategy="lazyOnload">
  // Inyecta el script de Cliengo dinamicamente
  // El widget aparece en todas las páginas vía layout.tsx
</Script>
```

### Configuración requerida en el panel de Cliengo

El widget está activo en el front-end, pero el **cliente debe configurar** lo siguiente desde su panel en [app.cliengo.com](https://app.cliengo.com):

1. **Horarios de atención** → cuándo muestra "en línea" vs "fuera de horario"
2. **Mensaje de bienvenida** → el texto inicial del chatbot
3. **Preguntas automáticas** → el flujo de conversación del bot
4. **Notificaciones de email** → a qué email llegan las nuevas conversaciones
5. **Apariencia** → colores del widget (recomendado: adaptar a colores Lexinton)

### Verificación del widget

Para confirmar que el widget está activo:
1. Abrir `http://localhost:3000` en el browser
2. Esperar ~3-5 segundos (carga lazy)
3. El ícono de Cliengo debe aparecer en la esquina inferior derecha

> **Nota:** Si el widget no aparece, puede ser que el plan de Cliengo esté vencido o la API key no tenga el widget habilitado. El cliente debe verificar su cuenta en app.cliengo.com.

---

## 6. Botón de WhatsApp

- **Número:** `5491131519928` (con código país, sin +)
- **Componente:** `WhatsAppButton.tsx` — botón circular verde fijo (bottom-24 right-5)
- **Mensaje pre-llenado:** "Hola, me comunico desde la web de Lexinton Propiedades."
- **Visible:** en todas las páginas vía `layout.tsx`

---

## 7. Navbar y Footer

### Navbar (fijo, 68px de alto)

- Transparente sobre fondos oscuros (hero), opaco sobre fondo claro en scroll
- Links: Propiedades · Emprendimientos · Inversores · Contacto
- Botón "Tasar inmueble" → `/tasar`
- **Importante:** todas las páginas deben tener `pt-[68px]` en su primer section para no quedar tapadas

### Footer

Links correctos a todas las páginas del sitio. Social links apuntan a `#` (pendiente actualizar con URLs reales de Instagram/Facebook de Lexinton).

---

## 8. Performance y caché

| Página | Estrategia |
|---|---|
| `/` | ISR con `revalidate: 3600` (1 hora) |
| `/propiedades` | SSR dinámico por searchParams |
| `/propiedades/[id]` | ISR con `revalidate: 300` (5 min) |
| `/emprendimientos` | Static (sin revalidate — emprendimientos cambian poco) |
| API routes | `export const dynamic = 'force-dynamic'` |

---

## 9. Variables de entorno

Archivo `.env.local` (NO commitear):

```env
TOKKO_API_KEY=<tu_api_key_de_tokko>
```

Para producción, configurar esta variable en el servicio de hosting (Vercel, Railway, etc.).

---

## 10. Comandos útiles

```bash
npm run dev      # Desarrollo en localhost:3000
npm run build    # Build de producción
npm run start    # Servidor de producción (después de build)
npm run lint     # ESLint

# Testear lead a Tokko manualmente:
curl -X POST https://www.tokkobroker.com/api/v1/web_contact/ \
  -H "Content-Type: application/json" \
  -d '{"key":"<API_KEY>","name":"Test","email":"test@test.com","tags":["Tasación"]}'
```

---

## 11. Deploy (pendiente)

El sitio está listo para deployar a **Vercel** o **Railway**:

1. Subir el repo a GitHub
2. Conectar con Vercel → auto-detecta Next.js
3. Agregar variable de entorno `TOKKO_API_KEY`
4. Configurar dominio `lexinton.com.ar`
5. ✅ Deploy

---

_Última actualización: Abril 2026_
