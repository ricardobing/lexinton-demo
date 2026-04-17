/**
 * PageHero — Hero reutilizable para páginas institucionales
 *
 * Uso:
 * <PageHero
 *   eyebrow="Lexinton · Tasaciones"
 *   title={<>Sabé cuánto vale<br /><em>tu propiedad hoy</em></>}
 *   subtitle="Tasación gratuita por un broker especialista en tu zona."
 * />
 */

'use client'

import { motion } from 'framer-motion'

interface PageHeroProps {
  eyebrow?: string
  title: React.ReactNode
  subtitle?: string
  /** 'dark' (fondo oscuro lx-ink, texto blanco) | 'light' (fondo lx-parchment, texto lx-ink) */
  theme?: 'dark' | 'light'
  children?: React.ReactNode
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  theme = 'dark',
  children,
}: PageHeroProps) {
  const isDark = theme === 'dark'

  return (
    <section
      className={[
        isDark ? 'bg-lx-ink text-white' : 'bg-lx-parchment text-lx-ink',
        'pt-[calc(68px+3.5rem)] pb-18 sm:pt-[calc(68px+5.5rem)] sm:pb-24 border-b',
        isDark ? 'border-white/5' : 'border-lx-line',
      ].join(' ')}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={[
              'text-[10.5px] font-bold tracking-[0.22em] uppercase mb-5',
              isDark ? 'text-lx-accent/80' : 'text-lx-stone',
            ].join(' ')}
          >
            {eyebrow}
          </motion.p>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className={[
            'font-serif text-[clamp(2rem,5vw,3.8rem)] font-normal leading-[1.1] tracking-[-0.01em] mb-6 max-w-2xl',
            isDark ? '[&_em]:text-white/40' : '[&_em]:text-lx-stone',
          ].join(' ')}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className={[
              'text-[16px] leading-[1.85] max-w-xl',
              isDark ? 'text-white/60' : 'text-lx-stone',
            ].join(' ')}
          >
            {subtitle}
          </motion.p>
        )}

        {children && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  )
}
