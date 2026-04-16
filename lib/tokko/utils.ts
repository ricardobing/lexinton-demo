/**
 * Tokko Broker API — Utilidades y helpers
 *
 * Todas las funciones son puras (sin side effects) y pueden usarse
 * tanto en Server Components como en Client Components.
 */

import type { TokkoProperty, TokkoOperation, TokkoPhoto, TokkoTag, TokkoLocation } from './types'

// ─── Traducciones ────────────────────────────────────────────────────────────

/** Traducción de operation_type (API en inglés) → español para mostrar */
export const OPERATION_LABELS: Record<string, string> = {
  Sale: 'Venta',
  Rent: 'Alquiler',
  'Temporary Rent': 'Alquiler Temporal',
}

/** Traducción de property type name (API en inglés) → español */
export const PROPERTY_TYPE_LABELS: Record<string, string> = {
  Apartment: 'Departamento',
  House: 'Casa',
  Condo: 'PH',
  Office: 'Oficina',
  'Bussiness Premises': 'Local',
  Land: 'Terreno',
  Garage: 'Cochera',
  'Industrial Ship': 'Galpón',
  'Commercial Building': 'Edificio',
  Storage: 'Depósito',
  'Storage room': 'Baulera',
  Hotel: 'Hotel',
  Farm: 'Granja',
  Ranch: 'Campo',
  Countryside: 'Country',
  'Weekend House': 'Quinta',
}

/** Traducción de property_condition → español */
export const CONDITION_LABELS: Record<string, string> = {
  Excellent: 'Excelente',
  'Very good': 'Muy bueno',
  Good: 'Bueno',
  Regular: 'Regular',
  Poor: 'Malo',
  '---': '',
}

/** Traducción de credit_eligible → etiqueta */
export const CREDIT_LABELS: Record<string, string> = {
  Eligible: 'Apto crédito',
  'Not eligible': 'No apto crédito',
  'Not specified': '',
}

// ─── Precios ─────────────────────────────────────────────────────────────────

/**
 * Formatea un precio para mostrar en pantalla.
 * Si price === 0, devuelve "Consultar".
 *
 * @example formatPrice(92000, 'USD') → "USD 92.000"
 * @example formatPrice(1500000, 'ARS') → "$ 1.500.000"
 * @example formatPrice(0, 'USD') → "Consultar"
 */
export function formatPrice(price: number | string | null | undefined, currency: string): string {
  const num = typeof price === 'string' ? parseFloat(price) : (price ?? 0)
  if (!num || isNaN(num) || num === 0) return 'Consultar'

  const formatted = new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)

  if (currency === 'USD') return `USD ${formatted}`
  if (currency === 'ARS') return `$ ${formatted}`
  if (currency === 'EUR') return `€ ${formatted}`
  return `${currency} ${formatted}`
}

/**
 * Formatea gastos de expensas.
 * @example formatExpenses(150000) → "$ 150.000/mes"
 */
export function formatExpenses(expenses: number | string | null | undefined): string {
  const num = typeof expenses === 'string' ? parseFloat(expenses) : (expenses ?? 0)
  if (!num || isNaN(num) || num === 0) return ''
  return `$ ${new Intl.NumberFormat('es-AR').format(num)}/mes`
}

// ─── Superficies ──────────────────────────────────────────────────────────────

/**
 * Formatea área en m².
 * @example formatArea(73.5) → "73,5 m²"
 * @example formatArea(73) → "73 m²"
 */
export function formatArea(area: number | string | null | undefined): string {
  const num = typeof area === 'string' ? parseFloat(area) : (area ?? 0)
  if (!num || isNaN(num)) return ''
  const formatted = num % 1 === 0 ? num.toString() : num.toFixed(1)
  return `${formatted} m²`
}

// ─── Extracción de datos de propiedad ─────────────────────────────────────────

/**
 * Extrae la operación principal de una propiedad.
 * Prioriza Venta > Alquiler > Temporal.
 */
export function getPrimaryOperation(property: TokkoProperty): TokkoOperation | null {
  if (!property.operations || !Array.isArray(property.operations)) {
    // La API puede devolver un objeto en vez de array en algunos endpoints
    const op = property.operations as unknown as TokkoOperation
    if (op && op.operation_type) return op
    return null
  }
  if (property.operations.length === 0) return null

  const priority = ['Sale', 'Rent', 'Temporary Rent']
  const sorted = [...property.operations].sort(
    (a, b) => priority.indexOf(a.operation_type) - priority.indexOf(b.operation_type)
  )
  return sorted[0]
}

/**
 * Extrae el precio principal de una operación.
 * Prioriza USD > ARS > EUR.
 */
export function getPrimaryPrice(operation: TokkoOperation): { price: number; currency: string } | null {
  if (!operation.prices || operation.prices.length === 0) return null

  const priorityCurrency = ['USD', 'ARS', 'EUR']
  const sorted = [...operation.prices].sort(
    (a, b) => priorityCurrency.indexOf(a.currency) - priorityCurrency.indexOf(b.currency)
  )
  return { price: sorted[0].price, currency: sorted[0].currency }
}

/**
 * Obtiene el string de precio formateado listo para mostrar.
 * @example "USD 92.000" | "$ 1.500.000/mes" | "Consultar"
 */
export function getPropertyPriceLabel(property: TokkoProperty): string {
  const op = getPrimaryOperation(property)
  if (!op) return 'Consultar'
  const priceData = getPrimaryPrice(op)
  if (!priceData) return 'Consultar'

  const label = formatPrice(priceData.price, priceData.currency)

  // Agregar "/mes" para alquileres
  if (op.operation_type === 'Rent' && priceData.price > 0) return `${label}/mes`
  if (op.operation_type === 'Temporary Rent' && priceData.price > 0) return `${label}/mes`

  return label
}

/**
 * Obtiene la etiqueta de operación en español.
 * @example "Venta" | "Alquiler" | "Alquiler Temporal"
 */
export function getOperationLabel(property: TokkoProperty): string {
  const op = getPrimaryOperation(property)
  if (!op) return ''
  return OPERATION_LABELS[op.operation_type] ?? op.operation_type
}

// ─── Fotos ────────────────────────────────────────────────────────────────────

/**
 * Obtiene la foto de portada (is_front_cover: true) o la primera foto.
 * Retorna la URL de la imagen watermarked (apta para web).
 */
export function getCoverPhoto(property: TokkoProperty): string {
  if (!property.photos || property.photos.length === 0) {
    return '/placeholder-property.jpg'
  }

  const sorted = [...property.photos].sort((a, b) => a.order - b.order)
  const cover = sorted.find((p) => p.is_front_cover) ?? sorted[0]
  return cover.image  // URL con watermark de Lexinton
}

/**
 * Obtiene todas las fotos ordenadas (portada primero, planos al final).
 */
export function getSortedPhotos(property: TokkoProperty): TokkoPhoto[] {
  if (!property.photos || property.photos.length === 0) return []

  return [...property.photos].sort((a, b) => {
    // Planos siempre al final
    if (a.is_blueprint && !b.is_blueprint) return 1
    if (!a.is_blueprint && b.is_blueprint) return -1
    // Portada primero
    if (a.is_front_cover && !b.is_front_cover) return -1
    if (!a.is_front_cover && b.is_front_cover) return 1
    return a.order - b.order
  })
}

// ─── Ubicación ────────────────────────────────────────────────────────────────

/**
 * Extrae el nombre del barrio desde el location object.
 * Ejemplo: "Belgrano", "Palermo"
 */
export function getNeighborhood(property: TokkoProperty): string {
  if (!property.location || typeof property.location === 'string') return ''
  return property.location.name ?? ''
}

/**
 * Extrae solo la ciudad/zona (sin el barrio específico).
 * Ejemplo: "Capital Federal", "Saavedra"
 */
export function getCity(property: TokkoProperty): string {
  if (!property.location || typeof property.location === 'string') return ''
  const parts = property.location.full_location?.split('|') ?? []
  return parts[1]?.trim() ?? 'Buenos Aires'
}

// ─── Amenities / Tags ─────────────────────────────────────────────────────────

/**
 * Mapeo de nombres de tags en inglés → etiquetas en español para mostrar
 */
export const TAG_LABELS: Record<string, string> = {
  // Servicios (type: 1)
  Water: 'Agua',
  Sewage: 'Cloacas',
  Electricity: 'Luz',
  Gas: 'Gas',
  Pavement: 'Pavimento',
  // Amenities internos (type: 2)
  Balcony: 'Balcón',
  Terrace: 'Terraza',
  Garden: 'Jardín',
  Pool: 'Piscina',
  Gym: 'Gimnasio',
  'Storage room': 'Baulera',
  Laundry: 'Lavadero',
  Fireplace: 'Chimenea',
  'Air conditioning': 'Aire acondicionado',
  Heating: 'Calefacción',
  Elevator: 'Ascensor',
  Security: 'Seguridad',
  Barbecue: 'Parrilla',
  'SUM/Salón': 'SUM',
  Parking: 'Cochera',
  Garage: 'Garage',
  // Extras (type: 9)
  'Immediate deed': 'Escritura inmediata',
  'Brand new': 'A estrenar',
}

/**
 * Filtra tags que valen la pena mostrar al usuario (excluye servicios básicos).
 * Devuelve máximo N tags.
 */
export function getDisplayTags(tags: TokkoTag[], max = 8): TokkoTag[] {
  // Excluir servicios básicos de infraestructura urbana (type: 1)
  const EXCLUDED_TAG_IDS = [1, 2, 5, 6, 7] // Water, Sewage, Electricity, Pavement, Gas
  return tags
    .filter((t) => !EXCLUDED_TAG_IDS.includes(t.id))
    .slice(0, max)
}

// ─── Slug ─────────────────────────────────────────────────────────────────────

/**
 * Genera un slug para la URL de la propiedad.
 * Formato: {id}-{direccion-kebab}
 *
 * @example slugify(19554, "TAMBORINI JOSE P. 3700") → "19554-tamborini-jose-p-3700"
 */
export function makePropertySlug(id: number, address: string): string {
  const addressSlug = address
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // quitar acentos
    .replace(/[^a-z0-9\s-]/g, '')     // solo alfanumérico y guiones
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60)
  return `${id}-${addressSlug}`
}

/**
 * Extrae el ID numérico de un slug.
 * @example parseSlugId("19554-tamborini-jose") → 19554
 */
export function parseSlugId(slug: string): number {
  const id = parseInt(slug.split('-')[0], 10)
  if (isNaN(id)) throw new Error(`Slug inválido: ${slug}`)
  return id
}

// ─── Tipo ─────────────────────────────────────────────────────────────────────

/**
 * Traduce el nombre del tipo de propiedad al español.
 */
export function getPropertyTypeLabel(property: TokkoProperty): string {
  if (!property.type) return ''
  return PROPERTY_TYPE_LABELS[property.type.name] ?? property.type.name
}

// ─── Descripción ──────────────────────────────────────────────────────────────

/**
 * Limpia la descripción: remueve el "footer" repetitivo de la agencia
 * que aparece en TODAS las propiedades (WhatsApp, matrícula, etc.)
 */
export function cleanDescription(description: string): string {
  if (!description) return ''

  // El footer empieza siempre con "Consulta por esta propiedad AHORA."
  const footerMarker = 'Consulta por esta propiedad AHORA.'
  const idx = description.indexOf(footerMarker)
  if (idx > -1) {
    return description.slice(0, idx).trim()
  }
  return description.trim()
}

/**
 * Obtiene los primeros N caracteres de la descripción limpia.
 */
export function getDescriptionExcerpt(property: TokkoProperty, maxLength = 120): string {
  const clean = cleanDescription(property.description)
  if (clean.length <= maxLength) return clean
  return clean.slice(0, maxLength).trim() + '…'
}

// ─── Antigüedad ───────────────────────────────────────────────────────────────

/**
 * Formatea la antigüedad de manera legible.
 */
export function formatAge(age: number | null): string {
  if (age === null || age === undefined) return ''
  if (age === 0) return 'A estrenar'
  if (age === 1) return '1 año'
  return `${age} años`
}

// ─── Coordenadas ─────────────────────────────────────────────────────────────

/**
 * Extrae coordenadas válidas de una propiedad.
 * Tokko las devuelve como strings, pueden estar vacías o en formato incorrecto.
 */
export function getCoordinates(property: TokkoProperty): { lat: number; lng: number } | null {
  const lat = parseFloat(property.geo_lat ?? '')
  const lng = parseFloat(property.geo_long ?? '')
  if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) return null
  return { lat, lng }
}
