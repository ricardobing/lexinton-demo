/**
 * POST /api/contact
 *
 * Recibe el formulario de contacto del sitio y crea un lead en Tokko CRM.
 * El lead aparece directamente en el panel del cliente.
 *
 * Body esperado:
 *   { propertyId, name, email, phone, message }
 *
 * Validación básica incluida — nunca confiar en datos del cliente.
 */

import { NextRequest, NextResponse } from 'next/server'
import { submitPropertyLead } from '@/lib/tokko/queries'

export const dynamic = 'force-dynamic'
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { propertyId, name, email, phone, message } = body

    // Validación básica
    if (!propertyId || !name || !email) {
      return NextResponse.json(
        { error: 'Campos requeridos: propertyId, name, email' },
        { status: 400 }
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }

    const result = await submitPropertyLead({
      property_id: parseInt(propertyId, 10),
      name: String(name).trim().slice(0, 100),
      email: String(email).trim().slice(0, 200),
      phone: String(phone ?? '').trim().slice(0, 50),
      message: String(message ?? '').trim().slice(0, 1000),
    })

    if (!result.success) {
      return NextResponse.json(
        { error: 'No se pudo enviar el mensaje. Intentá nuevamente.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API /contact] Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
