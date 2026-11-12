import { motion, useReducedMotion, useSpring } from 'motion/react'
import type { PointerEvent, ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { springs } from '../../lib/motion'

type MagneticProps = {
  children: ReactNode
  className?: string
  /** How far the element follows the pointer, as a share of the pointer's offset. */
  strength?: number
}

/** Pulls its child gently toward a mouse pointer. Does nothing for touch or reduced motion. */
export function Magnetic({ children, className, strength = 0.22 }: MagneticProps) {
  const reduce = useReducedMotion()
  const { stiffness, damping } = springs.snappy
  const x = useSpring(0, { stiffness, damping })
  const y = useSpring(0, { stiffness, damping })

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    if (reduce || event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength)
  }

  function handleLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      className={cn('inline-flex', className)}
      style={{ x, y }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {children}
    </motion.div>
  )
}
