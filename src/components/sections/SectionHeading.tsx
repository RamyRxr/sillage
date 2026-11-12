import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { SplitText, type TextSegment } from '../motion/SplitText'
import { Reveal } from '../motion/Reveal'

type SectionHeadingProps = {
  eyebrow: string
  title: readonly TextSegment[]
  id?: string
  action?: ReactNode
  className?: string
}

export function SectionHeading({ eyebrow, title, id, action, className }: SectionHeadingProps) {
  return (
    <div className={cn('flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div>
        <Reveal distance={8}>
          <p className="micro text-cocoa-soft">{eyebrow}</p>
        </Reveal>
        <h2 id={id} className="t-h2 mt-4">
          <SplitText segments={title} onView />
        </h2>
      </div>
      {action && <Reveal delay={0.2}>{action}</Reveal>}
    </div>
  )
}
