'use client'

import { motion } from 'framer-motion'
import { testimonials } from '@/lib/properties'

const ease = [0.22, 1, 0.36, 1] as const

export default function TestimonialsSection() {
  return (
    <section className="bg-lx-light py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease }}
          className="text-center mb-12 sm:mb-14"
        >
          <span className="block text-[11px] font-medium tracking-[0.22em] uppercase text-lx-red mb-3">
            Testimonios
          </span>
          <h2 className="text-[30px] sm:text-[36px] font-light text-lx-dark leading-tight tracking-tight">
            Lo que dicen nuestros clientes
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, ease, delay: i * 0.1 }}
              className="bg-white border border-lx-border p-6 sm:p-7 flex flex-col"
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <StarIcon key={j} />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-[14px] text-lx-mid leading-[1.8] italic flex-1 mb-5">
                &ldquo;{t.text}&rdquo;
              </blockquote>

              {/* Author */}
              <footer className="flex items-center justify-between pt-4 border-t border-lx-border">
                <div>
                  <p className="text-[13px] font-medium text-lx-dark">{t.name}</p>
                  <p className="text-[11px] text-lx-mid tracking-[0.06em]">{t.source}</p>
                </div>
                <GoogleBadge />
              </footer>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StarIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="#C41230">
      <path d="M8 1.5l1.545 4.77H14.6l-4.046 2.94 1.545 4.77L8 11.04l-4.099 2.94 1.545-4.77L1.4 6.27h5.055L8 1.5Z" />
    </svg>
  )
}

function GoogleBadge() {
  return (
    <div className="flex items-center gap-1.5">
      {/* Google 'G' SVG */}
      <svg className="w-4 h-4" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84Z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52Z"
        />
      </svg>
      <span className="text-[10px] text-lx-mid font-medium">Google</span>
    </div>
  )
}
