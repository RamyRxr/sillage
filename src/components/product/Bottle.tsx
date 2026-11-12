import { useId } from 'react'
import { cn } from '../../lib/cn'

type BottleProps = {
  /** "r g b" triple for the liquid and glass tint. */
  tone: string
  className?: string
  /** Accessible name. Leave empty when the bottle is decorative next to the product name. */
  label?: string
}

// The flacon from the design: rectangular body, chamfered shoulders, short neck, faceted cap.
// Coordinates have the base centre at 0,0 with negative y going up.
const BODY = 'M-100,0 L100,0 L100,-268 L78,-290 L-78,-290 L-100,-268 Z'
const CAP = 'M-46,-310 L46,-310 L46,-370 L32,-384 L-32,-384 L-46,-370 Z'

/**
 * Illustrated bottle used until the store supplies product photography. Swap for an <img> by giving
 * products an image field.
 */
export function Bottle({ tone, className, label }: BottleProps) {
  const id = useId().replace(/:/g, '')
  const rgb = `rgb(${tone.replace(/ /g, ',')})`
  const isDecorative = !label

  return (
    <svg
      viewBox="-130 -400 260 440"
      className={cn('block h-auto overflow-visible', className ?? 'w-full')}
      role={isDecorative ? undefined : 'img'}
      aria-label={label}
      aria-hidden={isDecorative ? 'true' : undefined}
    >
      <defs>
        <linearGradient id={`${id}-glass`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="0.45" stopColor={rgb} stopOpacity="0.28" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id={`${id}-juice`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={rgb} stopOpacity="0.55" />
          <stop offset="1" stopColor={rgb} stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id={`${id}-cap`} x1="0" x2="1">
          <stop offset="0" stopColor="#2a1815" />
          <stop offset="0.6" stopColor="#4a2e28" />
          <stop offset="1" stopColor="#2a1815" />
        </linearGradient>
        <radialGradient id={`${id}-shadow`}>
          <stop offset="0" stopColor="#3b2420" stopOpacity="0.28" />
          <stop offset="1" stopColor="#3b2420" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${id}-clip`}>
          <path d={BODY} />
        </clipPath>
      </defs>

      <ellipse cx="0" cy="16" rx="128" ry="18" fill={`url(#${id}-shadow)`} />
      <path d={BODY} fill={`url(#${id}-glass)`} />
      <g clipPath={`url(#${id}-clip)`}>
        <rect x="-100" y="-212" width="200" height="212" fill={`url(#${id}-juice)`} />
        <path d="M-100,-212 Q-50,-220 0,-212 T100,-212 L100,-206 L-100,-206 Z" fill="#fff" fillOpacity="0.35" />
      </g>
      <path d={BODY} fill="none" stroke="#fff" strokeOpacity="0.95" strokeWidth="2" />
      <rect x="62" y="-250" width="10" height="226" rx="5" fill="#fff" fillOpacity="0.55" />
      <rect x="-27" y="-310" width="54" height="22" fill="#3b2420" fillOpacity="0.75" />
      <path d={CAP} fill={`url(#${id}-cap)`} />
      <path d="M-30,-372 L30,-372" stroke="#fff" strokeOpacity="0.25" strokeWidth="2" />
      <rect x="-56" y="-148" width="112" height="44" rx="4" fill="#fff" fillOpacity="0.55" />
      <text
        x="0"
        y="-120"
        textAnchor="middle"
        fontFamily="Manrope Variable, sans-serif"
        fontSize="13"
        fontWeight="800"
        letterSpacing="5"
        fill="#3b2420"
        fillOpacity="0.8"
      >
        SILLAGE
      </text>
    </svg>
  )
}
