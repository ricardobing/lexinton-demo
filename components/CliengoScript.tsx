/**
 * CliengoScript — Widget de chat de Cliengo
 *
 * Carga el script oficial de Cliengo con strategy="lazyOnload"
 * para no bloquear el LCP ni el TBT.
 * El widget aparece en la esquina inferior derecha en todas las páginas.
 *
 * API key: bc0cc2ac-721e-4454-86ad-3f216db21ea2
 * Para cambiar colores, horarios o posición: panel Cliengo → Ajustes → Apariencia.
 */

import Script from 'next/script'

export function CliengoScript() {
  return (
    <Script
      id="cliengo-widget"
      src="https://s.cliengo.com/weboptimizer/bc0cc2ac-721e-4454-86ad-3f216db21ea2/bc0cc2ac-721e-4454-86ad-3f216db21ea2.js"
      strategy="lazyOnload"
    />
  )
}
