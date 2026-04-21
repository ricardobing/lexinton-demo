import type { TokkoProperty } from '@/lib/tokko/types'
import { PropertyListCard } from './PropertyListCard'

interface Props {
  properties: TokkoProperty[]
}

export function PropertyList({ properties }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {properties.map(property => (
        <PropertyListCard key={property.id} property={property} />
      ))}
    </div>
  )
}
