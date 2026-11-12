import type { Transition, Variants } from 'motion/react'

type Bezier = [number, number, number, number]

const smooth: Bezier = [0.22, 1, 0.36, 1]
const sharp: Bezier = [0.4, 0, 0.2, 1]

/** Every duration, easing, distance and scale used by an animation comes from here. */
export const motionTokens = {
  duration: { instant: 0.08, fast: 0.18, normal: 0.35, slow: 0.6, crawl: 1.0 },
  easing: { smooth, sharp },
  distance: { xs: 4, sm: 8, md: 16, lg: 24, xl: 48 },
  scale: { subtle: 0.98, press: 0.95, pop: 1.04 },
  stagger: 0.08,
  staggerFast: 0.05,
  delay: { short: 0.2, medium: 0.4, long: 0.7 },
  /** Durations of looping animations (spinner, bobbing arrow). */
  loop: { spin: 0.8, bob: 1.8 },
}

export const springs = {
  snappy: { type: 'spring', stiffness: 300, damping: 30 },
  gentle: { type: 'spring', stiffness: 120, damping: 14 },
  instant: { type: 'spring', stiffness: 600, damping: 35 },
} satisfies Record<string, Transition>

export const easeSlow: Transition = { duration: motionTokens.duration.slow, ease: smooth }
export const easeNormal: Transition = { duration: motionTokens.duration.normal, ease: smooth }
export const easeFast: Transition = { duration: motionTokens.duration.fast, ease: sharp }

/** Parent for a group whose children enter one after another. */
export const staggerParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: motionTokens.stagger, delayChildren: 0.1 } },
}

/** Child of `staggerParent`: fades in while rising. */
export const riseItem: Variants = {
  hidden: { opacity: 0, y: motionTokens.distance.lg },
  visible: { opacity: 1, y: 0, transition: easeSlow },
}

export const pageVariants: Variants = {
  initial: { opacity: 0, y: motionTokens.distance.md },
  enter: { opacity: 1, y: 0, transition: easeSlow },
  exit: { opacity: 0, y: -motionTokens.distance.sm, transition: easeFast },
}

/** Margin that makes scroll reveals start a little after the element enters the screen. */
export const REVEAL_MARGIN = '-80px'
