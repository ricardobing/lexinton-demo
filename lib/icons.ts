/**
 * lib/icons.ts — Pre-carga offline de íconos Iconify
 *
 * Evita fetches en runtime al CDN de Iconify.
 * Todos los íconos usados en el proyecto quedan bundleados con el JS.
 *
 * IMPORTANTE: Solo se puede llamar en contexto cliente (browser).
 * Usar desde un 'use client' component, nunca desde un Server Component.
 *
 * Sets incluidos:
 *   solar         — íconos UI principales (PropertyCard, Gallery, Nav, CTA, etc.)
 *   line-md       — íconos animados (/tasar ProcessSteps)
 *   logos         — logos de marcas (Google, WhatsApp, Meta, etc.)
 *   skill-icons   — Instagram, etc. (TrustStrip)
 */
import { addCollection } from '@iconify/react'
import solar from '@iconify-json/solar/icons.json'
import lineMd from '@iconify-json/line-md/icons.json'
import logos from '@iconify-json/logos/icons.json'
import skillIcons from '@iconify-json/skill-icons/icons.json'

export function loadIconCollections() {
  addCollection(solar as Parameters<typeof addCollection>[0])
  addCollection(lineMd as Parameters<typeof addCollection>[0])
  addCollection(logos as Parameters<typeof addCollection>[0])
  addCollection(skillIcons as Parameters<typeof addCollection>[0])
}

