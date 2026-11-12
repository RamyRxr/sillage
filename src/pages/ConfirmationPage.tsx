import { motion, useReducedMotion } from 'motion/react'
import { Navigate } from 'react-router'
import { Stagger, StaggerItem } from '../components/motion/Reveal'
import { ButtonLink } from '../components/ui/Button'
import { Orb } from '../components/ui/Decor'
import { productRepository } from '../data/productRepository'
import { useCartStore } from '../features/cart/cartStore'
import { easeSlow, motionTokens } from '../lib/motion'
import { formatPrice } from '../lib/money'

function DrawnCheck() {
  const reduce = useReducedMotion()
  const draw = { duration: motionTokens.duration.crawl, ease: motionTokens.easing.smooth }
  return (
    <motion.div
      className="glass mx-auto grid size-24 place-items-center rounded-full"
      initial={{ scale: reduce ? 1 : 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={easeSlow}
    >
      <svg viewBox="0 0 64 64" className="size-14" aria-hidden="true">
        <motion.circle
          cx="32"
          cy="32"
          r="26"
          fill="none"
          stroke="#e99a9a"
          strokeWidth="2"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ ...draw, delay: motionTokens.delay.short }}
        />
        <motion.path
          d="M21 33l8 8 15-17"
          fill="none"
          stroke="#3b2420"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ ...draw, delay: motionTokens.delay.long }}
        />
      </svg>
    </motion.div>
  )
}

export function ConfirmationPage() {
  const order = useCartStore((state) => state.lastOrder)
  if (!order) return <Navigate to="/shop" replace />

  const sampleNames = order.samples
    .map((slug) => productRepository.findBySlug(slug)?.name)
    .filter((name): name is string => Boolean(name))

  return (
    <section aria-labelledby="thanks-title" className="relative mx-auto max-w-[90rem] px-5 pt-28 text-center lg:pt-36">
      <title>Order confirmed — Sillage</title>
      <Orb x="50%" y="25%" size="1100px" tone="247 183 127" alpha={0.65} />
      <Orb x="8%" y="90%" size="600px" tone="233 154 154" alpha={0.4} delay={-5} />
      <Stagger className="relative mx-auto max-w-[600px]">
        <StaggerItem>
          <DrawnCheck />
        </StaggerItem>
        <StaggerItem>
          <p className="micro mt-8 text-cocoa-soft">Order confirmed</p>
          <h1 id="thanks-title" className="t-h1 mt-3">
            Thank <span className="accent">you</span>
          </h1>
        </StaggerItem>
        <StaggerItem>
          <p className="t-lead mx-auto mt-6 max-w-[38ch] text-cocoa-soft">
            {order.firstName}, in a live store your order would now be on its way from Grasse, and a confirmation
            would go to {order.email}.
          </p>
        </StaggerItem>
        <StaggerItem>
          <div className="glass mt-10 rounded-[32px] p-6 text-left sm:p-8 lg:rounded-[40px]">
            <p className="micro text-cocoa-soft">Order {order.number}</p>
            <ul className="mt-5 space-y-3">
              {order.items.map((item) => (
                <li key={`${item.name}-${item.sizeLabel}`} className="flex justify-between gap-4 font-display text-[20px] sm:text-[22px]">
                  <span>
                    {item.name} <span className="micro text-cocoa-soft">{item.sizeLabel} × {item.quantity}</span>
                  </span>
                  <span>{formatPrice(item.totalCents)}</span>
                </li>
              ))}
            </ul>
            {sampleNames.length > 0 && <p className="micro mt-4 text-cocoa-soft">Samples: {sampleNames.join(' · ')}</p>}
            <div className="hairline mt-5" />
            <div className="mt-5 flex items-baseline justify-between">
              <span className="font-display text-2xl">Total</span>
              <span className="font-display text-[46px] leading-none font-light">{formatPrice(order.totalCents)}</span>
            </div>
          </div>
        </StaggerItem>
        <StaggerItem>
          <ButtonLink to="/shop" variant="gradient" size="lg" className="mt-10">
            Continue shopping
          </ButtonLink>
          <p className="micro mt-6 text-cocoa-soft">Demo store · no order was placed and no email was sent</p>
        </StaggerItem>
      </Stagger>
    </section>
  )
}
