'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

export default function CTASection() {
  const [form, setForm] = useState({ nombre: '', contacto: '', tipo: '' })
  const [sent, setSent] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Future: POST to API
    setSent(true)
  }

  return (
    <section id="tasacion" className="bg-lx-ink py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 sm:gap-20 items-center">

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-6 h-px bg-white/25" />
              <span className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-white/40">
                Tasación
              </span>
            </div>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] font-normal text-white leading-[1.1] tracking-[-0.01em] mb-6">
              Descubrí el valor real<br />
              <em className="italic text-white/50">de tu propiedad.</em>
            </h2>
            <p className="text-[15px] text-white/55 leading-[1.85] max-w-md">
              Tasación sin compromiso. Análisis real de mercado. Acompañamiento personalizado desde el primer día.
            </p>

            <ul className="mt-8 space-y-3">
              {[
                'Informe de mercado incluido',
                'Sin compromiso de exclusividad',
                'Respuesta en menos de 24 hs',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[13.5px] text-white/50">
                  <span className="w-4 h-px bg-white/20 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
          >
            {sent ? (
              <div className="border border-white/10 p-10 text-center">
                <p className="font-serif text-[1.5rem] text-white font-normal mb-3">Recibimos tu consulta.</p>
                <p className="text-[14px] text-white/50">Te contactamos en menos de 24 horas.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold tracking-[0.16em] uppercase text-white/35 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    required
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    className="w-full bg-white/5 border border-white/10 px-4 py-3.5 text-[14px] text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors duration-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold tracking-[0.16em] uppercase text-white/35 mb-2">
                    Email o WhatsApp
                  </label>
                  <input
                    type="text"
                    name="contacto"
                    required
                    value={form.contacto}
                    onChange={handleChange}
                    placeholder="email@ejemplo.com o +54 9 11..."
                    className="w-full bg-white/5 border border-white/10 px-4 py-3.5 text-[14px] text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors duration-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold tracking-[0.16em] uppercase text-white/35 mb-2">
                    Tipo de operación
                  </label>
                  <select
                    name="tipo"
                    required
                    value={form.tipo}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3.5 text-[14px] text-white focus:outline-none focus:border-white/30 transition-colors duration-200 appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-lx-ink text-white/50">Seleccioná una opción</option>
                    <option value="venta" className="bg-lx-ink text-white">Quiero vender</option>
                    <option value="compra" className="bg-lx-ink text-white">Quiero comprar</option>
                    <option value="simultanea" className="bg-lx-ink text-white">Vendo y compro al mismo tiempo</option>
                    <option value="tasacion" className="bg-lx-ink text-white">Solo necesito tasación</option>
                  </select>
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-white text-lx-ink text-[12px] font-bold tracking-[0.16em] uppercase py-4 hover:bg-lx-cream transition-colors duration-200"
                  >
                    Quiero mi tasación
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
