'use client'

import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'

const steps = [
  {
    number: '01',
    icon: 'line-md:document-list',
    title: 'Contanos tu propiedad',
    description:
      'Completá el formulario con los datos básicos de tu inmueble. Sin documentación, sin trámites.',
  },
  {
    number: '02',
    icon: 'line-md:phone-call-loop',
    title: 'Te contacta tu corredor',
    description:
      'En menos de 24hs hábiles, un corredor especializado en tu barrio se comunica con vos.',
  },
  {
    number: '03',
    icon: 'line-md:clipboard-check',
    title: 'Recibís la tasación',
    description:
      'Análisis comparativo real, con propiedades similares cerradas recientemente en la zona.',
  },
  {
    number: '04',
    icon: 'line-md:home-simple-filled',
    title: 'Vendés mejor',
    description:
      'Difusión en todos los portales y campañas pagas. Más consultas, mejor precio, cierre más rápido.',
  },
]

export function ProcessSteps() {
  return (
    <section className="py-24 bg-[#f5f5f5] relative overflow-hidden">
      {/* Pattern decorativo de fondo MUY sutil */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: 'radial-gradient(circle, #111 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="text-xs text-[#C41230] uppercase tracking-[0.2em] font-medium mb-3">
            CÓMO FUNCIONA
          </p>
          <h2 className="text-4xl md:text-5xl font-light text-gray-900">
            Del formulario a la decisión
            <br />
            en 4 pasos
          </h2>
        </motion.div>

        <div className="relative">
          {/* Línea conectora animada */}
          <motion.div
            className="absolute top-[56px] left-[12.5%] right-[12.5%] h-px
              bg-gradient-to-r from-transparent via-[#C41230]/30 to-transparent
              hidden md:block"
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.5,
                  delay: 0.3 + i * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex flex-col items-center text-center group"
              >
                {/* Ícono en círculo con fondo */}
                <div className="relative mb-6">
                  <div
                    className="w-28 h-28 rounded-full bg-white
                    border border-gray-100 shadow-sm
                    flex items-center justify-center
                    group-hover:shadow-md group-hover:scale-105
                    transition-all duration-300"
                  >
                    <Icon icon={step.icon} className="w-14 h-14 text-[#C41230]" />
                  </div>

                  {/* Badge del número — flotante arriba a la derecha del círculo */}
                  <div
                    className="absolute -top-1 -right-1 w-9 h-9 rounded-full
                    bg-[#C41230] text-white text-xs font-semibold
                    flex items-center justify-center
                    shadow-md"
                  >
                    {step.number}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProcessSteps
