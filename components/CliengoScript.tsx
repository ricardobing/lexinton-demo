'use client'

/**
 * CliengoScript — Carga el widget de Cliengo de forma diferida.
 *
 * Canal:     59d3b2e0e4b0a4eff6631cc1
 * Company:   59cc0d38e4b0b1f0b5d8fec1
 *
 * Estrategia de carga diferida:
 *   - requestIdleCallback: se ejecuta cuando el browser no tiene nada urgente.
 *     Timeout de 5s como fallback si el browser nunca queda idle.
 *   - Fallback sin requestIdleCallback: window.load + 3s de delay.
 *   Esto saca Cliengo completamente del critical path → mejora TBT y LCP.
 *
 * SPA-safe:
 *   - scriptInjected ref evita doble inyección (React StrictMode safe)
 *   - En cambios de ruta: re-init si el widget desapareció
 */

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

const WEBSITE_ID = '59d3b2e0e4b0a4eff6631cc1'
const COMPANY_ID = '59cc0d38e4b0b1f0b5d8fec1'
const SCRIPT_ID  = 'cliengo-weboptimizer'
const SCRIPT_SRC = `https://s.cliengo.com/weboptimizer/${WEBSITE_ID}/${WEBSITE_ID}.js`

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
    if (typeof window.Cliengo?.reset === 'function')      { window.Cliengo.reset(); return }
    if (typeof window.Cliengo?.init  === 'function')      { window.Cliengo.init();  return }
    if (typeof window.cliengo?.reset === 'function')      { window.cliengo.reset(); return }
    if (typeof window.cliengo?.init  === 'function')      { window.cliengo.init();  return }
    if (typeof window.CliengoWidget?.init === 'function') { window.CliengoWidget.init(); return }
    if (typeof window._cliengo?.init === 'function')      { window._cliengo.init(); return }
  } catch (e) {
    console.warn('[Cliengo] reinit error:', e)
  }
}

function injectScript(): void {
  if (document.getElementById(SCRIPT_ID)) return

  window.Cliengo = window.Cliengo ?? {}
  window.Cliengo.chatConfig = { companyId: COMPANY_ID, websiteId: WEBSITE_ID }

  const script    = document.createElement('script')
  script.id       = SCRIPT_ID
  script.src      = SCRIPT_SRC
  script.async    = true
  script.defer    = true
  script.onload   = () => { window.__cliengoLoaded = true }
  script.onerror  = () => { console.warn('[Cliengo] script failed — check dash.cliengo.com') }
  document.body.appendChild(script)
}

export function CliengoScript() {
  const pathname       = usePathname()
  const scriptInjected = useRef(false)

  useEffect(() => {
    // ── Primera carga: inyectar diferido ────────────────────────────────
    if (!scriptInjected.current) {
      scriptInjected.current = true

      if ('requestIdleCallback' in window) {
        // Esperar a que el browser esté idle (máx 5s)
        requestIdleCallback(injectScript, { timeout: 5000 })
      } else {
        // Fallback: esperar 3s después del load
        const onLoad = () => setTimeout(injectScript, 3000)
        if (document.readyState === 'complete') {
          setTimeout(injectScript, 3000)
        } else {
          ;(window as Window).addEventListener('load', onLoad, { once: true })
        }
      }
      return
    }

    // ── Navegación SPA: re-init si el widget desapareció ────────────────
    if (!window.__cliengoLoaded) return

    const timer = setTimeout(() => {
      if (!isWidgetMounted()) tryReinit()
    }, 700)

    return () => clearTimeout(timer)
  }, [pathname])

  return null
}