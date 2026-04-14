'use client'

import { motion } from 'framer-motion'
import PropertyCard from '@/components/PropertyCard'
import { properties } from '@/lib/properties'

const ease = [0.22, 1, 0.36, 1] as const
const featured = properties.slice(0, 3)

export default function FeaturedProperties() {
  return (
    <section id="seleccion" className="bg-lx-parchment py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 sm:mb-16"
        >
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-6 h-px bg-lx-accent" />
              <span className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-lx-accent">
                Selección
              </span>
            </div>
            <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.8rem)] font-normal text-lx-ink leading-[1.12] tracking-[-0.01em]">
              Propiedades<br />
              <em className="italic text-lx-stone">con criterio propio.</em>
            </h2>
          </div>
          <a
            href="/"
            className="hidden sm:inline-flex items-center gap-3 text-[11.5px] font-bold tracking-[0.14em] uppercase text-lx-stone hover:text-lx-ink transition-colors duration-200 group shrink-0"
          >
            Ver todas
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-lx-line">
          {featured.map((property, i) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, ease, delay: i * 0.1 }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>

        {/* Mobile CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease, delay: 0.35 }}
          className="mt-10 text-center sm:hidden"
        >
          <a
            href="/"
            className="inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.14em] uppercase text-lx-accent hover:text-lx-ink transition-colors duration-200 group"
          >
            Ver todas las propiedades
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
