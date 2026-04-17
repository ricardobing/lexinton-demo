/**
 * SectionHeader — Reusable section header with label + serif title + decorative line.
 * Matches the home page visual language (MetodoSection style).
 */

'use client'

import { motion } from 'framer-motion'
import { EASE, VIEWPORT } from '@/lib/motion'

interface SectionHeaderProps {
  /** Small uppercase label above the title */
  label: string
  /** Main serif title */
  title: string
  /** Optional italic emphasis (renders on new line) */
  titleEmphasis?: string
  /** Optional paragraph below the title */
  description?: string
  /** Center the header */
  center?: boolean
  /** Use accent color for the label (default) or stone */
  labelColor?: 'accent' | 'stone' | 'white'
}

export default function SectionHeader({
  label,
  title,
  titleEmphasis,
  description,
  center = false,
  labelColor = 'accent',
}: SectionHeaderProps) {
  const labelCls =
    labelColor === 'white'
      ? 'text-white/40'
      : labelColor === 'stone'
        ? 'text-lx-stone'
        : 'text-lx-accent'

  const lineCls =
    labelColor === 'white' ? 'bg-white/20' : 'bg-lx-accent'

  const titleCls =
    labelColor === 'white' ? 'text-white' : 'text-lx-ink'

  const emphasisCls =
    labelColor === 'white' ? 'text-white/50' : 'text-lx-stone'

  const descCls =
    labelColor === 'white' ? 'text-white/55' : 'text-lx-stone'

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.6, ease: EASE }}
      className={`mb-14 sm:mb-16 ${center ? 'text-center' : 'max-w-2xl'}`}
    >
      <div className={`flex items-center gap-4 mb-5 ${center ? 'justify-center' : ''}`}>
        <div className={`w-6 h-px ${lineCls}`} />
        <span className={`text-[10.5px] font-bold tracking-[0.22em] uppercase ${labelCls}`}>
          {label}
        </span>
      </div>
      <h2
        className={`font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.12] tracking-[-0.01em] mb-5 ${titleCls}`}
      >
        {title}
        {titleEmphasis && (
          <>
            <br />
            <em className={`italic ${emphasisCls}`}>{titleEmphasis}</em>
          </>
        )}
      </h2>
      {description && (
        <p className={`text-[15px] sm:text-[16px] leading-[1.8] max-w-xl ${descCls} ${center ? 'mx-auto' : ''}`}>
          {description}
        </p>
      )}
    </motion.div>
  )
}
