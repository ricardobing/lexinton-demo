/**
 * GET /api/properties/[id]
 *
 * Proxy server-side para el detalle de una propiedad.
 * Acepta tanto el ID numérico como el slug completo (extrae el ID).
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPropertyById } from '@/lib/tokko/queries'
import { parseSlugId } from '@/lib/tokko/utils'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    let propertyId: number

    // El ID puede venir como número puro o como slug "19554-tamborini-jose"
    const raw = params.id
    if (/^\d+$/.test(raw)) {
      propertyId = parseInt(raw, 10)
    } else {
      propertyId = parseSlugId(raw)
    }

    const property = await getPropertyById(propertyId)

    return NextResponse.json(property, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    })
  } catch (error) {
    console.error(`[API /properties/${params.id}] Error:`, error)
    return NextResponse.json(
      { error: 'Propiedad no encontrada' },
      { status: 404 }
    )
  }
}
