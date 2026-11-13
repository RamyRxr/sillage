import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigationType, useSearchParams } from 'react-router'
import { SplitText } from '../components/motion/SplitText'
import { ProductCard } from '../components/product/ProductCard'
import { ServicesStrip } from '../components/sections/ServicesStrip'
import { DiscoveryPanel, FamilyTiles } from '../components/sections/ShopSections'
import { Button } from '../components/ui/Button'
import { Orb } from '../components/ui/Decor'
import { OptionGroup } from '../components/ui/OptionGroup'
import { productRepository } from '../data/productRepository'
import type { Product } from '../data/types'
import {
  FAMILY_FILTERS,
  filterAndSort,
  parseFamily,
  parseSort,
  SORT_OPTIONS,
  type FamilyFilter,
  type SortKey,
} from '../features/shop/shopFilters'
import { easeNormal, motionTokens } from '../lib/motion'

const MAX_QUERY = 60
type FilterKey = 'family' | 'sort' | 'q'

function SearchField({ query, onChange }: { query: string; onChange: (value: string) => void }) {
  const searchRef = useRef<HTMLInputElement>(null)
  const location = useLocation()
  const wantsFocus = (location.state as { focusSearch?: boolean } | null)?.focusSearch === true

  useEffect(() => {
    if (wantsFocus) searchRef.current?.focus()
  }, [wantsFocus])

  return (
    <label className="glass flex h-11 items-center gap-2 rounded-full px-4 sm:flex-1 lg:w-64 lg:flex-none">
      <span className="sr-only">Search perfumes</span>
      <svg viewBox="0 0 24 24" className="size-4 shrink-0" aria-hidden="true">
        <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
      <input
        ref={searchRef}
        type="search"
        value={query}
        maxLength={MAX_QUERY}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by name or note"
        className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-cocoa-soft/80"
      />
    </label>
  )
}

function SortSelect({ sort, onChange }: { sort: SortKey; onChange: (value: string) => void }) {
  return (
    <label className="glass relative flex h-11 items-center rounded-full pr-9 pl-4">
      <span className="sr-only">Sort perfumes</span>
      <select value={sort} onChange={(event) => onChange(event.target.value)} className="appearance-none bg-transparent text-sm font-bold outline-none">
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            Sort · {option.label}
          </option>
        ))}
      </select>
      <svg viewBox="0 0 24 24" className="pointer-events-none absolute right-3 size-4" aria-hidden="true">
        <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    </label>
  )
}

type FiltersProps = {
  family: FamilyFilter
  sort: SortKey
  query: string
  total: number
  onChange: (key: FilterKey, value: string) => void
}

function Filters({ family, sort, query, total, onChange }: FiltersProps) {
  const options = FAMILY_FILTERS.map((value) => ({ value, label: value === 'All' ? `All · ${total}` : value }))
  return (
    <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <OptionGroup label="Filter by family" layoutId="family-filter" options={options} value={family} onChange={(value) => onChange('family', value)} />
      <div className="grid gap-3 sm:flex">
        <SearchField query={query} onChange={(value) => onChange('q', value)} />
        <SortSelect sort={sort} onChange={(value) => onChange('sort', value)} />
      </div>
    </div>
  )
}

function ResultsGrid({ results }: { results: readonly Product[] }) {
  const reduce = useReducedMotion()
  const pop = reduce ? 1 : motionTokens.scale.subtle
  return (
    <motion.ul layout className="mt-10 product-grid lg:mt-12">
      <AnimatePresence mode="popLayout" initial={false}>
        {results.map((product, index) => (
          <motion.li
            key={product.slug}
            layout
            initial={{ opacity: 0, scale: pop, y: reduce ? 0 : motionTokens.distance.lg }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { ...easeNormal, delay: index * motionTokens.staggerFast } }}
            exit={{ opacity: 0, scale: pop, transition: easeNormal }}
          >
            <ProductCard product={product} />
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  )
}

function NoResults({ onReset }: { onReset: () => void }) {
  return (
    <div className="glass mt-10 grid place-items-center rounded-[2.5rem] px-6 py-20 text-center">
      <p className="font-display text-3xl">Nothing matches that yet</p>
      <p className="mt-2 text-cocoa-soft">Try another family or a different note.</p>
      <Button variant="dark" className="mt-8" onClick={onReset}>
        Show all perfumes
      </Button>
    </div>
  )
}

/**
 * Filters live in the URL so they can be shared. The search box keeps its own copy of the text so
 * typing is never slowed or dropped by URL updates, and re-syncs when a link changes the URL.
 */
function useShopFilters() {
  const [params, setParams] = useSearchParams()
  const location = useLocation()
  const navigationType = useNavigationType()
  const urlQuery = (params.get('q') ?? '').slice(0, MAX_QUERY)
  const [query, setQuery] = useState(urlQuery)
  const [syncedKey, setSyncedKey] = useState(location.key)

  // A link or Back/Forward changed the URL: take the search text from it. Our own updates use
  // replace, so they never overwrite what is being typed.
  if (location.key !== syncedKey) {
    setSyncedKey(location.key)
    if (navigationType !== 'REPLACE') setQuery(urlQuery)
  }

  function update(key: FilterKey, value: string) {
    const clean = key === 'q' ? value.slice(0, MAX_QUERY) : value
    if (key === 'q') setQuery(clean)
    const next = new URLSearchParams(params)
    const isDefault = (key === 'family' && clean === 'All') || (key === 'sort' && clean === 'featured') || clean === ''
    if (isDefault) next.delete(key)
    else next.set(key, clean)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  function reset() {
    setQuery('')
    setParams(new URLSearchParams(), { replace: true, preventScrollReset: true })
  }

  return { family: parseFamily(params.get('family')), sort: parseSort(params.get('sort')), query, update, reset }
}

export function ShopPage() {
  const reduce = useReducedMotion()
  const { family, sort, query, update, reset } = useShopFilters()
  const all = productRepository.findAll()
  const results = filterAndSort(all, { family, sort, query })

  function handleFamilyPick() {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <>
      <title>Shop all perfumes — Sillage</title>
      <section aria-labelledby="shop-title" className="page-x relative pt-28 lg:pt-40">
        <Orb x="85%" y="18%" size="56.25rem" tone="247 183 127" alpha={0.6} />
        <Orb x="0%" y="70%" size="37.5rem" tone="233 154 154" alpha={0.4} delay={-6} />
        <div className="relative">
          <p className="micro text-cocoa-soft">The collection</p>
          <h1 id="shop-title" className="t-h1 mt-4">
            <SplitText segments={[{ text: 'All' }, { text: 'perfumes', accent: true }]} />
          </h1>
          <p className="t-lead mt-6 max-w-[40ch] text-cocoa-soft">Six extraits de parfum, composed and bottled in Grasse.</p>
          <Filters family={family} sort={sort} query={query} total={all.length} onChange={update} />
          <p className="sr-only" aria-live="polite">
            {results.length} {results.length === 1 ? 'perfume' : 'perfumes'} shown
          </p>
          {results.length === 0 ? <NoResults onReset={reset} /> : <ResultsGrid results={results} />}
        </div>
      </section>
      <div className="mt-24 lg:mt-36">
        <DiscoveryPanel />
      </div>
      <div className="mt-24 lg:mt-36">
        <FamilyTiles onPick={handleFamilyPick} />
      </div>
      <div className="mt-16 lg:mt-24">
        <ServicesStrip />
      </div>
    </>
  )
}
