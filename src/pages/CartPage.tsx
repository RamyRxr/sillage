import { AnimatePresence, motion } from 'motion/react'
import { Link } from 'react-router'
import { SplitText } from '../components/motion/SplitText'
import { Bottle } from '../components/product/Bottle'
import { ButtonLink } from '../components/ui/Button'
import { Orb } from '../components/ui/Decor'
import { QuantityStepper } from '../components/ui/QuantityStepper'
import { productRepository } from '../data/productRepository'
import { DeliveryProgress } from '../features/cart/CartDrawer'
import { priceLines, summarize, type PricedLine } from '../features/cart/cartLogic'
import { useCartStore } from '../features/cart/cartStore'
import { MAX_SAMPLES } from '../lib/config'
import { cn } from '../lib/cn'
import { easeNormal, motionTokens } from '../lib/motion'
import { formatPrice } from '../lib/money'

function CartRow({ line }: { line: PricedLine }) {
  const setQuantity = useCartStore((state) => state.setQuantity)
  const remove = useCartStore((state) => state.remove)
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: motionTokens.distance.md }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -motionTokens.distance.xl }}
      transition={easeNormal}
      className="glass flex gap-4 rounded-[1.75rem] p-3 sm:gap-6 sm:rounded-[2.25rem] sm:p-5"
    >
      <div className="grid size-[6.5rem] shrink-0 place-items-center rounded-[1.25rem] border border-white bg-white/55 sm:size-[8.625rem] sm:rounded-[1.5rem]">
        <Bottle tone={line.product.tone} className="w-11 sm:w-14" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <Link to={`/shop/${line.slug}`} className="font-display text-[1.375rem] leading-tight hover:text-clay sm:text-[2.5rem] sm:font-light">
            {line.product.name}
          </Link>
          <button
            type="button"
            onClick={() => remove(line.key)}
            aria-label={`Remove ${line.product.name}`}
            className="grid size-9 shrink-0 place-items-center rounded-full text-cocoa-soft transition-colors hover:bg-white/70 hover:text-cocoa"
          >
            <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
              <path d="M7 7l10 10M17 7L7 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <p className="micro mt-1 text-cocoa-soft">
          {line.product.family ?? 'Set'} · {line.size.label}
        </p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <QuantityStepper value={line.quantity} itemName={line.product.name} onChange={(q) => setQuantity(line.key, q)} />
          <span className="font-display text-[1.375rem] sm:text-[1.75rem]">{formatPrice(line.totalCents)}</span>
        </div>
      </div>
    </motion.li>
  )
}

function Samples() {
  const samples = useCartStore((state) => state.samples)
  const toggleSample = useCartStore((state) => state.toggleSample)
  const perfumes = productRepository.findAll()
  return (
    <section aria-labelledby="samples-title" className="glass rounded-[1.75rem] p-5 sm:rounded-[2.25rem] sm:p-8">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="samples-title" className="micro text-cocoa-soft">
          Choose your two free samples
        </h2>
        <span className="micro shrink-0 whitespace-nowrap text-cocoa-soft">
          {samples.length} of {MAX_SAMPLES}
        </span>
      </div>
      <div className="mt-5 flex flex-wrap gap-2.5">
        {perfumes.map((product) => {
          const isChosen = samples.includes(product.slug)
          return (
            <button
              key={product.slug}
              type="button"
              aria-pressed={isChosen}
              onClick={() => toggleSample(product.slug)}
              className={cn(
                'h-11 rounded-full px-5 text-sm font-bold transition-colors duration-200',
                isChosen ? 'bg-cocoa text-cream' : 'border border-white bg-white/60 text-cocoa shadow-soft hover:bg-white',
              )}
            >
              {product.name}
            </button>
          )
        })}
      </div>
    </section>
  )
}

function EmptyCart() {
  return (
    <div className="glass relative mt-10 grid place-items-center overflow-hidden rounded-[2.5rem] px-6 py-20 text-center lg:mt-14">
      <Orb x="50%" y="30%" size="37.5rem" tone="247 183 127" alpha={0.5} />
      <Bottle tone="240 182 107" className="floaty relative w-20" />
      <p className="relative mt-8 font-display text-3xl">Nothing here yet</p>
      <p className="relative mt-2 text-cocoa-soft">Six perfumes are waiting in the shop.</p>
      <ButtonLink to="/shop" variant="gradient" className="relative mt-8">
        Shop the collection
      </ButtonLink>
    </div>
  )
}

function CartSummary({ subtotalCents, deliveryCents, totalCents }: { subtotalCents: number; deliveryCents: number; totalCents: number }) {
  return (
    <aside aria-label="Order summary" className="glass h-fit rounded-[2rem] p-6 sm:p-8 lg:sticky lg:top-32 lg:rounded-[2.5rem]">
      <p className="micro text-cocoa-soft">Order summary</p>
      <div className="mt-5">
        <DeliveryProgress subtotalCents={subtotalCents} />
      </div>
      <dl className="mt-6 space-y-3 text-[max(0.9375rem,11px)]">
        <div className="flex justify-between">
          <dt className="text-cocoa-soft">Subtotal</dt>
          <dd>{formatPrice(subtotalCents)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-cocoa-soft">Delivery</dt>
          <dd>{deliveryCents === 0 ? 'Free' : formatPrice(deliveryCents)}</dd>
        </div>
      </dl>
      <div className="hairline mt-6" />
      <div className="mt-5 flex items-baseline justify-between">
        <span className="font-display text-2xl">Total</span>
        <span className="font-display text-[2.875rem] leading-none font-light">{formatPrice(totalCents)}</span>
      </div>
      <ButtonLink to="/checkout" variant="gradient" size="lg" className="mt-7 w-full">
        Go to checkout
      </ButtonLink>
      <p className="micro mt-5 text-cocoa-soft">Taxes included</p>
      <p className="micro mt-2 text-cocoa-soft">Demo store · no payment is taken</p>
    </aside>
  )
}

export function CartPage() {
  const lines = useCartStore((state) => state.lines)
  const priced = priceLines(lines)
  const summary = summarize(priced)
  const itemLabel = `${summary.itemCount} ${summary.itemCount === 1 ? 'item' : 'items'}`

  return (
    <section aria-labelledby="cart-page-title" className="page-x relative pt-28 lg:pt-40">
      <title>Your cart — Sillage</title>
      <Orb x="88%" y="10%" size="56.25rem" tone="247 183 127" alpha={0.55} />
      <div className="relative">
        <p className="micro text-cocoa-soft">Your selection · {itemLabel}</p>
        <h1 id="cart-page-title" className="t-h1 mt-4">
          <SplitText segments={[{ text: 'Your' }, { text: 'cart', accent: true }]} />
        </h1>

        {priced.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-[1fr_27.5rem] lg:gap-12">
            <div className="space-y-5">
              <ul className="space-y-4">
                <AnimatePresence initial={false} mode="popLayout">
                  {priced.map((line) => (
                    <CartRow key={line.key} line={line} />
                  ))}
                </AnimatePresence>
              </ul>
              <Samples />
              <Link to="/shop" className="micro inline-block pt-2">
                ← Continue shopping
              </Link>
            </div>

            <CartSummary subtotalCents={summary.subtotalCents} deliveryCents={summary.deliveryCents} totalCents={summary.totalCents} />
          </div>
        )}
      </div>
    </section>
  )
}
