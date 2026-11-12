const WORDS = [
  'Bergamot',
  'Iris',
  'Ambergris',
  'Sea salt',
  'Neroli',
  'Violet leaf',
  'Amber',
  'Tonka',
  'Cedar',
  'Fig',
  'Rose',
  'Suede',
] as const

/** A slow ticker of the ingredients the house works with. Pauses under reduced motion. */
export function Marquee() {
  return (
    <section aria-label="Ingredients we work with" className="relative overflow-hidden border-y border-cocoa/10 py-5 lg:py-7">
      <p className="sr-only">{WORDS.join(', ')}</p>
      <div className="marquee-track flex w-max" aria-hidden="true">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center">
            {WORDS.map((word) => (
              <li key={word} className="flex items-center gap-10 pr-10 font-display text-[26px] font-light italic lg:gap-14 lg:pr-14 lg:text-[44px]">
                {word}
                <span className="size-2 rounded-full bg-peach lg:size-2.5" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  )
}
