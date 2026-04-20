'use client'

/**
 * CliengoScript — Carga el widget oficial de Cliengo para Next.js App Router.
 *
 * Channel ID:  59d3b2e0e4b0a4eff6631cc1  (www.lexinton.com.ar — verified 200 OK)
 * Company ID:  59cc0d38e4b0b1f0b5d8fec1
 * Script URL:  https://s.cliengo.com/weboptimizer/59d3b2e0e4b0a4eff6631cc1/59d3b2e0e4b0a4eff6631cc1.js
 *
 * SPA-safe:
 * - useEffect + usePathname re-intenta reinit en cada cambio de ruta
 * - scriptInjected ref evita doble inyección (React StrictMode safe)
 * - window.__cliengoLoaded flag evita reinit antes de que cargue el script
 */

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

const WEBSITE_ID   = '59d3b2e0e4b0a4eff6631cc1'
const COMPANY_ID   = '59cc0d38e4b0b1f0b5d8fec1'
const SCRIPT_ID    = 'cliengo-weboptimizer'
const SCRIPT_SRC   = `https://s.cliengo.com/weboptimizer/${WEBSITE_ID}/${WEBSITE_ID}.js`

declare global {
  interface Window {
    __cliengoLoaded?: boolean
    Cliengo?: {
      chatConfig?: Record<string, unknown>
      init?:       () => void
      reset?:      () => void
    }
    cliengo?: { init?: () => void; reset?: () => void }
    CliengoWidget?: { init?: () => void }
    _cliengo?: { init?: () => void }
  }
}

function isWidgetMounted(): boolean {
  return !!(
    document.getElementById('cliengo-fab') ||
    document.querySelector('[id*="cliengo"]') ||
    document.querySelector('[class*="cliengo"]') ||
    document.querySelector('iframe[src*="cliengo"]')
  )
}

function tryReinit(): void {
  try {
    if (typeof window.Cliengo?.reset === 'function')       { window.Cliengo.reset(); return }
    if (typeof window.Cliengo?.init  === 'function')       { window.Cliengo.init();  return }
    if (typeof window.cliengo?.reset === 'function')       { window.cliengo.reset(); return }
    if (typeof window.cliengo?.init  === 'function')       { window.cliengo.init();  return }
    if (typeof window.CliengoWidget?.init === 'function')  { window.CliengoWidget.init(); return }
    if (typeof window._cliengo?.init === 'function')       { window._cliengo.init(); return }
  } catch (e) {
    console.warn('[Cliengo] reinit error:', e)
  }
}

export function CliengoScript() {
  const pathname        = usePathname()
  const scriptInjected  = useRef(false)

  useEffect(() => {
    // ── Primera carga: inyectar script una sola vez ───────────────────────
    if (!scriptInjected.current) {
      scriptInjected.current = true

      if (!document.getElementById(SCRIPT_ID)) {
        // Pre-configurar companyId antes de cargar el script (algunos builds lo necesitan)
        window.Cliengo = window.Cliengo ?? {}
        window.Cliengo.chatConfig = {
          companyId: COMPANY_ID,
          websiteId: WEBSITE_ID,
        }

        const script       = document.createElement('script')
        script.id          = SCRIPT_ID
        script.src         = SCRIPT_SRC
        script.async       = true
        script.defer       = true
        script.onload      = () => { window.__cliengoLoaded = true }
        script.onerror     = () => {
          console.warn('[Cliengo] script.onerror — verificar cuenta en dash.cliengo.com')
        }
        document.body.appendChild(script)
      }
      return
    }

    // ── Navegación SPA: re-inicializar si el widget desapareció ──────────
    if (!window.__cliengoLoaded) return

    const timer = setTimeout(() => {
      if (!isWidgetMounted()) tryReinit()
    }, 700)

    return () => clearTimeout(timer)
  }, [pathname])

  return null
}
