/**
 * POST /api/leads
 *
 * Endpoint genérico para TODOS los formularios del sitio.
 * Crea un lead en Tokko CRM que aparece en el panel del cliente
 * bajo "Consultas" o "Leads" → sección correspondiente según el tag.
 *
 * ─────────────────────────────────────────────────────────────────────
 * ¿Cómo recibe el cliente los leads?
 * ─────────────────────────────────────────────────────────────────────
 * Los leads llegan AUTOMÁTICAMENTE al panel de Tokko Broker del cliente.
 * Para recibir notificaciones por email, el cliente debe configurarlo en:
 *   Panel Tokko → Configuración → Notificaciones → Email al recibir consulta web
 *
 * Los TAGS diferencian el origen del lead en el panel:
 *   - "Tasación"        → formulario de tasación
 *   - "Quiero Vender"   → formulario de venta urgente
 *   - "Inversores"      → formulario de inversores
 *   - "Emprendimientos" → formulario de emprendimientos
 *   - "Contacto"        → formulario de contacto general
 *   - "Home"            → formulario de la home
 *
 * Si el cliente quiere recibir también emails directos (fuera de Tokko),
 * se puede agregar integración con Resend o nodemailer — consultar si lo necesita.
 * ─────────────────────────────────────────────────────────────────────
 *
 * Body esperado:
 *   {
 *     nombre: string         (requerido)
 *     email: string          (requerido)
 *     telefono?: string
 *     mensaje?: string
 *     tipo?: string          → tag principal (ej: "Tasación")
 *     propiedad_id?: number  → ID de Tokko si es consulta sobre prop específica
 *     extra?: string         → info adicional (presupuesto, barrio, plazo, etc.)
 *   }
 */

import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const TOKKO_API_KEY = process.env.TOKKO_API_KEY

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nombre, email, telefono, mensaje, tipo, propiedad_id, extra } = body

    // Validación básica
    if (!nombre || !email) {
      return NextResponse.json(
        { error: 'Nombre y email son requeridos' },
        { status: 400 }
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }

    // Construir el mensaje completo
    const textParts = []
    if (mensaje) textParts.push(mensaje)
    if (extra) textParts.push(extra)
    if (tipo) textParts.push(`Origen: ${tipo}`)
    const text = textParts.join('\n') || tipo || 'Consulta desde la web'

    // Tags para identificar en el panel de Tokko
    const tags = tipo ? [tipo] : ['Contacto']

    // POST a Tokko web_contact
    // Docs: https://developers.tokkobroker.com/
    const tokkoBody: Record<string, unknown> = {
      name: String(nombre).trim().slice(0, 100),
      email: String(email).trim().slice(0, 200),
      phone: String(telefono ?? '').trim().slice(0, 50),
      text: text.slice(0, 1000),
      tags,
    }

    // Asociar a propiedad específica si se proveyó
    if (propiedad_id && !isNaN(Number(propiedad_id))) {
      tokkoBody.property = Number(propiedad_id)
    }

    const res = await fetch(
      `https://www.tokkobroker.com/api/v1/webcontact/?key=${TOKKO_API_KEY}&format=json`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tokkoBody),
      }
    )

    if (!res.ok) {
      console.error('[API /leads] Tokko error:', res.status, await res.text().catch(() => ''))
      return NextResponse.json(
        { error: 'No se pudo enviar. Intentá nuevamente.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API /leads] Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
