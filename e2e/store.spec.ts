import { expect, test, type Page } from '@playwright/test'

async function fillCheckout(page: Page) {
  const fields: ReadonlyArray<[string, string]> = [
    ['Email', 'claire@example.com'],
    ['First name', 'Claire'],
    ['Last name', 'Martin'],
    ['Address', '12 rue des Fleurs'],
    ['City', 'Grasse'],
    ['Postcode', '06130'],
    ['Card number', '4242 4242 4242 4242'],
    ['Expiry', '12/30'],
    ['Security code', '123'],
  ]
  for (const [label, value] of fields) {
    await page.getByLabel(label, { exact: true }).fill(value)
  }
}

test('a visitor buys a perfume, from the home page to the confirmation', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: 'Maison Sillage' })).toBeVisible()

  await page.getByRole('link', { name: 'Shop the collection' }).first().click()
  await expect(page.getByRole('heading', { level: 1, name: 'All perfumes' })).toBeVisible()

  await page.getByRole('link', { name: 'Iris Blanc', exact: true }).first().click()
  await expect(page.getByRole('heading', { level: 1, name: 'Iris Blanc' })).toBeVisible()

  await page.getByRole('radio', { name: /100 ml/ }).click()
  await page.getByRole('button', { name: /Add to cart · €360/ }).click()

  const drawer = page.getByRole('dialog', { name: 'Your cart' })
  await expect(drawer.getByRole('link', { name: 'Iris Blanc' })).toBeVisible()
  await drawer.getByRole('link', { name: 'Checkout' }).click()

  await expect(page.getByRole('heading', { level: 1, name: 'Checkout' })).toBeVisible()
  await page.getByRole('button', { name: /Place order/ }).click()
  await expect(page.getByText('Enter a valid email address')).toBeVisible()

  await fillCheckout(page)
  await page.getByRole('button', { name: /Place order/ }).click()

  await expect(page.getByRole('heading', { level: 1, name: 'Thank you' })).toBeVisible()
  await expect(page.getByText(/Claire, in a live store your order would now be on its way/)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Cart, 0 items' })).toBeVisible()
})

test('the cart is still there after a reload', async ({ page }) => {
  await page.goto('/shop/ombre-claire')
  await page.getByRole('button', { name: /Add to cart · €240/ }).click()
  await expect(page.getByRole('dialog', { name: 'Your cart' })).toBeVisible()

  await page.reload()

  await expect(page.getByRole('button', { name: 'Cart, 1 item' })).toBeVisible()
  await page.goto('/cart')
  await expect(page.getByRole('link', { name: 'Ombre Claire' })).toBeVisible()
})

test('with reduced motion the page is complete and readable straight away', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' })
  const page = await context.newPage()
  await page.goto('/')

  const heading = page.getByRole('heading', { level: 1, name: 'Maison Sillage' })
  await expect(heading).toBeVisible()
  await expect(page.getByRole('main').getByText('A perfume is not a smell.')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Shop the collection' }).first()).toBeVisible()
  await context.close()
})

test('the cart drawer closes fully and gives the page back', async ({ page }) => {
  await page.goto('/shop')
  await page.getByRole('button', { name: /^Cart,/ }).click()
  const drawer = page.getByRole('dialog', { name: 'Your cart' })
  await expect(drawer).toBeVisible()

  await page.getByRole('button', { name: 'Close cart' }).click()

  await expect(drawer).toHaveCount(0)
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
})

test.describe('phone menu', () => {
  test.skip(({ isMobile }) => !isMobile, 'The menu button only exists at phone width')

  test('opens, closes fully, and can hand over to the cart drawer', async ({ page }) => {
    await page.goto('/shop')
    const menu = page.getByRole('dialog', { name: 'Menu' })

    await page.getByRole('button', { name: 'Open menu' }).click()
    await expect(menu).toBeVisible()
    await page.getByRole('button', { name: 'Close menu' }).click()
    await expect(menu).toHaveCount(0)

    await page.getByRole('button', { name: 'Open menu' }).click()
    await menu.getByRole('button', { name: 'Cart' }).click()
    await expect(menu).toHaveCount(0)
    await expect(page.getByRole('dialog', { name: 'Your cart' })).toBeVisible()
    await page.getByRole('button', { name: 'Close cart' }).click()
    await expect(page.getByRole('dialog', { name: 'Your cart' })).toHaveCount(0)
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
  })
})
