'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import type { TokkoProperty } from '@/lib/tokko/types'

interface Props {
  open: boolean
  onClose: () => void
  property: TokkoProperty
}

export function ContactModal({ open, onClose, property }: Props) {
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
    } catch (e) {
      console.error(e)
    }
    setSending(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              z-50 bg-white rounded-2xl shadow-2xl w-[90vw] max-w-[480px]
              p-6 md:p-8 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Contactate con Lexinton Propiedades
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  por la propiedad en {property.location?.name || 'Buenos Aires'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 ml-3"
              >
                <Icon icon="solar:close-circle-linear" className="w-6 h-6" />
              </button>
            </div>

            {sent ? (
              <div className="text-center py-8">
                <Icon icon="solar:check-circle-bold" className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  ¡Consulta enviada!
                </p>
                <p className="text-sm text-gray-500">
                  Te vamos a contactar en menos de 2 horas hábiles.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-6 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
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
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={sending || !form.nombre || !form.email}
                  className="w-full mt-6 h-12 bg-[#EF6C00] text-white rounded-xl
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
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
