# Plan de Proyecto — Rediseño Lexinton.com.ar
> **Versión:** 1.0 · **Fecha:** Julio 2025 · **Stack:** Next.js 14 + Tokko Broker API + Vercel

---

## Resumen ejecutivo

| Item | Detalle |
|---|---|
| **Cliente** | Lexinton Real Estate |
| **Sitio actual** | lexinton.com.ar (WordPress + Houzez + Tokko WP Plugin, por Optimun) |
| **Sitio nuevo** | Next.js 14 App Router + Tokko REST API |
| **Hosting** | Vercel (Free Tier → auto-deploy desde GitHub) |
| **Repositorio** | `ricardobing/lexinton-demo` (demo base ya construida) |
| **Duración estimada** | 7–9 semanas |
| **Horas totales** | ~115–135 horas |
| **Tarifa interna** | USD 21/hr (promedio USD 20–22) |
| **Costo interno total** | USD 2,415–2,835 |
| **Precio al cliente** | USD 3,400 (fijo, ver PROPUESTA_CLIENTE_LEXINTON.md) |

---

## Estado inicial del demo

El repositorio `ricardobing/lexinton-demo` ya incluye:

✅ `Navbar.tsx` — blanco sobre hero, oscuro al scroll >80px  
✅ `HeroSection.tsx` — video aéreo de Buenos Aires con poster LCP-optimizado  
✅ `CredibilityBar.tsx` — barra de stats con AnimatedCounter  
✅ `MetodoSection.tsx` — 3 pasos editoriales  
✅ `FeaturedProperties.tsx` + `PropertyCard.tsx` — 3 cards con datos estáticos  
✅ `TestimonialsSection.tsx` — testimonios, diseño editorial  
✅ `CTASection.tsx` — formulario de tasación (estático aún)  
✅ `Footer.tsx` — 3 columnas (marca, links, sucursales)  
✅ `MobileSticky.tsx` — WhatsApp + CTA fijo en mobile  
✅ Design system completo (Tailwind tokens + fuentes)  
✅ Build en Vercel funcionando con auto-deploy  

Lo que resta es conectar Tokko, construir las páginas internas y finalizar todo.

---

## Mapa de fases

```
Fase 0  ── Recolección de información y setup [1 semana]
Fase 1  ── Arquitectura técnica + integración base Tokko [1 semana]
Fase 2  ── Listado de propiedades + buscador [2 semanas]
Fase 3  ── Ficha individual de propiedad [1 semana]
Fase 4  ── Formulario de contacto → Tokko CRM [0.5 semana]
Fase 5  ── Emprendimientos [1 semana]
Fase 6  ── SEO técnico + Performance + Analytics [1 semana]
Fase 7  ── QA, ajustes finales, deploy, capacitación [0.5 semana]
───────────────────────────────────────────────────────────
Total   ── 7–9 semanas calendario
```

---

## Fase 0 — Recolección de información y setup

**Duración:** 3–5 días  
**Horas:** 8–10 hrs  
**Bloqueante:** Sin la API KEY de Tokko no puede comenzar la Fase 1.

### Lo que necesitamos del cliente

| Item | Descripción | Quién lo consigue |
|---|---|---|
| **API KEY Tokko** | Key única de su cuenta, desde panel.tokkobroker.com → Configuración → API | **Cliente (Lexinton)** |
| **Credenciales Tokko** | Acceso al panel si necesitamos verificar endpoints | **Cliente** |
| **Textos/copy definitivos** | "Quiénes somos", descripción de sucursales, etc. | **Cliente** |
| **Logo en SVG** | Logo en vector para header y footer | **Cliente** |
| **Testimonios reales** | 3–5 testimonios de clientes (nombre, texto, foto opcional) | **Cliente** |
| **Credenciales dominio** | Acceso al DNS de lexinton.com.ar para apuntar a Vercel | **Cliente** |
| **Cuenta Cliengo** | ID del widget si quieren mantener el chatbot | **Cliente (opcional)** |

### Entregables de Fase 0

- [ ] `.env.local` configurado con API KEY real de Tokko
- [ ] Verificación de propiedades disponibles en la API (test con key real)
- [ ] Inventario de secciones del sitio actual (qué conservar, qué eliminar)
- [ ] Definición de paleta de barrios/zonas de actuación de Lexinton
- [ ] Brief de contenido aprobado por el cliente

---

## Fase 1 — Arquitectura técnica + integración base Tokko

**Duración:** 5–7 días  
**Horas:** 18–22 hrs  
**Dependencia:** API KEY disponible (Fase 0 completa)

### Tareas técnicas

#### 1.1 Librería de integración Tokko (`lib/tokko.ts`)
- Función `getProperties(params)` con cache ISR
- Función `getPropertyById(id)` para fichas individuales
- Función `getDevelopments()` para emprendimientos
- Función `submitContact(payload)` via Route Handler (oculta la API key)
- Tipado TypeScript completo (`types/tokko.ts`)
- Manejo de errores y fallbacks

#### 1.2 Configuración de Next.js
- `next.config.js` con `remotePatterns` para CDN de imágenes de Tokko
- Variables de entorno en Vercel (producción + preview)
- Configuración de `revalidate` por tipo de página

#### 1.3 Test de integración
- Verificar que las propiedades de Lexinton retornan correctamente
- Verificar estructura de datos (campos presentes, imágenes disponibles)
- Test del endpoint `/contact/` con datos ficticios

#### 1.4 Conectar `FeaturedProperties` al API real
- Reemplazar datos estáticos de `lib/properties.ts` por llamada a Tokko
- Selector de propiedades "destacadas" (by `reference_code` o primeras N)
- Mantener el diseño visual del demo existente

### Entregables de Fase 1

- [ ] `lib/tokko.ts` completo y testeado
- [ ] `types/tokko.ts` con todos los tipos
- [ ] Homepage conectada a datos reales de Tokko
- [ ] Test de envío de lead funcional (aparece en panel de Tokko)
- [ ] Deploy en Vercel con variables de entorno en prod

---

## Fase 2 — Listado de propiedades + buscador

**Duración:** 8–10 días  
**Horas:** 30–36 hrs  
**Dependencia:** Fase 1 completa

Esta es la fase de mayor complejidad técnica y diseño.

### Tareas técnicas

#### 2.1 Página `/propiedades` — Server Component
- Fetch de propiedades desde Tokko con ISR (revalidate 5 min)
- Soporte de `searchParams` para filtros desde URL
- Paginación (20 propiedades por página)
- Manejo de estado vacío (no se encontraron resultados)

#### 2.2 Componente `SearchBar` — Client Component
- Filtro por **operación** (Venta / Alquiler)
- Filtro por **tipo de propiedad** (Departamento, Casa, PH, Local, etc.)
- Filtro por **barrio/zona** (dropdown con zonas de Lexinton)
- Filtro por **precio mínimo/máximo** (con selector de moneda USD/ARS)
- Filtro por **ambientes** (1, 2, 3, 4, 5+)
- Botón "Limpiar filtros"
- Al cambiar filtros → actualiza la URL con `useRouter` y `router.push`

#### 2.3 Grilla de resultados
- Layout: 3 columnas en desktop, 2 en tablet, 1 en mobile
- `PropertyCard` (ya diseñada, conectar con datos reales)
- Skeleton loading durante navegación
- Contador de resultados ("Mostrando 1–20 de 87 propiedades")

#### 2.4 Ordenamiento
- Ordenar por precio (ascendente/descendente)
- Ordenar por más recientes

#### 2.5 Vista de mapa (opcional, Fase 2 Plus)
- Integración con Google Maps o Mapbox
- Pins por cada propiedad con popup del precio
- Toggle Lista / Mapa
- *Este item puede diferirse a una fase posterior si el presupuesto no lo incluye*

### Entregables de Fase 2

- [ ] `/propiedades` funcional con datos reales de Tokko
- [ ] Buscador con todos los filtros operativos
- [ ] Paginación funcional
- [ ] URLs semánticas con filtros (`/propiedades?op=venta&tipo=departamento&zona=palermo`)
- [ ] Responsive completo (mobile, tablet, desktop)
- [ ] SEO básico: `<title>` y `<meta description>` dinámicos

---

## Fase 3 — Ficha individual de propiedad

**Duración:** 5–7 días  
**Horas:** 20–25 hrs  
**Dependencia:** Fase 1 completa

### Tareas técnicas

#### 3.1 Ruta `/propiedades/[id]` — SSG + ISR
- `generateStaticParams()` para pre-generar las primeras 200 fichas en build
- `generateMetadata()` para SEO dinámico por propiedad
- Fallback `loading.tsx` + `not-found.tsx`

#### 3.2 Layout de la ficha
- **Galería de imágenes** — lightbox o slider (carousel responsive)
- **Información principal:**
  - Título de la publicación
  - Precio con moneda + tipo de operación (Venta / Alquiler)
  - Dirección ficticia (no la real, según configuración de Tokko)
  - Mapa con ubicación aproximada (geo_lat + geo_long)
- **Características:**
  - Ambientes, dormitorios, baños, superficie total/cubierta
  - Expensas, antigüedad, orientación, disposición
  - Servicios (agua, gas, electricidad, etc.)
- **Descripción completa** de la propiedad
- **Código de referencia** (para que el cliente identifique la prop en Tokko)

#### 3.3 Formulario de contacto en ficha
- Integrado al costado derecho en desktop / abajo en mobile
- Campos: Nombre, Email, Teléfono, Mensaje
- POST a Route Handler → Tokko `/contact/` API con `publication_id` de la propiedad
- Toast de confirmación o error
- El lead ingresa al CRM de Tokko identificado con esa propiedad específica

#### 3.4 Compartir y navegación
- Botón "Compartir" (URL directa, WhatsApp)
- Breadcrumb: Inicio > Propiedades > [Título]
- "Ver más propiedades similares" (misma zona o tipo)

### Entregables de Fase 3

- [ ] `/propiedades/[id]` con layout completo
- [ ] Galería de imágenes responsive
- [ ] Formulario funcional → lead en Tokko CRM
- [ ] Mapa con geolocalización (Google Maps embed)
- [ ] Meta OG dinámico (para compartir en WhatsApp/Redes)
- [ ] 200 fichas pre-generadas en build

---

## Fase 4 — Formulario de contacto general y tasación

**Duración:** 2–3 días  
**Horas:** 8–10 hrs  
**Dependencia:** Fase 1 completa (Route Handler `/api/contact` ya funciona)

### Tareas

#### 4.1 Formulario de tasación (`CTASection`)
- El formulario de tasación del demo es estático → conectar al backend
- Campos: Nombre, Email, Teléfono, Tipo de operación, Dirección, Mensaje
- POST a Tokko con tag `"tasacion"` para identificar el origen en el CRM
- Opcionalmente: envío paralelo a un email de la agencia (via Resend o Nodemailer)

#### 4.2 Página `/contacto`
- Datos de contacto completos: teléfonos, emails, sucursales, mapa
- Formulario de consulta general
- Horarios de atención
- WhatsApp Business link

#### 4.3 Validación frontend
- Validación de email, teléfono, campos requeridos
- Feedback visual de éxito/error
- Protección anti-spam (honeypot field o Turnstile de Cloudflare)

### Entregables de Fase 4

- [ ] Formulario de tasación conectado a Tokko
- [ ] Página `/contacto` completa
- [ ] Validación y feedback de formularios
- [ ] Leads de "tasación" identificables en el CRM

---

## Fase 5 — Emprendimientos

**Duración:** 4–5 días  
**Horas:** 14–18 hrs  
**Dependencia:** Fases 1 y 3 completas (reutiliza componentes de ficha)

### Tareas

#### 5.1 Página `/emprendimientos`
- Lista de desarrollos desde Tokko API (`/development/`)
- Cards de emprendimiento (nombre, foto, estado de avance, ubicación)
- Filtros por zona y estado (en pozo, en construcción, terminado)

#### 5.2 Ficha de emprendimiento `/emprendimientos/[id]`
- Galería de imágenes/renders
- Descripción del proyecto
- Unidades disponibles (si aplica)
- Video de la obra / tour virtual
- Formulario de contacto → Tokko CRM con `development_id`

#### 5.3 Widget de emprendimientos en Homepage
- Sección "Nuevos proyectos" con 2–3 emprendimientos destacados
- Link a la página completa

### Entregables de Fase 5

- [ ] `/emprendimientos` con listado real de Tokko
- [ ] Ficha de emprendimiento completa
- [ ] Leads de emprendimientos identificados en CRM
- [ ] Widget en homepage

---

## Fase 6 — SEO técnico, Performance y Analytics

**Duración:** 4–5 días  
**Horas:** 14–18 hrs  
**Dependencia:** Fases 2, 3 y 5 completas

### Tareas

#### 6.1 SEO técnico
- `app/sitemap.ts` dinámico (homepage + propiedades + emprendimientos + páginas estáticas)
- `app/robots.ts` con configuración correcta
- Metadata completa por página (`title`, `description`, `og:image`, `og:type`)
- Structured data (JSON-LD) para propiedades: `RealEstateListing` schema
- Canonical URLs

#### 6.2 Core Web Vitals
- Auditoría Lighthouse en páginas clave
- Objetivo LCP < 2.5s (hero ya optimizado con poster + lazy video)
- CLS < 0.1 (fijar aspect ratios de imágenes de propiedades)
- FID/INP < 200ms (minimizar JS cliente, defer scripts de terceros)
- Compresión de imágenes de Tokko via `next/image` (formato WebP automático)

#### 6.3 Analytics
- Google Analytics 4 via `@next/third-parties/google`
- Eventos custom:
  - `property_view` (ver ficha)
  - `search_performed` (búsqueda con filtros)
  - `contact_form_submit` (lead enviado)
  - `whatsapp_click` (clic en botón flotante)

#### 6.4 Cliengo (chatbot)
- Integrar widget de Cliengo como Script con `strategy="lazyOnload"`
- Verificar que leads de Cliengo llegan al CRM de Tokko (integración nativa de Cliengo + Tokko si está activada)

### Entregables de Fase 6

- [ ] Sitemap XML dinámico en `/sitemap.xml`
- [ ] `robots.txt` correcto
- [ ] JSON-LD en fichas de propiedades
- [ ] Lighthouse ≥ 85 en homepage y listado
- [ ] GA4 configurado con eventos custom
- [ ] Cliengo integrado

---

## Fase 7 — QA, ajustes finales, deploy y capacitación

**Duración:** 3–4 días  
**Horas:** 10–12 hrs

### Tareas

#### 7.1 QA cross-browser y cross-device
- Testing en Chrome, Firefox, Safari (iOS)
- Testing en dispositivos: iPhone SE (375px), iPhone 14 (390px), iPad, desktop 1280px+
- Verificación de todos los formularios en producción
- Test de flujo completo: visita → búsqueda → ficha → contacto → aparece en Tokko CRM

#### 7.2 Migración de dominio
- Actualización de DNS: apuntar `lexinton.com.ar` a Vercel
- Verificación de certificado SSL (Vercel lo gestiona automáticamente)
- Redirecciones 301 de URLs antiguas de WordPress (si es necesario)
- Prueba de verificación en Google Search Console

#### 7.3 Capacitación del cliente
- Sesión de 1 hora (video call) explicando:
  - Cómo ver leads que llegan desde el sitio en el panel de Tokko
  - Cómo el sitio se actualiza automáticamente cuando agregan propiedades en Tokko
  - Cómo interpretar Google Analytics
  - Qué deben hacer si algo falla (contacto de soporte)
- Documento "Manual de uso" (1–2 páginas, sin tecnicismos)

#### 7.4 Entrega de código
- Repo privado en GitHub transferido al cliente (o acceso de collaborator)
- Documentación de variables de entorno (`README.md`)
- Configuración de Vercel documentada

### Entregables de Fase 7

- [ ] QA completado sin bugs críticos
- [ ] Dominio `lexinton.com.ar` apuntando al nuevo sitio
- [ ] SSL activo
- [ ] Search Console verificado
- [ ] Sesión de capacitación realizada
- [ ] Manual de uso entregado
- [ ] Acceso al repositorio transferido

---

## Cronograma tentativo

```
Semana 1    │ Fase 0: Setup y recolección de info
Semana 2    │ Fase 1: Integración base Tokko
Semanas 3-4 │ Fase 2: Listado de propiedades + buscador
Semana 5    │ Fase 3: Ficha individual
Semana 5.5  │ Fase 4: Formularios de contacto
Semanas 6-7 │ Fase 5: Emprendimientos (paralelo con Fase 6 parcial)
Semana 7    │ Fase 6: SEO + Performance + Analytics
Semana 8    │ Fase 7: QA + Deploy + Capacitación
────────────┼────────────────────────────────────
TOTAL       │ ~8 semanas calendario
```

**Nota:** El cronograma puede acortarse a 6 semanas si el cliente proporciona todos los materiales de Fase 0 en la primera semana.

---

## Resumen de horas y costos

| Fase | Horas (min) | Horas (max) | Costo interno (USD) |
|---|---|---|---|
| Fase 0 — Setup | 8 | 10 | ~$189 |
| Fase 1 — Integración Tokko | 18 | 22 | ~$420 |
| Fase 2 — Listado + buscador | 30 | 36 | ~$693 |
| Fase 3 — Ficha individual | 20 | 25 | ~$472 |
| Fase 4 — Formularios | 8 | 10 | ~$189 |
| Fase 5 — Emprendimientos | 14 | 18 | ~$336 |
| Fase 6 — SEO + Performance | 14 | 18 | ~$336 |
| Fase 7 — QA + Deploy | 10 | 12 | ~$231 |
| **Total** | **122** | **151** | **~$2,866** |

**Precio al cliente:** USD 3,400 (fijo)  
**Margen:** ~18–35% (depende de velocidad de ejecución)

---

## Hitos de pago sugeridos (para negociación con cliente)

| Hito | Condición | % | USD |
|---|---|---|---|
| **Anticipo** | Firma de propuesta + entrega de API KEY | 30% | $1,020 |
| **Hito 1** | Listado de propiedades en vivo con buscador | 30% | $1,020 |
| **Hito 2** | Todas las fichas + formularios funcionando | 25% | $850 |
| **Entrega final** | Deploy en dominio real + capacitación | 15% | $510 |

---

## Exclusiones (out of scope)

Los siguientes ítems **no están incluidos** en este presupuesto y requieren cotización separada:

- ❌ Vista de mapa (Google Maps interactivo con pins)
- ❌ Sistema de alertas de propiedades por email para visitantes
- ❌ Blog o sección de noticias
- ❌ Portal de propietarios (login, publicación propia)
- ❌ Traducción al inglés del sitio
- ❌ Campañas de Google Ads / SEO ongoing
- ❌ Diseño de identidad visual / branding (se usa el logo y paleta existente)
- ❌ Hosting (Vercel Free Tier es suficiente para el volumen de Lexinton)
- ❌ Correos corporativos (Gmail/Zoho/etc.)

---

## Mantenimiento post-entrega (opcional)

Después de la entrega, se puede contratar un **retainer mensual** para:

| Servicio | USD/mes |
|---|---|
| Actualizaciones de dependencias (Next.js, etc.) | Incluido en Basic |
| Soporte técnico (bugs, problemas de integración) | Incluido en Basic |
| Cambios de contenido pequeños (textos, fotos) | Incluido en Basic |
| Nuevas features (secciones, funcionalidades) | A cotizar separado |
| **Retainer Basic** | **USD 180/mes** |

*El retainer es opcional. El sitio funciona de forma autónoma sin mantenimiento activo.*

---

*Documento interno · No distribuir al cliente sin revisión · Ver PROPUESTA_CLIENTE_LEXINTON.md para la versión comercial.*
