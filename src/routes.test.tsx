import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it } from 'vitest'
import { routes } from './routes'

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(<RouterProvider router={router} />)
}

describe('routes', () => {
  it.each([
    ['/', 'OMBRE CLAIRE'],
    ['/fragrance', 'The composition'],
    ['/maison', 'The house'],
  ])('renders exactly one h1 on %s', (path, heading) => {
    renderAt(path)

    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent(heading)
  })

  it('renders the landmarks and a skip link to main', () => {
    renderAt('/')

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main')
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main')
  })

  it('navigates between routes from the primary nav', async () => {
    const user = userEvent.setup()
    renderAt('/')

    await user.click(screen.getByRole('link', { name: 'Maison' }))

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('The house')
    expect(screen.getByRole('link', { name: 'Maison' })).toHaveAttribute('aria-current', 'page')
  })
})
