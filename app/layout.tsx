import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'

export const metadata: Metadata = {
  title: 'Inmobiliaria en Palermo — Lexinton Propiedades',
  description:
    'Somos una empresa dedicada al asesoramiento y soluciones integrales del rubro inmobiliario con 20 años de trayectoria. Líderes en operaciones simultáneas en CABA y GBA.',
  keywords: [
    'inmobiliaria palermo',
    'propiedades Buenos Aires',
    'venta departamentos CABA',
    'alquiler Buenos Aires',
    'Lexinton Propiedades',
    'operaciones simultáneas',
  ].join(', '),
  authors: [{ name: 'Lexinton Propiedades' }],
  openGraph: {
    title: 'Lexinton Propiedades | Inmobiliaria en Palermo',
    description:
      'Líderes en operaciones simultáneas. 20 años de trayectoria en el mercado inmobiliario de CABA y GBA.',
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
    <html lang="es" className={GeistSans.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
