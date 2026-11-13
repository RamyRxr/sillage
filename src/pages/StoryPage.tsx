import { CountUp } from '../components/motion/CountUp'
import { Reveal, Stagger, StaggerItem } from '../components/motion/Reveal'
import { SplitText } from '../components/motion/SplitText'
import { QUOTE } from '../components/sections/StoryTeaser'
import { ButtonLink } from '../components/ui/Button'
import { Echo, Orb } from '../components/ui/Decor'
import { ImageSlot } from '../components/ui/ImageSlot'
import { productRepository } from '../data/productRepository'
import { cn } from '../lib/cn'

// DRAFT copy written for the demo. The store should replace it with its own story.
const PARAGRAPHS = [
  'Sillage is a small perfume house from Grasse. We began with a single question: what does a perfume leave behind once the person has gone?',
  'Everything is made in small batches, by hand, in one atelier. Each perfume is composed as much for how it fades as for how it opens.',
  'Six perfumes so far, each a different trace. Ombre Claire was the first. It is still the one we are known for.',
] as const
const NUMERAL_COLORS = ['text-amber', 'text-rose', 'text-clay'] as const
const STEP = ['', 'lg:mt-12', 'lg:mt-24'] as const

function StoryHero() {
  return (
  <section aria-labelledby="story-page-title" className="page-x relative grid items-center gap-14 pt-28 lg:grid-cols-[1.25fr_0.75fr] lg:pt-40">
    <Orb x="30%" y="45%" size="62.5rem" tone="247 183 127" alpha={0.7} />
    <Orb x="95%" y="90%" size="43.75rem" tone="233 154 154" alpha={0.45} delay={-6} />
    <div className="relative">
      <p className="micro text-cocoa-soft">The house</p>
      <h1 id="story-page-title" className="t-quote mt-6">
        <SplitText segments={[{ text: QUOTE }]} />
      </h1>
      <Reveal delay={0.8} className="mt-10">
        <div className="hairline w-60" />
        <p className="micro mt-5 text-cocoa-soft">Est. 2024 · Grasse, France</p>
      </Reveal>
    </div>
    <Reveal delay={0.3} className="relative mx-auto w-full max-w-[21.25rem]">
      <div className="relative aspect-[34/52]">
        <Echo shape="rounded-full" />
        <ImageSlot caption="Atelier image" className="absolute inset-0 rounded-full" />
      </div>
    </Reveal>
  </section>
  )
}

type Fact = { value: number; label: string }

function StoryNumbers({ facts }: { facts: readonly Fact[] }) {
  return (
  <Reveal className="page-x mt-24 lg:mt-36">
    <section aria-label="The house in numbers" className="glass relative overflow-hidden rounded-[2.5rem] lg:rounded-[3.5rem]">
      <Orb x="45%" y="20%" size="56.25rem" tone="255 226 184" alpha={0.7} />
      <dl className="relative grid lg:grid-cols-3">
        {facts.map((fact, index) => (
          <div
            key={fact.label}
            className={cn(
              'flex items-end justify-between px-7 py-7 lg:block lg:px-12 lg:py-14',
              index > 0 && 'border-t border-cocoa/10 lg:border-t-0 lg:border-l',
            )}
          >
            <dt className="micro order-2 text-cocoa-soft lg:mt-6">{fact.label}</dt>
            <dd className="order-1 font-display text-[4rem] leading-none font-light tracking-[-0.04em] lg:text-[9.375rem]">
              <CountUp to={fact.value} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  </Reveal>
  )
}

function CollectionBand({ count }: { count: number }) {
  return (
  <Reveal className="page-x mt-24 lg:mt-36">
    <section aria-labelledby="collection-band" className="panel-gradient relative flex flex-col gap-8 overflow-hidden rounded-[2.5rem] p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between lg:rounded-[3.5rem] lg:p-16">
      <Orb x="80%" y="40%" size="47.5rem" tone="255 246 232" alpha={0.9} />
      <div className="relative">
        <h2 id="collection-band" className="t-h2">
          The <span className="accent">collection</span>
        </h2>
        <p className="micro mt-4">{count} perfumes · Made in Grasse</p>
      </div>
      <ButtonLink to="/shop" variant="dark" size="lg" className="relative">
        Shop the collection
      </ButtonLink>
    </section>
  </Reveal>
  )
}

export function StoryPage() {
  const perfumeCount = productRepository.findAll().length
  const facts = [
    { value: 2024, label: 'Established' },
    { value: perfumeCount, label: 'Perfumes' },
    { value: 1, label: 'Atelier' },
  ]
  return (
    <>
      <title>Our story — Sillage</title>
      <StoryHero />

      <section aria-label="About the house" className="page-x mt-28 lg:mt-40">
        <p className="micro text-cocoa-soft">About the house</p>
        <Stagger className="mt-8 grid gap-12 lg:grid-cols-3 lg:gap-[3.25rem]">
          {PARAGRAPHS.map((text, index) => (
            <StaggerItem key={text} className={cn('border-t border-cocoa/15 pt-7', STEP[index])}>
              <p className={cn('font-display text-[4rem] leading-none font-light lg:text-[7.5rem]', NUMERAL_COLORS[index])} aria-hidden="true">
                0{index + 1}
              </p>
              <p className="mt-6 text-[1.0625rem] leading-[1.75] lg:text-[1.1875rem]">{text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <StoryNumbers facts={facts} />

      <section aria-label="The atelier" className="page-x relative mt-24 lg:mt-36">
        <p className="micro text-cocoa-soft">The atelier</p>
        <Reveal className="relative mt-6">
          <ImageSlot caption="Atelier image" detail="Wide photo of the workshop" className="aspect-[350/420] rounded-[2.5rem] sm:aspect-[1280/820] lg:rounded-[3.5rem]" />
          <span className="glass absolute bottom-6 left-6 inline-flex h-14 items-center rounded-full px-7 font-display text-xl lg:bottom-10 lg:left-10">
            One atelier · Grasse, France
          </span>
        </Reveal>
      </section>

      <CollectionBand count={perfumeCount} />
    </>
  )
}
