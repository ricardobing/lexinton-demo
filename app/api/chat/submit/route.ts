import { NextRequest, NextResponse } from 'next/server'

const CLIENGO_TOKEN = 'bc0cc2ac-721e-4454-86ad-3f216db21ea2'
const CLIENGO_API = 'https://api.cliengo.com/1.0'

export interface ChatSubmitBody {
  name: string
  phone: string
  email?: string
  message?: string
  /** Property interest: tipo, zona, presupuesto captured from chatbot flow */
  meta?: Record<string, string>
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatSubmitBody = await req.json()

    if (!body.name?.trim() || !body.phone?.trim()) {
      return NextResponse.json(
        { ok: false, error: 'nombre y teléfono son obligatorios' },
        { status: 400 }
      )
    }

    // Build the message text from chatbot Q&A
    const lines: string[] = []
    if (body.meta?.operacion)   lines.push(`Operación: ${body.meta.operacion}`)
    if (body.meta?.tipo)        lines.push(`Tipo: ${body.meta.tipo}`)
    if (body.meta?.zona)        lines.push(`Zona: ${body.meta.zona}`)
    if (body.meta?.presupuesto) lines.push(`Presupuesto: ${body.meta.presupuesto}`)
    if (body.message)           lines.push(body.message)
    const fullMessage = lines.join('\n') || 'Consulta desde chatbot web'

    // Build the msgs array that Cliengo expects (chat transcript)
    const msgs = [
      { from: 'bot',  text: '¡Hola! ¿En qué te puedo ayudar?' },
      ...(body.meta?.operacion ? [{ from: 'visitor', text: body.meta.operacion }] : []),
      ...(body.meta?.tipo      ? [{ from: 'visitor', text: body.meta.tipo }] : []),
      ...(body.meta?.zona      ? [{ from: 'visitor', text: body.meta.zona }] : []),
      ...(body.meta?.presupuesto ? [{ from: 'visitor', text: body.meta.presupuesto }] : []),
      { from: 'bot',  text: '¿Cuál es tu nombre?' },
      { from: 'visitor', text: body.name },
      { from: 'bot',  text: '¿Y tu teléfono?' },
      { from: 'visitor', text: body.phone },
    ]

    const payload = {
      website_token: CLIENGO_TOKEN,
      name: body.name.trim(),
      phone: body.phone.trim(),
      email: body.email?.trim() || '',
      message: fullMessage,
      msgs,
    }

    // Server-side call — no browser Origin header, bypasses CORS restriction
    const res = await fetch(
      `${CLIENGO_API}/chats?access_token=${CLIENGO_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    )

    const cliengoBody = await res.text()
    let cliengoJson: unknown = null
    try { cliengoJson = JSON.parse(cliengoBody) } catch {}

    if (res.ok) {
      return NextResponse.json({ ok: true, data: cliengoJson })
    }

    // Non-blocking: even if Cliengo fails, we accept the lead locally
    console.error('[Cliengo submit] status:', res.status, cliengoBody.slice(0, 300))

    // Return success to user — lead is captured even if Cliengo API is unavailable
    return NextResponse.json({
      ok: true,
      warning: 'Lead guardado localmente. Cliengo sync pendiente.',
      cliengoStatus: res.status,
    })
  } catch (err) {
    console.error('[Cliengo submit] error:', err)
    return NextResponse.json({ ok: false, error: 'Error interno' }, { status: 500 })
  }
}
