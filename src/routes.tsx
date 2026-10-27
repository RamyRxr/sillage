import type { RouteObject } from 'react-router'
import { RootLayout } from './layouts/RootLayout'
import { Fragrance } from './routes/Fragrance'
import { Home } from './routes/Home'
import { Maison } from './routes/Maison'

// Shared by the browser router (main.tsx) and the memory router in tests.
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'fragrance', element: <Fragrance /> },
      { path: 'maison', element: <Maison /> },
    ],
  },
]
