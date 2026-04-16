/**
 * /quiero-vender — Propietarios que quieren vender su inmueble
 * URL idéntica a /quiero-vender (actual)
 */

import type { Metadata } from 'next'
import { LeadForm } from '@/components/LeadForm'

export const metadata: Metadata = {
  title: 'Quiero Vender mi Propiedad | Lexinton Propiedades',
  description: 'Vendé tu propiedad en Palermo, Belgrano o zona norte con el equipo de Lexinton. Difusión premium, negociación profesional y cierre garantizado.',
  alternates: { canonical: 'https://lexinton.com.ar/quiero-vender' },
}

const pasos = [
  {
    numero: '01',
    titulo: 'Tasación sin cargo',
    descripcion: 'Analizamos el valor real de mercado de tu propiedad con comparables reales, no fórmulas genéricas.',
  },
  {
    numero: '02',
    titulo: 'Difusión premium',
    descripcion: 'Publicamos en los principales portales, redes sociales y nuestra base de compradores activos.',
  },
  {
    numero: '03',
    titulo: 'Consultas y visitas',
    descripcion: 'Gestionamos todos los contactos y visitas. Vos solo recibís compradores serios y calificados.',
  },
  {
    numero: '04',
    titulo: 'Cierre y escritura',
    descripcion: 'Negociamos en tu nombre y coordinamos escribanos, abogados y todo el proceso de cierre.',
  },
]

const ventajas = [
  { titulo: 'Más de 20 años en el mercado', descripcion: 'Experiencia real en Palermo, Belgrano y zona norte.' },
  { titulo: 'Base de compradores activos', descripcion: 'Miles de interesados en nuestra cartera antes de la publicación.' },
  { titulo: 'Fotografía profesional incluida', descripcion: 'Fotos de alta calidad que maximizan las consultas online.' },
  { titulo: 'Especialistas en simultáneas', descripcion: 'Si necesitás vender y comprar a la vez, somos los indicados.' },
]

export default function QuieroVenderPage() {
  return (
    <main className="min-h-screen">

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="bg-lx-ink text-white pt-[calc(68px+4rem)] pb-20 sm:pt-[calc(68px+6rem)] sm:pb-28 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-lx-accent/80 mb-5">
            Lexinton Propiedades · Vendedores
          </p>
          <h1 className="font-serif text-[clamp(2.2rem,5vw,4rem)] font-normal leading-[1.1] tracking-[-0.01em] mb-6 max-w-2xl">
            Vendé con quienes<br />
            <em className="italic text-white/50">conocen tu barrio</em>
          </h1>
          <p className="text-[16px] text-white/60 leading-[1.85] max-w-xl">
            Más de 20 años cerrando operaciones en Palermo, Belgrano y zona norte. Te acompañamos desde la tasación hasta la escritura.
          </p>
        </div>
      </section>

      {/* ── PROCESO ──────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 border-b border-lx-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-lx-stone mb-3">
            El Proceso
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-lx-ink mb-12">
            ¿Cómo trabajamos?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-lx-line border border-lx-line">
            {pasos.map((p) => (
              <div key={p.numero} className="bg-white px-8 py-10">
                <span className="font-serif text-5xl text-lx-accent/25 leading-none block mb-5">
                  {p.numero}
                </span>
                <h3 className="text-[11px] font-bold tracking-[0.14em] uppercase text-lx-ink mb-3">
                  {p.titulo}
                </h3>
                <p className="text-sm text-lx-stone leading-relaxed">{p.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VENTAJAS ─────────────────────────────────── */}
      <section className="bg-lx-parchment py-16 sm:py-20 border-b border-lx-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-lx-stone mb-3">
            Por Qué Lexinton
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-lx-ink mb-12">
            Ventajas de vender con nosotros
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-lx-line border border-lx-line">
            {ventajas.map((v) => (
              <div key={v.titulo} className="bg-lx-parchment px-8 py-8 flex gap-4">
                <div className="w-px bg-lx-accent shrink-0 mt-1 self-stretch" />
                <div>
                  <h3 className="text-[11px] font-bold tracking-[0.14em] uppercase text-lx-ink mb-2">
                    {v.titulo}
                  </h3>
                  <p className="text-sm text-lx-stone leading-relaxed">{v.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORMULARIO ───────────────────────────────── */}
      <section className="bg-lx-cream py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-xl mx-auto">
            <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-lx-stone mb-3 text-center">
              Quiero Vender
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-lx-ink mb-3 text-center">
              Comenzá el proceso
            </h2>
            <p className="text-sm text-lx-stone text-center mb-10 leading-relaxed">
              Completá el formulario y te contactamos para coordinar la tasación gratuita y sin compromiso.
            </p>
            <LeadForm
              tipo="Quiero Vender"
              showTipoPropiedad
              showBarrio
              showPlazo
              theme="light"
              messagePlaceholder="Contanos sobre tu propiedad (m², ambientes, estado, piso...)"
            />
          </div>
        </div>
      </section>

    </main>
  )
}
