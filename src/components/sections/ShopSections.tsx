import { Link } from 'react-router'
import { productRepository } from '../../data/productRepository'
import { DISCOVERY_SET_SLUG } from '../../data/products'
import type { Family } from '../../data/types'
import { formatPrice } from '../../lib/money'
import { Reveal, Stagger, StaggerItem } from '../motion/Reveal'
import { SplitText } from '../motion/SplitText'
import { AddToCartButton } from '../product/AddToCartButton'
import { Bottle } from '../product/Bottle'
import { Orb } from '../ui/Decor'
import { SectionHeading } from './SectionHeading'

/** Six small bottles on a glass tray, one per perfume, standing in for the set photo. */
function SetTray() {
  const perfumes = productRepository.findAll()
  return (
    <div className="glass grid grid-cols-3 place-items-end gap-x-4 gap-y-6 rounded-[32px] px-8 pt-8 pb-6">
      {perfumes.map((product, index) => (
        <div key={product.slug} className="floaty w-full max-w-[60px]" style={{ animationDelay: `${index * -0.8}s` }}>
          <Bottle tone={product.tone} />
        </div>
      ))}
    </div>
  )
}

export function DiscoveryPanel() {
  const set = productRepository.findBySlug(DISCOVERY_SET_SLUG)
  if (!set) return null
  return (
    <Reveal className="mx-auto max-w-[90rem] px-5 lg:px-20">
      <section
        aria-labelledby="discovery-title"
        className="panel-gradient relative grid items-center gap-10 overflow-hidden rounded-[40px] p-6 sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:rounded-[56px] lg:p-[72px]"
      >
        <Orb x="80%" y="40%" size="800px" tone="255 246 232" alpha={0.9} />
        <div className="relative">
          <p className="micro">The discovery set</p>
          <h2 id="discovery-title" className="t-h2 mt-4">
            <SplitText segments={[{ text: 'Not sure yet?', breakAfter: true }, { text: 'Try all six.', accent: true }]} onView />
          </h2>
          <p className="mt-6 max-w-[40ch] text-base leading-relaxed lg:text-lg">{set.summary}</p>
          <AddToCartButton
            product={set}
            look="full"
            size="lg"
            label={`Add the discovery set · ${formatPrice(set.sizes[0]?.priceCents ?? 0)}`}
            className="mt-8"
          />
        </div>
        <div className="relative mx-auto w-full max-w-[400px]">
          <SetTray />
        </div>
      </section>
    </Reveal>
  )
}

const FAMILY_NOTES: Record<Family, { line: string; tone: string }> = {
  Fresh: { line: 'Salt, citrus, clean skin.', tone: '247 201 165' },
  Floral: { line: 'Iris, rose, soft powder.', tone: '233 154 154' },
  Amber: { line: 'Warm, resinous, worn close.', tone: '240 182 107' },
  Woody: { line: 'Cedar, fig, dry warmth.', tone: '214 170 120' },
}

export function FamilyTiles({ onPick }: { onPick?: () => void }) {
  const counts = productRepository.familyCounts()
  return (
    <section aria-labelledby="families-title" className="mx-auto max-w-[90rem] px-5 lg:px-20">
      <SectionHeading id="families-title" eyebrow="Find your scent" title={[{ text: 'Shop by' }, { text: 'family', accent: true }]} />
      <Stagger className="mt-10 grid grid-cols-2 gap-4 lg:mt-14 lg:grid-cols-4 lg:gap-8">
        {counts.map(({ family, count }) => (
          <StaggerItem key={family}>
            <Link
              to={`/shop?family=${family}`}
              onClick={onPick}
              className="glass group relative flex aspect-[296/340] flex-col justify-end overflow-hidden rounded-[28px] p-4 transition-transform duration-500 hover:-translate-y-1 lg:rounded-[40px] lg:p-7"
            >
              <Orb x="50%" y="22%" size="150%" tone={FAMILY_NOTES[family].tone} alpha={0.6} />
              <span className="relative t-h3 transition-colors group-hover:text-clay">{family}</span>
              <span className="micro relative mt-2 text-cocoa-soft">
                {count} {count === 1 ? 'perfume' : 'perfumes'}
              </span>
              <span className="relative mt-2 hidden text-sm text-cocoa-soft sm:block">{FAMILY_NOTES[family].line}</span>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}
