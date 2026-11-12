import { motion, useReducedMotion, useSpring } from 'motion/react'
import type { PointerEvent } from 'react'
import { Link } from 'react-router'
import type { Product } from '../../data/types'
import { cn } from '../../lib/cn'
import { springs } from '../../lib/motion'
import { formatPrice } from '../../lib/money'
import { Orb } from '../ui/Decor'
import { AddToCartButton } from './AddToCartButton'
import { Bottle } from './Bottle'

const MAX_TILT_DEG = 7

type ProductCardProps = {
  product: Product
  className?: string
}

/** Glass product card. The whole card links to the product; the add button sits above that link. */
export function ProductCard({ product, className }: ProductCardProps) {
  const reduce = useReducedMotion()
  const { stiffness, damping } = springs.snappy
  const rotateX = useSpring(0, { stiffness, damping })
  const rotateY = useSpring(0, { stiffness, damping })
  const price = product.sizes.find((size) => size.ml === product.defaultMl)?.priceCents ?? 0
  const notes = product.notes.map((note) => note.name).join(' · ')

  function handleMove(event: PointerEvent<HTMLElement>) {
    if (reduce || event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    rotateY.set(((event.clientX - rect.left) / rect.width - 0.5) * MAX_TILT_DEG * 2)
    rotateX.set(-((event.clientY - rect.top) / rect.height - 0.5) * MAX_TILT_DEG * 2)
  }

  function handleLeave() {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.article
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={cn(
        'glass group relative flex h-full flex-col rounded-[28px] p-2.5 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-cocoa sm:rounded-[40px] sm:p-5',
        className,
      )}
    >
      <div className="relative grid aspect-[16/15] place-items-center overflow-hidden rounded-[20px] border border-white bg-white/45 sm:aspect-square sm:rounded-[28px]">
        <Orb x="50%" y="40%" size="135%" tone={product.tone} alpha={0.55} />
        <Bottle
          tone={product.tone}
          className="floaty relative w-[42%] transition-transform duration-700 ease-[var(--ease-smooth)] group-hover:scale-[1.06]"
        />
        {product.tag && (
          <span className="micro absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1.5 text-cocoa sm:top-4 sm:left-4">
            {product.tag}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-1.5 pt-4 sm:px-2 sm:pt-6">
        <p className="micro text-cocoa-soft">
          {product.family}
          <span className="hidden sm:inline"> · 50 ml</span>
        </p>
        <h3 className="mt-2 font-display text-[21px] leading-[1.08] tracking-[-0.01em] sm:text-[38px] sm:font-light sm:tracking-[-0.02em]">
          <Link to={`/shop/${product.slug}`} className="outline-none after:absolute after:inset-0 after:rounded-[inherit]">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 hidden text-sm text-cocoa-soft sm:block">{notes}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4 sm:mt-6 sm:border-t sm:border-cocoa/15 sm:pt-5">
          <span className="font-display text-[22px] sm:text-[28px]">{formatPrice(price)}</span>
          <AddToCartButton product={product} className="relative z-10" />
        </div>
      </div>
    </motion.article>
  )
}
