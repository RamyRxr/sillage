import type { RouteObject } from 'react-router'
import { Layout } from './components/layout/Layout'
import { CartPage } from './pages/CartPage'
import { ConfirmationPage } from './pages/ConfirmationPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProductPage } from './pages/ProductPage'
import { RouteErrorPage } from './pages/RouteErrorPage'
import { ShopPage } from './pages/ShopPage'
import { StoryPage } from './pages/StoryPage'

// Shared by the browser router (main.tsx) and the memory router in tests.
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'shop', element: <ShopPage /> },
      { path: 'shop/:slug', element: <ProductPage /> },
      { path: 'story', element: <StoryPage /> },
      { path: 'cart', element: <CartPage /> },
      {
        // The checkout form and its validation load only when someone reaches checkout.
        path: 'checkout',
        lazy: async () => {
          const { CheckoutPage } = await import('./pages/CheckoutPage')
          return { Component: CheckoutPage }
        },
      },
      { path: 'order/confirmed', element: <ConfirmationPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
