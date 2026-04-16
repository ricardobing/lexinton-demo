/**
 * /contacto — Página de contacto con dos sucursales
 * URL idéntica a /contacto (actual)
 */

import type { Metadata } from 'next'
import { LeadForm } from '@/components/LeadForm'

export const metadata: Metadata = {
  title: 'Contacto | Lexinton Propiedades Palermo y Vicente López',
  description: 'Oficinas en Palermo y Vicente López. Contactanos por teléfono, email o visitanos personalmente. Atención de lunes a sábados.',
  alternates: { canonical: 'https://lexinton.com.ar/contacto' },
}

const sucursales = [
  {
    nombre: 'Palermo',
    direccion: 'Migueletes 1183',
    localidad: 'Palermo, CABA',
    telefono: '+54 11 3151-9928',
    email: 'info@lexinton.com.ar',
    horario: 'Lunes a viernes 9–18hs · Sábados 10–14hs',
    mapSrc:
      'https://maps.google.com/maps?q=Migueletes+1183+Palermo+Buenos+Aires&output=embed',
  },
  {
    nombre: 'Vicente López',
    direccion: 'Madero 351',
    localidad: 'Vicente López, GBA Norte',
    telefono: '+54 11 3151-9928',
    email: 'info@lexinton.com.ar',
    horario: 'Lunes a viernes 9–18hs · Sábados 10–14hs',
    mapSrc:
      'https://maps.google.com/maps?q=Madero+351+Vicente+Lopez+Buenos+Aires&output=embed',
  },
]

export default function ContactoPage() {
  return (
    <main className="min-h-screen">

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="bg-lx-ink text-white py-24 sm:py-32 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-lx-accent/80 mb-5">
            Lexinton Propiedades · Contacto
          </p>
          <h1 className="font-serif text-[clamp(2.2rem,5vw,4rem)] font-normal leading-[1.1] tracking-[-0.01em] mb-6 max-w-2xl">
            Estamos para ayudarte
          </h1>
          <p className="text-[16px] text-white/60 leading-[1.85] max-w-xl">
            Dos sucursales en Buenos Aires. Un equipo disponible para responder todas tus consultas sobre propiedades en venta, alquiler y tasaciones.
          </p>
        </div>
      </section>

      {/* ── FORMULARIO + DATOS ───────────────────────── */}
      <section className="bg-lx-cream py-16 sm:py-20 border-b border-lx-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

            {/* Datos de contacto */}
            <div>
              <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-lx-stone mb-5">
                Datos de contacto
              </p>
              <h2 className="font-serif text-3xl font-normal text-lx-ink mb-10">
                Hablemos
              </h2>
              <div className="space-y-8">
                {sucursales.map((s) => (
                  <div key={s.nombre} className="border border-lx-line bg-white p-6">
                    <h3 className="text-[11px] font-bold tracking-[0.16em] uppercase text-lx-accent mb-4">
                      Sucursal {s.nombre}
                    </h3>
                    <ul className="space-y-2 text-sm text-lx-stone">
                      <li className="flex gap-2">
                        <span className="text-lx-ink/40 w-4 shrink-0">📍</span>
                        {s.direccion} · {s.localidad}
                      </li>
                      <li className="flex gap-2">
                        <span className="text-lx-ink/40 w-4 shrink-0">📞</span>
                        <a href="tel:+541131519928" className="hover:text-lx-ink transition-colors">
                          {s.telefono}
                        </a>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-lx-ink/40 w-4 shrink-0">✉</span>
                        <a href={`mailto:${s.email}`} className="hover:text-lx-ink transition-colors">
                          {s.email}
                        </a>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-lx-ink/40 w-4 shrink-0">🕐</span>
                        {s.horario}
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulario */}
            <div>
              <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-lx-stone mb-5">
                Envianos un mensaje
              </p>
              <h2 className="font-serif text-3xl font-normal text-lx-ink mb-10">
                Escribinos
              </h2>
              <LeadForm
                tipo="Contacto"
                showTipoSelector
                theme="light"
                messagePlaceholder="¿En qué podemos ayudarte?"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── MAPAS ────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-lx-stone mb-3">
            Nuestras Oficinas
          </p>
          <h2 className="font-serif text-3xl font-normal text-lx-ink mb-10">
            Cómo llegar
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {sucursales.map((s) => (
              <div key={s.nombre}>
                <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-lx-stone mb-3">
                  Sucursal {s.nombre} — {s.direccion}
                </p>
                <iframe
                  src={s.mapSrc}
                  width="100%"
                  height="300"
                  className="border border-lx-line w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Mapa sucursal ${s.nombre}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
