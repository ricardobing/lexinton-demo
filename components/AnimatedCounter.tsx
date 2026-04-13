'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface Props {
  end: number
  suffix?: string
  prefix?: string
  duration?: number
}

export function AnimatedCounter({
  end,
  suffix = '',
  prefix = '',
  duration = 1.5,
}: Props) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!isInView) return
    const startTime = Date.now()
    const timer = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000
      const progress = Math.min(elapsed / duration, 1)
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      if (progress >= 1) {
        setCount(end)
        clearInterval(timer)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, end, duration])

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString('es-AR')}
      {suffix}
    </span>
  )
}
