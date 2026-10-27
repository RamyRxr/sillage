import { fragrance, hero } from '../content/copy'

export function Home() {
  return (
    <section aria-labelledby="hero-title">
      <h1 id="hero-title">{fragrance.name}</h1>
      {hero.lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </section>
  )
}
