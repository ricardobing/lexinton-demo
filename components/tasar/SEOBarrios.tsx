'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EASE } from '@/lib/motion'

const barrios = [
  {
    nombre: 'Palermo',
    precio: 'USD 3.420/m²',
    texto:
      'En Palermo, el precio del metro cuadrado se mantiene entre los más altos de Buenos Aires, con valores actuales en torno a los USD 3.420/m² para departamentos de 2 y 3 ambientes en buen estado. La diversidad de microzonas — Hollywood, Soho, Botánico, Chico — genera diferencias de hasta 20% en el valor según la cuadra exacta. Lexinton opera en Palermo desde 2004 y cuenta con un equipo de corredores especializados que conocen cada bloque. Si buscás una tasación gratuita en Palermo con datos reales de operaciones cerradas, completá el formulario y te contactamos en menos de 24 horas.',
  },
  {
    nombre: 'Belgrano',
    precio: 'USD 3.294/m²',
    texto:
      'Belgrano combina alta densidad de compradores calificados con una oferta diversa que va desde unidades compactas en Belgrano C hasta residencias de lujo en Barrancas. El valor promedio actual ronda los USD 3.294/m², con picos en las zonas de mayor cotización sobre Avenida del Libertador y el corredor de Juramento. Para una tasación precisa en Belgrano, la diferencia entre un simulador y un corredor matriculado puede significar decenas de miles de dólares. Lexinton trabaja activamente en el barrio con operaciones mensuales de compraventa.',
  },
  {
    nombre: 'Núñez',
    precio: 'USD 2.800/m²',
    texto:
      'Núñez se consolida como una de las mejores relaciones calidad-precio de la zona norte, con valores actuales en torno a los USD 2.800/m². La demanda sostenida de familias y la renovación del parque habitacional hacen que las tasaciones desactualizadas dejen dinero sobre la mesa. Si tenés una propiedad en Núñez y estás evaluando vender, una tasación profesional gratuita con Lexinton te da el valor real de mercado con comparables de los últimos 90 días.',
  },
  {
    nombre: 'Recoleta',
    precio: 'USD 2.500/m²',
    texto:
      'Recoleta mantiene su status como uno de los barrios más demandados por compradores internacionales y locales de perfil alto, con precios que promedian los USD 2.500/m² en el segmento residencial estándar y valores significativamente superiores en edificios de categoría. La tasación en Recoleta requiere un análisis detallado por edificio, piso y estado de conservación — factores que ningún simulador online puede capturar. Lexinton realiza tasaciones gratuitas en Recoleta con informes basados en operaciones reales de la zona.',
  },
  {
    nombre: 'Saavedra',
    precio: 'USD 1.900/m²',
    texto:
      'Saavedra ofrece una de las mejores ecuaciones entre superficie, verde y precio de zona norte, con valores actuales de USD 1.900/m² que atraen tanto a familias en crecimiento como a inversores que buscan rendimiento. La tipología dominante — PH y casas con jardín — requiere criterios de tasación específicos que difieren del departamento estándar. Si tenés una propiedad en Saavedra, nuestros corredores conocen el segmento de la zona y pueden darte una tasación gratuita con información real de mercado.',
  },
  {
    nombre: 'Villa Urquiza',
    precio: 'USD 2.200/m²',
    texto:
      'Villa Urquiza atraviesa un proceso sostenido de valorización impulsado por la renovación edilicia y la llegada de nuevos comercios y servicios. El precio actual de USD 2.200/m² refleja una demanda activa, especialmente en el corredor de Avenida Triunvirato y el eje de Monroe. Para propietarios que piensan en vender en Villa Urquiza, una tasación actualizada con datos reales es el primer paso para no ceder valor en la negociación. Lexinton realiza tasaciones gratuitas en la zona con respuesta en menos de 24 horas.',
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
          <span className="text-xs text-lx-stone font-mono">{barrio.precio}</span>
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
                <span className="text-xs text-lx-stone font-mono">{barrio.precio}</span>
              </div>
              <p className="text-sm text-lx-stone leading-relaxed">{barrio.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
