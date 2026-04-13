interface SectionLabelProps {
  children: React.ReactNode
}

export function SectionLabel({ children }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="w-8 h-px bg-lx-red" />
      <span className="text-[11px] uppercase tracking-[0.14em] text-lx-red font-medium">
        {children}
      </span>
    </div>
  )
}
