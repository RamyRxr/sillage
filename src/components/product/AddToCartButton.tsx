import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import type { Product } from '../../data/types'
import { useCartStore } from '../../features/cart/cartStore'
import { cn } from '../../lib/cn'
import { easeFast, motionTokens } from '../../lib/motion'
import { Button } from '../ui/Button'
import type { ButtonSize, ButtonVariant } from '../ui/buttonStyles'

const CONFIRM_MS = 1600

type AddToCartButtonProps = {
  product: Product
  ml?: number
  quantity?: number
  /** "card": a round "+" on phones and a small pill from tablet up. "full": a large pill. */
  look?: 'card' | 'full'
  label?: string
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

function Check() {
  const reduce = useReducedMotion()
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <motion.path
        d="M5 12.5l4.5 4.5L19 7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: reduce ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: motionTokens.duration.slow, ease: motionTokens.easing.smooth }}
      />
    </svg>
  )
}

/** Adds to the cart, then briefly turns into a drawn check mark. */
export function AddToCartButton({
  product,
  ml = product.defaultMl,
  quantity = 1,
  look = 'card',
  label = 'Add to cart',
  variant = 'dark',
  size = 'sm',
  className,
}: AddToCartButtonProps) {
  const add = useCartStore((state) => state.add)
  const [isAdded, setIsAdded] = useState(false)

  useEffect(() => {
    if (!isAdded) return
    const timer = window.setTimeout(() => setIsAdded(false), CONFIRM_MS)
    return () => window.clearTimeout(timer)
  }, [isAdded])

  function handleClick() {
    add(product.slug, ml, quantity)
    setIsAdded(true)
  }

  const isCard = look === 'card'
  const content = isAdded ? (
    <>
      <Check />
      <span className={cn(isCard && 'hidden sm:inline')}>Added</span>
    </>
  ) : (
    <>
      <span aria-hidden="true" className={cn(isCard ? 'text-xl leading-none sm:hidden' : 'hidden')}>
        +
      </span>
      <span className={cn(isCard && 'hidden sm:inline')}>{label}</span>
    </>
  )

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      aria-label={isCard ? `Add ${product.name} to cart` : undefined}
      className={cn(isCard && 'size-10 px-0 sm:h-11 sm:w-auto sm:px-5', 'overflow-hidden', className)}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isAdded ? 'added' : 'add'}
          className="inline-flex items-center gap-2"
          initial={{ y: motionTokens.distance.md, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -motionTokens.distance.md, opacity: 0 }}
          transition={easeFast}
        >
          {content}
        </motion.span>
      </AnimatePresence>
    </Button>
  )
}
