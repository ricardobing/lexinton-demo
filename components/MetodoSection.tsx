'use client'

import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

const steps = [
  {
    num: '01',
    title: 'Tasación estratégica',
    body:
      'Analizamos el valor real de mercado de tu propiedad, no el valor que querés escuchar. Un precio preciso es la base de cualquier operación exitosa.',
  },
  {
    num: '02',
    title: 'Plan de venta y búsqueda',
    body:
      'Diseñamos una estrategia comercial simultánea: publicamos tu propiedad y activamos la búsqueda de la siguiente en paralelo, con tiempos coordinados.',
  },
  {
    num: '03',
    title: 'Cierre coordinado',
    body:
      'Acompañamos escrituras, boletos y financiamiento en sincronía. Sin entregas anticipadas, sin riesgos de timing, con acompañamiento legal propio.',
  },
]

export default function MetodoSection() {
  return (
    <section className="bg-lx-cream py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease }}
          className="max-w-2xl mb-16 sm:mb-20"
        >
          <div className="flex items-center gap-4 mb-5">
            <div className="w-6 h-px bg-lx-accent" />
            <span className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-lx-accent">
              El método Lexinton
            </span>
          </div>
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal text-lx-ink leading-[1.12] tracking-[-0.01em] mb-5">
            Una operación simultánea<br />
            <em className="italic text-lx-stone">no se improvisa.</em>
          </h2>
          <p className="text-[15px] sm:text-[16px] text-lx-stone leading-[1.8] max-w-xl">
            Requiere valoración precisa, estrategia comercial y coordinación experta.
            Eso es exactamente lo que hacemos desde hace 20 años.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, ease, delay: i * 0.1 }}
              className="relative bg-[#ede9e3] rounded-xl p-8
                border border-[#d4cfc8]
                hover:bg-[#e5e0d8] transition-colors duration-200"
            >
              <span className="block text-5xl font-light text-[#C41230]/25 mb-4 leading-none select-none">
                {step.num}
              </span>
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease, delay: 0.4 }}
          className="mt-10 text-center sm:text-left"
        >
          <a
            href="/tasar"
            className="inline-flex items-center gap-3 text-[12px] font-bold tracking-[0.14em] uppercase text-lx-accent hover:text-lx-ink transition-colors duration-200 group"
          >
            Iniciar mi proceso
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
