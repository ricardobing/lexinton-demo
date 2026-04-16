/**
 * Sitemap dinámico para Lexinton Propiedades
 *
 * Incluye:
 * - Páginas estáticas principales
 * - Landings SEO
 * - Propiedades activas (hasta 100, ISR 1 hora)
 *
 * NO incluye:
 * - URLs con filtros (?operation=Sale, etc.) — están marcadas noindex
 * - /api/* — son route handlers, no páginas
 */

import type { MetadataRoute } from 'next'
import { getAllPropertyIds } from '@/lib/tokko/queries'
import { makePropertySlug } from '@/lib/tokko/utils'

const BASE_URL = 'https://lexinton.com.ar'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/propiedades`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Landings SEO — crear estas páginas en fases posteriores
    {
      url: `${BASE_URL}/inmobiliaria-en-palermo`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/tasacion-de-propiedades-en-palermo`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/vender-para-comprar`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/propiedades-en-palermo`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  // Propiedades activas desde Tokko
  let propertyPages: MetadataRoute.Sitemap = []
  try {
    const ids = await getAllPropertyIds()
    propertyPages = ids.map((id) => ({
      url: `${BASE_URL}/propiedades/${makePropertySlug(id, '')}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch {
    // Si la API falla, el sitemap se genera sin propiedades individuales
    console.warn('[Sitemap] No se pudieron obtener IDs de propiedades')
  }

  return [...staticPages, ...propertyPages]
}
