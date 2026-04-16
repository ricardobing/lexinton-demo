/**
 * Tokko Broker API — Queries reutilizables
 *
 * Todas las funciones son server-side (importan tokkoFetch que usa la API key).
 * Usar solo desde Server Components, Route Handlers o getStaticProps/generateStaticParams.
 *
 * Endpoints utilizados:
 *   GET /property/            → listado (params: limit, offset, lang)
 *   GET /property/{id}/       → detalle individual
 *   GET /property_type/       → tipos de propiedad (cache largo)
 *   GET /location/            → barrios/zonas (cache largo)
 *   GET /development/         → emprendimientos
 *   POST /web_contact/        → envío de lead al CRM
 *
 * Nota sobre filtros de la API:
 *   La API de Tokko no filtra correctamente por operation_type en el listado.
 *   El filtro se hace post-fetch en el lado del servidor de Next.js.
 *   Para listas grandes, implementar paginación en el cliente.
 */

import { tokkoFetch, tokkoPost } from './client'
import type {
  TokkoProperty,
  TokkoPropertyListResponse,
  TokkoPropertyTypeListResponse,
  TokkoLocationListResponse,
  TokkoDevelopmentListResponse,
  PropertyFilters,
  TokkoLeadPayload,
} from './types'

// ─── Constantes ──────────────────────────────────────────────────────────────

/** ID del estado Capital Federal en la API de Tokko */
const CABA_STATE_ID = 146

/** Máximo de propiedades por request (límite de Tokko: ≤ 100 recomendado) */
const DEFAULT_LIMIT = 24

// ─── Propiedades ─────────────────────────────────────────────────────────────

/**
 * Obtiene el listado de propiedades con filtros aplicados server-side.
 *
 * La API de Tokko devuelve 171 propiedades.
 * Filtros de operación, tipo y precio se aplican post-fetch.
 */
export async function getProperties(
  filters: PropertyFilters = {},
  revalidate = 300
): Promise<{ properties: TokkoProperty[]; total: number }> {
  const {
    operation,
    propertyType,
    locationId,
    minRooms,
    maxRooms,
    minPrice,
    maxPrice,
    currency,
    limit = DEFAULT_LIMIT,
    offset = 0,
    orderBy = 'newest',
  } = filters

  // Params que la API acepta nativamente
  const apiParams: Record<string, string | number | boolean> = {}

  if (locationId) {
    apiParams['current_localization_id'] = locationId
    apiParams['current_localization_type'] = 'location'
  }

  // Para ordenamiento que la API soporta
  if (orderBy === 'newest') {
    apiParams['order_by'] = '-created_at'
  } else if (orderBy === 'oldest') {
    apiParams['order_by'] = 'created_at'
  } else if (orderBy === 'price_asc') {
    apiParams['order_by'] = 'price'
  } else if (orderBy === 'price_desc') {
    apiParams['order_by'] = '-price'
  }

  // Traer todas para filtrar (la API no filtra bien por operación)
  // Si hay filtros que reducen mucho, traer más del servidor
  const fetchLimit = operation || propertyType || minRooms || minPrice ? 100 : limit
  const fetchOffset = operation || propertyType ? 0 : offset

  const response = await tokkoFetch<TokkoPropertyListResponse>(
    'property',
    { limit: fetchLimit, offset: fetchOffset, ...apiParams },
    revalidate
  )

  let filtered = response.objects

  // Filtro por operación (Sale, Rent, Temporary Rent)
  if (operation) {
    filtered = filtered.filter((p) => {
      const ops = Array.isArray(p.operations) ? p.operations : [p.operations]
      return ops.some((op) => op && op.operation_type === operation)
    })
  }

  // Filtro por tipo de propiedad
  if (propertyType) {
    filtered = filtered.filter((p) => p.type?.id === propertyType)
  }

  // Filtro por ambientes
  if (minRooms !== undefined) {
    filtered = filtered.filter((p) => (p.room_amount ?? 0) >= minRooms)
  }
  if (maxRooms !== undefined) {
    filtered = filtered.filter((p) => (p.room_amount ?? 0) <= maxRooms)
  }

  // Filtro por precio
  if (minPrice !== undefined || maxPrice !== undefined) {
    filtered = filtered.filter((p) => {
      const ops = Array.isArray(p.operations) ? p.operations : [p.operations]
      return ops.some((op) => {
        if (!op) return false
        return op.prices?.some((pr) => {
          if (currency && pr.currency !== currency) return false
          if (minPrice && pr.price < minPrice) return false
          if (maxPrice && pr.price > maxPrice) return false
          return true
        })
      })
    })
  }

  const total = filtered.length

  // Paginación del resultado filtrado
  const paginated = filtered.slice(offset, offset + limit)

  return { properties: paginated, total }
}

/**
 * Obtiene el detalle completo de una propiedad por ID.
 */
export async function getPropertyById(id: number, revalidate = 300): Promise<TokkoProperty> {
  return tokkoFetch<TokkoProperty>(`property/${id}`, {}, revalidate)
}

/**
 * Obtiene propiedades destacadas para la home.
 * Si no hay propiedades con is_starred_on_web, toma las más recientes.
 */
export async function getFeaturedProperties(limit = 6): Promise<TokkoProperty[]> {
  const response = await tokkoFetch<TokkoPropertyListResponse>(
    'property',
    { limit: 50, order_by: '-created_at' },
    300
  )

  const starred = response.objects.filter((p) => p.is_starred_on_web)

  if (starred.length >= limit) {
    return starred.slice(0, limit)
  }

  // Complementar con las más recientes si no hay suficientes destacadas
  const rest = response.objects.filter((p) => !p.is_starred_on_web)
  return [...starred, ...rest].slice(0, limit)
}

/**
 * Obtiene propiedades similares a una dada (misma ubicación o tipo).
 */
export async function getSimilarProperties(
  property: TokkoProperty,
  limit = 3
): Promise<TokkoProperty[]> {
  const locationId = property.location?.id

  const params: Record<string, string | number | boolean> = {
    limit: 10,
    order_by: '-created_at',
  }

  if (locationId) {
    params['current_localization_id'] = locationId
    params['current_localization_type'] = 'location'
  }

  const response = await tokkoFetch<TokkoPropertyListResponse>('property', params, 300)

  return response.objects
    .filter((p) => p.id !== property.id)
    .slice(0, limit)
}

/**
 * Obtiene los IDs de propiedades para generateStaticParams.
 * Trae todas las propiedades para pre-renderizar las más visitadas.
 */
export async function getAllPropertyIds(): Promise<number[]> {
  const response = await tokkoFetch<TokkoPropertyListResponse>(
    'property',
    { limit: 100 },
    3600 // cache 1 hora
  )
  return response.objects.map((p) => p.id)
}

// ─── Tipos de propiedad ───────────────────────────────────────────────────────

/**
 * Obtiene todos los tipos de propiedad (cache de 1 hora — cambian raramente).
 */
export async function getPropertyTypes() {
  const response = await tokkoFetch<TokkoPropertyTypeListResponse>(
    'property_type',
    { limit: 50 },
    3600
  )
  return response.objects
}

// ─── Ubicaciones ─────────────────────────────────────────────────────────────

/**
 * Obtiene los barrios de Capital Federal filtrados por estado.
 * Cache largo (1 hora) porque cambian muy poco.
 */
export async function getLocations(stateId = CABA_STATE_ID) {
  // Tokko tiene 272k locations globales — filtramos por estado
  const response = await tokkoFetch<TokkoLocationListResponse>(
    'location',
    {
      limit: 100,
      state: stateId,
      order_by: '-weight', // los más populares primero
    },
    3600
  )
  return response.objects
}

// ─── Emprendimientos ──────────────────────────────────────────────────────────

/**
 * Obtiene los emprendimientos activos (5 en la cuenta de Lexinton).
 */
export async function getDevelopments() {
  const response = await tokkoFetch<TokkoDevelopmentListResponse>(
    'development',
    { limit: 20 },
    300
  )
  return response.objects.filter((d) => d.display_on_web)
}

// ─── Leads / Contacto ─────────────────────────────────────────────────────────

/**
 * Envía un lead al CRM de Tokko.
 * Aparece directamente en el panel de Tokko del cliente.
 *
 * POST /api/v1/web_contact/
 * Body: { property: ID, name, email, phone, text }
 */
export async function submitPropertyLead(data: TokkoLeadPayload): Promise<{ success: boolean }> {
  try {
    await tokkoPost('web_contact', {
      property: data.property_id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      text: data.message,
      ...(data.development_id ? { development: data.development_id } : {}),
    })
    return { success: true }
  } catch (error) {
    console.error('[Tokko] Error enviando lead:', error)
    return { success: false }
  }
}
