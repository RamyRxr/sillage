import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { motionTokens, springs } from '../../lib/motion'

/** Thin gradient line along the top that fills as you scroll the page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const { stiffness, damping } = springs.snappy
  const scaleX = useSpring(scrollYProgress, { stiffness, damping })
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-[linear-gradient(90deg,#f0b66b,#e99a9a,#a4483c)]"
      style={{ scaleX }}
    />
  )
}

/** A warm panel that sweeps up over the page and away again on every page change. */
export function RouteCurtain() {
  const { pathname } = useLocation()
  const reduce = useReducedMotion()
  const [run, setRun] = useState(0)
  const lastPath = useRef(pathname)

  useEffect(() => {
    if (lastPath.current === pathname) return
    lastPath.current = pathname
    setRun((count) => count + 1)
  }, [pathname])

  if (reduce || run === 0) return null

  const duration = motionTokens.duration.crawl
  return (
    <motion.div
      key={run}
      aria-hidden="true"
      className="panel-gradient pointer-events-none fixed inset-0 z-[60] grid place-items-center"
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      animate={{
        clipPath: ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 100% 0%)'],
      }}
      transition={{ duration, times: [0, 0.36, 0.52, 1], ease: motionTokens.easing.smooth }}
    >
      <motion.span
        className="text-[max(0.8125rem,11px)] font-extrabold tracking-[0.42em] text-cocoa"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration, times: [0, 0.34, 0.5, 0.8] }}
      >
        SILLAGE
      </motion.span>
    </motion.div>
  )
}
