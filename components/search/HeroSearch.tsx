'use client'

/**
 * HeroSearch
 *
 * Buscador principal del hero. Comprar / Alquilar + barrio autocomplete + tipo.
 * Al buscar redirige a /propiedades con los filtros como searchParams.
 *
 * Mobile-first: columna en móvil, fila en sm+.
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import LocationAutocomplete from './LocationAutocomplete'

const PROPERTY_TYPES = [
  { value: '', label: 'Tipo de propiedad' },
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="w-full max-w-2xl mx-auto" onKeyDown={handleKeyDown}>
      {/* Tabs: COMPRAR / ALQUILAR */}
      <div className="flex mb-2.5">
        {(['Sale', 'Rent'] as const).map((op) => (
          <button
            key={op}
            type="button"
            onClick={() => setOperation(op)}
            className={`px-5 py-2 text-[10.5px] font-bold tracking-[0.22em] uppercase transition-all duration-200 ${
              operation === op
                ? 'bg-white text-lx-ink'
                : 'bg-white/10 text-white/65 border border-white/20 hover:bg-white/18 hover:text-white/90'
            }`}
          >
            {op === 'Sale' ? 'Comprar' : 'Alquilar'}
          </button>
        ))}
      </div>

      {/* Search row — columna en mobile, fila en sm+ */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Barrio (ocupa todo el espacio disponible) */}
        <LocationAutocomplete
          value={locationId}
          displayName={locationName}
          onChange={(id, name) => {
            setLocationId(id)
            setLocationName(name)
          }}
          placeholder="Barrio o zona..."
          theme="dark"
          className="sm:flex-1"
        />

        {/* Tipo de propiedad */}
        <select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="h-[42px] bg-white/10 border border-white/25 text-white text-sm px-3 outline-none focus:border-white/50 cursor-pointer sm:w-44 appearance-none"
          style={{ WebkitAppearance: 'none' }}
          aria-label="Tipo de propiedad"
        >
          {PROPERTY_TYPES.map((t) => (
            <option key={t.value} value={t.value} className="bg-[#1a1a1a] text-white">
              {t.label}
            </option>
          ))}
        </select>

        {/* Botón buscar */}
        <button
          type="button"
          onClick={handleSearch}
          className="h-[42px] bg-white text-lx-ink text-[10.5px] font-bold tracking-[0.20em] uppercase px-7 hover:bg-lx-cream transition-colors duration-200 whitespace-nowrap shrink-0"
        >
          Buscar
        </button>
      </div>
    </div>
  )
}
