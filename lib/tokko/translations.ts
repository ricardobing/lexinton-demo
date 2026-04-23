/**
 * lib/tokko/translations.ts
 *
 * Diccionarios de traducción para todos los valores devueltos por la API de Tokko.
 * Generado tras auditoría de 50 propiedades + 20 emprendimientos (abril 2025).
 *
 * Uso:
 *   import { translate, TAG_TRANSLATIONS, CONDITION_TRANSLATIONS } from '@/lib/tokko/translations'
 *   translate(tag.name, TAG_TRANSLATIONS)  // → 'Gas natural' o el original si no hay entrada
 */

// ─── Tags / Amenities ────────────────────────────────────────────────────────

export const TAG_TRANSLATIONS: Record<string, string> = {
  // Servicios básicos
  'Water': 'Agua',
  'Sewage': 'Cloacas',
  'Electricity': 'Luz eléctrica',
  'Gas': 'Gas',
  'Natural Gas': 'Gas natural',
  'Pavement': 'Pavimento',
  'Public lighting': 'Iluminación pública',
  'Public Lighting': 'Iluminación pública',

  // Ascensores / circulación
  'Lift': 'Ascensor',
  'Elevator': 'Ascensor',
  'Service Lift': 'Montacargas',
  'Cargo lift': 'Montacargas',

  // Espacios exteriores
  'Balcony': 'Balcón',
  'Balcony terrace': 'Terraza balcón',
  'Terrace': 'Terraza',
  'Garden': 'Jardín',
  'Backyard': 'Patio',
  'Deck': 'Deck',
  'Solarium': 'Solarium',
  'Gallery': 'Galería',

  // Piscina / wellness
  'Pool': 'Piscina',
  'Heated Pool': 'Piscina climatizada',
  'Jacuzzi': 'Jacuzzi',
  'Sauna': 'Sauna',
  'Scottish shower': 'Ducha escocesa',

  // Deportes / recreación
  'Gym': 'Gimnasio',
  "Children's game room": 'Sala de juegos infantil',
  'Game room': 'Sala de juegos',
  'Mini-cinema': 'Microcine',
  'Playroom': 'Sala de juegos',

  // Social / SUM
  'SUM': 'SUM',
  'SUM/Salón': 'SUM',
  'Dining lounge': 'Salón comedor',
  'Diary dining': 'Comedor diario',
  'Restaurant': 'Restaurante',
  'Barbecue': 'Parrilla',
  'Barbecue area': 'Área de parrilla',
  'Communal BBQ Area': 'Parrilla común',

  // Cochera / estacionamiento
  'Garage': 'Cochera',
  'Fixed garage': 'Cochera fija',
  'Courtesy garage': 'Cochera de cortesía',
  'Optional parking': 'Cochera opcional',
  'Parking': 'Estacionamiento',
  'Parking space': 'Lugar de estacionamiento',

  // Lavadero
  'Laundry': 'Lavadero privado',
  'Public Laundry': 'Lavadero común',

  // Calefacción / agua caliente
  'Heating': 'Calefacción',
  'Central Heating': 'Calefacción central',
  'Air Heating': 'Calefacción por aire',
  'Individual heating': 'Calefacción individual',
  'Floor Heating': 'Piso radiante',
  'General radiant floor heating': 'Piso radiante general',
  'Central boiler': 'Caldera central',
  'Individual boiler': 'Caldera individual',
  'Heater': 'Calefactor',
  'Central Water Heating': 'Calentador de agua central',
  'Individual hot water': 'Agua caliente individual',
  'Individual hot water tank': 'Termotanque individual',
  'Hot water by electricity': 'Agua caliente eléctrica',
  'Hot water by gas': 'Agua caliente a gas',

  // Aire acondicionado
  'Individual Air conditioner': 'Aire acondicionado individual',
  'central air conditioning': 'Aire acondicionado central',
  'Air Conditioning': 'Aire acondicionado',
  'Pre-installed Air-Conditioning': 'Pre-instalación de AC',

  // Seguridad
  '24 Hour Security': 'Seguridad 24 hs',
  'Night security': 'Seguridad nocturna',
  'Private Security Company': 'Seguridad privada',
  'Video Cameras': 'Cámaras de seguridad',
  'Access control': 'Control de acceso',
  'Reinforced door': 'Puerta blindada',
  'Alarm': 'Alarma',
  'Safe Box': 'Caja fuerte',
  'Security': 'Seguridad',
  'Superintendent': 'Encargado',

  // Luminosidad / características edilicias
  'Luminous': 'Luminoso',
  'Free perimeter building': 'Edificio de perímetro libre',
  'Semi-floor': 'Semipiso',
  'Independent Studio': 'Monoambiente independiente',
  'Private hallway': 'Pasillo privado',
  'Hall': 'Hall',
  'Toilette': 'Toilette',
  'Dresser': 'Vestidor',
  'Kitchen': 'Cocina',
  'Kitchenette': 'Kitchenette',

  // Dependencias
  'Dependency': 'Dependencia de servicio',
  'Service entrance': 'Entrada de servicio',
  'Service bathroom': 'Baño de servicio',
  'Storage room': 'Baulera',
  'Storage': 'Depósito',

  // Pisos / terminaciones
  'Wood Flooring': 'Pisos de madera',
  'Fireplace': 'Chimenea',
  'Furniture': 'Amoblado',

  // Usos permitidos
  'Work able': 'Apto profesional',
  'Commercial able': 'Apto comercial',
  'Office': 'Oficina',

  // Mascotas
  'Pets allowed': 'Acepta mascotas',
  'Pets Allowed': 'Acepta mascotas',

  // Misc
  'Generator': 'Grupo electrógeno',
  'Accessibility With Reduced Mobility': 'Acceso para movilidad reducida',
  'Immediate deed': 'Escritura inmediata',
  'Brand new': 'A estrenar',

  // Emprendimientos adicionales
  'Aluminium Carpentry': 'Carpintería de aluminio',
  'Amenities': 'Amenities',
  'Automatic garage door': 'Portón automático',
  'Cable': 'Cable',
  'Double Glazing': 'Doble vidrio',
  'Double glazing windows': 'Ventanas de doble vidrio',
  'Gas Storage': 'Depósito de gas',
  'Good Rental Potential': 'Buen potencial de alquiler',
  'Industrial power': 'Energía trifásica',
  'Newly Built': 'Recién construido',
  'Phone': 'Teléfono',
  'Trifasic energy': 'Energía trifásica',
}

// ─── Condición / Estado ───────────────────────────────────────────────────────

export const CONDITION_TRANSLATIONS: Record<string, string> = {
  'Excellent': 'Excelente',
  'Very good': 'Muy bueno',
  'Good': 'Bueno',
  'Regular': 'Regular',
  'Poor': 'Malo',
  'To refurbish': 'A reciclar',
  'For renovation': 'A renovar',
  'New': 'A estrenar',
  'Brand new': 'A estrenar',
  'Used': 'Usado',
  'Under construction': 'En construcción',
  '---': '',
}

// ─── Tipo de propiedad ───────────────────────────────────────────────────────

export const PROPERTY_TYPE_TRANSLATIONS: Record<string, string> = {
  'Apartment': 'Departamento',
  'Department': 'Departamento',
  'House': 'Casa',
  'Condo': 'PH',
  'PH': 'PH',
  'Office': 'Oficina',
  'Bussiness Premises': 'Local comercial',
  'Business Premises': 'Local comercial',
  'Store': 'Local comercial',
  'Land': 'Terreno',
  'Garage': 'Cochera',
  'Commercial Building': 'Edificio comercial',
  'Building': 'Edificio',
  'Storage': 'Depósito',
  'Storage room': 'Baulera',
  'Warehouse': 'Depósito',
  'Industrial Ship': 'Galpón',
  'Hotel': 'Hotel',
  'Farm': 'Granja',
  'Ranch': 'Campo',
  'Countryside': 'Country',
  'Weekend House': 'Quinta',
}

// ─── Operación ────────────────────────────────────────────────────────────────

export const OPERATION_TRANSLATIONS: Record<string, string> = {
  'Sale': 'Venta',
  'Rent': 'Alquiler',
  'Temporary rent': 'Alquiler temporal',
  'Temporary Rent': 'Alquiler temporal',
  // Por si viene en español
  'Venta': 'Venta',
  'Alquiler': 'Alquiler',
  'Alquiler temporal': 'Alquiler temporal',
}

// ─── Estado de emprendimientos ────────────────────────────────────────────────

export const DEVELOPMENT_STATUS_TRANSLATIONS: Record<number, string> = {
  // Valores encontrados en la API: 4 = En construcción, 6 = Terminado
  // Mapa completo según documentación Tokko:
  1: 'En proyecto',
  2: 'Preventa',
  3: 'Pozo',
  4: 'En construcción',
  5: 'Próximo a entregar',
  6: 'Terminado',
}

// ─── Función helper ───────────────────────────────────────────────────────────

/**
 * Traduce un string usando un diccionario.
 * Intenta primero con el valor original, luego con lowercase.
 * Si no encuentra traducción, devuelve el valor original.
 *
 * @example translate('Natural Gas', TAG_TRANSLATIONS) → 'Gas natural'
 * @example translate('XYZ Unknown', TAG_TRANSLATIONS) → 'XYZ Unknown'
 */
export function translate(
  value: string | null | undefined,
  dict: Record<string, string>
): string {
  if (!value) return ''
  return dict[value] ?? dict[value.toLowerCase()] ?? value
}
