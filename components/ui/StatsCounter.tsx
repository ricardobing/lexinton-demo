/**
 * StatsCounter — Animated number counting with intersection observer.
 * Used in stats bars and credibility sections.
 */

'use client'

import { motion } from 'framer-motion'
import { AnimatedCounter } from '@/components/AnimatedCounter'
import { EASE, STAGGER, VIEWPORT } from '@/lib/motion'

export interface Stat {
  /** Number to count up to */
  end: number
  /** Prefix like + or # */
  prefix?: string
  /** Suffix like % or años */
  suffix?: string
  /** Label below the number */
  label: string
}

interface StatsCounterProps {
  stats: Stat[]
  /** Visual theme */
  theme?: 'dark' | 'light'
}

export default function StatsCounter({ stats, theme = 'light' }: StatsCounterProps) {
  const dark = theme === 'dark'

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 divide-x ${dark ? 'divide-white/10' : 'divide-lx-line'}`}>
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.5, ease: EASE, delay: i * STAGGER.fast }}
          className="px-6 sm:px-10 py-2 text-center first:pl-0 last:pr-0"
        >
          <span className={`block font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-none mb-2 ${dark ? 'text-white' : 'text-lx-ink'}`}>
            {stat.prefix && <span className="text-[0.6em] mr-0.5 align-middle">{stat.prefix}</span>}
            <AnimatedCounter end={stat.end} />
            {stat.suffix && <span className="text-[0.6em] ml-0.5">{stat.suffix}</span>}
          </span>
          <span className={`block text-[10px] sm:text-[11px] tracking-[0.18em] uppercase font-medium leading-snug ${dark ? 'text-white/45' : 'text-lx-stone'}`}>
            {stat.label}
          </span>
        </motion.div>
      ))}
    </div>
  )
}
