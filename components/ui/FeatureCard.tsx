/**
 * FeatureCard — Hover scale 1.02, subtle shadow, decorative accent line.
 * Consistent card style across all institutional pages.
 */

'use client'

import { motion } from 'framer-motion'
import { fadeInUp, VIEWPORT } from '@/lib/motion'

interface FeatureCardProps {
  title: string
  description: string
  /** Optional icon/emoji rendered above the title */
  icon?: React.ReactNode
  /** Show decorative accent line (default true) */
  accentLine?: boolean
}

export default function FeatureCard({
  title,
  description,
  icon,
  accentLine = true,
}: FeatureCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="bg-white border border-lx-line rounded-xl p-8 h-full shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {icon && <div className="text-lx-accent text-lg mb-4 font-serif">{icon}</div>}
      {accentLine && !icon && <div className="w-8 h-px bg-lx-accent mb-6" />}
      <h3 className="text-[11px] font-bold tracking-[0.16em] uppercase text-lx-ink mb-4">
        {title}
      </h3>
      <p className="text-sm text-lx-stone leading-relaxed">{description}</p>
    </motion.div>
  )
}
