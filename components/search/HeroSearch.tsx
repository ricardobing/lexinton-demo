'use client'

/**
 * HeroSearch — Buscador del hero.
 *
 * Diseño: tarjeta glass sobre el hero con video de fondo.
 * Tabs COMPRAR / ALQUILAR integradas en el header de la tarjeta.
 * Inputs: barrio autocomplete + tipo de propiedad + botón buscar.
 *
 * Mobile-first: todo apilado en columna, tabs full-width.
 * Desktop (sm+): fila horizontal con inputs alineados.
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import LocationAutocomplete from './LocationAutocomplete'

const PROPERTY_TYPES = [
  { value: '', label: 'Cualquier tipo' },
  { value: '2', label: 'Departamento' },
  { value: '3', label: 'Casa' },
  { value: '13', label: 'PH' },
  { value: '31', label: 'Monoambiente' },
  { value: '1', label: 'Terreno' },
  { value: '10', label: 'Cochera' },
  { value: '7', label: 'Local' },
  { value: '5', label: 'Oficina' },
]

export default function HeroSearch() {
  const router = useRouter()
  const [operation, setOperation] = useState<'Sale' | 'Rent'>('Sale')
  const [locationId, setLocationId] = useState('')
  const [locationName, setLocationName] = useState('')
  const [propertyType, setPropertyType] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    params.set('operation', operation)
    if (locationId) {
      params.set('location', locationId)
      params.set('location_name', locationName)
    }
    if (propertyType) params.set('type', propertyType)
    router.push(`/propiedades?${params.toString()}`)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">

      {/* ── Tarjeta glass ─────────────────────────────── */}
      <div className="bg-black/35 backdrop-blur-md border border-white/12">

        {/* Tabs header */}
        <div className="flex border-b border-white/12">
          {(['Sale', 'Rent'] as const).map((op) => {
            const active = operation === op
            return (
              <button
                key={op}
                type="button"
                onClick={() => setOperation(op)}
                className={`flex-1 py-3 text-[10.5px] font-bold tracking-[0.22em] uppercase transition-all duration-200 ${
                  active
                    ? 'bg-white text-lx-ink'
                    : 'text-white/55 hover:text-white/90 hover:bg-white/8'
                }`}
              >
                {op === 'Sale' ? 'Comprar' : 'Alquilar'}
              </button>
            )
          })}
        </div>

        {/* Inputs */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-3">

          {/* Barrio — crece para ocupar espacio disponible */}
          <div className="flex-1 min-w-0">
            <LocationAutocomplete
              value={locationId}
              displayName={locationName}
              onChange={(id, name) => {
                setLocationId(id)
                setLocationName(name)
              }}
              placeholder="Barrio o zona..."
              theme="dark"
            />
          </div>

          {/* Tipo */}
          <div className="relative sm:w-44 shrink-0">
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
              className="w-full h-[42px] bg-white/10 border border-white/25 text-white text-sm pl-3 pr-8 outline-none focus:border-white/50 cursor-pointer appearance-none"
              aria-label="Tipo de propiedad"
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t.value} value={t.value} className="bg-[#1a1a1a] text-white">
                  {t.label}
                </option>
              ))}
            </select>
            {/* Chevron */}
            <svg
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/45"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
            </svg>
          </div>

          {/* Buscar */}
          <button
            type="button"
            onClick={handleSearch}
            className="h-[42px] shrink-0 bg-white text-lx-ink text-[10.5px] font-bold tracking-[0.22em] uppercase px-8 hover:bg-lx-cream active:scale-[0.98] transition-all duration-150 flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            Buscar
          </button>
        </div>
      </div>

    </div>
  )
}
