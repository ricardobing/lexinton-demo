import Image from 'next/image'
import SearchBar from '@/components/SearchBar'

export default function HeroSection() {
  return (
    <section className="relative h-[100svh] min-h-[640px] flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=1800&q=80"
          alt="Palermo, Buenos Aires"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'var(--lx-hero-overlay)' }}
        />
        {/* Subtle bottom gradient for SearchBar readability */}
        <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Content — centered vertically */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-white text-center px-6 pt-[68px]">
        <span className="block text-[11px] tracking-[0.22em] uppercase text-white/70 mb-5 font-medium">
          Inmobiliaria en Palermo · Buenos Aires
        </span>

        <h1 className="text-[clamp(36px,6vw,62px)] font-light leading-[1.1] tracking-tight max-w-3xl text-balance mb-5">
          ¿Necesitás vender
          <br />
          <em className="not-italic font-normal">para comprar?</em>
        </h1>

        <p className="text-[15px] sm:text-[17px] text-white/80 font-light max-w-md leading-relaxed">
          LEXINTON es líder en{' '}
          <strong className="font-medium text-white">
            operaciones simultáneas
          </strong>{' '}
          con 20 años de experiencia en el mercado.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <a
            href="/tasar"
            className="inline-flex items-center gap-2 bg-lx-red text-white text-[12px] font-medium tracking-[0.1em] uppercase px-7 py-3.5 rounded-[4px] hover:bg-[#a80f28] transition-colors duration-200 cursor-pointer"
          >
            Tasar mi inmueble
          </a>
          <a
            href="#propiedades"
            className="inline-flex items-center gap-2 border border-white/40 text-white/90 text-[12px] font-medium tracking-[0.1em] uppercase px-7 py-3.5 rounded-[4px] hover:border-white/70 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Ver propiedades
          </a>
        </div>
      </div>

      {/* SearchBar — pinned to bottom of hero */}
      <div className="relative z-20 px-4 sm:px-6 pb-10">
        <div className="max-w-5xl mx-auto">
          <SearchBar />
        </div>
      </div>
    </section>
  )
}
