import { Link } from 'react-router'

const LINKS = [
  { to: '/shop', label: 'Shop' },
  { to: '/story', label: 'Our story' },
  { to: '/cart', label: 'Cart' },
] as const

export function SiteFooter() {
  return (
    <footer className="page-x relative mt-24 pb-10 lg:mt-32">
      <div className="hairline" />
      <div className="flex flex-col gap-8 pt-10 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[max(0.8125rem,11px)] font-extrabold tracking-[0.42em]">SILLAGE</p>
          <p className="mt-3 max-w-[30ch] text-sm text-cocoa-soft">A perfume is not a smell. It is the space you leave behind.</p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-12 gap-y-3 sm:flex sm:gap-10">
            {LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm font-semibold text-cocoa-soft transition-colors hover:text-cocoa">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="micro text-cocoa-soft">Grasse, France</p>
      </div>
      <div className="mt-10 flex flex-col gap-2 text-xs text-cocoa-soft sm:flex-row sm:justify-between">
        <p>© 2026 Sillage. Made in Grasse.</p>
        <p>Demo store: no payment is taken and nothing is sent or stored.</p>
      </div>
    </footer>
  )
}
