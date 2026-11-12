import { useEffect, useRef } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

// Several dialogs can overlap for a moment (the menu closing while the cart drawer opens), so the
// page scroll lock is counted instead of each dialog saving and restoring it on its own.
let openDialogs = 0
let savedOverflow = ''

function lockScroll() {
  if (openDialogs === 0) {
    savedOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  openDialogs += 1
}

function unlockScroll() {
  openDialogs = Math.max(0, openDialogs - 1)
  if (openDialogs === 0) {
    document.body.style.overflow = savedOverflow
  }
}

/**
 * Modal behaviour for the cart drawer and mobile menu: moves focus inside on open, keeps Tab inside,
 * closes on Escape, locks page scroll, and returns focus to where it was when it closes.
 *
 * Call it with the open state from the component that stays mounted, so the cleanup runs as soon as
 * closing starts, not after the exit animation.
 */
export function useDialog<T extends HTMLElement>(isOpen: boolean, onClose: () => void) {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!isOpen) return
    const node = ref.current
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const focusables = () => (node ? Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)) : [])
    focusables()[0]?.focus()
    lockScroll()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const items = focusables()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      // Focus can fall out of the dialog when the focused button disappears (e.g. "Remove").
      if (!node?.contains(active)) {
        event.preventDefault()
        ;(event.shiftKey ? last : first).focus()
      } else if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      unlockScroll()
      // Only give focus back if nothing else has taken it (a new page, another dialog).
      const active = document.activeElement
      if (!active || active === document.body || node?.contains(active)) {
        previouslyFocused?.focus()
      }
    }
  }, [isOpen, onClose])

  return ref
}
