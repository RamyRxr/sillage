export type Family = 'Fresh' | 'Floral' | 'Amber' | 'Woody'
export type NotePosition = 'Top' | 'Heart' | 'Base'
export type ProductTag = 'Signature' | 'New'

export type Note = {
  readonly name: string
  readonly position: NotePosition
  readonly line: string
}

export type Size = {
  readonly ml: number
  readonly label: string
  readonly priceCents: number
}

export type Product = {
  readonly slug: string
  readonly name: string
  /** English meaning of the French name. */
  readonly translation: string
  /** null for items that are not perfumes in the shop grid, such as the discovery set. */
  readonly family: Family | null
  readonly tag?: ProductTag
  /** "r g b" triple used for the glow and the bottle tint. */
  readonly tone: string
  readonly summary: string
  readonly notes: readonly Note[]
  readonly sizes: readonly Size[]
  readonly defaultMl: number
}
