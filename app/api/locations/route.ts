/**
 * GET /api/locations
 * Devuelve los barrios de Capital Federal para poblar el buscador.
 * Cache de 1 hora.
 */

import { NextResponse } from 'next/server'
import { getPropertyLocations } from '@/lib/tokko/queries'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const locations = await getPropertyLocations()
    return NextResponse.json(locations ?? [], {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=120',
      },
    })
  } catch (error) {
    console.error('[API /locations] Error:', error)
    return NextResponse.json([], { status: 500 })
  }
}
