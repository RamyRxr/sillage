import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { MotionGlobalConfig } from 'motion/react'
import { afterEach, vi } from 'vitest'

// Animations finish instantly in tests, so assertions never wait on a transition.
MotionGlobalConfig.skipAnimations = true

// jsdom has no layout engine and lacks a few browser APIs that the app and motion use.
vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
})

class MockIntersectionObserver {
  readonly root = null
  readonly rootMargin = ''
  readonly thresholds = []
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
Object.defineProperty(window, 'IntersectionObserver', { writable: true, value: MockIntersectionObserver })

afterEach(() => {
  cleanup()
  localStorage.clear()
})
