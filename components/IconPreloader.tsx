'use client'
/**
 * IconPreloader — Pre-carga los sets de íconos Iconify en el cliente.
 *
 * Evita fetches en runtime al CDN de Iconify: los íconos quedan bundleados.
 * Se renderiza como null — solo efecto de registro de las colecciones.
 */
import { useEffect } from 'react'
import { loadIconCollections } from '@/lib/icons'

let loaded = false

export function IconPreloader() {
  useEffect(() => {
    if (!loaded) {
      loaded = true
      loadIconCollections()
    }
  }, [])

  return null
}
