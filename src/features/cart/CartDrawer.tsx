import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { RefObject } from 'react'
import { Link } from 'react-router'
import { Bottle } from '../../components/product/Bottle'
import { buttonClasses } from '../../components/ui/buttonStyles'
import { QuantityStepper } from '../../components/ui/QuantityStepper'
import { useDialog } from '../../hooks/useDialog'
import { FREE_DELIVERY_FROM_CENTS } from '../../lib/config'
import { easeFast, easeNormal, easeSlow, motionTokens } from '../../lib/motion'
import { formatPrice } from '../../lib/money'
import { priceLines, summarize, type PricedLine } from './cartLogic'
import { useCartStore } from './cartStore'

export function DeliveryProgress({ subtotalCents }: { subtotalCents: number }) {
  const progress = Math.min(subtotalCents / FREE_DELIVERY_FROM_CENTS, 1)
  const remaining = FREE_DELIVERY_FROM_CENTS - subtotalCents
  const message =
    remaining > 0 ? `${formatPrice(remaining)} away from free delivery` : 'Free delivery on this order'
  return (
    <div>
      <p className="text-sm font-semibold">{message}</p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cocoa/10">
        <motion.div
          className="h-full origin-left rounded-full bg-[linear-gradient(90deg,#f0b66b,#e99a9a)]"
          initial={false}
          animate={{ scaleX: progress }}
          transition={easeSlow}
        />
      </div>
    </div>
  )
}

function DrawerLine({ line }: { line: PricedLine }) {
  const setQuantity = useCartStore((state) => state.setQuantity)
  const remove = useCartStore((state) => state.remove)
  const closeDrawer = useCartStore((state) => state.closeDrawer)
  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: motionTokens.distance.lg }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: motionTokens.distance.xl }}
      transition={easeNormal}
      className="flex gap-4 border-b border-cocoa/10 py-5"
    >
      <div className="grid size-20 shrink-0 place-items-center rounded-[1.25rem] border border-white bg-white/60">
        <Bottle tone={line.product.tone} className="w-9" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <Link to={`/shop/${line.slug}`} onClick={closeDrawer} className="font-display text-[1.375rem] leading-tight hover:text-clay">
            {line.product.name}
          </Link>
          <span className="font-display text-xl">{formatPrice(line.totalCents)}</span>
        </div>
        <p className="micro mt-1 text-cocoa-soft">{line.size.label}</p>
        <div className="mt-3 flex items-center justify-between">
          <QuantityStepper value={line.quantity} itemName={line.product.name} onChange={(q) => setQuantity(line.key, q)} />
          <button type="button" onClick={() => remove(line.key)} className="micro text-cocoa-soft hover:text-cocoa">
            Remove<span className="sr-only"> {line.product.name}</span>
          </button>
        </div>
      </div>
    </motion.li>
  )
}

function EmptyDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
      <Bottle tone="240 182 107" className="floaty w-20" />
      <p className="mt-6 font-display text-2xl">Your cart is empty</p>
      <p className="mt-2 text-sm text-cocoa-soft">Six perfumes are waiting in the shop.</p>
      <Link to="/shop" onClick={onClose} className={buttonClasses('gradient', 'md', 'mt-8')}>
        Shop the collection
      </Link>
    </div>
  )
}

function DrawerFooter({ subtotalCents, onClose }: { subtotalCents: number; onClose: () => void }) {
  return (
    <div className="border-t border-cocoa/10 px-6 pt-5 pb-6">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-cocoa-soft">Subtotal</span>
        <span className="font-display text-3xl">{formatPrice(subtotalCents)}</span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Link to="/cart" onClick={onClose} className={buttonClasses('outline', 'md')}>
          View cart
        </Link>
        <Link to="/checkout" onClick={onClose} className={buttonClasses('gradient', 'md')}>
          Checkout
        </Link>
      </div>
      <p className="micro mt-4 text-center text-cocoa-soft">Demo store · no payment is taken</p>
    </div>
  )
}

function DrawerPanel({ dialogRef }: { dialogRef: RefObject<HTMLElement | null> }) {
  const closeDrawer = useCartStore((state) => state.closeDrawer)
  const lines = useCartStore((state) => state.lines)
  const reduce = useReducedMotion()
  const priced = priceLines(lines)
  const summary = summarize(priced)

  return (
    <div className="fixed inset-0 z-50">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-cocoa/25 backdrop-blur-[2px]"
        onClick={closeDrawer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={easeFast}
      />
      <motion.aside
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className="absolute inset-y-0 right-0 flex w-full max-w-[28.75rem] flex-col bg-cream shadow-[-1.875rem_0_5rem_rgb(59_36_32/0.18)]"
        initial={{ x: reduce ? 0 : '100%', opacity: reduce ? 0 : 1 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: reduce ? 0 : '100%', opacity: reduce ? 0 : 1 }}
        transition={easeNormal}
      >
        <div className="flex items-center justify-between px-6 pt-6">
          <h2 id="cart-title" className="font-display text-[2.125rem] font-light tracking-[-0.02em]">
            Your <span className="accent">cart</span>
          </h2>
          <button type="button" onClick={closeDrawer} aria-label="Close cart" className="glass grid size-11 place-items-center rounded-full">
            <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
              <path d="M7 7l10 10M17 7L7 17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {priced.length === 0 ? (
          <EmptyDrawer onClose={closeDrawer} />
        ) : (
          <>
            <div className="px-6 pt-6">
              <DeliveryProgress subtotalCents={summary.subtotalCents} />
            </div>
            <ul className="flex-1 overflow-y-auto px-6">
              <AnimatePresence initial={false} mode="popLayout">
                {priced.map((line) => (
                  <DrawerLine key={line.key} line={line} />
                ))}
              </AnimatePresence>
            </ul>
            <DrawerFooter subtotalCents={summary.subtotalCents} onClose={closeDrawer} />
          </>
        )}
      </motion.aside>
    </div>
  )
}

export function CartDrawer() {
  const isOpen = useCartStore((state) => state.isDrawerOpen)
  const closeDrawer = useCartStore((state) => state.closeDrawer)
  // Lives outside the animated panel so focus and scroll are released as soon as closing starts.
  const dialogRef = useDialog<HTMLElement>(isOpen, closeDrawer)
  return <AnimatePresence>{isOpen && <DrawerPanel key="cart-drawer" dialogRef={dialogRef} />}</AnimatePresence>
}
