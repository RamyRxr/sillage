import { Stagger, StaggerItem } from '../components/motion/Reveal'
import { ProductCard } from '../components/product/ProductCard'
import { HomeHero } from '../components/sections/HomeHero'
import { Marquee } from '../components/sections/Marquee'
import { SectionHeading } from '../components/sections/SectionHeading'
import { ServicesStrip } from '../components/sections/ServicesStrip'
import { Spotlight } from '../components/sections/Spotlight'
import { StoryTeaser } from '../components/sections/StoryTeaser'
import { ButtonLink } from '../components/ui/Button'
import { BlobField } from '../components/ui/Decor'
import { productRepository } from '../data/productRepository'
import { cn } from '../lib/cn'

// Desktop cards step down, like the design.
const STEP = ['', 'lg:mt-12', 'lg:mt-24', 'lg:hidden']

export function HomePage() {
  const featured = productRepository.findAll().slice(0, 4)
  const signature = productRepository.findBySlug('ombre-claire')
  return (
    <>
      <title>Sillage — Perfume house, Grasse</title>
      <HomeHero />
      <Marquee />

      <section id="collection" aria-labelledby="collection-title" className="relative mx-auto mt-24 max-w-[90rem] scroll-mt-28 px-5 lg:mt-36 lg:px-20">
        <BlobField
          viewBox="0 0 1440 900"
          className="-inset-x-20 top-40 h-[900px] w-[calc(100%+10rem)]"
          blobs={[
            { cx: 300, cy: 330, r: 260, wobble: 0.14, phase: 1.2, fill: '#F7C9A5', opacity: 0.45 },
            { cx: 1150, cy: 560, r: 300, wobble: 0.15, phase: 3.3, fill: '#E99A9A', opacity: 0.3 },
          ]}
        />
        <SectionHeading
          id="collection-title"
          eyebrow="The collection"
          title={[{ text: 'Six perfumes,', breakAfter: true }, { text: 'one house', accent: true }]}
          action={
            <ButtonLink to="/shop" variant="outline" size="md">
              View all perfumes
            </ButtonLink>
          }
        />
        <Stagger className="relative mt-10 grid grid-cols-2 gap-4 lg:mt-16 lg:grid-cols-3 lg:gap-[52px]">
          {featured.map((product, index) => (
            <StaggerItem key={product.slug} className={cn(STEP[index])}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <div className="mt-24 lg:mt-40">{signature && <Spotlight product={signature} />}</div>
      <div className="mt-12 lg:mt-16">
        <ServicesStrip />
      </div>
      <div className="mt-24 lg:mt-36">
        <StoryTeaser />
      </div>
    </>
  )
}
