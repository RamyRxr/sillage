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

// Desktop cards step down, like the design: three in a row on smaller desktops, four from xl up.
const STEP = ['', 'lg:mt-12 xl:mt-8', 'lg:mt-24 xl:mt-16', 'lg:hidden xl:mt-24 xl:block']

export function HomePage() {
  const featured = productRepository.findAll().slice(0, 4)
  const signature = productRepository.findBySlug('ombre-claire')
  return (
    <>
      <title>Sillage — Perfume house, Grasse</title>
      <HomeHero />
      <Marquee />

      <section id="collection" aria-labelledby="collection-title" className="page-x relative mt-24 scroll-mt-28 lg:mt-36">
        <BlobField
          viewBox="0 0 1440 900"
          className="-inset-x-20 top-40 h-[56.25rem] w-[calc(100%+10rem)]"
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
        <Stagger className="relative mt-10 product-grid lg:mt-16">
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
