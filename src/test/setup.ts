import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// jsdom has no layout engine; ScrollRestoration calls this on every navigation.
vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

afterEach(() => {
  cleanup()
})
