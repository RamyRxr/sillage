import { cn } from '../../lib/cn'

export type ButtonVariant = 'gradient' | 'dark' | 'outline' | 'glass'
export type ButtonSize = 'sm' | 'md' | 'lg'

const VARIANTS: Record<ButtonVariant, string> = {
  gradient: 'btn-gradient text-cocoa shadow-warm',
  dark: 'bg-cocoa text-cream shadow-dark',
  outline: 'border border-cocoa/35 text-cocoa hover:bg-white/45',
  glass: 'glass text-cocoa',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-11 px-5 text-sm',
  md: 'h-14 px-7 text-[15px]',
  lg: 'h-[60px] px-8 text-[15px]',
}

export function buttonClasses(variant: ButtonVariant = 'gradient', size: ButtonSize = 'md', className?: string): string {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-bold tracking-[0.02em] whitespace-nowrap transition-colors duration-200 disabled:opacity-50',
    VARIANTS[variant],
    SIZES[size],
    className,
  )
}
