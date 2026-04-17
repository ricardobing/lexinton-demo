# Discrepancias y Problemas Conocidos

## 🔴 Críticos

### Tokko API 403 durante build
- **Problema**: La API de Tokko devuelve 403 intermitentemente durante `npm run build`
- **Impacto**: Las páginas de detalle se pre-renderizan sin datos de propiedades similares
- **Mitigación**: ISR revalida cada 5 min; las páginas se regeneran en producción
- **Acción**: Monitorear logs de Vercel para 403 persistentes

### Filtros de operación no nativos en Tokko
- **Problema**: La API no filtra correctamente por `operation_type`
- **Impacto**: Se descargan todas las propiedades y se filtran server-side
- **Mitigación**: 2 batches de 100 cubren el inventario actual (~171 propiedades)
- **Riesgo**: Si el inventario crece a >200, agregar un 3er batch

## 🟡 Normales

### Fuentes pequeñas en mobile
- Labels con `text-[10px]`–`text-[11px]` en navbar, footer, tabs del hero search
- Son elementos decorativos/secundarios, no contenido principal
- iOS Safari zoom automático si inputs < 16px: los inputs ya son 14px+ ✅

### Google Maps embeds
- Los iframes de Google Maps no tienen API key dedicada
- Pueden mostrar "For development purposes only" en alto tráfico
- Solución: migrar a Google Maps Embed API con key

### Cliengo widget
- Usa `<Script src="..." strategy="afterInteractive" />`
- El widget se carga después del hydration de Next.js
- Puede haber 1-2s de delay antes de que aparezca el chat

## 🟢 Nice-to-have

### Optimización de imágenes
- Las fotos de Tokko no pasan por next/image optimization (URLs externas)
- Configurar `remotePatterns` en next.config.js para habilitar optimización

### Búsqueda por texto libre
- Actualmente solo se puede buscar por barrio, tipo y operación
- Agregar búsqueda por dirección/texto en PropertySearch

### SEO de propiedades
- Los slugs son solo IDs numéricos (`/propiedades/12345`)
- Se generan slugs con `makePropertySlug` pero no se usan como canonical
