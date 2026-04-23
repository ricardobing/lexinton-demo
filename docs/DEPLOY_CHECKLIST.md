# Deploy Checklist — Lexinton Web

## Variables de entorno requeridas en Vercel

Configurar en: Vercel Dashboard → Project → Settings → Environment Variables

| Variable | Descripción |
|---|---|
| `TOKKO_API_KEY` | API key de Tokko Broker (panel del cliente) |
| `TOKKO_BASE_URL` | `https://www.tokkobroker.com/api/v1` |
| `TOKKO_COMPANY_ID` | ID de la empresa en Tokko (ver URL del panel) |

## Dominios configurados en next.config.mjs (remotePatterns)

- `images.unsplash.com` — imágenes de fondo (DualCTA)
- `lexinton.com.ar` — dominio propio
- `static.tokkobroker.com` (https + http) — fotos de propiedades y emprendimientos

## Post-deploy verificar

- [ ] Las propiedades de Tokko cargan en `/propiedades`
- [ ] El carrusel de emprendimientos carga en home
- [ ] Los formularios envían leads (hacer test manual con email real)
- [ ] Las imágenes de propiedades cargan correctamente
- [ ] El modal de contacto abre desde home
- [ ] `/inversor` y `/emprendimientos` muestran formulario blanco (no oscuro)
- [ ] La sección de emprendimientos en `/emprendimientos` lista las propiedades
- [ ] Google Search Console — verificar indexación

## Notas

- Los leads van directamente al panel de Tokko Broker del cliente
- Para notificaciones por email: Panel Tokko → Configuración → Notificaciones → Email al recibir consulta web
- El sitio usa ISR (Incremental Static Regeneration) — las páginas se revalidan cada 600s en producción
