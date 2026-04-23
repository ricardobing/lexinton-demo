'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EASE } from '@/lib/motion'

const barrios = [
  {
    nombre: 'Palermo',
    texto:
      'Palermo es uno de los barrios con mayor demanda de compradores en Buenos Aires, con una diversidad de microzonas — Hollywood, Soho, Botánico, Chico — que genera diferencias significativas de valor según la cuadra exacta. Lexinton opera en Palermo desde 2004 con corredores especializados que conocen cada bloque. Si estás evaluando vender en Palermo, completá el formulario y te contactamos.',
  },
  {
    nombre: 'Belgrano',
    texto:
      'Belgrano combina alta densidad de compradores calificados con una oferta que va desde unidades compactas en Belgrano C hasta residencias en Barrancas. Para una tasación precisa en Belgrano, la diferencia entre un simulador y un corredor matriculado que conoce el barrio puede ser determinante. Lexinton trabaja activamente en Belgrano con operaciones mensuales.',
  },
  {
    nombre: 'Núñez',
    texto:
      'Núñez se consolida como una de las mejores relaciones calidad-precio de la zona norte. La demanda sostenida de familias y la renovación edilicia hacen que las tasaciones desactualizadas dejen dinero sobre la mesa. Nuestros corredores trabajan en Núñez con datos de operaciones cerradas en los últimos 90 días.',
  },
  {
    nombre: 'Recoleta',
    texto:
      'Recoleta mantiene su posición como uno de los barrios más demandados por compradores de perfil alto. La tasación en Recoleta requiere un análisis detallado por edificio, piso y estado de conservación — factores que ningún simulador puede capturar. Lexinton realiza tasaciones en Recoleta con información real de mercado.',
  },
  {
    nombre: 'Saavedra',
    texto:
      'Saavedra ofrece una de las mejores ecuaciones entre superficie, verde y precio de zona norte. La tipología dominante — PH y casas con jardín — requiere criterios de tasación específicos. Nuestros corredores conocen el segmento y pueden darte una tasación con información real del mercado local.',
  },
  {
    nombre: 'Villa Urquiza',
    texto:
      'Villa Urquiza atraviesa un proceso sostenido de valorización impulsado por la renovación edilicia y nuevos servicios. Para propietarios que piensan en vender, una tasación actualizada es el primer paso para no ceder valor en la negociación. Lexinton realiza tasaciones en la zona con respuesta en menos de 24 horas.',
  },
]

function AccordionItem({
  barrio,
  isOpen,
  onToggle,
}: {
  barrio: (typeof barrios)[0]
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-lx-line">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-lx-ink text-[15px] group-hover:text-[#C41230] transition-colors duration-200">
            {barrio.nombre}
          </span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2, ease: EASE }}
          className="text-lx-stone text-xl leading-none shrink-0 select-none"
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="text-sm text-lx-stone leading-relaxed pb-5">{barrio.texto}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function SEOBarrios() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="bg-lx-cream py-16 sm:py-20 border-t border-lx-line">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <h2 className="font-serif text-2xl text-lx-ink mb-10">
          Tasaciones en zona norte de Buenos Aires
        </h2>

        {/* Mobile: accordion */}
        <div className="md:hidden">
          {barrios.map((barrio, i) => (
            <AccordionItem
              key={barrio.nombre}
              barrio={barrio}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        {/* Desktop: 2-column grid */}
        <div className="hidden md:grid md:grid-cols-2 gap-x-16 gap-y-10">
          {barrios.map((barrio) => (
            <div key={barrio.nombre}>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-lx-ink text-[15px]">{barrio.nombre}</h3>
              </div>
              <p className="text-sm text-lx-stone leading-relaxed">{barrio.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
