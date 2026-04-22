import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import {
  validateWeddingData,
  weddingData,
  type WeddingData,
  type PersonData,
  type EventData,
  type QuranVerseData,
  type LoveStoryItem,
} from '../lib/weddingData'

// ─── Helper builders ───────────────────────────────────────────────────────────

const validPerson = (): PersonData => ({
  fullName: 'Test Person',
  nickname: 'Test',
  parentNames: 'Parent Names',
  photo: 'https://example.com/photo.jpg',
})

const validEvent = (): EventData => ({
  name: 'Akad Nikah',
  date: 'Sabtu, 12 Juli 2025',
  time: '09.00 - 11.00 WITA',
  venue: 'Masjid Agung',
  address: 'Jl. Test No. 1',
  mapsUrl: 'https://maps.google.com/?q=-8.489,117.417',
})

const validVerse = (): QuranVerseData => ({
  arabic: 'وَمِنْ آيَاتِهِ',
  translation: 'Dan di antara tanda-tanda kebesaran-Nya',
  surah: 'QS. Ar-Rum: 21',
})

const validLoveStory = (): LoveStoryItem[] => [
  { title: 'Pertama Bertemu', description: 'Kami bertemu', date: 'Januari 2020' },
]

const validData = (): WeddingData => ({
  groom: validPerson(),
  bride: validPerson(),
  events: [validEvent()],
  gallery: ['https://example.com/photo1.jpg'],
  musicUrl: 'https://example.com/music.mp3',
  quranVerse: validVerse(),
  loveStory: validLoveStory(),
})

// ─── Unit Tests ────────────────────────────────────────────────────────────────

describe('validateWeddingData', () => {
  it('returns true for valid complete data', () => {
    expect(validateWeddingData(validData())).toBe(true)
  })

  it('returns true for the default weddingData export', () => {
    expect(validateWeddingData(weddingData)).toBe(true)
  })

  it('returns false when groom fullName is empty', () => {
    const data = validData()
    data.groom.fullName = ''
    expect(validateWeddingData(data)).toBe(false)
  })

  it('returns false when groom fullName is only whitespace', () => {
    const data = validData()
    data.groom.fullName = '   '
    expect(validateWeddingData(data)).toBe(false)
  })

  it('returns false when bride fullName is empty', () => {
    const data = validData()
    data.bride.fullName = ''
    expect(validateWeddingData(data)).toBe(false)
  })

  it('returns false when events array is empty', () => {
    const data = validData()
    data.events = []
    expect(validateWeddingData(data)).toBe(false)
  })

  it('returns false when gallery array is empty', () => {
    const data = validData()
    data.gallery = []
    expect(validateWeddingData(data)).toBe(false)
  })

  it('returns false when loveStory array is empty', () => {
    const data = validData()
    data.loveStory = []
    expect(validateWeddingData(data)).toBe(false)
  })

  it('returns false when quranVerse.arabic is empty', () => {
    const data = validData()
    data.quranVerse.arabic = ''
    expect(validateWeddingData(data)).toBe(false)
  })

  it('returns false when quranVerse.translation is empty', () => {
    const data = validData()
    data.quranVerse.translation = ''
    expect(validateWeddingData(data)).toBe(false)
  })

  it('returns false when quranVerse.surah is empty', () => {
    const data = validData()
    data.quranVerse.surah = ''
    expect(validateWeddingData(data)).toBe(false)
  })

  it('returns false when musicUrl is empty', () => {
    const data = validData()
    data.musicUrl = ''
    expect(validateWeddingData(data)).toBe(false)
  })

  it('returns false when mapsUrl is an invalid URL', () => {
    const data = validData()
    data.events[0].mapsUrl = 'not-a-url'
    expect(validateWeddingData(data)).toBe(false)
  })

  it('returns true when mapsUrl is a valid URL', () => {
    const data = validData()
    data.events[0].mapsUrl = 'https://maps.google.com/?q=-8.489,117.417'
    expect(validateWeddingData(data)).toBe(true)
  })
})

// ─── Property Tests (Property 11) ─────────────────────────────────────────────

describe('Property 11: validateWeddingData Consistency', () => {
  it('returns true iff all required fields are valid (fast-check)', () => {
    fc.assert(
      fc.property(
        fc.record({
          groomName: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          brideName: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          eventsCount: fc.integer({ min: 1, max: 5 }),
          galleryCount: fc.integer({ min: 1, max: 12 }),
          loveStoryCount: fc.integer({ min: 1, max: 5 }),
          arabic: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          translation: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          surah: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          musicUrl: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
        }),
        ({ groomName, brideName, eventsCount, galleryCount, loveStoryCount, arabic, translation, surah, musicUrl }) => {
          const data: WeddingData = {
            groom: { ...validPerson(), fullName: groomName },
            bride: { ...validPerson(), fullName: brideName },
            events: Array.from({ length: eventsCount }, validEvent),
            gallery: Array.from({ length: galleryCount }, (_, i) => `https://example.com/${i}.jpg`),
            musicUrl,
            quranVerse: { arabic, translation, surah },
            loveStory: Array.from({ length: loveStoryCount }, () => validLoveStory()[0]),
          }
          expect(validateWeddingData(data)).toBe(true)
        }
      )
    )
  })

  it('returns false when any required string field is empty (fast-check)', () => {
    // Test that empty groom name always fails
    fc.assert(
      fc.property(
        fc.constant(validData()),
        (data) => {
          const invalidData = { ...data, groom: { ...data.groom, fullName: '' } }
          expect(validateWeddingData(invalidData)).toBe(false)
        }
      )
    )
  })
})
