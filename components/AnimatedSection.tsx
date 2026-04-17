'use client'

import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer, viewportOnce } from '@/lib/animations'
import type { ReactNode } from 'react'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  stagger?: boolean
}

/**
 * Wraps a section with fade-in-up animation on scroll.
 * Use stagger={true} when children have motion variants.
 */
export default function AnimatedSection({ children, className, stagger }: AnimatedSectionProps) {
  return (
    <motion.section
      variants={stagger ? staggerContainer : fadeInUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className={className}
    >
      {children}
    </motion.section>
  )
}

/**
 * A motion.div child for use inside staggered containers.
 */
export function AnimatedItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={fadeInUp} className={className}>
      {children}
    </motion.div>
  )
}
