import { motion, useReducedMotion, useScroll, type MotionValue } from 'motion/react'
import { useRef } from 'react'
import type { Product } from '../../data/types'
import { REVEAL_MARGIN, riseItem, staggerParent } from '../../lib/motion'
import { Reveal } from '../motion/Reveal'
import { BlobField, Orb } from '../ui/Decor'
import { SectionHeading } from './SectionHeading'

const NOTE_TONES = ['240 182 107', '233 154 154', '190 110 92'] as const
const NOTE_FILLS = ['#F0B66B', '#E99A9A', '#BE6E5C'] as const

/** A moving colour field standing in for a macro photo of the ingredient. */
function NoteTexture({ index }: { index: number }) {
  return (
    <div aria-hidden="true" className="relative h-[110px] overflow-hidden rounded-full border border-white bg-white/45 lg:h-[200px]">
      <Orb x="60%" y="50%" size="130%" tone={NOTE_TONES[index]} alpha={0.6} delay={index * -5} />
      <BlobField
        viewBox="0 0 540 200"
        className="inset-0 h-full w-full"
        blobs={[
          { cx: 200 + index * 60, cy: 110, r: 90, wobble: 0.16, phase: index * 1.3, fill: NOTE_FILLS[index], opacity: 0.45 },
          { cx: 360 - index * 40, cy: 90, r: 70, wobble: 0.2, phase: 2 + index, fill: '#FFFFFF', opacity: 0.5 },
        ]}
      />
    </div>
  )
}

export function NotesInDepth({ product }: { product: Product }) {
  return (
    <section id="notes" aria-labelledby="notes-title" className="mx-auto max-w-[90rem] scroll-mt-28 px-5 lg:px-20">
      <SectionHeading id="notes-title" eyebrow="Notes in depth" title={[{ text: 'How it' }, { text: 'unfolds', accent: true }]} />
      <ol className="mt-10 lg:mt-14">
        {product.notes.map((note, index) => (
          <li key={note.name} className="border-t border-cocoa/15 py-8 lg:grid lg:grid-cols-[120px_1fr_540px] lg:items-center lg:gap-10 lg:py-10">
            <Reveal className="flex items-center gap-3 lg:block">
              <span className="font-display text-[28px] text-cocoa-soft">0{index + 1}</span>
              <p className="micro flex items-center gap-2 text-cocoa-soft lg:mt-4">
                <span className="size-3 rounded-full" style={{ background: `rgb(${NOTE_TONES[index]})` }} aria-hidden="true" />
                {note.position} note
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="t-name mt-3 lg:mt-0">{note.name}</h3>
              <p className="t-lead mt-4 max-w-[40ch]">{note.line}</p>
            </Reveal>
            <Reveal delay={0.2} className="mt-6 lg:mt-0">
              <NoteTexture index={index} />
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  )
}

type Mark = { readonly hours: number; readonly text: string; readonly tone: string }

function marksFor(product: Product): readonly Mark[] {
  const [top, heart, base] = product.notes
  return [
    { hours: 0, text: `${top.name} opens`, tone: NOTE_TONES[0] },
    { hours: 1, text: `…and withdraws`, tone: NOTE_TONES[0] },
    { hours: 4, text: `${heart.name} takes the room`, tone: NOTE_TONES[1] },
    { hours: 8, text: `${base.name} settles`, tone: NOTE_TONES[2] },
    { hours: 24, text: 'A trace remains', tone: NOTE_TONES[2] },
  ]
}

function Marker({ tone }: { tone: string }) {
  return (
    <span
      aria-hidden="true"
      className="block size-[22px] rounded-full border-[3px] bg-white shadow-soft"
      style={{ borderColor: `rgb(${tone})` }}
    />
  )
}

function PhoneTimeline({ marks, progress, trail }: { marks: readonly Mark[]; progress: MotionValue<number> | number; trail: string }) {
  return (
    <div className="relative pl-14 lg:hidden">
      <motion.div
        aria-hidden="true"
        className={`absolute top-2 bottom-2 left-[19px] w-1.5 origin-top rounded-full ${trail} [--dir:180deg]`}
        style={{ scaleY: progress }}
      />
      <motion.ol
        className="space-y-8"
        variants={staggerParent}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: REVEAL_MARGIN }}
      >
        {marks.map((mark) => (
          <motion.li key={mark.hours} className="relative" variants={riseItem}>
            <span className="absolute top-1 -left-[46px]">
              <Marker tone={mark.tone} />
            </span>
            <p className="micro text-cocoa-soft">{mark.hours} h</p>
            <p className="mt-1 font-display text-[22px]">{mark.text}</p>
          </motion.li>
        ))}
      </motion.ol>
    </div>
  )
}

function DesktopTimeline({ marks, progress, trail }: { marks: readonly Mark[]; progress: MotionValue<number> | number; trail: string }) {
  return (
    <div className="relative hidden h-[220px] lg:block">
      <motion.div
        aria-hidden="true"
        className={`absolute top-1/2 right-0 left-0 h-2.5 -translate-y-1/2 origin-left rounded-full ${trail} [--dir:90deg]`}
        style={{ scaleX: progress }}
      />
      <ol>
        {marks.map((mark, index) => {
          const isUp = index % 2 === 0
          const isLast = index === marks.length - 1
          return (
            <li
              key={mark.hours}
              className="absolute top-1/2"
              style={{ left: `${(mark.hours / 24) * 100}%`, transform: 'translate(-50%, -50%)' }}
            >
              <Reveal delay={0.15 * index} distance={8}>
                <Marker tone={mark.tone} />
              </Reveal>
              <Reveal
                delay={0.15 * index + 0.1}
                className={`absolute w-max ${isUp ? 'bottom-10' : 'top-10'} ${isLast ? 'right-0 text-right' : 'left-0'}`}
              >
                <p className="micro text-cocoa-soft">{mark.hours} h</p>
                <p className="mt-1 font-display text-[24px]">{mark.text}</p>
              </Reveal>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

/** How the perfume wears over a day. The trail draws itself as the section scrolls past. */
export function Timeline({ product }: { product: Product }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 55%'] })
  const progress = reduce ? 1 : scrollYProgress
  const marks = marksFor(product)
  const trail = 'bg-[linear-gradient(var(--dir),rgb(240_182_107/0.95),rgb(233_154_154/0.7)_33%,rgb(190_110_92/0.45)_66%,rgb(190_110_92/0.08))]'

  return (
    <section aria-labelledby="timeline-title" className="mx-auto max-w-[90rem] px-5 lg:px-20">
      <SectionHeading id="timeline-title" eyebrow="Longevity & sillage" title={[{ text: 'A day' }, { text: 'with it', accent: true }]} />
      <div ref={ref} className="relative mt-12 lg:mt-16">
        <PhoneTimeline marks={marks} progress={progress} trail={trail} />
        <DesktopTimeline marks={marks} progress={progress} trail={trail} />
      </div>
    </section>
  )
}
