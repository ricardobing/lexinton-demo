/**
 * GET /api/properties
 *
 * Proxy server-side a Tokko API.
 * La API key NUNCA se expone al cliente — solo vive en el servidor.
 *
 * Query params soportados:
 *   operation  = Sale | Rent | Temporary Rent
 *   type       = número (ID del tipo de propiedad)
 *   location   = número (ID del barrio/zona)
 *   minRooms   = número
 *   maxRooms   = número
 *   minPrice   = número
 *   maxPrice   = número
 *   currency   = USD | ARS
 *   limit      = número (default: 24)
 *   offset     = número (default: 0)
 *   orderBy    = price_asc | price_desc | newest | oldest
 */

import { NextRequest, NextResponse } from 'next/server'
import { getProperties } from '@/lib/tokko/queries'
import type { PropertyFilters } from '@/lib/tokko/types'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl

    const filters: PropertyFilters = {}

    const operation = searchParams.get('operation')
    if (operation === 'Sale' || operation === 'Rent' || operation === 'Temporary Rent') {
      filters.operation = operation
    }

    const type = searchParams.get('type')
    if (type) filters.propertyType = parseInt(type, 10)

    const location = searchParams.get('location')
    if (location) filters.locationId = parseInt(location, 10)

    const minRooms = searchParams.get('minRooms')
    if (minRooms) filters.minRooms = parseInt(minRooms, 10)

    const maxRooms = searchParams.get('maxRooms')
    if (maxRooms) filters.maxRooms = parseInt(maxRooms, 10)

    const minPrice = searchParams.get('minPrice')
    if (minPrice) filters.minPrice = parseInt(minPrice, 10)

    const maxPrice = searchParams.get('maxPrice')
    if (maxPrice) filters.maxPrice = parseInt(maxPrice, 10)

    const currency = searchParams.get('currency')
    if (currency === 'USD' || currency === 'ARS') filters.currency = currency

    const limit = searchParams.get('limit')
    if (limit) filters.limit = parseInt(limit, 10)

    const offset = searchParams.get('offset')
    if (offset) filters.offset = parseInt(offset, 10)

    const orderBy = searchParams.get('orderBy')
    if (orderBy === 'price_asc' || orderBy === 'price_desc' || orderBy === 'newest' || orderBy === 'oldest') {
      filters.orderBy = orderBy
    }

    const { properties, total } = await getProperties(filters)

    return NextResponse.json({ properties, total }, {
      headers: {
        // Cache en Vercel Edge para 5 minutos
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    })
  } catch (error) {
    console.error('[API /properties] Error:', error)
    return NextResponse.json(
      { error: 'Error al obtener propiedades', properties: [], total: 0 },
      { status: 500 }
    )
  }
}
