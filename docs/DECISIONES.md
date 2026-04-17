# Decisiones Técnicas

## 1. Filtrado server-side vs API nativa

**Decisión**: Filtrar propiedades post-fetch en el servidor de Next.js.

**Motivo**: La API de Tokko no filtra correctamente por `operation_type` y retorna 400 para `order_by`. Es más confiable descargar todo y filtrar/ordenar en Node.

**Trade-off**: Mayor uso de memoria en build/request, pero el inventario es pequeño (~171 props).

## 2. overflow-x-hidden en HeroSection

**Decisión**: Cambiar `overflow-hidden` a `overflow-x-hidden` en el hero.

**Motivo**: Los dropdowns del HeroSearch (tipo de propiedad, autocomplete de barrio) se cortaban detrás del video background. `overflow-hidden` los clippeaba.

**Trade-off**: El contenido puede desbordar verticalmente, pero el hero usa `h-[100svh]` así que no hay contenido extra.

## 3. Propiedades similares con scoring

**Decisión**: Sistema de scoring ponderado (operación obligatoria + zona×3 + tipo×2 + precio±30%×2).

**Motivo**: El sistema anterior (filtro por zona OR tipo) mostraba propiedades de venta junto a alquileres en USD 133, rompiendo la coherencia.

**Trade-off**: Requiere descargar todas las propiedades para scoring (2 batches). Cacheado en ISR.

## 4. Design system components vs inline JSX

**Decisión**: Crear componentes reutilizables (SectionHeader, NumberedSteps, FeatureCard, StatsCounter).

**Motivo**: Las 5 páginas institucionales repetían patrones visuales (labels, títulos serif, cards con hover). Los componentes garantizan coherencia con el home.

**Trade-off**: Menor flexibilidad por caso individual, pero mucho más mantenible.

## 5. Motion tokens centralizados

**Decisión**: `lib/motion.ts` como fuente única de easing, duraciones y stagger values.

**Motivo**: Easing `[0.22, 1, 0.36, 1]` repetido en 15+ archivos. Centralizar evita inconsistencias.

## 6. Cliengo via next/script

**Decisión**: Usar `<Script src="..." strategy="afterInteractive" />` en lugar de dangerouslySetInnerHTML.

**Motivo**: dangerouslySetInnerHTML no funciona de manera confiable con App Router de Next.js. El script se ejecutaba en SSR pero no re-ejecutaba en navegación client-side.

## 7. Tailwind static classes

**Decisión**: Usar clases fijas (`lg:grid-cols-4`) en StatsCounter en vez de dinámicas (`lg:grid-cols-${n}`).

**Motivo**: Tailwind JIT no detecta clases construidas dinámicamente con template literals. El CSS nunca se genera.
