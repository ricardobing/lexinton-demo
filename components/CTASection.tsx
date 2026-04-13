'use client'

import { motion } from 'framer-motion'
import { SectionLabel } from '@/components/SectionLabel'

const ease = [0.22, 1, 0.36, 1] as const

export default function CTASection() {
  return (
    <section className="bg-lx-dark py-20 sm:py-24">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease }}
        >
          <div className="flex justify-center">
            <SectionLabel>Comenzá ahora</SectionLabel>
          </div>
          <h2 className="text-[28px] sm:text-[38px] font-light text-white leading-tight tracking-tight mb-4 text-balance">
            Conocé el valor real
            <br />
            de tu propiedad
          </h2>
          <p className="text-[15px] text-white/60 leading-[1.8] mb-8 max-w-xl mx-auto">
            Tasación gratuita y sin compromiso. Nuestro equipo de especialistas
            te da un informe detallado del mercado actual en menos de 24 horas.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/"
              className="inline-flex items-center gap-2 bg-lx-red text-white text-[12px] font-medium tracking-[0.12em] uppercase px-8 py-4 rounded-[4px] hover:bg-[#a80f28] transition-colors duration-200 cursor-pointer"
            >
              Tasar mi inmueble gratis
            </a>
            <a
              href="tel:01147765003"
              className="inline-flex items-center gap-2 border border-white/20 text-white/80 text-[12px] font-medium tracking-[0.1em] uppercase px-8 py-4 rounded-[4px] hover:border-white/50 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              <PhoneIcon />
              011 4776-5003
            </a>
          </div>

          {/* Trust note */}
          <p className="mt-6 text-[13px] text-white/40">
            Sin compromiso &middot; Respuesta en menos de 24 horas &middot; Gratis
          </p>
        </motion.div>
      </div>
    </section>
  )
}

function PhoneIcon() {
  return (
    <svg
      className="w-3.5 h-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 13 19.79 19.79 0 0 1 1.93 4.36a2 2 0 0 1 1.99-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}
