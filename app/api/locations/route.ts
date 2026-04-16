/**
 * GET /api/locations
 * Devuelve los barrios de Capital Federal para poblar el buscador.
 * Cache de 1 hora.
 */

import { NextResponse } from 'next/server'
import { getLocations } from '@/lib/tokko/queries'

export async function GET() {
  try {
    const locations = await getLocations()
    return NextResponse.json(locations, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('[API /locations] Error:', error)
    return NextResponse.json([], { status: 500 })
  }
}
