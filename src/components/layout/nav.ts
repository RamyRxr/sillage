export type NavItem = { readonly to: string; readonly label: string; readonly end: boolean }

export const NAV_ITEMS: readonly NavItem[] = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop', end: false },
  { to: '/story', label: 'Our story', end: true },
]
