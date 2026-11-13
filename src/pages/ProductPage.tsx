import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { SplitText } from '../components/motion/SplitText'
import { Stagger, StaggerItem } from '../components/motion/Reveal'
import { AddToCartButton } from '../components/product/AddToCartButton'
import { Bottle } from '../components/product/Bottle'
import { ProductCard } from '../components/product/ProductCard'
import { NotesInDepth, Timeline } from '../components/sections/ProductSections'
import { SectionHeading } from '../components/sections/SectionHeading'
import { ServicesStrip } from '../components/sections/ServicesStrip'
import { BlobField, Orb } from '../components/ui/Decor'
import { OptionGroup } from '../components/ui/OptionGroup'
import { QuantityStepper } from '../components/ui/QuantityStepper'
import { productRepository } from '../data/productRepository'
import type { Product } from '../data/types'
import { FREE_DELIVERY_FROM_CENTS } from '../lib/config'
import { cn } from '../lib/cn'
import { easeFast, easeNormal, motionTokens } from '../lib/motion'
import { formatPrice } from '../lib/money'
import { NotFoundPage } from './NotFoundPage'

type View = 'bottle' | 'detail' | 'tone'
const VIEWS: ReadonlyArray<{ value: View; label: string }> = [
  { value: 'bottle', label: 'Bottle' },
  { value: 'detail', label: 'Close-up of the cap' },
  { value: 'tone', label: 'Colour of the juice' },
]
const ARCH = 'rounded-t-full rounded-b-[2rem]'
// "You may also like": two cards on phones, three on smaller desktops, four from xl up.
// One entry per card shown, so the list length is also how many related perfumes to fetch.
const RELATED_VISIBILITY = [undefined, undefined, 'hidden lg:block', 'hidden xl:block']

function Visual({ product, view }: { product: Product; view: View }) {
  if (view === 'tone') {
    return (
      <BlobField
        viewBox="0 0 400 560"
        className="inset-0 h-full w-full"
        blobs={[
          { cx: 200, cy: 300, r: 170, wobble: 0.15, phase: 0.6, fill: `rgb(${product.tone})`, opacity: 0.8 },
          { cx: 230, cy: 250, r: 90, wobble: 0.2, phase: 2.2, fill: '#FFFFFF', opacity: 0.5 },
        ]}
      />
    )
  }
  const isDetail = view === 'detail'
  return (
    <Bottle
      tone={product.tone}
      label={`${product.name} bottle`}
      className={cn('relative', isDetail ? 'w-[110%] translate-y-[38%]' : 'floaty w-[44%]')}
    />
  )
}

function Gallery({ product }: { product: Product }) {
  const [view, setView] = useState<View>('bottle')
  const reduce = useReducedMotion()
  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row lg:gap-6">
      <div className="flex gap-3 lg:flex-col" role="group" aria-label="Views">
        {VIEWS.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-label={option.label}
            aria-pressed={view === option.value}
            onClick={() => setView(option.value)}
            className={cn(
              'relative grid size-16 place-items-center overflow-hidden rounded-[1.125rem] border-[1.5px] bg-white/50 transition-colors lg:size-24 lg:rounded-[1.5rem]',
              view === option.value ? 'border-cocoa' : 'border-dashed border-cocoa/30 hover:border-cocoa/60',
            )}
          >
            <span aria-hidden="true" className="relative grid size-full place-items-center overflow-hidden">
              <Visual product={product} view={option.value} />
            </span>
          </button>
        ))}
      </div>
      <div className="relative w-full max-w-[32.5rem] flex-1">
        <div className={cn('glass relative grid aspect-[13/17] place-items-center overflow-hidden', ARCH)}>
          <Orb x="50%" y="45%" size="130%" tone={product.tone} alpha={0.6} />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={view}
              className="absolute inset-0 grid place-items-center"
              initial={{ opacity: 0, scale: reduce ? 1 : motionTokens.scale.subtle }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={easeNormal}
            >
              <Visual product={product} view={view} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function AnimatedPrice({ cents }: { cents: number }) {
  return (
    <span className="relative inline-block h-[2.875rem] overflow-hidden font-display text-[2.875rem] leading-none font-light">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={cents}
          className="inline-block"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={easeFast}
        >
          {formatPrice(cents)}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function NoteChips({ product }: { product: Product }) {
  if (product.notes.length === 0) return null
  return (
    <ul className="mt-7 flex flex-wrap gap-3 border-t border-cocoa/15 pt-6">
      {product.notes.map((note) => (
        <li key={note.name}>
          <a href="#notes" className="glass inline-flex h-12 items-center rounded-full px-6 font-display text-[1.1875rem] transition-colors hover:text-clay">
            {note.name}
          </a>
        </li>
      ))}
    </ul>
  )
}

function BuyControls({ product }: { product: Product }) {
  const [ml, setMl] = useState(product.defaultMl)
  const [quantity, setQuantity] = useState(1)
  const size = product.sizes.find((candidate) => candidate.ml === ml) ?? product.sizes[0]
  const total = size.priceCents * quantity
  const sizeOptions = product.sizes.map((candidate) => ({
    value: candidate.ml,
    label: `${candidate.label} · ${formatPrice(candidate.priceCents)}`,
  }))
  return (
    <>
      <div className="mt-6 flex items-baseline gap-4">
        <AnimatedPrice cents={total} />
        <span className="micro text-cocoa-soft">{size.label} · tax included</span>
      </div>
      {product.sizes.length > 1 && (
        <>
          <p className="micro mt-7 text-cocoa-soft">Size</p>
          <OptionGroup label="Size" layoutId="size-option" options={sizeOptions} value={ml} onChange={setMl} className="mt-3" />
        </>
      )}
      <div className="mt-7 flex flex-wrap gap-3">
        <QuantityStepper value={quantity} onChange={setQuantity} itemName={product.name} className="h-[3.75rem]" />
        <AddToCartButton
          product={product}
          ml={ml}
          quantity={quantity}
          look="full"
          variant="gradient"
          size="lg"
          label={`Add to cart · ${formatPrice(total)}`}
          className="min-w-[15rem] flex-1"
        />
      </div>
    </>
  )
}

function BuyBox({ product }: { product: Product }) {
  const [first, ...rest] = product.name.split(' ')
  return (
    <div className="lg:pt-6">
      <p className="micro text-cocoa-soft">
        {product.tag ? `${product.tag} · ` : ''}Extrait de parfum
      </p>
      <h1 className="t-name mt-3">
        <SplitText segments={[{ text: first }, { text: rest.join(' '), accent: true }]} />
      </h1>
      <p className="mt-3 font-display text-2xl text-cocoa-soft italic">{product.translation}</p>
      <p className="t-lead mt-5 max-w-[46ch] text-cocoa-soft">{product.summary}</p>
      <div className="hairline mt-8" />
      <BuyControls product={product} />
      <p className="micro mt-5 text-cocoa-soft">
        Free delivery over {formatPrice(FREE_DELIVERY_FROM_CENTS)} · Two samples included
      </p>
      <NoteChips product={product} />
    </div>
  )
}

export function ProductPage() {
  const { slug = '' } = useParams()
  const product = productRepository.findBySlug(slug)
  if (!product) return <NotFoundPage />

  const related = productRepository.findRelated(product.slug, RELATED_VISIBILITY.length)
  return (
    <>
      <title>{`${product.name} — Sillage`}</title>
      <section aria-label={product.name} className="page-x relative pt-24 lg:pt-32">
        <Orb x="30%" y="40%" size="62.5rem" tone="247 183 127" alpha={0.6} />
        <Orb x="95%" y="85%" size="43.75rem" tone="233 154 154" alpha={0.4} delay={-5} />
        <nav aria-label="Breadcrumb" className="micro relative text-cocoa-soft">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link to="/shop" className="hover:text-cocoa">Shop</Link> /
            </li>
            {product.family && (
              <li>
                <Link to={`/shop?family=${product.family}`} className="hover:text-cocoa">{product.family}</Link> /
              </li>
            )}
            <li aria-current="page" className="text-cocoa">{product.name}</li>
          </ol>
        </nav>
        <div className="relative mt-8 grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:gap-16">
          <Gallery product={product} />
          <BuyBox product={product} />
        </div>
      </section>

      {product.notes.length > 0 && (
        <>
          <div className="mt-24 lg:mt-36">
            <NotesInDepth product={product} />
          </div>
          <div className="mt-24 lg:mt-32">
            <Timeline product={product} />
          </div>
        </>
      )}

      <section aria-labelledby="related-title" className="page-x mt-24 lg:mt-36">
        <SectionHeading id="related-title" eyebrow="More from the house" title={[{ text: 'You may' }, { text: 'also like', accent: true }]} />
        <Stagger className="mt-10 product-grid lg:mt-14">
          {related.map((item, index) => (
            <StaggerItem key={item.slug} className={RELATED_VISIBILITY[index]}>
              <ProductCard product={item} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>
      <div className="mt-16 lg:mt-24">
        <ServicesStrip />
      </div>
    </>
  )
}
