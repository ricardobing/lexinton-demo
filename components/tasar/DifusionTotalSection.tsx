'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
import {
  InstagramLogo,
  FacebookLogo,
  GoogleLogo,
  ZonapropLogo,
  ArgenpropLogo,
  MetaVideoLogo,
} from '@/components/icons/channel-logos'
import { fadeInUp, staggerContainer, fadeIn } from '@/lib/animations'

const channels = [
  {
    name: 'Zonaprop',
    copy: 'El portal inmobiliario líder en Argentina',
    Logo: ZonapropLogo,
  },
  {
    name: 'Argenprop',
    copy: 'Millones de búsquedas mensuales de compradores',
    Logo: ArgenpropLogo,
  },
  {
    name: 'Instagram',
    copy: 'Campañas segmentadas por zona e interés',
    Logo: InstagramLogo,
  },
  {
    name: 'Facebook',
    copy: 'Alcance masivo con pauta dirigida',
    Logo: FacebookLogo,
  },
  {
    name: 'Google',
    copy: 'Aparecer primero cuando alguien busca propiedades',
    Logo: GoogleLogo,
  },
  {
    name: 'Meta Video',
    copy: 'Reels y videos patrocinados de tu propiedad',
    Logo: MetaVideoLogo,
  },
]

/** Animated counter that counts from 0 to target when it enters the viewport */
function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1400
          const steps = 60
          const increment = target / steps
          let current = 0
          const interval = setInterval(() => {
            current += increment
            if (current >= target) {
              setCount(target)
              clearInterval(interval)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
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
            title="Tu propiedad, en todos lados"
            description="Publicamos en los portales con mayor tráfico del país y activamos campañas pagas en redes sociales para que tu propiedad llegue a los compradores correctos."
          />
        </motion.div>

        {/* Channel cards grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12"
        >
          {channels.map(({ name, copy, Logo }) => (
            <motion.div
              key={name}
              variants={fadeInUp}
              className="group flex items-start gap-4 bg-white border border-lx-line rounded-xl p-6
                         shadow-sm hover:shadow-md transition-shadow duration-300
                         relative overflow-hidden"
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
        </motion.div>
      </div>

      {/* 80% stat block — full-width gray band */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        className="mt-20 w-full bg-[#f5f5f3] py-16"
      >
        <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center">
          <p className="font-serif text-7xl sm:text-8xl font-bold text-lx-ink leading-none mb-4">
            <AnimatedNumber target={80} suffix="%" />
          </p>
          <p className="text-base sm:text-lg text-lx-stone leading-relaxed max-w-md mx-auto">
            de los propietarios que tasaron con Lexinton nos eligieron para vender su propiedad.
          </p>
        </div>
      </motion.div>
    </section>
  )
}
