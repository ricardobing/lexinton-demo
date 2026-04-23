'use client'

interface Props {
  /** The phone number (without prefix) */
  value: string
  onChange: (value: string) => void
  /** The country prefix, e.g. '+54'. Controlled by parent. */
  prefix: string
  onPrefixChange: (prefix: string) => void
  placeholder?: string
  /** Extra classes for the number input */
  inputClassName?: string
  /** Extra classes for the prefix box */
  prefixClassName?: string
}

/**
 * PhoneInput — campo de teléfono con prefijo de país editable.
 *
 * El prefijo está controlado por el componente padre (prefix + onPrefixChange).
 * Al enviar el formulario, el padre concatena: `${prefix} ${value}`.
 *
 * Flag logic:
 *  - Si prefix === '+54' → 🇦🇷
 *  - Cualquier otro valor → 🌐
 */
export function PhoneInput({
  value,
  onChange,
  prefix,
  onPrefixChange,
  placeholder = '11 1234-5678',
  inputClassName = 'flex-1 px-4 py-3 border border-gray-200 rounded-xl text-base focus:border-gray-400 focus:outline-none transition-colors',
  prefixClassName = 'flex items-center gap-1.5 px-3 border border-gray-200 rounded-xl bg-white min-w-[84px]',
}: Props) {
  const flag = prefix.replace(/\s/g, '') === '+54' ? '🇦🇷' : '🌐'

  return (
    <div className="flex gap-2">
      {/* Prefix box */}
      <div className={prefixClassName}>
        <span className="text-base leading-none select-none">{flag}</span>
        <input
          type="text"
          value={prefix}
          onChange={e => onPrefixChange(e.target.value)}
          className="w-10 text-sm text-gray-700 bg-transparent focus:outline-none"
          maxLength={6}
          aria-label="Prefijo de país"
        />
      </div>
      {/* Number */}
      <input
        type="tel"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClassName}
      />
    </div>
  )
}
