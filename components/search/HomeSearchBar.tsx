'use client'

/**
 * HomeSearchBar — Buscador del hero con layout ZonaProp.
 *
 * Fila 1: tabs Alquilar | Comprar | Emprendimientos
 * Fila 2: [Tipo v] [Barrio...] [BUSCAR]
 *
 * Redirige a /propiedades con los mismos searchParams que espera esa página:
 * operation=Sale|Rent|Temporary+rent, type=<id>, location=<id>, location_name=<name>
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import LocationAutocomplete from './LocationAutocomplete'

const TABS = [
  { value: 'Sale',           label: 'Comprar',          op: 'Sale' },
  { value: 'Rent',           label: 'Alquilar',         op: 'Rent' },
  { value: 'Emprendimientos', label: 'Emprendimientos',  op: null },
] as const

const TYPES = [
  { value: '',   label: 'Cualquier tipo' },
  { value: '2',  label: 'Departamento' },
  { value: '3',  label: 'Casa' },
  { value: '13', label: 'PH' },
  { value: '7',  label: 'Local Comercial' },
  { value: '5',  label: 'Oficina' },
  { value: '1',  label: 'Terreno' },
  { value: '10', label: 'Cochera' },
]

export function HomeSearchBar() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<typeof TABS[number]['value']>('Sale')
  const [typeValue, setTypeValue] = useState('')
  const [locationId, setLocationId] = useState('')
  const [locationName, setLocationName] = useState('')

  const handleSearch = () => {
    if (activeTab === 'Emprendimientos') {
      router.push('/emprendimientos')
      return
    }
    const p = new URLSearchParams()
    p.set('operation', activeTab)
    if (typeValue) p.set('type', typeValue)
    if (locationId) { p.set('location', locationId); p.set('location_name', locationName) }
    router.push(`/propiedades?${p.toString()}`)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">

        {/* ── Fila 1: Tabs ──────────────────────────────────────────── */}
        <div className="flex border-b border-gray-100">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={[
                'flex-1 py-4 text-sm font-medium transition-colors duration-150',
                activeTab === tab.value
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700',
              ].join(' ')}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Fila 2: Tipo + Barrio + Botón ─────────────────────────── */}
        <div className="flex items-center gap-2 p-3">

          {/* Select de tipo */}
          <div className="relative flex-shrink-0">
            <select
              value={typeValue}
              onChange={(e) => setTypeValue(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-xl
                px-4 py-3 pr-8 text-sm text-gray-700 min-w-[150px]
                focus:outline-none focus:border-gray-400 cursor-pointer"
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <svg
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
            </svg>
          </div>

          {/* Barrio autocomplete */}
          <div className="flex-1 min-w-0">
            <LocationAutocomplete
              value={locationId}
              displayName={locationName}
              onChange={(id, name) => { setLocationId(id); setLocationName(name) }}
              placeholder="Barrio o zona..."
              theme="light"
            />
          </div>

          {/* Botón Buscar */}
          <button
            type="button"
            onClick={handleSearch}
            className="flex-shrink-0 bg-[#C41230] text-white
              px-5 py-3 rounded-xl text-sm font-semibold
              flex items-center gap-2
              hover:bg-[#a30f28] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            Buscar
          </button>
        </div>
      </div>
    </div>
  )
}
