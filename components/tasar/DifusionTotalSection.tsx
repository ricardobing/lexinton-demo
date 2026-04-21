'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
import {
  InstagramLogo,
  FacebookLogo,
  GoogleLogo,
  ZonapropLogo,
  ArgenpropLogo,
  MetaVideoLogo,
} from '@/components/icons/channel-logos'
import { fadeInUp } from '@/lib/animations'
import { EASE } from '@/lib/motion'

const channels = [
  {
    name: 'Zonaprop',
    copy: 'El portal donde el 70% de los compradores activos empieza su búsqueda',
    Logo: ZonapropLogo,
  },
  {
    name: 'Argenprop',
    copy: 'Segunda audiencia más grande del mercado inmobiliario argentino',
    Logo: ArgenpropLogo,
  },
  {
    name: 'Instagram Ads',
    copy: 'Campañas con foto y video de tu propiedad, segmentadas por zona y poder adquisitivo',
    Logo: InstagramLogo,
  },
  {
    name: 'Facebook Ads',
    copy: 'Alcance a compradores de 35-60 años en Palermo, Belgrano y zona norte',
    Logo: FacebookLogo,
  },
  {
    name: 'Google Ads',
    copy: 'Tu propiedad aparece primero cuando alguien busca "departamento en venta Palermo"',
    Logo: GoogleLogo,
  },
  {
    name: 'Meta Video Ads',
    copy: 'Recorrido virtual en video, con distribución paga a audiencias calificadas',
    Logo: MetaVideoLogo,
  },
]

/** Custom logo card variants — staggered "light up" entrance */
const logoVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: EASE,
    },
  }),
}

/** Animated counter: counts 0 → end with ease-out cubic using rAF */
function AnimatedCounter({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    if (!isInView) return
    const startTime = performance.now()
    const tick = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease out cubic — decelerates near the end
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [isInView, end, duration])

  return <span ref={ref}>{count}</span>
}

export default function DifusionTotalSection() {
  return (
    <section className="bg-white py-20 sm:py-24 border-b border-lx-line">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          <SectionHeader
            label="Difusión Total"
            title="Publicamos donde vive el comprador de tu barrio"
            description="Cada propiedad de Lexinton se publica simultáneamente en los portales con mayor tráfico de Argentina y se activan campañas pagas segmentadas por zona. El comprador de tu departamento está ahí — nosotros lo encontramos."
          />
        </motion.div>

        {/* Channel cards grid — staggered "light up" entrance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {channels.map(({ name, copy, Logo }, i) => (
            <motion.div
              key={name}
              custom={i}
              variants={logoVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              whileHover={{
                y: -4,
                boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
              }}
              transition={{ duration: 0.2 }}
              className="group flex items-start gap-4 bg-white border border-lx-line rounded-xl p-6
                         shadow-sm relative overflow-hidden cursor-default"
            >
              {/* Bottom red accent line on hover */}
              <span
                className="absolute bottom-0 left-0 h-[3px] w-0 bg-lx-red
                           group-hover:w-full transition-all duration-300 rounded-b-xl"
              />
              <div className="shrink-0">
                <Logo size={44} />
              </div>
              <div>
                <p className="font-semibold text-lx-ink text-[15px] mb-1">{name}</p>
                <p className="text-sm text-lx-stone leading-relaxed">{copy}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 80% stat block — full-width gray band */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: EASE }}
        className="mt-20 w-full bg-[#f5f5f3] py-16"
      >
        <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center">
          {/* Animated counter — red number */}
          <p className="font-serif text-[clamp(5rem,14vw,7.5rem)] font-light text-[#C41230] leading-none mb-4">
            <AnimatedCounter end={80} />%
          </p>
          <p className="text-base sm:text-lg text-lx-stone leading-relaxed max-w-md mx-auto mb-3">
            de los propietarios que tasaron con Lexinton eligieron publicar con nosotros.
          </p>
          <p className="text-sm text-lx-stone italic">
            No porque los presionamos — porque confiaron.
          </p>
        </div>
      </motion.div>
    </section>
  )
}
