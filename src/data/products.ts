import type { Note, Product, Size } from './types'

// PLACEHOLDER DATA. Only Ombre Claire (its name, notes, note lines and the €240 / 50 ml price) comes
// from the brand copy. The other five perfumes, every other price and the discovery set are invented
// for the demo and must be replaced with the store's real catalogue.

function sizes(small: number, standard: number, large: number): readonly Size[] {
  return [
    { ml: 10, label: '10 ml', priceCents: small },
    { ml: 50, label: '50 ml', priceCents: standard },
    { ml: 100, label: '100 ml', priceCents: large },
  ]
}

function notes(top: [string, string], heart: [string, string], base: [string, string]): readonly Note[] {
  return [
    { name: top[0], position: 'Top', line: top[1] },
    { name: heart[0], position: 'Heart', line: heart[1] },
    { name: base[0], position: 'Base', line: base[1] },
  ]
}

export const DISCOVERY_SET_SLUG = 'discovery-set'

export const products: readonly Product[] = [
  {
    slug: 'ombre-claire',
    name: 'Ombre Claire',
    translation: 'Bright shadow',
    family: 'Amber',
    tag: 'Signature',
    tone: '240 182 107',
    summary:
      'Bergamot opens and withdraws within the hour; what remains for the rest of the day is iris, ambrette, and a warm salt skin of ambergris.',
    notes: notes(
      ['Bergamot', 'Cold, green, brief. It exists to leave.'],
      ['Iris', 'Powder and root. The part that stays in the room.'],
      ['Ambergris', 'Salt, skin, warmth. Not a scent so much as a presence.'],
    ),
    sizes: sizes(6_500, 24_000, 38_000),
    defaultMl: 50,
  },
  {
    slug: 'peau-de-sel',
    name: 'Peau de Sel',
    translation: 'Salt skin',
    family: 'Fresh',
    tag: 'New',
    tone: '247 201 165',
    summary: 'Sea air on warm skin. Bright at first, then clean and close for the rest of the day.',
    notes: notes(
      ['Sea salt', 'Mineral and bright. The first breath by the water.'],
      ['Neroli', 'Orange blossom, green at the edges.'],
      ['White musk', 'Clean skin, long after the sea has gone.'],
    ),
    sizes: sizes(5_800, 21_000, 33_500),
    defaultMl: 50,
  },
  {
    slug: 'iris-blanc',
    name: 'Iris Blanc',
    translation: 'White iris',
    family: 'Floral',
    tone: '233 154 154',
    summary: 'Cool iris wrapped in something soft. Quiet, powdery and very close to the skin.',
    notes: notes(
      ['Violet leaf', 'Green and watery. A cool start.'],
      ['Iris', 'Powder and root, at full strength.'],
      ['Cashmere', 'Soft warmth that holds the powder in place.'],
    ),
    sizes: sizes(6_200, 22_500, 36_000),
    defaultMl: 50,
  },
  {
    slug: 'nuit-ambree',
    name: 'Nuit Ambrée',
    translation: 'Amber night',
    family: 'Amber',
    tone: '226 140 110',
    summary: 'Resin and vanilla, slow and warm. The one to wear after dark.',
    notes: notes(
      ['Pink pepper', 'A short spark before the warmth.'],
      ['Amber', 'Resin, honeyed and slow.'],
      ['Tonka', 'Vanilla and almond, late into the night.'],
    ),
    sizes: sizes(6_500, 24_000, 38_000),
    defaultMl: 50,
  },
  {
    slug: 'bois-tendre',
    name: 'Bois Tendre',
    translation: 'Tender wood',
    family: 'Woody',
    tone: '214 170 120',
    summary: 'Dry cedar softened by fig. Warm wood without the weight.',
    notes: notes(
      ['Fig leaf', 'Milky green. Shade on a hot day.'],
      ['Cedar', 'Dry, clean pencil wood.'],
      ['Sandalwood', 'Creamy and warm, the part that lingers.'],
    ),
    sizes: sizes(5_900, 21_500, 34_500),
    defaultMl: 50,
  },
  {
    slug: 'fleur-d-ombre',
    name: "Fleur d'Ombre",
    translation: 'Shadow flower',
    family: 'Floral',
    tone: '238 160 170',
    summary: 'Rose in low light. Petals first, then a soft suede that stays.',
    notes: notes(
      ['Peony', 'Fresh petals, just opened.'],
      ['Rose', 'Full and velvety, a little dark.'],
      ['Soft suede', 'Smooth and warm, a second skin.'],
    ),
    sizes: sizes(6_300, 23_000, 36_500),
    defaultMl: 50,
  },
  {
    slug: DISCOVERY_SET_SLUG,
    name: 'Discovery Set',
    translation: 'All six perfumes',
    family: null,
    tone: '247 183 127',
    summary: 'Six 2 ml vials, one of each perfume. Credited to your first bottle.',
    notes: [],
    sizes: [{ ml: 12, label: '6 × 2 ml', priceCents: 3_500 }],
    defaultMl: 12,
  },
]
