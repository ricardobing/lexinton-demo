'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { neighborhoods, propertyTypes } from '@/lib/properties'

type Tab = 'Todo' | 'Venta' | 'Alquiler' | 'Temporal'

const TABS: Tab[] = ['Todo', 'Venta', 'Alquiler', 'Temporal']

const ROOMS = ['1', '2', '3', '4', '5+']

export default function SearchBar() {
  const [activeTab, setActiveTab] = useState<Tab>('Todo')
  const [neighborhood, setNeighborhood] = useState('')
  const [type, setType] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [rooms, setRooms] = useState('')

  return (
    <div className="bg-white rounded-[4px] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.18)]">
      {/* Tabs */}
      <div className="flex border-b border-lx-border">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-1 sm:flex-none px-4 sm:px-6 py-3 text-[11px] font-medium tracking-[0.1em] uppercase transition-colors duration-150 cursor-pointer relative',
              activeTab === tab
                ? 'text-lx-red'
                : 'text-lx-mid hover:text-lx-dark',
            )}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-lx-red" />
            )}
          </button>
        ))}
      </div>

      {/* Filters row */}
      <div className="p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-4 lg:flex lg:items-center gap-2">
        <Select
          value={neighborhood}
          onChange={setNeighborhood}
          placeholder="Barrio"
          className="lg:flex-1"
        >
          {neighborhoods.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </Select>

        <Select
          value={type}
          onChange={setType}
          placeholder="Tipo"
          className="lg:flex-1"
        >
          {propertyTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>

        <Select
          value={bedrooms}
          onChange={setBedrooms}
          placeholder="Dormitorios"
          className="lg:flex-1"
        >
          {ROOMS.map((r) => (
            <option key={r} value={r}>
              {r} dormitorio{r !== '1' ? 's' : ''}
            </option>
          ))}
        </Select>

        <Select
          value={rooms}
          onChange={setRooms}
          placeholder="Ambientes"
          className="lg:flex-1"
        >
          {['Monoambiente', ...ROOMS.map((r) => `${r} ambientes`)].map(
            (r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ),
          )}
        </Select>

        <button className="col-span-2 sm:col-span-4 lg:col-span-1 lg:flex-none bg-lx-red text-white text-[12px] font-medium tracking-[0.12em] uppercase px-8 py-3 rounded-[4px] hover:bg-[#a80f28] transition-colors duration-200 cursor-pointer whitespace-nowrap flex items-center justify-center gap-2">
          <SearchIcon />
          Buscar
        </button>
      </div>
    </div>
  )
}

interface SelectProps {
  value: string
  onChange: (v: string) => void
  placeholder: string
  className?: string
  children: React.ReactNode
}

function Select({
  value,
  onChange,
  placeholder,
  className,
  children,
}: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        'w-full appearance-none bg-lx-light border border-lx-border text-lx-dark text-[12px] px-3 py-2.5 rounded-[4px] cursor-pointer focus:outline-none focus:border-lx-red transition-colors duration-150',
        !value && 'text-lx-mid',
        className,
      )}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {children}
    </select>
  )
}

function SearchIcon() {
  return (
    <svg
      className="w-3.5 h-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}
