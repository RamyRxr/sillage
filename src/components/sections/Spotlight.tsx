import type { Product } from '../../data/types'
import { formatPrice } from '../../lib/money'
import { Reveal } from '../motion/Reveal'
import { SplitText } from '../motion/SplitText'
import { AddToCartButton } from '../product/AddToCartButton'
import { Bottle } from '../product/Bottle'
import { ButtonLink } from '../ui/Button'
import { Echo, Orb } from '../ui/Decor'

/** The signature perfume on a warm gradient panel. */
export function Spotlight({ product }: { product: Product }) {
  const size = product.sizes.find((candidate) => candidate.ml === product.defaultMl)
  const [first, ...rest] = product.name.split(' ')
  return (
    <Reveal className="mx-auto max-w-[90rem] px-5 lg:px-20">
      <section
        aria-labelledby="spotlight-title"
        className="panel-gradient relative grid overflow-hidden rounded-[40px] p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:rounded-[56px] lg:p-[72px]"
      >
        <Orb x="78%" y="35%" size="820px" tone="255 246 232" alpha={0.9} />
        <div className="relative order-2 mt-8 lg:order-1 lg:mt-0">
          <p className="micro">The signature · Extrait de parfum</p>
          <h2 id="spotlight-title" className="t-name mt-3">
            <SplitText segments={[{ text: first }, { text: rest.join(' '), accent: true }]} onView />
          </h2>
          <p className="mt-6 max-w-[46ch] text-base leading-relaxed lg:text-lg">{product.summary}</p>
          <p className="mt-8 flex items-baseline gap-4">
            <span className="font-display text-[46px] leading-none font-light">{formatPrice(size?.priceCents ?? 0)}</span>
            <span className="micro">{size?.label}</span>
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <AddToCartButton product={product} look="full" size="lg" />
            <ButtonLink to={`/shop/${product.slug}`} variant="outline" size="lg">
              View details
            </ButtonLink>
          </div>
        </div>
        <div className="relative order-1 mx-auto w-[220px] sm:w-[300px] lg:order-2 lg:w-[400px] lg:self-center">
          <div className="relative aspect-square">
            <Echo shape="rounded-full" light />
            <div className="absolute inset-0 grid place-items-center rounded-full border-[1.5px] border-white/90 bg-white/20">
              <Bottle tone={product.tone} className="floaty w-[42%]" />
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  )
}
