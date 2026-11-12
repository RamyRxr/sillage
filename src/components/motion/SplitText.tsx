import { motion, useReducedMotion } from 'motion/react'
import { Fragment } from 'react'
import { cn } from '../../lib/cn'
import { motionTokens, REVEAL_MARGIN } from '../../lib/motion'

export type TextSegment = {
  readonly text: string
  readonly accent?: boolean
  /** Start a new line after this segment. */
  readonly breakAfter?: boolean
}

type SplitTextProps = {
  segments: readonly TextSegment[]
  className?: string
  delay?: number
  /** Animate when scrolled into view instead of on mount. */
  onView?: boolean
}

/**
 * A heading whose words rise out of a mask one by one. Screen readers get the plain sentence once;
 * the animated words are hidden from them.
 */
export function SplitText({ segments, className, delay = 0, onView = false }: SplitTextProps) {
  const reduce = useReducedMotion()
  const plain = segments.map((segment) => segment.text).join(' ')
  const words = segments.flatMap((segment) =>
    segment.text.split(' ').map((word, index, all) => ({
      word,
      accent: segment.accent ?? false,
      breakAfter: Boolean(segment.breakAfter) && index === all.length - 1,
    })),
  )
  const trigger = onView
    ? { whileInView: { y: '0%' }, viewport: { once: true, margin: REVEAL_MARGIN } }
    : { animate: { y: '0%' } }

  return (
    <span className={className}>
      <span className="sr-only">{plain}</span>
      <span aria-hidden="true">
        {words.map(({ word, accent, breakAfter }, index) => (
          <Fragment key={`${word}-${index}`}>
            <span className="-mb-[0.14em] inline-block overflow-hidden pr-[0.06em] pb-[0.14em] align-top">
              <motion.span
                className={cn('inline-block', accent && 'accent')}
                initial={{ y: reduce ? '0%' : '108%' }}
                {...trigger}
                transition={{
                  duration: motionTokens.duration.crawl,
                  ease: motionTokens.easing.smooth,
                  delay: delay + index * motionTokens.stagger,
                }}
              >
                {word}
              </motion.span>
            </span>
            {breakAfter ? <br /> : index < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </span>
    </span>
  )
}
