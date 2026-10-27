// Locked brand copy (IDEA.md §3). Edit here, never inline in components.

export const house = {
  name: 'SILLAGE',
  definition:
    'Sillage (noun, French): the trail of scent a person leaves behind after they have gone.',
} as const

export const fragrance = {
  name: 'OMBRE CLAIRE',
  translation: 'bright shadow',
  volume: '50 ml',
  concentration: 'Extrait de Parfum',
  price: '€240',
  origin: 'Grasse, France',
} as const

export const hero = {
  lines: ['A perfume is not a smell.', 'It is the space you leave behind.'],
} as const

export const manifesto =
  'Most fragrances announce themselves. This one waits. Bergamot opens and withdraws within the hour; what remains for the rest of the day is iris, ambrette, and a warm salt skin of ambergris. Worn close, it reads as your own warmth. Worn at a distance, it is only a suggestion that someone was here.'

export type NotePosition = 'Top' | 'Heart' | 'Base'

export interface Note {
  readonly name: string
  readonly position: NotePosition
  readonly copy: string
}

export const notes: readonly Note[] = [
  { name: 'Bergamot', position: 'Top', copy: 'Cold, green, brief. It exists to leave.' },
  { name: 'Iris', position: 'Heart', copy: 'Powder and root. The part that stays in the room.' },
  {
    name: 'Ambergris',
    position: 'Base',
    copy: 'Salt, skin, warmth. Not a scent so much as a presence.',
  },
]

export const pullQuote = 'We did not make a perfume to be noticed. We made one to be remembered.'

export const cta = 'Request an invitation'
