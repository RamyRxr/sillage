import { NavLink, Outlet, ScrollRestoration } from 'react-router'
import { house } from '../content/copy'

const navItems = [
  { to: '/', label: 'Ombre Claire' },
  { to: '/fragrance', label: 'Fragrance' },
  { to: '/maison', label: 'Maison' },
] as const

export function RootLayout() {
  return (
    <>
      <a href="#main">Skip to content</a>
      <header>
        <NavLink to="/" aria-label={`${house.name} — home`}>
          {house.name}
        </NavLink>
        <nav aria-label="Primary">
          <ul>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main id="main">
        <Outlet />
      </main>
      <footer>
        <p>{house.name} · Grasse</p>
      </footer>
      <ScrollRestoration />
    </>
  )
}
