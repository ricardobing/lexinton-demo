'use client'
import { useState } from 'react'
import type { TokkoProperty } from '@/lib/tokko/types'
import PropertyCard from '@/components/PropertyCard'
import { PropertyList } from '@/components/properties/PropertyList'
import { ViewToggle } from '@/components/properties/ViewToggle'
import { PropertyListCard } from '@/components/properties/PropertyListCard'

interface Props {
  properties: TokkoProperty[]
}

export function EmprendimientosClient({ properties }: Props) {
  const [view, setView] = useState<'grid' | 'list'>('list')

  return (
    <>
      <ViewToggle
        view={view}
        onChange={setView}
        total={properties.length}
        currentOffset={0}
        itemsPerPage={properties.length}
      />

      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} basePath="/emprendimientos" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {properties.map((p) => (
            <PropertyListCard key={p.id} property={p} basePath="/emprendimientos" />
          ))}
        </div>
      )}
    </>
  )
}
