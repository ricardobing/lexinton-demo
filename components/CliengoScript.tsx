/**
 * CliengoScript — Widget de chat de Cliengo
 *
 * Carga el script oficial usando src= directo con strategy="afterInteractive".
 * Este es el único método que funciona de forma confiable en Next.js App Router.
 *
 * API key: bc0cc2ac-721e-4454-86ad-3f216db21ea2
 * Para cambiar colores, horarios o posición: panel Cliengo → Ajustes → Apariencia.
 */

import Script from 'next/script'

export function CliengoScript() {
  return (
    <Script
      src="https://s.cliengo.com/weboptimizer/bc0cc2ac-721e-4454-86ad-3f216db21ea2/bc0cc2ac-721e-4454-86ad-3f216db21ea2.js"
      strategy="afterInteractive"
    />
  )
}
