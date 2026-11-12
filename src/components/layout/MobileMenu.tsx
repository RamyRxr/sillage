import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { RefObject } from 'react'
import { Link, NavLink } from 'react-router'
import { productRepository } from '../../data/productRepository'
import { useCartStore } from '../../features/cart/cartStore'
import { useDialog } from '../../hooks/useDialog'
import { cn } from '../../lib/cn'
import { easeNormal, motionTokens } from '../../lib/motion'
import { formatPrice } from '../../lib/money'
import { buttonClasses } from '../ui/buttonStyles'
import { Orb } from '../ui/Decor'
import { NAV_ITEMS } from './nav'

type MobileMenuProps = { isOpen: boolean; onClose: () => void }

function SignatureCard({ onClose, rise }: { onClose: () => void; rise: number }) {
  const signature = productRepository.findBySlug('ombre-claire')
  const size = signature?.sizes.find((candidate) => candidate.ml === signature.defaultMl)
  if (!signature || !size) return null
  return (
    <motion.div
      className="panel-gradient relative mt-10 overflow-hidden rounded-[32px] p-6"
      initial={{ opacity: 0, y: rise }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...easeNormal, delay: motionTokens.delay.medium }}
    >
      <p className="micro">The signature</p>
      <p className="mt-2 font-display text-[40px] leading-none font-light tracking-[-0.03em]">
        Ombre <span className="accent">Claire</span>
      </p>
      <div className="mt-5 flex items-center justify-between">
        <span className="micro">
          {formatPrice(size.priceCents)} · {size.label}
        </span>
        <Link to={`/shop/${signature.slug}`} onClick={onClose} className={buttonClasses('dark', 'sm')}>
          Shop now
        </Link>
      </div>
    </motion.div>
  )
}

function MenuLinks({ onClose, rise }: { onClose: () => void; rise: number }) {
  return (
    <nav aria-label="Mobile" className="mt-10">
      <ul>
        {NAV_ITEMS.map((item, index) => (
          <motion.li
            key={item.to}
            className="border-b border-cocoa/15"
            initial={{ opacity: 0, y: rise }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...easeNormal, delay: motionTokens.stagger * (index + 1) }}
          >
            <NavLink
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) => cn('flex items-end justify-between py-4 t-h1 !text-[64px]', isActive && 'accent')}
            >
              {item.label}
              <span className="micro mb-3 text-cocoa-soft not-italic">0{index + 1}</span>
            </NavLink>
          </motion.li>
        ))}
      </ul>
    </nav>
  )
}

function MenuPanel({ onClose, dialogRef }: { onClose: () => void; dialogRef: RefObject<HTMLDivElement | null> }) {
  const reduce = useReducedMotion()
  const openDrawer = useCartStore((state) => state.openDrawer)
  const rise = reduce ? 0 : motionTokens.distance.xl

  function handleCart() {
    onClose()
    openDrawer()
  }

  return (
    <motion.div
      ref={dialogRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-50 overflow-y-auto bg-cream/95 backdrop-blur-xl lg:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={easeNormal}
    >
      <Orb x="80%" y="25%" size="620px" tone="247 183 127" alpha={0.75} />
      <Orb x="10%" y="90%" size="460px" tone="233 154 154" alpha={0.5} />
      <div className="relative flex min-h-full flex-col px-5 pt-4 pb-10">
        <div className="flex h-14 items-center justify-between">
          <span className="text-[13px] font-extrabold tracking-[0.42em]">SILLAGE</span>
          <button type="button" onClick={onClose} aria-label="Close menu" className="glass grid size-11 place-items-center rounded-full">
            <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
              <path d="M7 7l10 10M17 7L7 17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <MenuLinks onClose={onClose} rise={rise} />
        <motion.div
          className="mt-8 flex flex-col items-start gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...easeNormal, delay: motionTokens.delay.medium }}
        >
          <button type="button" onClick={handleCart} className="micro">
            Cart
          </button>
          <Link to="/checkout" onClick={onClose} className="micro">
            Checkout
          </Link>
        </motion.div>
        <SignatureCard onClose={onClose} rise={rise} />
        <p className="micro mt-auto pt-10 text-cocoa-soft">Grasse, France</p>
      </div>
    </motion.div>
  )
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // The dialog behaviour lives here, outside the animated panel, so it stops the moment the menu
  // starts closing rather than after its fade-out.
  const dialogRef = useDialog<HTMLDivElement>(isOpen, onClose)
  return <AnimatePresence>{isOpen && <MenuPanel key="menu" onClose={onClose} dialogRef={dialogRef} />}</AnimatePresence>
}
