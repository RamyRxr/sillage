import { animate, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { motionTokens, REVEAL_MARGIN } from '../../lib/motion'

type CountUpProps = {
  to: number
  /** Where the count starts. Defaults to 0, or 40 below `to` for years. */
  from?: number
  className?: string
}

/** A number that counts up when it scrolls into view. Screen readers only ever hear the final value. */
export function CountUp({ to, from, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: REVEAL_MARGIN })
  const reduce = useReducedMotion()
  const start = from ?? (to > 1000 ? to - 40 : 0)

  useEffect(() => {
    const node = ref.current
    if (!node || reduce) return
    if (!isInView) {
      node.textContent = String(start)
      return
    }
    const controls = animate(start, to, {
      duration: motionTokens.duration.crawl * 1.6,
      ease: motionTokens.easing.smooth,
      onUpdate: (value) => {
        node.textContent = String(Math.round(value))
      },
    })
    return () => controls.stop()
  }, [isInView, reduce, start, to])

  return (
    <span className={className}>
      <span className="sr-only">{to}</span>
      <span ref={ref} aria-hidden="true">
        {to}
      </span>
    </span>
  )
}
