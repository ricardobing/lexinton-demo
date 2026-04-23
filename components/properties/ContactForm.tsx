'use client'
/**
 * ContactForm — Formulario de contacto reutilizable.
 * Usado en ContactModal (popup) y en la sidebar de /propiedades/[id] y /emprendimientos/[id].
 */
import { useState } from 'react'
import { Icon } from '@iconify/react'
import type { TokkoProperty } from '@/lib/tokko/types'

interface Props {
  property: TokkoProperty
  onSuccess?: () => void
}

export function ContactForm({ property, onSuccess }: Props) {
  const address = property.fake_address || property.address || 'esta propiedad'
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: `¡Hola! Quiero que se comuniquen conmigo por esta propiedad en ${address} que vi en Lexinton Propiedades.`,
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async () => {
    if (!form.nombre || !form.email) return
    setSending(true)
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          telefono: form.telefono,
          mensaje: form.mensaje,
          tipo: 'Consulta de propiedad',
          propiedad_id: property.id,
        }),
      })
      setSent(true)
      onSuccess?.()
    } catch (e) {
      console.error(e)
    }
    setSending(false)
  }

  if (sent) {
    return (
      <div className="text-center py-8 px-6">
        <Icon icon="solar:check-circle-bold" className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">¡Consulta enviada!</p>
        <p className="text-sm text-gray-500">Te vamos a contactar en menos de 2 horas hábiles.</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <h3 className="text-lg font-medium text-gray-900">
          Contactate con Lexinton Propiedades
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          por la propiedad en {property.location?.name || 'Buenos Aires'}
        </p>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Nombre</label>
            <input
              type="text"
              placeholder="Tu nombre"
              value={form.nombre}
              onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg
                text-sm focus:border-gray-400 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Email</label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg
                text-sm focus:border-gray-400 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 block">Teléfono</label>
          <div className="flex gap-2">
            <div className="flex items-center gap-1 px-3 border border-gray-200
              rounded-lg text-sm text-gray-500 bg-gray-50 shrink-0">
              <span>🇦🇷</span>
              <span>+54</span>
            </div>
            <input
              type="tel"
              placeholder="11 1234-5678"
              value={form.telefono}
              onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg
                text-sm focus:border-gray-400 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 block">Mensaje</label>
          <textarea
            rows={3}
            value={form.mensaje}
            onChange={e => setForm(f => ({ ...f, mensaje: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg
              text-sm focus:border-gray-400 focus:outline-none transition-colors resize-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={sending || !form.nombre || !form.email}
          className="w-full h-12 bg-[#EF6C00] text-white rounded-xl
            text-sm font-medium flex items-center justify-center gap-2
            hover:bg-[#E65100] transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? 'Enviando...' : (
            <>
              Contactar
              <Icon icon="solar:letter-bold" className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
