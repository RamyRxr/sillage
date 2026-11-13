import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { useCallback, useState } from 'react'
import { Link, NavLink } from 'react-router'
import { useCartStore } from '../../features/cart/cartStore'
import { cn } from '../../lib/cn'
import { easeNormal, springs } from '../../lib/motion'
import { MobileMenu } from './MobileMenu'
import { NAV_ITEMS } from './nav'

const HIDE_AFTER_PX = 480

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export function CartButton({ className }: { className?: string }) {
  const openDrawer = useCartStore((state) => state.openDrawer)
  const count = useCartStore((state) => state.lines.reduce((sum, line) => sum + line.quantity, 0))
  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}
      className={cn(
        'inline-flex h-11 items-center gap-1.5 rounded-full border border-cocoa/35 px-4 text-sm font-bold transition-colors hover:bg-white/50 lg:h-12 lg:px-6',
        className,
      )}
    >
      Cart ·
      <motion.span key={count} initial={{ scale: 1.6 }} animate={{ scale: 1 }} transition={springs.snappy} className="inline-block">
        {count}
      </motion.span>
    </button>
  )
}

function DesktopNav() {
  return (
    <nav aria-label="Primary" className="glass absolute left-1/2 hidden -translate-x-1/2 rounded-full p-1.5 lg:flex">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              'relative isolate inline-flex h-10 w-[8.5rem] items-center justify-center rounded-full text-sm font-semibold transition-colors',
              isActive ? 'text-cocoa' : 'text-cocoa-soft hover:text-cocoa',
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.span
                  layoutId="nav-active"
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 rounded-full bg-white/95 shadow-soft"
                  transition={springs.snappy}
                />
              )}
              {item.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

function MenuButton({ isOpen, onOpen }: { isOpen: boolean; onOpen: () => void }) {
  return (
    <button
      type="button"
      aria-label="Open menu"
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
      onClick={onOpen}
      className="glass grid size-11 place-items-center rounded-full lg:hidden"
    >
      <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
        <path d="M5 9h14M5 15h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    </button>
  )
}

export function SiteHeader() {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const closeMenu = useCallback(() => setIsMenuOpen(false), [])

  useMotionValueEvent(scrollY, 'change', (y) => {
    const previous = scrollY.getPrevious() ?? 0
    setIsScrolled(y > 24)
    setIsHidden(y > HIDE_AFTER_PX && y > previous)
  })

  return (
    <>
      <motion.header
        animate={{ y: isHidden && !reduce ? '-110%' : '0%' }}
        transition={easeNormal}
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-500',
          isScrolled && 'bg-cream/70 shadow-[0_0.625rem_1.875rem_rgb(176_92_62/0.08)] backdrop-blur-xl',
        )}
      >
        <div className="page-x relative flex h-[4.5rem] items-center justify-between lg:h-[6rem]">
          <Link to="/" aria-label="Sillage, home" className="text-[max(0.8125rem,11px)] font-extrabold tracking-[0.42em]">
            SILLAGE
          </Link>

          <DesktopNav />

          <div className="flex items-center gap-2 lg:gap-3">
            <Link
              to="/shop"
              state={{ focusSearch: true }}
              aria-label="Search perfumes"
              className="glass hidden size-12 place-items-center rounded-full transition-transform hover:scale-105 lg:grid"
            >
              <SearchIcon />
            </Link>
            <CartButton />
            <MenuButton isOpen={isMenuOpen} onOpen={() => setIsMenuOpen(true)} />
          </div>
        </div>
      </motion.header>
      <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </>
  )
}
