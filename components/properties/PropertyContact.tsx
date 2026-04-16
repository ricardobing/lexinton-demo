'use client'

/**
 * PropertyContact — Formulario de contacto de propiedad
 *
 * Envía el lead al CRM de Tokko via /api/contact.
 * El lead aparece en el panel del cliente inmediatamente.
 */

import { useState } from 'react'

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
    `w-full bg-transparent border-b py-2.5 text-[13px] text-lx-ink placeholder:text-lx-stone/60 outline-none transition-colors duration-150 focus:border-lx-ink ${
      errors[field] ? 'border-red-400' : 'border-lx-line hover:border-lx-stone'
    }`

  if (formState === 'success') {
    return (
      <div className="p-6 bg-lx-parchment border border-lx-line text-center">
        <div className="w-12 h-12 rounded-full bg-lx-accent/10 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-lx-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
    <div className="bg-lx-parchment border border-lx-line p-6">
      {/* Agente asignado */}
      {agentName && (
        <div className="flex items-center gap-3 mb-5 pb-5 border-b border-lx-line">
          {agentPhoto && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={agentPhoto}
              alt={agentName}
              className="w-10 h-10 rounded-full object-cover bg-gray-200"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          )}
          {!agentPhoto && (
            <div className="w-10 h-10 rounded-full bg-lx-line flex items-center justify-center">
              <svg className="w-5 h-5 text-lx-stone" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
          )}
          <div>
            <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-lx-stone">Asesor</p>
            <p className="text-[14px] font-medium text-lx-ink">{agentName}</p>
          </div>
        </div>
      )}

      <h3 className="font-serif text-lg text-lx-ink mb-5">Consultar por esta propiedad</h3>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
        <div>
          <input
            type="tel"
            placeholder="Teléfono"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className={inputClass('phone')}
            disabled={formState === 'loading'}
            autoComplete="tel"
          />
        </div>

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
        <div>
          <textarea
            placeholder={defaultMessage}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            rows={3}
            className={`${inputClass('message')} resize-none`}
            disabled={formState === 'loading'}
          />
        </div>

        {/* Error global */}
        {formState === 'error' && (
          <p className="text-[12px] text-red-500">
            No se pudo enviar el mensaje. Intentá nuevamente o llamanos al 4776-5003.
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={formState === 'loading'}
          className="w-full bg-lx-ink text-white text-[11px] font-bold tracking-[0.18em] uppercase py-3.5 px-6 hover:bg-lx-accent transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {formState === 'loading' ? 'Enviando…' : 'Enviar consulta'}
        </button>

        {/* WhatsApp alternativo */}
        <a
          href={`https://wa.me/5491131519928?text=${encodeURIComponent(defaultMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full border border-lx-line text-lx-stone text-[11px] font-bold tracking-[0.14em] uppercase py-3 hover:border-lx-stone hover:text-lx-ink transition-colors duration-200"
        >
          <WhatsAppIcon />
          Consultar por WhatsApp
        </a>

        <p className="text-[10px] text-lx-stone/60 text-center leading-relaxed">
          Al enviar este formulario aceptás los{' '}
          <a href="/terminos" className="underline hover:text-lx-stone">términos de uso</a>.
        </p>
      </form>
    </div>
  )
}

function WhatsAppIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}
