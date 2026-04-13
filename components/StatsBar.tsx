'use client'

import { motion } from 'framer-motion'
import { stats } from '@/lib/properties'

const ease = [0.22, 1, 0.36, 1] as const

export default function StatsBar() {
  return (
    <section className="bg-lx-white border-y border-lx-border">
      <div className="max-w-4xl mx-auto px-6 py-12 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-0 sm:divide-x sm:divide-lx-border text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, ease, delay: i * 0.1 }}
              className="px-4 sm:px-8"
            >
              <span className="block text-[40px] sm:text-[46px] font-light text-lx-dark tracking-tight leading-none mb-2">
                {stat.value}
              </span>
              <span className="block text-[12px] text-lx-mid uppercase tracking-[0.14em] font-medium">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
