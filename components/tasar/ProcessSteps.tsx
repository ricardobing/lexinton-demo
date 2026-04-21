'use client'

import { motion } from 'framer-motion'
import { EASE } from '@/lib/motion'
import SectionHeader from '@/components/ui/SectionHeader'

const steps = [
  {
    number: '01',
    title: 'Contanos tu propiedad',
    description:
      'Completá el formulario con los datos básicos de tu inmueble. Sin documentación, sin trámites.',
  },
  {
    number: '02',
    title: 'Te contacta tu corredor',
    description:
      'En menos de 24hs hábiles, un corredor especializado en tu barrio se comunica con vos.',
  },
  {
    number: '03',
    title: 'Recibís la tasación',
    description:
      'Análisis comparativo real, con propiedades similares cerradas recientemente en la zona.',
  },
  {
    number: '04',
    title: 'Decidís sin presión',
    description:
      'Si querés publicar con Lexinton, arrancamos. Si no, el informe es tuyo de todas formas.',
  },
]

export default function ProcessSteps() {
  return (
    <section className="bg-white py-20 sm:py-24 border-b border-lx-line">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeader label="Cómo Funciona" title="Del formulario a la decisión en 4 pasos" />

        <div className="relative">
          {/* Drawing line — desktop only, animates scaleX left→right */}
          <motion.div
            className="absolute top-10 left-0 right-0 h-px bg-gray-200 hidden md:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
            style={{ transformOrigin: 'left center' }}
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.2 + i * 0.2 }}
                className="relative flex flex-col md:items-start pl-5 md:pl-0
                           border-l border-gray-200 md:border-l-0"
              >
                {/* Number with circle background */}
                <div className="relative inline-flex items-center justify-center w-20 h-20 mb-5 shrink-0">
                  <div className="absolute inset-0 rounded-full bg-[#C41230]/5" />
                  <span className="relative text-5xl font-light text-[#C41230] font-serif leading-none">
                    {step.number}
                  </span>
                </div>

                <h3 className="font-semibold text-lx-ink text-[15px] mb-2 leading-snug">
                  {step.title}
                </h3>
                <p className="text-sm text-lx-stone leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
