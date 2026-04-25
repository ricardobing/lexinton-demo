'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'

const testimonials = [
  {
    quote: "Me asesoraron en todas mis consultas sobre una propiedad. Muy buen servicio, atención personalizada y respuestas rápidas.",
    name: "Yair DíazRoy Bennett",
    source: "Google Reviews",
    avatarBg: "#FEE2E2",
    initials: "YB",
    operation: "Compra en Palermo",
  },
  {
    quote: "Tengo el placer de elegir a Lexinton Propiedades por su excelente asesoramiento durante mi experiencia de compra/venta de un departamento. Los agentes inmobiliarios fueron profesionales, eficientes y siempre estuvieron dispuestos a responder todas mis preguntas.",
    name: "Julia Degreef",
    source: "Google Reviews",
    avatarBg: "#DBEAFE",
    initials: "JD",
    operation: "Operación simultánea en Belgrano",
  },
  {
    quote: "Altamente confiables. Agradezco enormemente su responsabilidad y la atención detallada en cada etapa del proceso. ¡Excelente trabajo!",
    name: "Celeste Cruz Romero",
    source: "Google Reviews",
    avatarBg: "#FEF3C7",
    initials: "CR",
    operation: "Venta en Núñez",
  },
]

export function TestimonialsSection() {
  const [active, setActive] = useState(0)
  const current = testimonials[active]

  return (
    <section className="py-24 bg-[#f5f5f5] relative overflow-hidden">

      {/* Elemento decorativo — comilla gigante de fondo */}
      <div className="absolute top-20 left-10 text-[320px] text-[#C41230]/5
        leading-none font-serif pointer-events-none select-none hidden md:block">
        &ldquo;
      </div>

      <div className="relative max-w-5xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs text-[#C41230] uppercase tracking-[0.2em] font-medium mb-3">
            Testimonios
          </p>
          <h2 className="text-4xl md:text-5xl font-light text-gray-900">
            Lo que dicen<br />
            <em className="not-italic font-normal">quienes confiaron en nosotros</em>
          </h2>
        </motion.div>

        {/* Testimonio activo con animación al cambiar */}
        <div className="relative min-h-[320px] md:min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              {/* Estrellas */}
              <div className="flex justify-center gap-1 mb-8">
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} icon="solar:star-bold" className="w-5 h-5 text-[#FBBF24]" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-xl md:text-2xl font-light text-gray-700
                leading-relaxed max-w-3xl mx-auto mb-10 italic">
                &ldquo;{current.quote}&rdquo;
              </blockquote>

              {/* Autor con avatar */}
              <div className="flex items-center justify-center gap-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center
                  text-lg font-semibold text-gray-800"
                  style={{ backgroundColor: current.avatarBg }}>
                  {current.initials}
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">{current.name}</p>
                  <p className="text-sm text-gray-500">{current.operation}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Icon icon="logos:google-icon" className="w-3 h-3" />
                    <span className="text-xs text-gray-400">{current.source}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots de navegación con flechas */}
        <div className="flex justify-center items-center gap-6 mt-10">
          <button
            onClick={() => setActive((active - 1 + testimonials.length) % testimonials.length)}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Testimonio anterior"
          >
            <Icon icon="solar:arrow-left-linear" className="w-5 h-5" />
          </button>

          <div className="flex gap-2 items-center">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="p-3 -m-3 flex items-center justify-center"
                aria-label={`Ver testimonio ${i + 1}`}
              >
                <span
                  className={`h-2 rounded-full block transition-all duration-300 ${
                    i === active ? 'w-10 bg-[#C41230]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            onClick={() => setActive((active + 1) % testimonials.length)}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Siguiente testimonio"
          >
            <Icon icon="solar:arrow-right-linear" className="w-5 h-5" />
          </button>
        </div>

        {/* Link a Google reviews real */}
        <div className="text-center mt-10">
          <a
            href="https://www.google.com/search?q=Lexinton+Propiedades+reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-gray-500
              hover:text-[#C41230] transition-colors"
          >
            Ver todas las reseñas en Google
            <Icon icon="solar:arrow-right-linear" className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  )
}
