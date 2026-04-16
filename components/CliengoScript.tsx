'use client'
/**
 * CliengoScript — Widget de chat de Cliengo
 *
 * Se carga con strategy="lazyOnload" para no bloquear el LCP ni el TBT.
 * El widget aparece en la esquina inferior derecha.
 *
 * API key de Cliengo: bc0cc2ac-721e-4454-86ad-3f216db21ea2
 *
 * ℹ️  Si el cliente quiere cambiar colores/posición/horarios del widget,
 *     se configura desde su panel de Cliengo → Ajustes → Apariencia.
 */

import Script from 'next/script'

export function CliengoScript() {
  return (
    <Script
      id="cliengo-widget"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `
          (function(){
            var ldk = document.createElement('script');
            ldk.type = 'text/javascript';
            ldk.async = true;
            ldk.src = 'https://s.cliengo.com/weboptimizer/bc0cc2ac-721e-4454-86ad-3f216db21ea2/bc0cc2ac-721e-4454-86ad-3f216db21ea2.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(ldk, s);
          })();
        `,
      }}
    />
  )
}
