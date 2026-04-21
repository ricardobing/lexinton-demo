/**
 * Channel logo SVGs for the "Difusión Total" section on /tasar
 */

export function InstagramLogo({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#ig-grad)" />
      <rect x="8" y="8" width="32" height="32" rx="10" fill="none" stroke="white" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="8" fill="none" stroke="white" strokeWidth="2.5" />
      <circle cx="33" cy="15" r="2" fill="white" />
    </svg>
  )
}

export function FacebookLogo({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="12" fill="#1877F2" />
      <path
        d="M28 24h-3v10h-4V24h-2v-4h2v-2c0-3 1.5-5 5-5h3v4h-2c-1 0-1 .5-1 1v2h3l-.5 4z"
        fill="white"
      />
    </svg>
  )
}

export function GoogleLogo({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="12" fill="white" stroke="#e5e7eb" strokeWidth="1" />
      <path
        fill="#4285F4"
        d="M44 24c0-1.4-.1-2.8-.4-4H24v7.6h11.3c-.5 2.6-2 4.8-4.2 6.3v5.2h6.8C41.5 35 44 30 44 24z"
      />
      <path
        fill="#34A853"
        d="M24 44c5.7 0 10.5-1.9 14-5.1l-6.8-5.2c-1.9 1.3-4.3 2-7.2 2-5.5 0-10.2-3.7-11.9-8.8H5.2v5.4C8.7 40.1 15.9 44 24 44z"
      />
      <path
        fill="#FBBC05"
        d="M12.1 26.9c-.4-1.3-.7-2.6-.7-4s.3-2.7.7-4v-5.4H5.2C3.8 16.3 3 20 3 24s.8 7.7 2.2 10.5l6.9-5.4z"
      />
      <path
        fill="#EA4335"
        d="M24 10.2c3.1 0 5.9 1.1 8.1 3.1l6-6C34.5 3.9 29.7 2 24 2 15.9 2 8.7 5.9 5.2 13.5l6.9 5.4c1.7-5.1 6.4-8.7 11.9-8.7z"
      />
    </svg>
  )
}

export function ZonapropLogo({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="10" fill="#FF6600" />
      <text
        x="24"
        y="29"
        textAnchor="middle"
        fill="white"
        fontSize="13"
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        ZP
      </text>
    </svg>
  )
}

export function ArgenpropLogo({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="10" fill="#00A651" />
      <text
        x="24"
        y="29"
        textAnchor="middle"
        fill="white"
        fontSize="13"
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        AP
      </text>
    </svg>
  )
}

export function MetaVideoLogo({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="12" fill="#0866FF" />
      <path d="M18 16l14 8-14 8V16z" fill="white" />
    </svg>
  )
}
