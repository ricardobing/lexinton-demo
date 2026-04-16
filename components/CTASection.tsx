'use client'

import { motion } from 'framer-motion'
import { LeadForm } from '@/components/LeadForm'

const ease = [0.22, 1, 0.36, 1] as const

export default function CTASection() {
  return (
    <section id="tasacion" className="bg-lx-ink py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 sm:gap-20 items-start">

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
                Consultá con nosotros
              </span>
            </div>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] font-normal text-white leading-[1.1] tracking-[-0.01em] mb-6">
              Conocé el valor real<br />
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
            <LeadForm
              tipo="Home"
              showTipoSelector
              theme="dark"
              messagePlaceholder="¿Sobre qué querés consultarnos?"
            />
          </motion.div>

        </div>
      </div>
    </section>
  )
}

