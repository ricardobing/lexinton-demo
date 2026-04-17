# Arquitectura del Sitio — Lexinton Propiedades

## Stack Tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| Next.js | 14.2.29 | App Router, SSG/ISR |
| TypeScript | 5.x | Tipado estricto |
| Tailwind CSS | 3.x | Utility-first styling |
| Framer Motion | 11.x | Animaciones |
| yet-another-react-lightbox | 3.x | Galería de fotos |

## Estructura de Carpetas

```
app/
├── layout.tsx              # Root layout (fonts, navbar, footer, cliengo)
├── page.tsx                # Home
├── globals.css             # Variables CSS, scrollbar, focus-visible
├── sitemap.ts              # Sitemap dinámico
├── api/
│   ├── properties/route.ts # API proxy para Tokko
│   ├── leads/route.ts      # Lead submission
│   ├── contact/route.ts    # Formulario de contacto
│   └── locations/route.ts  # Barrios de CABA
├── propiedades/
│   ├── page.tsx            # Listado con filtros server-side
│   └── [id]/page.tsx       # Detalle ISR (revalidate=300)
├── contacto/page.tsx
├── emprendimientos/page.tsx
├── inversor/page.tsx
├── quiero-vender/page.tsx
└── tasar/page.tsx

components/
├── ui/                     # Design system
│   ├── SectionHeader.tsx   # Label + serif title + decorative line
│   ├── NumberedSteps.tsx   # 01/02/03 format grid
│   ├── FeatureCard.tsx     # Hover scale card
│   └── StatsCounter.tsx    # Animated counting numbers
├── search/
│   ├── HeroSearch.tsx      # Buscador premium del hero
│   └── LocationAutocomplete.tsx
├── properties/
│   ├── PropertySearch.tsx  # Filtros + grilla de resultados
│   ├── PropertyDetailClient.tsx
│   ├── PropertyGallery.tsx
│   └── PropertyContact.tsx
├── Navbar.tsx, Footer.tsx, HeroSection.tsx, etc.
├── PageHero.tsx            # Hero reutilizable para páginas interiores
├── AnimatedSection.tsx     # Wrapper de animación scroll
└── AnimatedCounter.tsx     # Contador animado

lib/
├── motion.ts               # Tokens de animación (EASE, DURATION, variants)
├── animations.ts           # Re-export backward-compatible
├── utils.ts                # cn() helper
└── tokko/
    ├── client.ts           # tokkoFetch / tokkoPost
    ├── types.ts            # Tipos TypeScript
    ├── queries.ts          # getProperties, getSimilarProperties, etc.
    └── utils.ts            # Helpers de formato y display
```

## Paleta de Colores

| Token | Hex | Uso |
|---|---|---|
| `lx-ink` | #111111 | Texto principal |
| `lx-stone` | #7a7570 | Texto secundario |
| `lx-cream` | #f8f6f2 | Fondo principal |
| `lx-parchment` | #f0ede6 | Fondo alternado |
| `lx-accent` | #3d5a6c | Acentos, labels |
| `lx-line` | #ddd9d0 | Bordes, divisores |

## Tipografía

- **Sans**: Inter (--font-inter)
- **Serif**: Instrument Serif (--font-serif)

## Tokens de Animación (lib/motion.ts)

- Easing: `[0.22, 1, 0.36, 1]` (ease-premium)
- Duraciones: fast=0.3s, normal=0.5s, slow=0.7s, entrance=0.6s
- Stagger: fast=0.06, normal=0.1, slow=0.15
- Viewport: `{ once: true, margin: '-60px' }`

## API / Data

- **Tokko Broker API**: propiedades, tipos, barrios, emprendimientos, leads
- **Revalidación**: 300s para propiedades, 3600s para tipos/locations
- **Paginación**: 2 batches de 100, filtrado server-side
- **Propiedades similares**: scoring por operación, zona, tipo, rango de precio ±30%

## Rendering

| Ruta | Estrategia |
|---|---|
| `/` | Static |
| `/propiedades` | Dynamic (server-side filters) |
| `/propiedades/[id]` | SSG + ISR (300s) |
| `/emprendimientos` | SSG (Tokko API at build) |
| Resto | Static |
