'use client'

/**
 * PropertyContact — Formulario de contacto de propiedad (ZonaProp style)
 *
 * Envía el lead al CRM de Tokko via /api/contact.
 */

import { useState } from 'react'
import { Icon } from '@iconify/react'

interface PropertyContactProps {
  propertyId: number
  propertyAddress: string
  agentName?: string
  agentPhoto?: string
}

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function PropertyContact({
  propertyId,
  propertyAddress,
  agentName,
  agentPhoto,
}: PropertyContactProps) {
  const [formState, setFormState] = useState<FormState>('idle')
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [errors, setErrors] = useState<Partial<typeof form>>({})

  const defaultMessage = `Hola Lexinton, estoy interesado/a en la siguiente propiedad: [${propertyAddress}]`

  const validate = () => {
    const errs: Partial<typeof form> = {}
    if (!form.name.trim()) errs.name = 'Ingresá tu nombre'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Email inválido'
    }
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setFormState('loading')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message || defaultMessage,
        }),
      })

      if (res.ok) {
        setFormState('success')
      } else {
        setFormState('error')
      }
    } catch {
      setFormState('error')
    }
  }

  const inputClass = (field: keyof typeof form) =>
    `w-full px-4 py-3 border rounded-xl text-sm focus:outline-none transition-colors duration-150 focus:border-gray-400 ${
      errors[field] ? 'border-red-400' : 'border-gray-200'
    }`

  if (formState === 'success') {
    return (
      <div className="p-6 bg-white text-center">
        <div className="w-12 h-12 rounded-full bg-[#C41230]/10 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-[#C41230]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-serif text-xl text-lx-ink mb-2">Mensaje enviado</h3>
        <p className="text-[13px] text-lx-stone leading-relaxed">
          Recibimos tu consulta. Un asesor de Lexinton se va a comunicar con vos a la brevedad.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gray-50 px-5 py-4 border-b border-gray-200 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#C41230] text-white text-xs font-bold flex items-center justify-center shrink-0">
          LX
        </div>
        <div>
          <p className="text-[11px] text-gray-400">Asesor inmobiliario</p>
          <p className="text-sm font-semibold text-gray-800">Consultar por esta propiedad</p>
        </div>
      </div>

      <div className="p-5">
        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          {/* Nombre */}
          <div>
            <input
              type="text"
              placeholder="Nombre *"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={inputClass('name')}
              disabled={formState === 'loading'}
              autoComplete="name"
            />
            {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Teléfono */}
          <input
            type="tel"
            placeholder="Teléfono"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className={inputClass('phone')}
            disabled={formState === 'loading'}
            autoComplete="tel"
          />

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email *"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className={inputClass('email')}
              disabled={formState === 'loading'}
              autoComplete="email"
            />
            {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Mensaje */}
          <textarea
            placeholder={defaultMessage}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            rows={3}
            className={`${inputClass('message')} resize-none`}
            disabled={formState === 'loading'}
          />

          {formState === 'error' && (
            <p className="text-[12px] text-red-500">
              No se pudo enviar el mensaje. Intentá nuevamente o llamanos al 4776-5003.
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={formState === 'loading'}
            className="w-full bg-[#C41230] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#a30f28] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formState === 'loading' ? 'Enviando…' : 'ENVIAR CONSULTA'}
          </button>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/5491131519928?text=${encodeURIComponent(defaultMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full border border-[#25D366] text-[#25D366] py-3 rounded-xl text-sm font-semibold hover:bg-[#25D366] hover:text-white transition-colors"
          >
            <Icon icon="logos:whatsapp-icon" className="w-4 h-4" />
            CONSULTAR POR WHATSAPP
          </a>

          <p className="text-xs text-gray-400 text-center">
            Al enviar aceptás los{' '}
            <a href="/terminos" className="underline hover:text-gray-600">términos de uso</a>.
          </p>
        </form>
      </div>
    </div>
  )
}
