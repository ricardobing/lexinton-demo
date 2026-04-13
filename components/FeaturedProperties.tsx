'use client'

import { motion } from 'framer-motion'
import PropertyCard from '@/components/PropertyCard'
import { properties } from '@/lib/properties'

const ease = [0.22, 1, 0.36, 1] as const

export default function FeaturedProperties() {
  return (
    <section id="propiedades" className="bg-lx-light py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease }}
          className="mb-10 sm:mb-14"
        >
          <span className="block text-[11px] font-medium tracking-[0.22em] uppercase text-lx-red mb-3">
            Destacadas
          </span>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="text-[32px] sm:text-[38px] font-light text-lx-dark leading-tight tracking-tight">
              Propiedades seleccionadas
            </h2>
            <a
              href="/propiedades"
              className="inline-flex items-center gap-2 text-[12px] font-medium text-lx-mid hover:text-lx-dark tracking-[0.08em] transition-colors duration-150 cursor-pointer shrink-0"
            >
              Ver todas las propiedades
              <ArrowIcon />
            </a>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {properties.map((property, i) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, ease, delay: i * 0.08 }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-10 text-center sm:hidden">
          <a
            href="/propiedades"
            className="inline-flex items-center gap-2 border border-lx-dark text-lx-dark text-[12px] font-medium tracking-[0.1em] uppercase px-8 py-3.5 rounded-[4px] hover:bg-lx-dark hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Ver todas las propiedades
          </a>
        </div>
      </div>
    </section>
  )
}

function ArrowIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}
