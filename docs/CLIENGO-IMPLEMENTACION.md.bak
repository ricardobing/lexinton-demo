# Implementación de Cliengo — Chat Widget

## Estado Actual: ✅ Funcionando

### Implementación

**Archivo**: `components/CliengoScript.tsx`

```tsx
import Script from 'next/script'

export function CliengoScript() {
  return (
    <Script
      src="https://s.cliengo.com/weboptimizer/bc0cc2ac-721e-4454-86ad-3f216db21ea2/bc0cc2ac-721e-4454-86ad-3f216db21ea2.js"
      strategy="afterInteractive"
    />
  )
}
```

**Ubicación**: Renderizado en `app/layout.tsx` dentro del `<body>`, después de todos los componentes.

### API Key
- ID: `bc0cc2ac-721e-4454-86ad-3f216db21ea2`

### Estrategia de Carga
- `strategy="afterInteractive"`: se carga después del hydration de Next.js
- NO bloquea LCP ni FID
- Delay típico: 1–2 segundos después de que la página es interactiva

### Intentos Anteriores (NO usar)

1. ❌ **dangerouslySetInnerHTML**: No funciona con App Router — el script se ejecuta en SSR pero no re-ejecuta en client-side navigation
2. ❌ **DOM injection manual**: `document.createElement('script')` + `document.body.appendChild()` — funciona pero pierde la optimización de Next.js Script
3. ❌ **useEffect + eval**: Anti-pattern, problemas de seguridad y CSP

### Verificación
El widget debe aparecer como un botón flotante en la esquina inferior derecha en TODAS las rutas:
- `/` (home)
- `/propiedades` y `/propiedades/[id]`
- `/inversor`
- `/emprendimientos`
- `/tasar`
- `/quiero-vender`
- `/contacto`

### Debugging
Si el widget no aparece:
1. Verificar en DevTools → Network que el script se descarga (status 200)
2. Verificar en Console que no hay errores de CORS o CSP
3. El script crea un iframe con `id="cliengo-widget"` — buscar en Elements
4. Cliengo puede estar desactivado desde el panel del cliente
