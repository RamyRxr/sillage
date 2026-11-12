import { motion } from 'motion/react'
import { useRef, type KeyboardEvent } from 'react'
import { cn } from '../../lib/cn'
import { springs } from '../../lib/motion'

export type Option<T extends string | number> = {
  readonly value: T
  readonly label: string
}

type OptionGroupProps<T extends string | number> = {
  /** Accessible name for the group, e.g. "Size". */
  label: string
  options: readonly Option<T>[]
  value: T
  onChange: (value: T) => void
  /** Unique per group on a page, so the sliding highlight stays in its own group. */
  layoutId: string
  className?: string
  optionClassName?: string
}

/**
 * Single-choice pills (sizes, filters). Behaves like a radio group: arrow keys move the choice and only
 * the chosen pill is in the tab order. The dark highlight slides between pills.
 */
export function OptionGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
  layoutId,
  className,
  optionClassName,
}: OptionGroupProps<T>) {
  const refs = useRef<Array<HTMLButtonElement | null>>([])

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key]
    if (!step) return
    event.preventDefault()
    const next = (index + step + options.length) % options.length
    onChange(options[next].value)
    refs.current[next]?.focus()
  }

  return (
    <div role="radiogroup" aria-label={label} className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option, index) => {
        const isChecked = option.value === value
        return (
          <button
            key={String(option.value)}
            ref={(node) => {
              refs.current[index] = node
            }}
            type="button"
            role="radio"
            aria-checked={isChecked}
            tabIndex={isChecked ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              'relative isolate h-11 rounded-full border border-white bg-white/55 px-5 text-sm font-bold shadow-soft transition-colors duration-200',
              isChecked ? 'text-cream' : 'text-cocoa hover:bg-white/85',
              optionClassName,
            )}
          >
            {isChecked && (
              <motion.span
                layoutId={layoutId}
                aria-hidden="true"
                className="absolute inset-0 -z-10 rounded-full bg-cocoa"
                transition={springs.snappy}
              />
            )}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
