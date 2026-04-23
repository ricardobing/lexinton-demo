# Auditoría Mobile — Lexinton Web

> Fecha: 2025-07  
> Breakpoints objetivo: 375 px · 390 px · 768 px  
> Framework: Next.js 14 · Tailwind CSS

---

## Resumen ejecutivo

| Componente / Página | Estado | Problema | Fix |
|---|---|---|---|
| Navbar | ✅ OK | — | — |
| Footer | ✅ OK | — | — |
| HeroSection | ✅ OK | — | — |
| StatsBar | ✅ OK | `grid-cols-2` en mobile | — |
| TasacionCTA | ✅ OK | `grid-cols-1 md:grid-cols-2` | — |
| ProcessSteps (tasar) | ✅ OK | `grid-cols-1 md:grid-cols-4` | — |
| FeaturedProperties | ✅ OK | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` | — |
| DevelopmentsCarousel | ✅ OK | drag-to-swipe, full width en mobile | — |
| /propiedades page | ✅ OK | grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` | — |
| /contacto page | ✅ OK | mapas con height="300" explícito | — |
| /quiero-vender page | ✅ OK | layout apilado en mobile | — |
| /inversor page | ✅ OK | layout apilado en mobile | — |
| PropertyDetailClient | ✅ OK | mapa con `aspect-[16/9]` responsive | — |
| **ContactModal** | ⚠️ FIX | Modal centrado clip con teclado iOS | Bottom-sheet en mobile |
| **HomeSearchBar** | ⚠️ FIX | Fila 2 (tipo+barrio+buscar) en una fila → overflow en 375px | Stack vertical `flex-col sm:flex-row` |
| **ContactForm** | ⚠️ FIX | `text-sm` (14px) en inputs → iOS auto-zoom | `text-base` (16px) |
| **LeadForm** | ⚠️ FIX | `text-[14px]` en inputs → iOS auto-zoom | `text-[16px]` |
| **PropertyListCard** | ⚠️ FIX | Flechas de foto `opacity-0 group-hover` → invisibles en touch | `opacity-60 md:opacity-0 md:group-hover/img:opacity-80` |
| **DualCTA** | ⚠️ FIX | `p-10` en cards → 40px padding en mobile, algo justo | `p-6 md:p-10` |

---

## Detalle por componente

### 1. ContactModal — Bottom-sheet en mobile

**Problema:** `fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2` cuando el teclado virtual iOS se abre, desplaza el viewport y el modal puede quedar parcialmente oculto bajo el teclado o recortado arriba.

**Fix aplicado:** En mobile (`< md`) el modal usa patrón bottom-sheet (`bottom-0 left-0 right-0 rounded-t-2xl`). En desktop mantiene el centrado clásico.

---

### 2. HomeSearchBar — Stack en mobile

**Problema:** La fila 2 del buscador tiene `flex items-center` con tres hijos inline: select de tipo (`min-w-[150px]`), barrio (`flex-1`) y botón buscar. En 375px el ancho total supera el contenedor.

**Fix aplicado:** `flex-col sm:flex-row` en la fila 2. Tipo y barrio crecen a `w-full` en mobile. Botón buscar `w-full sm:w-auto`.

---

### 3. ContactForm — iOS font-size zoom

**Problema:** Todos los `<input>` y `<textarea>` usan `text-sm` (14px). iOS Safari hace zoom automático en cualquier input con `font-size < 16px`.

**Fix aplicado:** Cambiar `text-sm` → `text-base` (16px) en todos los campos del formulario.

---

### 4. LeadForm — iOS font-size zoom

**Problema:** Todos los `<input>`, `<select>` y `<textarea>` usan `text-[14px]`. Mismo problema que ContactForm.

**Fix aplicado:** Cambiar `text-[14px]` → `text-[16px]` en todos los campos.

---

### 5. PropertyListCard — Flechas de foto en touch

**Problema:** Las flechas de navegación del carousel tienen `opacity-0 group-hover/img:opacity-80`. En dispositivos touch no existe hover, por lo que las flechas son siempre invisibles.

**Fix aplicado:** `opacity-60 md:opacity-0 md:group-hover/img:opacity-80` — visibles con 60% opacidad en mobile, ocultas por defecto en desktop (se muestran al hover como antes).

---

### 6. DualCTA — Padding en mobile

**Problema:** El contenido de cada card tiene `p-10` (40px de padding). En mobile es aceptable pero el espacio es más justo.

**Fix aplicado:** `p-6 md:p-10` — 24px en mobile, 40px en desktop.

---

## Notas

- **PropertyDetailClient mapa:** ya usa `aspect-[16/9]` con `w-full` — responsive sin cambios.
- **DevelopmentsCarousel:** slides laterales `hidden md:block` — en mobile solo se muestra el slide central full width. Drag-to-swipe habilitado.
- **ContactForm grid nombre/email:** `grid grid-cols-2 gap-3` — en 375px cada campo mide ~170px, dentro del modal de 337px (375-2*19). Aceptable.
