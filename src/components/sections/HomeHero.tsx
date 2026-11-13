import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'
import { Link } from 'react-router'
import { productRepository } from '../../data/productRepository'
import { easeSlow, motionTokens } from '../../lib/motion'
import { formatPrice } from '../../lib/money'
import { CountUp } from '../motion/CountUp'
import { Magnetic } from '../motion/Magnetic'
import { SplitText } from '../motion/SplitText'
import { Bottle } from '../product/Bottle'
import { ButtonLink } from '../ui/Button'
import { BlobField, Echo, Orb, type BlobSpec } from '../ui/Decor'

const BLOBS: readonly BlobSpec[] = [
  { cx: 880, cy: 470, r: 330, wobble: 0.12, phase: 0.4, fill: '#F7C9A5', opacity: 0.55 },
  { cx: 1010, cy: 570, r: 250, wobble: 0.16, phase: 2.1, fill: '#E99A9A', opacity: 0.35 },
  { cx: 700, cy: 330, r: 200, wobble: 0.14, phase: 4.0, fill: '#F0B66B', opacity: 0.4 },
]
const LEAD = ['A perfume is not a smell.', 'It is the space you leave behind.']
const ARCH = 'rounded-t-full rounded-b-[2.25rem]'

function CountBadge() {
  const count = productRepository.findAll().length
  return (
    <div className="glass grid size-24 place-items-center rounded-full text-center lg:size-[9.75rem]">
      <div>
        <CountUp to={count} className="block font-display text-[2.25rem] leading-none font-light lg:text-[2.875rem]" />
        <span className="micro mt-1 block text-cocoa-soft lg:mt-2">Perfumes</span>
      </div>
    </div>
  )
}

function Bestsellers() {
  const items = productRepository.findAll().slice(0, 3)
  // On desktop the card grows to fit the longest name: prices keep their 11px minimum there.
  return (
    <div className="glass w-[18.75rem] rounded-[2rem] p-7 lg:w-fit lg:min-w-[21rem]">
      <p className="micro text-cocoa-soft">Bestsellers</p>
      <ul className="mt-4">
        {items.map((product, index) => (
          <li key={product.slug} className={index > 0 ? 'border-t border-cocoa/10' : undefined}>
            <Link to={`/shop/${product.slug}`} className="group flex items-center gap-3 py-3">
              <span className="size-3 rounded-full" style={{ background: `rgb(${product.tone})` }} aria-hidden="true" />
              <span className="flex-1 font-display text-[1.625rem] leading-none whitespace-nowrap transition-colors group-hover:text-clay lg:text-[1.5rem]">{product.name}</span>
              <span className="micro text-cocoa-soft">{formatPrice(product.sizes[1]?.priceCents ?? 0)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function HeroArch({ y, reduce }: { y: MotionValue<number>; reduce: boolean }) {
  return (
    <motion.div
      style={{ y }}
      className="relative mx-auto mt-10 w-[15.625rem] [grid-area:arch] sm:w-[20rem] lg:mt-0 lg:w-full lg:max-w-[26.25rem] lg:self-center"
      initial={{ opacity: 0, scale: reduce ? 1 : 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...easeSlow, duration: motionTokens.duration.crawl, delay: 0.25 }}
    >
      <div className="relative aspect-[21/32]">
        <Echo shape={ARCH} />
        <div className={`glass absolute inset-0 grid place-items-center overflow-hidden ${ARCH}`}>
          <Orb x="50%" y="45%" size="140%" tone="240 182 107" alpha={0.55} />
          <Bottle tone="240 182 107" label="Ombre Claire bottle" className="floaty relative mt-[12%] w-[36%]" />
        </div>
      </div>
      <div className="absolute -right-6 -bottom-4 lg:hidden">
        <CountBadge />
      </div>
    </motion.div>
  )
}

function HeroBody({ rise, reduce }: { rise: number; reduce: boolean }) {
  return (
    <motion.div
      className="relative z-10 mt-12 [grid-area:body] lg:mt-0 lg:self-end"
      initial={{ opacity: 0, y: rise }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...easeSlow, delay: 0.55 }}
    >
      <p className="t-lead text-cocoa-soft">
        {LEAD[0]}
        <br />
        {LEAD[1]}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Magnetic>
          <ButtonLink to="/shop" variant="gradient" size="lg">
            Shop the collection
          </ButtonLink>
        </Magnetic>
        <ButtonLink to="/story" variant="outline" size="lg">
          Our story
        </ButtonLink>
      </div>
      <a href="#collection" className="mt-10 hidden items-center gap-5 lg:inline-flex" aria-label="Scroll to the collection">
        <span className="glass grid size-14 place-items-center rounded-full">
          <motion.svg
            viewBox="0 0 24 24"
            className="size-5"
            aria-hidden="true"
            animate={reduce ? undefined : { y: [0, 5, 0] }}
            transition={{ duration: motionTokens.loop.bob, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path d="M12 5v14M6 13l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </span>
        <span className="micro text-cocoa-soft">Scroll</span>
      </a>
    </motion.div>
  )
}

export function HomeHero() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const archY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140])
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -70])
  const rise = reduce ? 0 : motionTokens.distance.xl

  return (
    <section ref={ref} aria-labelledby="home-title" className="relative overflow-hidden pt-24 pb-10 lg:pt-28 lg:pb-16">
      <Orb x="66%" y="48%" size="66.25rem" tone="247 183 127" alpha={0.9} />
      <Orb x="10%" y="96%" size="48.75rem" tone="233 154 154" alpha={0.55} delay={-4} />
      <Orb x="21%" y="10%" size="35rem" tone="255 226 184" alpha={0.85} delay={-8} />
      <BlobField blobs={BLOBS} viewBox="0 0 1440 900" className="inset-0 h-full w-full" />

      <div className="page-x hero-grid relative lg:min-h-[47.5rem]">
        <motion.div style={{ y: textY }} className="relative z-10 [grid-area:head]">
          <motion.p
            className="micro text-cocoa-soft"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={easeSlow}
          >
            Perfume house · Grasse, France
          </motion.p>
          <h1 id="home-title" className="t-display mt-5 lg:mt-8">
            <SplitText segments={[{ text: 'Maison', breakAfter: true }, { text: 'Sillage', accent: true }]} delay={0.15} />
          </h1>
        </motion.div>

        <HeroArch y={archY} reduce={Boolean(reduce)} />
        <motion.div
          className="hidden flex-col items-end justify-center gap-10 [grid-area:aside] lg:flex"
          initial={{ opacity: 0, x: rise }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...easeSlow, delay: 0.7 }}
        >
          <Bestsellers />
          <div className="mr-10">
            <CountBadge />
          </div>
        </motion.div>

        <HeroBody rise={rise} reduce={Boolean(reduce)} />
      </div>
    </section>
  )
}
