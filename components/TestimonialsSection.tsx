'use client'

import { motion } from 'framer-motion'
import { testimonials } from '@/lib/properties'

const ease = [0.22, 1, 0.36, 1] as const

export default function TestimonialsSection() {
  return (
    <section className="bg-lx-ink py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease }}
          className="mb-14 sm:mb-18"
        >
          <div className="flex items-center gap-4 mb-5">
            <div className="w-6 h-px bg-white/30" />
            <span className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-white/40">
              Testimonios
            </span>
          </div>
          <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.8rem)] font-normal text-white leading-[1.12] tracking-[-0.01em]">
            Lo que dicen quienes<br />
            <em className="italic text-white/50">confiaron en nosotros.</em>
          </h2>
        </motion.div>

        {/* Quotes grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, ease, delay: i * 0.1 }}
              className="bg-lx-ink p-8 sm:p-10 flex flex-col"
            >
              {/* Large quote glyph */}
              <span className="font-serif text-[4.5rem] text-white/10 leading-none mb-4 select-none">&ldquo;</span>

              {/* Quote text */}
              <blockquote className="text-[14.5px] text-white/70 leading-[1.85] italic flex-1 mb-8">
                {t.text}
              </blockquote>

              {/* Author */}
              <footer className="pt-5 border-t border-white/10">
                <p className="text-[13px] font-semibold text-white">{t.name}</p>
                <p className="text-[11px] text-white/35 tracking-[0.06em] mt-0.5">{t.source}</p>
              </footer>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
