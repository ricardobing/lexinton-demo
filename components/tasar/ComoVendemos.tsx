'use client'

import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { EASE, VIEWPORT } from '@/lib/motion'

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

const portales = [
  { name: 'Zonaprop', color: '#FF6600' },
  { name: 'Argenprop', color: '#00A651' },
  { name: 'MercadoLibre', color: '#f59e0b' },
  { name: 'Properati', color: '#93c5fd' },
]

const bloques = [
  {
    icon: 'solar:map-point-bold-duotone',
    title: 'Publicaciones premium en los principales portales',
    text: 'Tu propiedad en los lugares donde los compradores realmente buscan — con fotos profesionales, descripción optimizada y máxima visibilidad.',
    extra: 'portales',
  },
  {
    icon: 'solar:video-frame-bold-duotone',
    title: 'Video profesional en Instagram, Facebook y YouTube',
    text: 'Producimos un video de tu propiedad y lo llevamos directo a las personas que están buscando comprar en tu zona, con campañas de publicidad paga segmentada por perfil e intereses.',
    extra: null,
  },
  {
    icon: 'solar:magnifer-bold-duotone',
    title: 'Posicionamiento en Google',
    text: 'Utilizamos palabras clave estratégicas para que tu propiedad aparezca cuando alguien busca exactamente lo que vos tenés para ofrecer. Más búsquedas, más consultas, más posibilidades de cerrar.',
    extra: null,
  },
]

export function ComoVendemos() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        {/* Título y subtítulo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.65, ease: EASE }}
          className="max-w-2xl mb-14"
        >
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#C41230] mb-4">
            Cómo vendemos tu propiedad
          </p>
          <h2 className="text-3xl sm:text-4xl font-light text-gray-900 leading-snug mb-5">
            Vender bien no es cuestión de suerte.
          </h2>
          <p className="text-gray-500 leading-relaxed">
            Es estrategia, exposición y llegar al comprador correcto en el momento justo.
            Por eso combinamos las herramientas más efectivas del mercado para que tu
            propiedad no pase desapercibida.
          </p>
        </motion.div>

        {/* 3 bloques */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14"
        >
          {bloques.map((b) => (
            <motion.div key={b.title} variants={staggerItem} className="flex flex-col gap-4">
              <Icon icon={b.icon} className="w-10 h-10 text-[#C41230] flex-shrink-0" />
              <h3 className="text-lg font-medium text-gray-900 leading-snug">{b.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{b.text}</p>
              {b.extra === 'portales' && (
                <div className="flex flex-wrap gap-3 mt-1">
                  {portales.map((p) => (
                    <span
                      key={p.name}
                      className="text-xs font-bold tracking-wide"
                      style={{ color: p.color }}
                    >
                      {p.name}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Frase cierre */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="text-xl italic text-gray-600 text-center"
        >
          El resultado: más personas viendo tu propiedad, en menos tiempo.
        </motion.p>

      </div>
    </section>
  )
}
