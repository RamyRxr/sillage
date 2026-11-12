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
const ARCH = 'rounded-t-full rounded-b-[36px]'

function CountBadge() {
  const count = productRepository.findAll().length
  return (
    <div className="glass grid size-24 place-items-center rounded-full text-center lg:size-[156px]">
      <div>
        <CountUp to={count} className="block font-display text-[36px] leading-none font-light lg:text-[46px]" />
        <span className="micro mt-1 block text-cocoa-soft lg:mt-2">Perfumes</span>
      </div>
    </div>
  )
}

function Bestsellers() {
  const items = productRepository.findAll().slice(0, 3)
  return (
    <div className="glass w-[300px] rounded-[32px] p-7">
      <p className="micro text-cocoa-soft">Bestsellers</p>
      <ul className="mt-4">
        {items.map((product, index) => (
          <li key={product.slug} className={index > 0 ? 'border-t border-cocoa/10' : undefined}>
            <Link to={`/shop/${product.slug}`} className="group flex items-center gap-3 py-3">
              <span className="size-3 rounded-full" style={{ background: `rgb(${product.tone})` }} aria-hidden="true" />
              <span className="flex-1 font-display text-[26px] leading-none transition-colors group-hover:text-clay">{product.name}</span>
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
      className="relative mx-auto mt-10 w-[250px] [grid-area:arch] sm:w-[320px] lg:mt-0 lg:w-full lg:max-w-[420px] lg:self-center"
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
      <Orb x="66%" y="48%" size="1060px" tone="247 183 127" alpha={0.9} />
      <Orb x="10%" y="96%" size="780px" tone="233 154 154" alpha={0.55} delay={-4} />
      <Orb x="21%" y="10%" size="560px" tone="255 226 184" alpha={0.85} delay={-8} />
      <BlobField blobs={BLOBS} viewBox="0 0 1440 900" className="inset-0 h-full w-full" />

      <div className="hero-grid relative mx-auto max-w-[90rem] px-5 lg:min-h-[760px] lg:px-20">
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
