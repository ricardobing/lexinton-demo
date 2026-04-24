'use client'

import { Icon } from '@iconify/react'

const socials = [
  {
    name: 'Instagram',
    handle: '@lexintonpropiedades',
    url: 'https://www.instagram.com/lexintonpropiedades/',
    icon: 'mdi:instagram',
    bg: 'bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]',
    text: 'text-white',
  },
  {
    name: 'Facebook',
    handle: 'LexintonPropiedadesOficial',
    url: 'https://www.facebook.com/LexintonPropiedadesOficial',
    icon: 'mdi:facebook',
    bg: 'bg-[#1877F2]',
    text: 'text-white',
  },
  {
    name: 'LinkedIn',
    handle: 'lexinton-propiedades',
    url: 'https://www.linkedin.com/company/lexinton-propiedades/',
    icon: 'mdi:linkedin',
    bg: 'bg-[#0A66C2]',
    text: 'text-white',
  },
  {
    name: 'YouTube',
    handle: '@LexintonPropiedades',
    url: 'https://www.youtube.com/@LexintonPropiedades',
    icon: 'mdi:youtube',
    bg: 'bg-[#FF0000]',
    text: 'text-white',
  },
]

export function SocialFollowBar() {
  return (
    <section className="bg-lx-cream py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-[10px] tracking-[0.3em] font-semibold text-lx-ink/40 uppercase mb-2">
            Seguinos en
          </p>
          <h2 className="text-2xl font-semibold text-lx-ink">Nuestras redes sociales</h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Seguinos en ${s.name}`}
              className={`${s.bg} ${s.text} rounded-2xl p-5 flex flex-col items-center gap-3 group transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg`}
            >
              <Icon icon={s.icon} className="w-8 h-8 opacity-95" />
              <span className="text-sm font-semibold">{s.name}</span>
              <span className="text-[11px] opacity-80 text-center truncate w-full text-center">
                {s.handle}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
