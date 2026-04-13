'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

const checks = [
  'Líderes en operaciones simultáneas venta + compra',
  'Tasación gratuita y sin compromiso',
  'Equipo jurídico y financiero propio',
  'Atención personalizada en Palermo y Vicente López',
  'Más de 5.000 clientes que confían en nosotros',
]

export default function AboutSection() {
  return (
    <section className="bg-lx-white py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease }}
            className="relative aspect-[4/3] lg:aspect-auto lg:h-[500px] overflow-hidden rounded-[4px]"
          >
            <Image
              src="https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?w=800&q=80"
              alt="Equipo Lexinton Propiedades"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
            {/* Accent badge */}
            <div className="absolute bottom-6 right-6 bg-lx-red text-white px-5 py-4 text-center shadow-lg">
              <span className="block text-[32px] font-light leading-none">20</span>
              <span className="block text-[10px] tracking-[0.18em] uppercase mt-1 font-medium">
                años
              </span>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
          >
            <span className="block text-[11px] font-medium tracking-[0.22em] uppercase text-lx-red mb-4">
              Quiénes somos
            </span>
            <h2 className="text-[30px] sm:text-[36px] font-light text-lx-dark leading-tight tracking-tight mb-5">
              Tu próximo hogar,
              <br />
              nuestra prioridad
            </h2>
            <p className="text-[15px] text-lx-mid leading-[1.8] mb-6">
              Somos una empresa dedicada al asesoramiento y soluciones integrales
              del rubro inmobiliario. Con sede en Palermo y Vicente López,
              acompañamos a nuestros clientes en cada etapa de la compra, venta
              o alquiler de su propiedad.
            </p>

            {/* Checklist */}
            <ul className="space-y-3 mb-8">
              {checks.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[14px] text-lx-mid">
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <a
                href="/tasar"
                className="inline-flex items-center gap-2 bg-lx-red text-white text-[12px] font-medium tracking-[0.1em] uppercase px-7 py-3.5 rounded-[4px] hover:bg-[#a80f28] transition-colors duration-200 cursor-pointer"
              >
                Tasar mi inmueble
              </a>
              <a
                href="/contacto"
                className="inline-flex items-center gap-2 border border-lx-border text-lx-mid text-[12px] font-medium tracking-[0.1em] uppercase px-7 py-3.5 rounded-[4px] hover:border-lx-dark hover:text-lx-dark transition-colors duration-200 cursor-pointer"
              >
                Contactar
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4 shrink-0 text-lx-red mt-0.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
