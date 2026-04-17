/**
 * NumberedSteps — 01/02/03 format with connecting lines and stagger animation.
 * Mirrors the MetodoSection home page visual language.
 */

'use client'

import { motion } from 'framer-motion'
import { EASE, STAGGER, VIEWPORT } from '@/lib/motion'

export interface Step {
  title: string
  description: string
}

interface NumberedStepsProps {
  steps: Step[]
  /** Grid columns on desktop (default: number of steps, max 5) */
  columns?: 3 | 4 | 5
}

const colsClass = {
  3: 'md:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
  5: 'sm:grid-cols-3 lg:grid-cols-5',
}

export default function NumberedSteps({ steps, columns }: NumberedStepsProps) {
  const cols = columns ?? (Math.min(steps.length, 5) as 3 | 4 | 5)

  return (
    <div className={`grid grid-cols-1 ${colsClass[cols]} gap-px bg-lx-line`}>
      {steps.map((step, i) => {
        const num = String(i + 1).padStart(2, '0')
        return (
          <motion.div
            key={num}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.55, ease: EASE, delay: i * STAGGER.normal }}
            className="bg-lx-cream p-8 sm:p-10 group hover:bg-lx-parchment transition-colors duration-300"
          >
            <span className="block font-serif text-[3.5rem] font-normal text-lx-line leading-none mb-6 group-hover:text-lx-line/60 transition-colors duration-300">
              {num}
            </span>
            <h3 className="text-[17px] font-bold text-lx-ink tracking-tight mb-4 leading-tight">
              {step.title}
            </h3>
            <p className="text-[14px] text-lx-stone leading-[1.8]">
              {step.description}
            </p>
          </motion.div>
        )
      })}
    </div>
  )
}
