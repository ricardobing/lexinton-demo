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
    <div className={`grid grid-cols-1 ${colsClass[cols]} gap-4`}>
      {steps.map((step, i) => {
        const num = String(i + 1).padStart(2, '0')
        return (
          <motion.div
            key={num}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.55, ease: EASE, delay: i * STAGGER.normal }}
            className="relative bg-[#f0f0f0] rounded-xl p-8
              border border-[#e5e5e5]
              hover:bg-[#e8e8e8] transition-colors duration-200"
          >
            <span className="block text-5xl font-light text-[#C41230]/25 mb-4 leading-none select-none">
              {num}
            </span>
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              {step.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        )
      })}
    </div>
  )
}
