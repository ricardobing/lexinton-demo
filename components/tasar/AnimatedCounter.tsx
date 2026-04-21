'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface AnimatedCounterProps {
  end: number
  duration?: number
  pauseDuration?: number
  loop?: boolean
}

export function AnimatedCounter({
  end,
  duration = 3500,
  pauseDuration = 5000,
  loop = false,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: false, margin: '-80px' })

  useEffect(() => {
    if (!isInView) return

    let startTime: number
    let animationFrame: number
    let loopTimer: ReturnType<typeof setTimeout>

    const animate = () => {
      startTime = performance.now()

      const tick = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setCount(Math.floor(eased * end))

        if (progress < 1) {
          animationFrame = requestAnimationFrame(tick)
        } else {
          setCount(end)
          if (loop) {
            loopTimer = setTimeout(() => {
              setCount(0)
              animate()
            }, pauseDuration)
          }
        }
      }

      animationFrame = requestAnimationFrame(tick)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrame)
      clearTimeout(loopTimer)
    }
  }, [isInView, end, duration, pauseDuration, loop])

  return <span ref={ref}>{count}</span>
}
