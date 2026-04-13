import Link from 'next/link'

const propertyLinks = [
  { label: 'Departamentos en venta', href: '/' },
  { label: 'Casas en venta', href: '/' },
  { label: 'Alquileres', href: '/' },
  { label: 'Emprendimientos', href: '/' },
  { label: 'Cocheras y locales', href: '/' },
]

const serviceLinks = [
  { label: 'Tasar mi inmueble', href: '/' },
  { label: 'Quiero vender', href: '/' },
  { label: 'Inversor', href: '/' },
  { label: 'Contacto', href: '/' },
]

const officeLinks = [
  {
    label: 'Palermo',
    address: 'Migueletes 1180, CABA',
    phone: '011 4776-5003',
    href: 'tel:01147765003',
  },
  {
    label: 'Vicente López',
    address: 'Madero 381, Vicente López',
    phone: '11 3151-9928',
    href: 'tel:01131519928',
  },
]

export default function Footer() {
  return (
    <footer className="bg-white border-t border-lx-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex flex-col leading-[1.1] mb-4">
              <span className="text-base font-bold tracking-[0.22em] text-lx-red">
                LEXINTON
              </span>
              <span className="text-[8.5px] tracking-[0.32em] font-medium text-lx-mid">
                PROPIEDADES
              </span>
            </Link>
            <p className="text-[13px] text-lx-mid leading-[1.75] mb-5">
              Líderes en operaciones simultáneas. 20 años asesorando a familias
              en la compra, venta y alquiler de propiedades en CABA y GBA.
            </p>
            <a
              href="mailto:info@lexinton.com.ar"
              className="text-[12px] text-lx-mid hover:text-lx-dark transition-colors duration-150 flex items-center gap-2"
            >
              <MailIcon />
              info@lexinton.com.ar
            </a>
          </div>

          {/* Properties */}
          <div>
            <h4 className="text-[11px] font-medium tracking-[0.18em] uppercase text-lx-dark mb-4">
              Propiedades
            </h4>
            <ul className="space-y-2.5">
              {propertyLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[13px] text-lx-mid hover:text-lx-dark transition-colors duration-150 cursor-pointer"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[11px] font-medium tracking-[0.18em] uppercase text-lx-dark mb-4">
              Servicios
            </h4>
            <ul className="space-y-2.5">
              {serviceLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[13px] text-lx-mid hover:text-lx-dark transition-colors duration-150 cursor-pointer"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Offices */}
          <div>
            <h4 className="text-[11px] font-medium tracking-[0.18em] uppercase text-lx-dark mb-4">
              Sucursales
            </h4>
            <div className="space-y-6">
              {officeLinks.map((o) => (
                <div key={o.label}>
                  <p className="text-[12px] font-medium text-lx-dark mb-1">
                    {o.label}
                  </p>
                  <p className="text-[12px] text-lx-mid mb-1">{o.address}</p>
                  <a
                    href={o.href}
                    className="text-[12px] text-lx-mid hover:text-lx-dark transition-colors duration-150 flex items-center gap-1.5"
                  >
                    <PhoneIcon />
                    {o.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-lx-border flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-lx-mid">
          <span>
            © {new Date().getFullYear()} Lexinton Propiedades. Todos los derechos
            reservados.
          </span>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="hover:text-lx-dark transition-colors duration-150 cursor-pointer"
            >
              Privacidad
            </Link>
            <Link
              href="/"
              className="hover:text-lx-dark transition-colors duration-150 cursor-pointer"
            >
              Términos
            </Link>
            {/* WhatsApp */}
            <a
              href="https://wa.me/5491131519928"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-lx-dark transition-colors duration-150"
            >
              <WhatsAppIcon />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function MailIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 13 19.79 19.79 0 0 1 1.93 4.36a2 2 0 0 1 1.99-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  )
}
