import { motion, useReducedMotion, type Variants } from 'motion/react'
import type { ReactNode } from 'react'
import { easeSlow, motionTokens, REVEAL_MARGIN, riseItem, staggerParent } from '../../lib/motion'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  distance?: number
}

/** Fades and lifts its children the first time they scroll into view. */
export function Reveal({ children, className, delay = 0, distance = motionTokens.distance.lg }: RevealProps) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: REVEAL_MARGIN }}
      transition={{ ...easeSlow, delay }}
    >
      {children}
    </motion.div>
  )
}

type StaggerProps = { children: ReactNode; className?: string }

/** A group whose `StaggerItem` children enter one after another when scrolled into view. */
export function Stagger({ children, className }: StaggerProps) {
  return (
    <motion.div
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: REVEAL_MARGIN }}
    >
      {children}
    </motion.div>
  )
}

const fadeItem: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: easeSlow },
}

export function StaggerItem({ children, className }: StaggerProps) {
  const reduce = useReducedMotion()
  return (
    <motion.div className={className} variants={reduce ? fadeItem : riseItem}>
      {children}
    </motion.div>
  )
}
