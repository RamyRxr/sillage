import { FREE_DELIVERY_FROM_CENTS } from '../../lib/config'
import { formatPrice } from '../../lib/money'
import { Stagger, StaggerItem } from '../motion/Reveal'

// PLACEHOLDER promises. The store owner must confirm the real delivery, sample and returns policy.
const SERVICES = [
  { title: 'Made in Grasse', note: 'Small batches, by hand' },
  { title: 'Free delivery', note: `On orders over ${formatPrice(FREE_DELIVERY_FROM_CENTS)}` },
  { title: 'Two samples', note: 'With every order' },
  { title: '30-day returns', note: 'On unopened bottles' },
] as const

export function ServicesStrip() {
  return (
    <section aria-label="Our promises" className="page-x">
      <Stagger className="glass grid rounded-[2rem] px-6 py-2 sm:grid-cols-2 lg:grid-cols-4 lg:rounded-[2.5rem] lg:px-0 lg:py-8">
        {SERVICES.map((service, index) => (
          <StaggerItem
            key={service.title}
            className={`py-4 lg:px-9 lg:py-2 ${index > 0 ? 'border-t border-cocoa/10 sm:border-t-0 lg:border-l' : ''} ${index > 1 ? 'sm:border-t lg:border-t-0' : ''}`}
          >
            <p className="font-display text-[1.375rem] lg:text-[1.5rem]">{service.title}</p>
            <p className="micro mt-2 text-cocoa-soft">{service.note}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}
