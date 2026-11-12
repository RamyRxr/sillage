import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigationType, useOutlet } from 'react-router'
import { CartDrawer } from '../../features/cart/CartDrawer'
import { pageVariants } from '../../lib/motion'
import { RouteCurtain, ScrollProgress } from './Chrome'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

/**
 * One page plus the footer. It keeps the page it was created with, so the old page can finish its
 * exit animation while the router has already moved on.
 */
// Where each history entry was scrolled to, so Back and Forward return to the same place.
const scrollPositions = new Map<string, number>()

function PageFrame() {
  const outlet = useOutlet()
  const [page] = useState(outlet)
  const navigationType = useNavigationType()
  const { key } = useLocation()
  // Decided once, when this page appears. Later URL changes on the same page (search, filters) must
  // not move focus or scroll, or typing in the search box would stop after one letter.
  const [entry] = useState(() => ({ key, isPop: navigationType === 'POP' }))
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const saved = scrollPositions.get(entry.key)
    if (!entry.isPop) {
      window.scrollTo(0, 0)
      // Move keyboard and screen-reader focus to the new page, unless something on the page (like the
      // search box) has already asked for it.
      const main = mainRef.current
      if (main && !main.contains(document.activeElement)) {
        main.focus({ preventScroll: true })
      }
    } else if (saved !== undefined) {
      window.scrollTo(0, saved)
    }
    return () => {
      scrollPositions.set(entry.key, window.scrollY)
    }
  }, [entry])

  return (
    // overflow-x-clip stops the large decorative glows from widening the page on phones, without
    // creating a scroll container (so sticky summaries keep working).
    <motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit" className="overflow-x-clip">
      <main ref={mainRef} id="main" tabIndex={-1} className="outline-none">
        {page}
      </main>
      <SiteFooter />
    </motion.div>
  )
}

export function Layout() {
  const { pathname } = useLocation()
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[70] rounded-full bg-cocoa px-5 py-3 text-sm font-bold text-cream focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <SiteHeader />
      <AnimatePresence mode="wait">
        <PageFrame key={pathname} />
      </AnimatePresence>
      <CartDrawer />
      <RouteCurtain />
    </>
  )
}
