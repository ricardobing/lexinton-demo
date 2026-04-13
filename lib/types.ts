export type OperationType = 'Venta' | 'Alquiler' | 'Alquiler Temporal' | 'Emprendimiento'

export type Currency = 'ARS' | 'USD'

export interface Property {
  id: string
  title: string
  address: string
  neighborhood: string
  city: string
  operation: OperationType
  currency: Currency
  price: number
  /** Formatted price string ready to display */
  priceLabel: string
  bedrooms?: number
  bathrooms?: number
  garage?: boolean
  surface: number
  image: string
  slug: string
}

export interface Testimonial {
  id: string
  name: string
  text: string
  source: 'Google' | 'Facebook' | 'Zonaprop'
  rating: number
}

export interface StatItem {
  value: string
  label: string
}
