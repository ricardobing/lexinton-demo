/**
 * Objetos de props de Framer Motion reutilizables en toda la app.
 * Uso (en client components):
 *   import { fadeInUp } from '@/lib/animations'
 *   <motion.div {...fadeInUp}>…</motion.div>
 */

const ease = [0.22, 1, 0.36, 1] as const

/** Desliza hacia arriba + aparece */
export const fadeInUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, ease },
}

/** Solo aparece */
export const fadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.6 },
}

/** Desde la izquierda */
export const slideInLeft = {
  initial: { opacity: 0, x: -32 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease },
}

/** Desde la derecha */
export const slideInRight = {
  initial: { opacity: 0, x: 32 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease },
}

/** Contenedor con stagger — usar junto a staggerItem como variants */
export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}

/** Hijo de staggerContainer */
export const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
}
