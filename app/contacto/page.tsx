/**
 * /contacto — Página de contacto con dos sucursales
 * Framer Motion animations + PageHero + improved visuals
 */

import type { Metadata } from 'next'
import { LeadForm } from '@/components/LeadForm'
import PageHero from '@/components/PageHero'
import AnimatedSection, { AnimatedItem } from '@/components/AnimatedSection'

export const metadata: Metadata = {
  title: 'Contacto | Lexinton Propiedades Palermo y Vicente López',
  description: 'Oficinas en Palermo y Vicente López. Contactanos por teléfono, email o visitanos personalmente.',
  alternates: { canonical: 'https://lexinton.com.ar/contacto' },
}

const sucursales = [
  {
    nombre: 'Palermo',
    direccion: 'Migueletes 1183',
    localidad: 'Palermo, CABA',
    telefono: '+54 11 3151-9928',
    email: 'info@lexinton.com.ar',
    horario: 'Lunes a viernes 9 a 18hs | Sabados 10 a 14hs',
    mapSrc: 'https://maps.google.com/maps?q=Migueletes+1183+Palermo+Buenos+Aires&output=embed',
  },
  {
    nombre: 'Vicente Lopez',
    direccion: 'Madero 351',
    localidad: 'Vicente Lopez, GBA Norte',
    telefono: '+54 11 3151-9928',
    email: 'info@lexinton.com.ar',
    horario: 'Lunes a viernes 9 a 18hs | Sabados 10 a 14hs',
    mapSrc: 'https://maps.google.com/maps?q=Madero+351+Vicente+Lopez+Buenos+Aires&output=embed',
  },
]

export default function ContactoPage() {
  return (
    <main className="min-h-screen">
      <PageHero
        label="Lexinton Propiedades · Contacto"
        title="Estamos para ayudarte"
        description="Dos sucursales en Buenos Aires. Un equipo disponible para responder todas tus consultas sobre propiedades en venta, alquiler y tasaciones."
      />

      <AnimatedSection className="bg-lx-cream py-16 sm:py-20 border-b border-lx-line" stagger>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <AnimatedItem>
              <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-lx-stone mb-5">Datos de contacto</p>
              <h2 className="font-serif text-3xl font-normal text-lx-ink mb-10">Hablemos</h2>
              <div className="space-y-6">
                {sucursales.map((s) => (
                  <div key={s.nombre} className="border border-lx-line bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-[11px] font-bold tracking-[0.16em] uppercase text-lx-accent mb-4">Sucursal {s.nombre}</h3>
                    <ul className="space-y-3 text-sm text-lx-stone">
                      <li className="flex items-start gap-3">
                        <svg className="w-4 h-4 shrink-0 mt-0.5 text-lx-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                        <span>{s.direccion} — {s.localidad}</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-4 h-4 shrink-0 mt-0.5 text-lx-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 012 3.22 2 2 0 014 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                        <a href="tel:+541131519928" className="hover:text-lx-ink transition-colors">{s.telefono}</a>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-4 h-4 shrink-0 mt-0.5 text-lx-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <a href={`mailto:${s.email}`} className="hover:text-lx-ink transition-colors">{s.email}</a>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-4 h-4 shrink-0 mt-0.5 text-lx-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <span>{s.horario}</span>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            </AnimatedItem>

            <AnimatedItem>
              <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-lx-stone mb-5">Envianos un mensaje</p>
              <h2 className="font-serif text-3xl font-normal text-lx-ink mb-10">Escribinos</h2>
              <div className="bg-white rounded-xl border border-lx-line p-6 sm:p-8 shadow-sm">
                <LeadForm tipo="Contacto" showTipoSelector theme="light" messagePlaceholder="¿En qué podemos ayudarte?" />
              </div>
            </AnimatedItem>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-white py-16 sm:py-20" stagger>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <AnimatedItem>
            <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-lx-stone mb-3">Nuestras Oficinas</p>
            <h2 className="font-serif text-3xl font-normal text-lx-ink mb-10">Cómo llegar</h2>
          </AnimatedItem>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {sucursales.map((s) => (
              <AnimatedItem key={s.nombre}>
                <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-lx-stone mb-3">Sucursal {s.nombre} — {s.direccion}</p>
                <div className="rounded-xl overflow-hidden border border-lx-line shadow-sm">
                  <iframe src={s.mapSrc} width="100%" height="300" className="border-0 w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={`Mapa sucursal ${s.nombre}`} />
                </div>
              </AnimatedItem>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </main>
  )
}
