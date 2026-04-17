/**
 * Tokko Broker API — Tipos TypeScript basados en respuesta real de la API
 *
 * Base URL: https://www.tokkobroker.com/api/v1/
 * Endpoints explorados:
 *   GET /property/            → listado paginado (171 propiedades activas)
 *   GET /property/{id}/       → detalle individual con nested objects
 *   GET /property_type/       → 31 tipos (Apartment, House, Office, etc.)
 *   GET /location/            → barrios/zonas (272k entradas, filtrar por state)
 *   GET /development/         → emprendimientos (5 activos)
 *   POST /web_contact/        → envío de lead al CRM
 *
 * Notas clave:
 *   - Fotos: imagen directa desde static.tokkobroker.com (3 variantes: image, original, thumb)
 *   - Operaciones: "Sale" | "Rent" (en inglés en la API)
 *   - Precios: pueden ser USD o ARS, precio 0 = "Consultar"
 *   - geo_lat/geo_long: disponibles en la mayoría de propiedades
 *   - producer: agente asignado con foto y datos de contacto
 *   - expenses: en ARS
 */

// ─── Meta de paginación ──────────────────────────────────────────────────────

export interface TokkoMeta {
  limit: number
  next: string | null
  offset: number
  previous: string | null
  total_count: number
}

// ─── Listas paginadas ─────────────────────────────────────────────────────────

export interface TokkoPropertyListResponse {
  meta: TokkoMeta
  objects: TokkoProperty[]
}

export interface TokkoLocationListResponse {
  meta: TokkoMeta
  objects: TokkoLocation[]
}

export interface TokkoPropertyTypeListResponse {
  meta: TokkoMeta
  objects: TokkoPropertyType[]
}

export interface TokkoDevelopmentListResponse {
  meta: TokkoMeta
  objects: TokkoDevelopment[]
}

// ─── Propiedad ────────────────────────────────────────────────────────────────

export interface TokkoProperty {
  id: number
  reference_code: string          // e.g. "LAP19554"
  publication_title: string       // título editorial
  address: string                 // dirección aproximada pública
  fake_address: string            // alias/approximación si el dueño pidió ocultar
  real_address: string            // dirección exacta (solo backend)
  address_complement: string

  // Tipo y clasificación
  type: TokkoPropertyType | null
  property_condition: string      // "Excellent" | "Very good" | "Good" | "---"
  disposition: string             // "Front" | "Back" | "Side" | ""
  orientation: string             // "North" | "South" | "East" | "West" | ""
  floor: string
  floors_amount: number
  appartments_per_floor: number

  // Superficies (en m²)
  surface: number | null           // superficie principal (cubierta)
  roofed_surface: number | null    // m² cubiertos
  semiroofed_surface: number | null
  unroofed_surface: number | null  // descubiertos (balcón, patio)
  total_surface: number | null     // total real
  surface_measurement: string      // "M2"

  // Ambientes
  room_amount: number | null       // ambientes totales
  suite_amount: number | null      // dormitorios
  bathroom_amount: number | null   // baños
  toilet_amount: number | null     // toilettes
  parking_lot_amount: number | null // cocheras
  covered_parking_lot: number
  uncovered_parking_lot: number

  // Financiero
  expenses: number                 // en ARS, 0 si no aplica
  web_price: boolean               // si se muestra el precio públicamente
  credit_eligible: string          // "Eligible" | "Not specified" | "Not eligible"
  down_payment: number

  // Antigüedad
  age: number | null               // años de antigüedad, 0 = a estrenar

  // Ubicación
  location: TokkoLocation | null
  geo_lat: string | null           // "-34.5597..." (como string)
  geo_long: string | null          // "-58.4782..." (como string)
  gm_location_type: string         // "BY_HAND" | "ROOFTOP" | "APPROXIMATE"

  // Operaciones y precios
  operations: TokkoOperation[]     // una propiedad puede tener Venta Y Alquiler

  // Multimedia
  photos: TokkoPhoto[]
  videos: TokkoVideo[]
  files: TokkoFile[]

  // Amenities/características
  tags: TokkoTag[]
  custom_tags: TokkoCustomTag[]
  extra_attributes: TokkoExtraAttribute[]

  // Descripción
  description: string              // texto plano (puede incluir footer de la agencia)
  rich_description: string         // HTML con formato
  description_only: string         // HTML solo de la descripción
  footer: string                   // texto de pie de ficha
  seo_description: string
  seo_keywords: string

  // Desarrollo (si pertenece a un emprendimiento)
  development: TokkoDevelopment | null | string

  // Agente
  producer: TokkoProducer | null   // asesor asignado

  // Metadatos
  created_at: string               // ISO 8601
  deleted_at: string | null
  status: number                   // 2 = activa en web
  is_starred_on_web: boolean       // destacada
  is_denounced: boolean
  legally_checked: string
  public_url: string               // ficha.info URL
  situation: string                // "Empty" | "In use" | "---"

  // Otros
  dining_room: number
  living_amount: number
  tv_rooms: number
  guests_amount: number
  has_temporary_rent: boolean
  internal_data: string
}

// ─── Operación / Precio ───────────────────────────────────────────────────────

export interface TokkoOperation {
  operation_id: number
  operation_type: 'Sale' | 'Rent' | 'Temporary Rent'  // en inglés en la API
  prices: TokkoPrice[]
}

export interface TokkoPrice {
  currency: 'USD' | 'ARS' | 'EUR'
  price: number                    // 0 = "Consultar"
  period: number                   // 0 para venta; para alquiler: meses
  is_promotional: boolean
}

// ─── Foto ─────────────────────────────────────────────────────────────────────

export interface TokkoPhoto {
  description: string | null
  image: string                    // URL con marca de agua (uso en web)
  original: string                 // URL sin marca de agua
  thumb: string                    // miniatura
  is_front_cover: boolean          // foto principal
  is_blueprint: boolean            // plano/croquis
  order: number
}

// ─── Video ────────────────────────────────────────────────────────────────────

export interface TokkoVideo {
  id: number
  url: string
  provider: string
  title: string
}

// ─── Archivo ──────────────────────────────────────────────────────────────────

export interface TokkoFile {
  id: number
  url: string
  name: string
}

// ─── Etiquetas / Amenities ────────────────────────────────────────────────────

export interface TokkoTag {
  id: number
  name: string  // "Balcony", "Pool", "Garage", "Electricity", etc.
  type: number  // 1=servicios, 2=amenities internos, 9=extras
}

export interface TokkoCustomTag {
  id: number
  name: string
}

export interface TokkoExtraAttribute {
  id: number
  name: string
  value: string
}

// ─── Ubicación ────────────────────────────────────────────────────────────────

export interface TokkoLocation {
  id: number
  name: string                     // "Belgrano", "Palermo", etc.
  full_location: string            // "Argentina | Capital Federal | Belgrano "
  short_location: string           // mismo o "Capital Federal | Belgrano "
  parent_division: string | null   // URI del barrio padre si es sub-barrio
  divisions: TokkoLocationDivision[] | string
  state: string | null             // URI "/api/v1/state/146/"
  weight: number                   // popularidad (mayor = más relevante)
  zip_code: string | null
}

export interface TokkoLocationDivision {
  id: number
  name: string
  resource_uri: string
}

// ─── Tipo de propiedad ────────────────────────────────────────────────────────

export interface TokkoPropertyType {
  id: number
  code: string   // "AP", "HO", "PH", "OF", "LO", etc.
  name: string   // "Apartment", "House", "Condo", "Office", "Bussiness Premises"
}

// ─── Agente/Productor ─────────────────────────────────────────────────────────

export interface TokkoProducer {
  id: number
  name: string
  email: string
  phone: string
  cellphone: string
  picture: string    // URL a foto del asesor (puede ser el placeholder genérico)
  position: string
}

// ─── Emprendimiento ───────────────────────────────────────────────────────────

export interface TokkoDevelopment {
  id: number
  name: string
  address: string
  fake_address: string
  description: string
  publication_title: string
  reference_code: string
  location: TokkoLocation | null
  photos: TokkoPhoto[] | string
  tags: TokkoTag[] | string
  videos: string
  type: TokkoDevelopmentType
  construction_date: string
  construction_status: number
  display_on_web: boolean
  is_starred_on_web: boolean
  geo_lat: string | null
  geo_long: string | null
  users_in_charge: TokkoProducer | null
  web_url: string
  deleted_at: string | null
  resource_uri: string
}

export interface TokkoDevelopmentType {
  id: number
  code: string   // "BU" = Building, "OB" = Office Building
  name: string
}

// ─── Payload de lead/contacto ─────────────────────────────────────────────────

export interface TokkoLeadPayload {
  property_id: number
  name: string
  email: string
  phone: string
  message: string
  development_id?: number
}

// ─── Filtros de búsqueda (para el proxy interno) ──────────────────────────────

export interface PropertyFilters {
  operation?: 'Sale' | 'Rent'
  propertyType?: number            // ID del tipo (2=Apartment, 3=House, etc.)
  locationId?: number              // ID del barrio/zona
  minRooms?: number
  maxRooms?: number
  minPrice?: number
  maxPrice?: number
  currency?: 'USD' | 'ARS'
  limit?: number
  offset?: number
  orderBy?: 'price_asc' | 'price_desc' | 'newest' | 'oldest'
}
