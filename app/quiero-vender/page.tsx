/**
 * /quiero-vender — Propietarios que quieren vender su inmueble
 * Framer Motion + PageHero + premium visuals
 */

import type { Metadata } from 'next'
import { LeadForm } from '@/components/LeadForm'
import PageHero from '@/components/PageHero'
import AnimatedSection, { AnimatedItem } from '@/components/AnimatedSection'

export const metadata: Metadata = {
  title: 'Quiero Vender mi Propiedad | Lexinton Propiedades',
  description: 'Vendé tu propiedad en Palermo, Belgrano o zona norte con el equipo de Lexinton.',
  alternates: { canonical: 'https://lexinton.com.ar/quiero-vender' },
}

const pasos = [
  { numero: '01', titulo: 'Tasación sin cargo', descripcion: 'Analizamos el valor real de mercado de tu propiedad con comparables reales, no fórmulas genéricas.' },
  { numero: '02', titulo: 'Difusión premium', descripcion: 'Publicamos en los principales portales, redes sociales y nuestra base de compradores activos.' },
  { numero: '03', titulo: 'Consultas y visitas', descripcion: 'Gestionamos todos los contactos y visitas. Vos solo recibís compradores serios y calificados.' },
  { numero: '04', titulo: 'Cierre y escritura', descripcion: 'Negociamos en tu nombre y coordinamos escribanos, abogados y todo el proceso de cierre.' },
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
      <PageHero
        label="Lexinton Propiedades · Vendedores"
        title="Vendé con quienes"
        titleEmphasis="conocen tu barrio"
        description="Más de 20 años cerrando operaciones en Palermo, Belgrano y zona norte. Te acompañamos desde la tasación hasta la escritura."
      />

      {/* ── PROCESO ──────────────────────────────────── */}
      <AnimatedSection className="bg-white py-16 sm:py-20 border-b border-lx-line" stagger>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <AnimatedItem>
            <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-lx-stone mb-3">El Proceso</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-lx-ink mb-12">¿Cómo trabajamos?</h2>
          </AnimatedItem>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pasos.map((p) => (
              <AnimatedItem key={p.numero}>
                <div className="bg-white border border-lx-line rounded-xl p-8 h-full shadow-sm hover:shadow-md transition-shadow duration-300">
                  <span className="font-serif text-5xl text-lx-accent/25 leading-none block mb-5">{p.numero}</span>
                  <h3 className="text-[11px] font-bold tracking-[0.14em] uppercase text-lx-ink mb-3">{p.titulo}</h3>
                  <p className="text-sm text-lx-stone leading-relaxed">{p.descripcion}</p>
                </div>
              </AnimatedItem>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ── VENTAJAS ─────────────────────────────────── */}
      <AnimatedSection className="bg-lx-parchment py-16 sm:py-20 border-b border-lx-line" stagger>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <AnimatedItem>
            <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-lx-stone mb-3">Por Qué Lexinton</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-lx-ink mb-12">Ventajas de vender con nosotros</h2>
          </AnimatedItem>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {ventajas.map((v) => (
              <AnimatedItem key={v.titulo}>
                <div className="bg-white border border-lx-line rounded-xl p-8 h-full shadow-sm hover:shadow-md transition-shadow duration-300 flex gap-4">
                  <div className="w-px bg-lx-accent shrink-0 mt-1 self-stretch" />
                  <div>
                    <h3 className="text-[11px] font-bold tracking-[0.14em] uppercase text-lx-ink mb-2">{v.titulo}</h3>
                    <p className="text-sm text-lx-stone leading-relaxed">{v.descripcion}</p>
                  </div>
                </div>
              </AnimatedItem>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ── FORMULARIO ───────────────────────────────── */}
      <AnimatedSection className="bg-lx-cream py-20 sm:py-28" stagger>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-xl mx-auto">
            <AnimatedItem>
              <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-lx-stone mb-3 text-center">Quiero Vender</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-lx-ink mb-3 text-center">Comenzá el proceso</h2>
              <p className="text-sm text-lx-stone text-center mb-10 leading-relaxed">
                Completá el formulario y te contactamos para coordinar la tasación gratuita y sin compromiso.
              </p>
            </AnimatedItem>
            <AnimatedItem>
              <div className="bg-white rounded-xl border border-lx-line p-6 sm:p-8 shadow-sm">
                <LeadForm tipo="Quiero Vender" showTipoPropiedad showBarrio showPlazo theme="light" messagePlaceholder="Contanos sobre tu propiedad (m², ambientes, estado, piso...)" />
              </div>
            </AnimatedItem>
          </div>
        </div>
      </AnimatedSection>
    </main>
  )
}
