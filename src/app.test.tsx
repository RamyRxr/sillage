import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { useCartStore } from './features/cart/cartStore'
import { routes } from './routes'

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(<RouterProvider router={router} />)
  return router
}

beforeEach(() => {
  useCartStore.setState({ lines: [], samples: [], lastOrder: null, isDrawerOpen: false })
})

describe('pages', () => {
  it.each([
    ['/', 'Maison Sillage'],
    ['/shop', 'All perfumes'],
    ['/shop/ombre-claire', 'Ombre Claire'],
    ['/story', /We did not make a perfume/],
    ['/cart', 'Your cart'],
    ['/no-such-page', 'This page left no trace'],
    ['/shop/no-such-perfume', 'This page left no trace'],
  ])('renders exactly one h1 on %s', async (path, heading) => {
    renderAt(path)

    const headings = await screen.findAllByRole('heading', { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveAccessibleName(heading)
  })

  it('has the page landmarks and a skip link', async () => {
    renderAt('/')

    expect(await screen.findByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main')
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main')
  })

  it('navigates from the primary nav and marks the current page', async () => {
    const user = userEvent.setup()
    renderAt('/')

    const nav = await screen.findByRole('navigation', { name: 'Primary' })
    await user.click(within(nav).getByRole('link', { name: 'Shop' }))

    expect(await screen.findByRole('heading', { level: 1, name: 'All perfumes' })).toBeInTheDocument()
    expect(within(nav).getByRole('link', { name: 'Shop' })).toHaveAttribute('aria-current', 'page')
  })
})

describe('shop', () => {
  it('filters by family and keeps the choice in the URL', async () => {
    const user = userEvent.setup()
    const router = renderAt('/shop')

    await user.click(await screen.findByRole('radio', { name: 'Floral' }))

    const grid = screen.getAllByRole('list').find((list) => within(list).queryAllByRole('article').length > 0)
    const names = within(grid as HTMLElement).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    expect(names).toEqual(['Iris Blanc', "Fleur d'Ombre"])
    expect(router.state.location.search).toBe('?family=Floral')
  })

  it('shows an empty state when the search matches nothing', async () => {
    const user = userEvent.setup()
    renderAt('/shop')

    await user.type(await screen.findByRole('searchbox', { name: 'Search perfumes' }), 'chocolate')

    expect(screen.getByText('Nothing matches that yet')).toBeInTheDocument()
  })

  it('adds a perfume from its card and opens the cart drawer', async () => {
    const user = userEvent.setup()
    renderAt('/shop')

    await user.click(await screen.findByRole('button', { name: 'Add Ombre Claire to cart' }))

    const drawer = await screen.findByRole('dialog', { name: 'Your cart' })
    expect(within(drawer).getByRole('link', { name: 'Ombre Claire' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cart, 1 item' })).toBeInTheDocument()
  })

  it('closes the cart drawer with Escape', async () => {
    const user = userEvent.setup()
    useCartStore.setState({ isDrawerOpen: true })
    renderAt('/shop')

    expect(await screen.findByRole('dialog', { name: 'Your cart' })).toBeInTheDocument()
    await user.keyboard('{Escape}')

    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Your cart' })).not.toBeInTheDocument())
  })
})

describe('product page', () => {
  it('adds the chosen size and quantity', async () => {
    const user = userEvent.setup()
    renderAt('/shop/ombre-claire')

    await user.click(await screen.findByRole('radio', { name: /10 ml/ }))
    await user.click(screen.getByRole('button', { name: 'Increase quantity of Ombre Claire' }))
    await user.click(screen.getByRole('button', { name: /Add to cart · €130/ }))

    expect(useCartStore.getState().lines).toEqual([{ slug: 'ombre-claire', ml: 10, quantity: 2 }])
  })
})

describe('checkout', () => {
  it('sends an empty cart back to the cart page', async () => {
    renderAt('/checkout')

    expect(await screen.findByRole('heading', { level: 1, name: 'Your cart' })).toBeInTheDocument()
  })

  it('shows what is wrong, then places the order and confirms it', async () => {
    const user = userEvent.setup()
    useCartStore.setState({ lines: [{ slug: 'ombre-claire', ml: 50, quantity: 1 }] })
    renderAt('/checkout')

    const placeOrder = await screen.findByRole('button', { name: /Place order/ })
    await user.click(placeOrder)
    expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')

    await user.type(screen.getByLabelText('Email'), 'claire@example.com')
    await user.type(screen.getByLabelText('First name'), 'Claire')
    await user.type(screen.getByLabelText('Last name'), 'Martin')
    await user.type(screen.getByLabelText('Address'), '12 rue des Fleurs')
    await user.type(screen.getByLabelText('City'), 'Grasse')
    await user.type(screen.getByLabelText('Postcode'), '06130')
    await user.type(screen.getByLabelText('Card number'), '4242 4242 4242 4242')
    await user.type(screen.getByLabelText('Expiry'), '12/30')
    await user.type(screen.getByLabelText('Security code'), '123')
    await user.click(placeOrder)

    expect(await screen.findByRole('heading', { level: 1, name: 'Thank you' }, { timeout: 3000 })).toBeInTheDocument()
    expect(screen.getByText(/Claire, in a live store your order would now be on its way/)).toBeInTheDocument()
    expect(useCartStore.getState().lines).toEqual([])
    expect(JSON.stringify(useCartStore.getState())).not.toContain('4242')
  })

  it('sends the confirmation page to the shop when there is no order', async () => {
    renderAt('/order/confirmed')

    expect(await screen.findByRole('heading', { level: 1, name: 'All perfumes' })).toBeInTheDocument()
  })
})
