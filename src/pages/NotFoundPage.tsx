import { SplitText } from '../components/motion/SplitText'
import { Bottle } from '../components/product/Bottle'
import { ButtonLink } from '../components/ui/Button'
import { Orb } from '../components/ui/Decor'

export function NotFoundPage() {
  return (
    <section aria-labelledby="not-found-title" className="page-x relative grid min-h-[80svh] place-items-center pt-28 text-center">
      <title>Page not found — Sillage</title>
      <Orb x="50%" y="45%" size="56.25rem" tone="247 183 127" alpha={0.6} />
      <div className="relative">
        <Bottle tone="233 154 154" className="floaty mx-auto w-20 opacity-80" />
        <p className="micro mt-10 text-cocoa-soft">404</p>
        <h1 id="not-found-title" className="t-h2 mt-4">
          <SplitText segments={[{ text: 'This page left', breakAfter: true }, { text: 'no trace', accent: true }]} />
        </h1>
        <p className="t-lead mx-auto mt-6 max-w-[36ch] text-cocoa-soft">It may have moved, or it never existed.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/" variant="gradient">
            Back home
          </ButtonLink>
          <ButtonLink to="/shop" variant="outline">
            Shop perfumes
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
