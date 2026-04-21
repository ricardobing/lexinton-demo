'use client'
import { Icon } from '@iconify/react'

interface Props {
  view: 'grid' | 'list'
  onChange: (view: 'grid' | 'list') => void
  total: number
  currentOffset: number
  itemsPerPage: number
}

export function ViewToggle({ view, onChange, total, currentOffset, itemsPerPage }: Props) {
  return (
    <div className="flex items-center justify-between mb-6">
      <p className="text-[11px] text-lx-stone">
        {total === 0 ? 'Sin resultados' :
         `${currentOffset + 1}–${Math.min(currentOffset + itemsPerPage, total)} de ${total} propiedades`}
      </p>
      <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
        <button
          onClick={() => onChange('list')}
          className={`p-2 rounded-md transition-colors ${
            view === 'list'
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-400 hover:text-gray-600'
          }`}
          aria-label="Vista lista"
        >
          <Icon icon="solar:list-bold" className="w-5 h-5" />
        </button>
        <button
          onClick={() => onChange('grid')}
          className={`p-2 rounded-md transition-colors ${
            view === 'grid'
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-400 hover:text-gray-600'
          }`}
          aria-label="Vista cuadrícula"
        >
          <Icon icon="solar:widget-bold" className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
