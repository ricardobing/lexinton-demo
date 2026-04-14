import type { Metadata } from 'next'
import { Inter, Instrument_Serif } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Lexinton Propiedades — Especialistas en operaciones inmobiliarias en Palermo',
  description:
    'Coordinamos venta, compra y tasación con una estrategia clara, tiempos sincronizados y acompañamiento experto. 20 años de trayectoria en CABA y zona norte.',
  keywords: [
    'inmobiliaria palermo',
    'operaciones simultáneas',
    'vender para comprar Buenos Aires',
    'tasación inmueble CABA',
    'Lexinton Propiedades',
  ].join(', '),
  authors: [{ name: 'Lexinton Propiedades' }],
  openGraph: {
    title: 'Lexinton Propiedades — Especialistas en operaciones inmobiliarias',
    description:
      'Coordinamos venta, compra y tasación con estrategia clara y tiempos sincronizados. Palermo y zona norte.',
    url: 'https://lexinton.com.ar',
    siteName: 'Lexinton Propiedades',
    locale: 'es_AR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className="font-sans antialiased bg-lx-cream text-lx-ink">{children}</body>
    </html>
  )
}
