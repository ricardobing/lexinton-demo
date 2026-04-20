'use client'

/**
 * CliengoScript — Carga robusta del widget de chat de Cliengo para Next.js App Router.
 *
 * Problema en SPA: el script se ejecuta una sola vez al cargar la app.
 * En navegaciones client-side (sin reload), Cliengo puede no reinicializarse.
 *
 * Solución:
 * - useEffect + usePathname: detecta cada cambio de ruta
 * - Primera carga: inyecta el script dinámicamente (una sola vez)
 * - Navegaciones posteriores: intenta re-inicializar si el widget desapareció
 *
 * ⚠️  IMPORTANTE: verificar que la cuenta de Cliengo esté activa.
 *     El script https://s.cliengo.com/weboptimizer/{ID}/{ID}.js devuelve 404
 *     si la cuenta está inactiva o el ID es incorrecto.
 *     Obtener el embed code actualizado desde:
 *     Cliengo Dashboard → Chatbot → Editar Chatbot → Conexiones → Sitio web → Ver Instrucciones
 *
 * API key: bc0cc2ac-721e-4454-86ad-3f216db21ea2
 */

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

const CLIENGO_ID = 'bc0cc2ac-721e-4454-86ad-3f216db21ea2'
const CLIENGO_SRC = `https://s.cliengo.com/weboptimizer/${CLIENGO_ID}/${CLIENGO_ID}.js`
const CLIENGO_SCRIPT_ID = 'cliengo-weboptimizer'

declare global {
  interface Window {
    __cliengoLoaded?: boolean
    cliengo?: { init?: () => void }
    CliengoWidget?: { init?: () => void }
    _cliengo?: { init?: () => void }
  }
}

/** Returns true if the Cliengo widget is currently mounted in the DOM */
function isWidgetMounted(): boolean {
  return !!(
    document.querySelector('[id*="cliengo"]') ||
    document.querySelector('[class*="cliengo"]') ||
    document.querySelector('iframe[src*="cliengo"]')
  )
}

/** Attempt to call any public re-initialization API Cliengo may expose */
function tryReinit(): void {
  if (typeof window.cliengo?.init === 'function') {
    window.cliengo.init()
  } else if (typeof window.CliengoWidget?.init === 'function') {
    window.CliengoWidget.init()
  } else if (typeof window._cliengo?.init === 'function') {
    window._cliengo.init()
  }
}

export function CliengoScript() {
  const pathname = usePathname()
  const scriptInjected = useRef(false)

  useEffect(() => {
    // ── First load: inject the script tag once ────────────────────────────
    if (!scriptInjected.current) {
      scriptInjected.current = true

      // Skip if already in DOM (StrictMode double-invoke guard)
      if (!document.getElementById(CLIENGO_SCRIPT_ID)) {
        const script = document.createElement('script')
        script.id = CLIENGO_SCRIPT_ID
        script.src = CLIENGO_SRC
        script.async = true
        script.onload = () => {
          window.__cliengoLoaded = true
        }
        script.onerror = () => {
          console.warn(
            '[Cliengo] Script failed to load (404 or network error).\n' +
            'Verify the account is active at dash.cliengo.com and the embed URL is correct.'
          )
        }
        document.body.appendChild(script)
      }
      return
    }

    // ── SPA navigation: re-initialize if widget is missing ────────────────
    if (!window.__cliengoLoaded) return

    const timer = setTimeout(() => {
      if (!isWidgetMounted()) {
        tryReinit()
      }
    }, 600)

    return () => clearTimeout(timer)
  }, [pathname])

  return null
}
