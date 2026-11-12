import { Reveal } from '../motion/Reveal'
import { SplitText } from '../motion/SplitText'
import { ButtonLink } from '../ui/Button'
import { Echo, Orb } from '../ui/Decor'
import { ImageSlot } from '../ui/ImageSlot'

export const QUOTE = 'We did not make a perfume to be noticed. We made one to be remembered.'

export function StoryTeaser() {
  return (
    <section aria-labelledby="story-title" className="relative mx-auto grid max-w-[90rem] items-center gap-14 px-5 lg:grid-cols-[1.2fr_0.8fr] lg:px-20">
      <Orb x="8%" y="60%" size="700px" tone="247 183 127" alpha={0.35} />
      <div className="relative">
        <Reveal distance={8}>
          <p className="micro text-cocoa-soft">Our story</p>
        </Reveal>
        <h2 id="story-title" className="t-quote mt-5">
          <SplitText segments={[{ text: QUOTE }]} onView />
        </h2>
        <Reveal delay={0.3} className="mt-10">
          <ButtonLink to="/story" variant="outline" size="md">
            Read our story
          </ButtonLink>
        </Reveal>
      </div>
      <Reveal className="relative mx-auto w-full max-w-[420px]">
        <div className="relative aspect-[42/50]">
          <Echo shape="rounded-full" />
          <ImageSlot caption="Atelier image" className="absolute inset-0 rounded-full" />
        </div>
      </Reveal>
    </section>
  )
}
