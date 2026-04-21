'use client'

import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'

const reasons = [
  {
    icon: 'solar:map-point-wave-bold-duotone',
    iconBg: '#FEE2E2',
    iconColor: '#C41230',
    title: '20 años en la misma zona',
    description:
      'Operamos exclusivamente en zona norte CABA desde 2004. Conocemos cada barrio, cada edificio y cada ciclo de mercado de Palermo a Saavedra.',
  },
  {
    icon: 'solar:user-check-bold-duotone',
    iconBg: '#FEF3C7',
    iconColor: '#B45309',
    title: 'Corredores matriculados',
    description:
      'El corredor que te atiende tiene matrícula habilitante y trabaja en tu barrio de forma permanente. No es un call center. Es alguien que cerró operaciones en tu misma cuadra.',
  },
  {
    icon: 'solar:chart-square-bold-duotone',
    iconBg: '#DBEAFE',
    iconColor: '#1E40AF',
    title: 'Informe con datos reales',
    description:
      'Análisis comparativo basado en operaciones cerradas de los últimos 90 días en tu zona. No promediamos publicaciones — usamos precios reales de cierre.',
  },
]

export function WhyUs() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <p className="text-xs text-[#C41230] uppercase tracking-[0.2em] font-medium mb-3">
            NUESTRA METODOLOGÍA
          </p>
          <h2 className="text-4xl md:text-5xl font-light text-gray-900">¿Por qué elegirnos?</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.5,
                delay: i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative bg-white border border-gray-100
                rounded-2xl p-8 hover:border-gray-200 hover:shadow-lg
                transition-all duration-300"
            >
              {/* Ícono con fondo de color */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                style={{ backgroundColor: reason.iconBg }}
              >
                <Icon icon={reason.icon} className="w-8 h-8" style={{ color: reason.iconColor }} />
              </div>

              <h3 className="text-xl font-medium text-gray-900 mb-3">{reason.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{reason.description}</p>

              {/* Accent line que aparece en hover */}
              <div
                className="absolute bottom-0 left-8 right-8 h-0.5 bg-[#C41230]
                scale-x-0 group-hover:scale-x-100 transition-transform duration-300
                origin-left"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyUs
