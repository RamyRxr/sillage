import { cn } from '../../lib/cn'

type ImageSlotProps = {
  /** What photo belongs here, e.g. "Atelier image". */
  caption: string
  detail?: string
  className?: string
}

/** A labelled, intentionally empty frame where the store's own photography will go. */
export function ImageSlot({ caption, detail = 'Photo coming soon', className }: ImageSlotProps) {
  return (
    <div
      role="img"
      aria-label={`${caption} (placeholder)`}
      className={cn(
        'grid place-items-center border-[1.5px] border-dashed border-cocoa/30 bg-[linear-gradient(180deg,rgb(255_255_255/0.55),rgb(255_232_214/0.3))] text-center',
        className,
      )}
    >
      <div aria-hidden="true" className="space-y-2 px-6">
        <p className="micro text-cocoa-soft">{caption}</p>
        <p className="micro text-cocoa-soft/70">{detail}</p>
      </div>
    </div>
  )
}
