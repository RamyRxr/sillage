import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm, type FieldErrors, type UseFormRegister } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router'
import { Bottle } from '../components/product/Bottle'
import { Button } from '../components/ui/Button'
import { Orb } from '../components/ui/Decor'
import { Field } from '../features/checkout/Field'
import { priceLines, summarize, type PricedLine } from '../features/cart/cartLogic'
import { useCartStore } from '../features/cart/cartStore'
import { checkoutSchema, type CheckoutInput } from '../features/checkout/checkoutSchema'
import { cn } from '../lib/cn'
import { motionTokens } from '../lib/motion'
import { formatPrice } from '../lib/money'

/** Pretend to talk to a payment provider, so the button can show its working state. */
const FAKE_PROCESSING_MS = 900

const EMPTY_FORM: CheckoutInput = {
  email: '',
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  postcode: '',
  country: 'France',
  cardNumber: '',
  expiry: '',
  cvc: '',
}

function Steps() {
  const steps = [
    { label: '1 · Cart', to: '/cart' },
    { label: '2 · Details and payment', to: null },
    { label: '3 · Done', to: null },
  ]
  return (
    <ol aria-label="Checkout steps" className="flex flex-wrap gap-2">
      {steps.map((step, index) => {
        const isCurrent = index === 1
        const classes = cn('inline-flex h-10 items-center rounded-full px-5 text-sm font-bold', isCurrent ? 'bg-cocoa text-cream' : 'glass text-cocoa')
        return (
          <li key={step.label} aria-current={isCurrent ? 'step' : undefined}>
            {step.to ? (
              <Link to={step.to} className={classes}>
                {step.label}
              </Link>
            ) : (
              <span className={classes}>{step.label}</span>
            )}
          </li>
        )
      })}
    </ol>
  )
}

type FieldsProps = { register: UseFormRegister<CheckoutInput>; errors: FieldErrors<CheckoutInput> }

function DeliveryFields({ register, errors }: FieldsProps) {
  return (
    <>
      <fieldset className="space-y-4">
        <legend className="micro mb-4 text-cocoa-soft">Contact</legend>
        <Field label="Email" type="email" autoComplete="email" registration={register('email')} error={errors.email} />
      </fieldset>
      <fieldset className="space-y-4">
        <legend className="micro mb-4 text-cocoa-soft">Delivery</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name" autoComplete="given-name" registration={register('firstName')} error={errors.firstName} />
          <Field label="Last name" autoComplete="family-name" registration={register('lastName')} error={errors.lastName} />
        </div>
        <Field label="Address" autoComplete="street-address" registration={register('address')} error={errors.address} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="City" autoComplete="address-level2" registration={register('city')} error={errors.city} />
          <Field label="Postcode" autoComplete="postal-code" registration={register('postcode')} error={errors.postcode} />
        </div>
        <Field label="Country" autoComplete="country-name" registration={register('country')} error={errors.country} />
      </fieldset>
    </>
  )
}

function PaymentFields({ register, errors }: FieldsProps) {
  return (
    <fieldset className="space-y-4">
      <legend className="micro mb-4 text-cocoa-soft">Payment</legend>
      <p className="rounded-[1.25rem] bg-peach/40 px-5 py-4 text-sm">
        This is a demo. Use the test card <strong>4242 4242 4242 4242</strong> with any future date. Nothing is charged, sent or stored.
      </p>
      <Field label="Card number" inputMode="numeric" autoComplete="off" placeholder="4242 4242 4242 4242" registration={register('cardNumber')} error={errors.cardNumber} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Expiry" placeholder="MM / YY" autoComplete="off" registration={register('expiry')} error={errors.expiry} />
        <Field label="Security code" inputMode="numeric" autoComplete="off" placeholder="CVC" registration={register('cvc')} error={errors.cvc} />
      </div>
    </fieldset>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-cocoa-soft">{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

function OrderSummary({ priced, isSubmitting }: { priced: readonly PricedLine[]; isSubmitting: boolean }) {
  const summary = summarize(priced)
  const label = isSubmitting ? 'Placing order…' : `Place order · ${formatPrice(summary.totalCents)}`
  return (
    <aside aria-label="Your order" className="glass h-fit rounded-[2rem] p-6 sm:p-8 lg:sticky lg:top-32 lg:rounded-[2.5rem]">
      <p className="micro text-cocoa-soft">Your order</p>
      <ul className="mt-5 space-y-4">
        {priced.map((line) => (
          <li key={line.key} className="flex items-center gap-4">
            <span className="grid size-16 shrink-0 place-items-center rounded-[1.125rem] border border-white bg-white/55">
              <Bottle tone={line.product.tone} className="w-7" />
            </span>
            <span className="flex-1">
              <span className="block font-display text-[1.375rem] leading-tight">{line.product.name}</span>
              <span className="micro text-cocoa-soft">
                {line.size.label} · Qty {line.quantity}
              </span>
            </span>
            <span className="font-display text-[1.375rem]">{formatPrice(line.totalCents)}</span>
          </li>
        ))}
      </ul>
      <div className="hairline mt-6" />
      <dl className="mt-5 space-y-3 text-[max(0.9375rem,11px)]">
        <SummaryRow label="Subtotal" value={formatPrice(summary.subtotalCents)} />
        <SummaryRow label="Delivery" value={summary.deliveryCents === 0 ? 'Free' : formatPrice(summary.deliveryCents)} />
      </dl>
      <div className="hairline mt-5" />
      <div className="mt-5 flex items-baseline justify-between">
        <span className="font-display text-2xl">Total</span>
        <span className="font-display text-[2.875rem] leading-none font-light">{formatPrice(summary.totalCents)}</span>
      </div>
      <Button type="submit" form="checkout-form" variant="gradient" size="lg" disabled={isSubmitting} className="mt-7 w-full">
        {isSubmitting && (
          <motion.span
            aria-hidden="true"
            className="size-4 rounded-full border-2 border-cocoa/30 border-t-cocoa"
            animate={{ rotate: 360 }}
            transition={{ duration: motionTokens.loop.spin, repeat: Infinity, ease: 'linear' }}
          />
        )}
        {label}
      </Button>
      <p className="micro mt-5 text-cocoa-soft">Demo store · no payment is taken</p>
    </aside>
  )
}

export function CheckoutPage() {
  const lines = useCartStore((state) => state.lines)
  const placeOrder = useCartStore((state) => state.placeOrder)
  const navigate = useNavigate()
  const schema = useMemo(() => checkoutSchema(), [])
  // What the summary showed when the order was placed, so it does not flash empty while fading out.
  const [placedLines, setPlacedLines] = useState<readonly PricedLine[] | null>(null)
  const isMounted = useRef(false)
  const { register, handleSubmit, formState } = useForm<CheckoutInput>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: EMPTY_FORM,
  })

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const priced = placedLines ?? priceLines(lines)
  if (priced.length === 0) {
    return <Navigate to="/cart" replace />
  }

  async function onSubmit(values: CheckoutInput) {
    await new Promise((resolve) => window.setTimeout(resolve, FAKE_PROCESSING_MS))
    // The visitor may have left checkout while the order was "processing": then do nothing.
    if (!isMounted.current) return
    const snapshot = priceLines(useCartStore.getState().lines)
    // Only the email and first name go into the order. Card details are dropped here, never stored.
    const order = placeOrder({ email: values.email, firstName: values.firstName })
    if (!order) return
    setPlacedLines(snapshot)
    navigate('/order/confirmed', { replace: true })
  }

  return (
    <section aria-labelledby="checkout-title" className="page-x relative pt-24 lg:pt-36">
      <title>Checkout — Sillage</title>
      <Orb x="85%" y="12%" size="56.25rem" tone="247 183 127" alpha={0.55} />
      <div className="relative">
        <Steps />
        <h1 id="checkout-title" className="t-h1 mt-8">
          Check<span className="accent">out</span>
        </h1>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_27.5rem] lg:gap-16">
          {/* method="post" so that even a fallback native submit could never put card details in the URL. */}
          <form
            id="checkout-form"
            method="post"
            noValidate
            onSubmit={(event) => handleSubmit(onSubmit)(event)}
            className="space-y-10"
          >
            <DeliveryFields register={register} errors={formState.errors} />
            <PaymentFields register={register} errors={formState.errors} />
          </form>
          <OrderSummary priced={priced} isSubmitting={formState.isSubmitting} />
        </div>
      </div>
    </section>
  )
}
