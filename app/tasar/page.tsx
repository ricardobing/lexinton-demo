/**
 * /tasar — Tasación de inmuebles en Buenos Aires
 * URL idéntica a /tasar (actual)
 */

import type { Metadata } from 'next'
import { LeadForm } from '@/components/LeadForm'

export const metadata: Metadata = {
  title: 'Tasar Propiedades en Buenos Aires | Lexinton Propiedades',
  description: 'Tasación profesional y gratuita de propiedades en Palermo, Belgrano y zona norte. Valuación real de mercado por brokers con 20 años de experiencia.',
  alternates: { canonical: 'https://lexinton.com.ar/tasar' },
}

const diferenciadores = [
  {
    titulo: 'Valor real de mercado',
    descripcion: 'No inflamos ni subestimamos. Trabajamos con comparables reales de nuestra base de operaciones cerradas en la zona.',
  },
  {
    titulo: 'Broker especializado por zona',
    descripcion: 'El tasador que te atiene conoce el barrio de primera mano. No es una fórmula genérica online.',
  },
  {
    titulo: 'Sin compromiso de exclusividad',
    descripcion: 'La tasación es gratuita. Podés contratarnos o no. Te damos el informe igual.',
  },
]

const queIncluye = [
  'Análisis comparativo de mercado (ACM) con propiedades similares',
  'Valuación de m² cubierto y semicubierto por zona y piso',
  'Estado de conservación y potencial de mejora',
  'Estimación de tiempo de venta al precio sugerido',
  'Recomendaciones para maximizar el valor antes de publicar',
]

export default function TasarPage() {
  return (
    <main className="min-h-screen">

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="bg-lx-ink text-white pt-[calc(68px+4rem)] pb-20 sm:pt-[calc(68px+6rem)] sm:pb-28 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-lx-accent/80 mb-5">
            Lexinton Propiedades · Tasaciones
          </p>
          <h1 className="font-serif text-[clamp(2.2rem,5vw,4rem)] font-normal leading-[1.1] tracking-[-0.01em] mb-6 max-w-2xl">
            Sabé cuánto vale<br />
            <em className="italic text-white/50">tu propiedad hoy</em>
          </h1>
          <p className="text-[16px] text-white/60 leading-[1.85] max-w-xl">
            Tasación gratuita por un broker especialista en tu zona. Sin sorpresas, sin números inflados. El valor real que te permite vender.
          </p>
        </div>
      </section>

      {/* ── POR QUÉ ELEGIRNOS ────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 border-b border-lx-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-lx-stone mb-3">
            Nuestra Metodología
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-lx-ink mb-12">
            ¿Por qué elegirnos?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-lx-line border border-lx-line">
            {diferenciadores.map((d) => (
              <div key={d.titulo} className="bg-white px-8 py-10">
                <div className="w-8 h-px bg-lx-accent mb-6" />
                <h3 className="text-[11px] font-bold tracking-[0.16em] uppercase text-lx-ink mb-4">
                  {d.titulo}
                </h3>
                <p className="text-sm text-lx-stone leading-relaxed">{d.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUÉ INCLUYE ──────────────────────────────── */}
      <section className="bg-lx-parchment py-16 sm:py-20 border-b border-lx-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-lx-stone mb-3">
                El Informe
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-lx-ink mb-8">
                ¿Qué incluye la tasación?
              </h2>
              <ul className="space-y-4">
                {queIncluye.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-lx-stone leading-relaxed">
                    <span className="mt-0.5 text-lx-accent shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-lx-line bg-white p-8">
              <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-lx-stone mb-2">
                100% gratuita
              </p>
              <p className="font-serif text-3xl text-lx-ink mb-4">Sin costo ni compromiso</p>
              <p className="text-sm text-lx-stone leading-relaxed">
                La tasación no te obliga a publicar con nosotros. Pero más del 80% de los propietarios que tasaron con Lexinton nos eligen para vender. Hablamos con hechos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FORMULARIO ───────────────────────────────── */}
      <section className="bg-lx-cream py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-xl mx-auto">
            <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-lx-stone mb-3 text-center">
              Tasación Gratuita
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-lx-ink mb-3 text-center">
              Solicitá tu tasación
            </h2>
            <p className="text-sm text-lx-stone text-center mb-10 leading-relaxed">
              Completá el formulario y un broker de tu zona te contactará en menos de 24hs hábiles.
            </p>
            <LeadForm
              tipo="Tasación"
              showTipoPropiedad
              showBarrio
              theme="light"
              messagePlaceholder="¿Qué querés tasar? Indicanos dirección o barrio, m² y características."
            />
          </div>
        </div>
      </section>

    </main>
  )
}
