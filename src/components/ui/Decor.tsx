import type { CSSProperties } from 'react'
import { blobPath } from '../../lib/blob'
import { cn } from '../../lib/cn'

// Purely decorative layers: glows, liquid shapes and echoing arch lines. All are aria-hidden and
// animate with CSS only, which the reduced-motion rules in global.css switch off.

type OrbProps = {
  /** Centre position, as CSS lengths (e.g. "65%", "420px"). */
  x: string
  y: string
  size: string
  /** "r g b" triple. */
  tone: string
  alpha?: number
  delay?: number
  className?: string
}

export function Orb({ x, y, size, tone, alpha = 0.6, delay = 0, className }: OrbProps) {
  const style = {
    left: x,
    top: y,
    width: size,
    height: size,
    '--orb': tone,
    '--orb-a': alpha,
    animationDelay: `${delay}s`,
  } as CSSProperties
  return <div aria-hidden="true" className={cn('orb', className)} style={style} />
}

export type BlobSpec = {
  readonly cx: number
  readonly cy: number
  readonly r: number
  readonly wobble: number
  readonly phase: number
  readonly fill: string
  readonly opacity: number
}

type BlobFieldProps = {
  blobs: readonly BlobSpec[]
  /** The coordinate box the blob centres are given in. */
  viewBox: string
  className?: string
}

export function BlobField({ blobs, viewBox, className }: BlobFieldProps) {
  return (
    <svg aria-hidden="true" className={cn('pointer-events-none absolute', className)} viewBox={viewBox} preserveAspectRatio="xMidYMid slice">
      {blobs.map((blob, index) => (
        <path
          key={index}
          className="blob"
          style={{ animationDelay: `${index * -3}s` }}
          d={blobPath(blob.cx, blob.cy, blob.r, blob.wobble, blob.phase)}
          fill={blob.fill}
          fillOpacity={blob.opacity}
        />
      ))}
    </svg>
  )
}

type EchoProps = {
  /** Tailwind classes giving the echo the same rounding as the shape it surrounds. */
  shape: string
  /** Light echoes for use on a coloured panel. */
  light?: boolean
}

/** Three outlines that pulse outward from a shape, like the trail of a scent. */
export function Echo({ shape, light = false }: EchoProps) {
  const border = light ? 'border-white/70' : 'border-cocoa/25'
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {[0, 1, 2].map((ring) => (
        <div
          key={ring}
          className={cn('echo absolute -inset-3 border sm:-inset-6', shape, border)}
          style={{ animationDelay: `${ring * 1.8}s` }}
        />
      ))}
    </div>
  )
}
