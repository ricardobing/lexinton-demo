/**
 * Motion Design Tokens — Single source of truth for all animations.
 *
 * Rules:
 * - Max 1 animation per element
 * - Prefer transform + opacity for 60fps
 * - Consistent easing everywhere
 */

export const EASE = [0.22, 1, 0.36, 1] as const

export const DURATION = {
  fast: 0.3,
  normal: 0.5,
  slow: 0.7,
  entrance: 0.6,
} as const

export const STAGGER = {
  fast: 0.06,
  normal: 0.1,
  slow: 0.15,
} as const

/** Shared viewport config for whileInView */
export const VIEWPORT = { once: true, margin: '-60px' as const }

/** Standard fade-in-up for section content */
export const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.entrance, ease: EASE } },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DURATION.normal, ease: EASE } },
}

export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: STAGGER.normal, delayChildren: 0.05 } },
}

export const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { duration: DURATION.entrance, ease: EASE } },
}

export const slideInRight = {
  hidden: { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0, transition: { duration: DURATION.entrance, ease: EASE } },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: DURATION.normal, ease: EASE } },
}
