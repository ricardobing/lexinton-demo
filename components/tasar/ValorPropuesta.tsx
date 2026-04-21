'use client'

import { motion } from 'framer-motion'
import { EASE, VIEWPORT } from '@/lib/motion'

export default function ValorPropuesta() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.65, ease: EASE }}
          className="max-w-2xl"
        >
          <p className="text-[17px] sm:text-[19px] text-lx-stone leading-[1.85]">
            Llevamos{' '}
            <motion.strong
              className="text-lx-ink font-semibold rounded-sm px-0.5"
              initial={{ backgroundColor: 'rgba(196, 18, 48, 0)' }}
              whileInView={{ backgroundColor: 'rgba(196, 18, 48, 0.08)' }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
            >
              20 años
            </motion.strong>{' '}
            cerrando operaciones en{' '}
            <motion.strong
              className="text-lx-ink font-semibold rounded-sm px-0.5"
              initial={{ backgroundColor: 'rgba(196, 18, 48, 0)' }}
              whileInView={{ backgroundColor: 'rgba(196, 18, 48, 0.08)' }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.6, ease: EASE }}
            >
              Palermo, Belgrano y zona norte
            </motion.strong>
            . Conocemos el precio de cada cuadra. Tu tasación no la hace un algoritmo
            — la hace{' '}
            <motion.strong
              className="text-lx-ink font-semibold rounded-sm px-0.5"
              initial={{ backgroundColor: 'rgba(196, 18, 48, 0)' }}
              whileInView={{ backgroundColor: 'rgba(196, 18, 48, 0.08)' }}
              viewport={{ once: true }}
              transition={{ delay: 0.9, duration: 0.6, ease: EASE }}
            >
              el corredor que vendió el departamento de tu vecino
            </motion.strong>
            .
          </p>
        </motion.div>
      </div>
    </section>
  )
}
