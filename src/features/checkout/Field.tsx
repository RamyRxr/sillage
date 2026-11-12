import { AnimatePresence, motion } from 'motion/react'
import type { InputHTMLAttributes } from 'react'
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import { easeFast, motionTokens } from '../../lib/motion'

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  registration: UseFormRegisterReturn
  error?: FieldError
}

/** A labelled text field whose error message is announced and linked to the input. */
export function Field({ label, registration, error, className, ...input }: FieldProps) {
  const id = `field-${registration.name}`
  const errorId = `${id}-error`
  return (
    <div className={className}>
      <div className="relative">
        <label htmlFor={id} className="micro pointer-events-none absolute top-3 left-5 text-cocoa-soft">
          {label}
        </label>
        <input
          id={id}
          className="field"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          {...input}
          {...registration}
        />
      </div>
      <AnimatePresence initial={false}>
        {error?.message && (
          <motion.p
            key="error"
            id={errorId}
            role="alert"
            className="mt-2 pl-5 text-sm font-semibold text-danger"
            initial={{ opacity: 0, y: -motionTokens.distance.xs }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={easeFast}
          >
            {error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
