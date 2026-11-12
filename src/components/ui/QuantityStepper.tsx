import { AnimatePresence, motion } from 'motion/react'
import { MAX_QUANTITY } from '../../lib/config'
import { cn } from '../../lib/cn'
import { easeFast, motionTokens } from '../../lib/motion'

type QuantityStepperProps = {
  value: number
  onChange: (value: number) => void
  /** What is being counted, for screen readers, e.g. "Ombre Claire". */
  itemName: string
  min?: number
  max?: number
  className?: string
}

export function QuantityStepper({ value, onChange, itemName, min = 1, max = MAX_QUANTITY, className }: QuantityStepperProps) {
  const buttonClass =
    'grid size-10 place-items-center rounded-full text-lg font-bold text-cocoa transition-colors hover:bg-white/80 disabled:opacity-35'
  return (
    <div className={cn('glass inline-flex items-center gap-1 rounded-full p-1', className)}>
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={`Decrease quantity of ${itemName}`}
      >
        −
      </button>
      <span className="relative grid h-10 w-8 place-items-center overflow-hidden font-bold" aria-live="polite">
        <span className="sr-only">Quantity </span>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: motionTokens.distance.md, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -motionTokens.distance.md, opacity: 0 }}
            transition={easeFast}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </span>
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Increase quantity of ${itemName}`}
      >
        +
      </button>
    </div>
  )
}
