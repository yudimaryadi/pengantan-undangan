// lib/weddingData.ts — Data undangan pernikahan (type-safe)

// ─── Interfaces ────────────────────────────────────────────────────────────────

export interface PersonData {
  fullName: string
  nickname: string
  parentNames: string
  photo: string               // URL foto
  instagram?: string          // Handle Instagram (tanpa @)
}

export interface EventData {
  name: string                // "Akad Nikah" | "Resepsi"
  date: string                // "Sabtu, 12 Juli 2025"
  time: string                // "09.00 - 11.00 WITA"
  venue: string
  address: string
  mapsUrl: string
}

export interface QuranVerseData {
  arabic: string              // Teks Arab
  translation: string         // Terjemahan Bahasa Indonesia
  surah: string               // "QS. Ar-Rum: 21"
}

export interface LoveStoryItem {
  title: string               // "Pertama Bertemu"
  description: string         // Narasi singkat
  date: string                // "Januari 2020"
  icon?: string               // Emoji atau nama ikon Lucide
}

export interface WishItem {
  name: string
  message: string
  attendance: 'hadir' | 'tidak_hadir'
  timestamp: string           // ISO date string
}

export interface BankAccount {
  bank: string                // "BCA" | "Mandiri" | "BRI" | dll
  accountNumber: string
  accountName: string
}

export interface WeddingData {
  groom: PersonData
  bride: PersonData
  events: EventData[]
  gallery: string[]           // URL foto (min 12 untuk grid galeri)
  musicUrl: string            // URL audio background music (bebas royalti)
  quranVerse: QuranVerseData  // Ayat pembuka (default: QS Ar-Rum: 21)
  loveStory: LoveStoryItem[]  // Timeline kisah cinta
  wishes?: WishItem[]         // Ucapan (opsional, bisa dari localStorage)
  bankAccounts?: BankAccount[] // Info rekening untuk wedding gift
  rsvpUrl?: string
}

// ─── Default Data ──────────────────────────────────────────────────────────────

export const defaultQuranVerse: QuranVerseData = {
  arabic:
    'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ',
  translation:
    'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.',
  surah: 'QS. Ar-Rum: 21',
}

// Gallery: 12 foto dari Unsplash (bebas lisensi)
export const dummyGallery: string[] = [
  // 1 — Couple di taman
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
  // 2 — Pasangan di pantai saat golden hour
  'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800',
  // 3 — Pengantin wanita dengan buket bunga
  'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800',
  // 4 — Couple berpegangan tangan
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
  // 5 — Ciuman di altar
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800',
  // 6 — Detail cincin pernikahan
  'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800',
  // 7 — Couple berjalan di jalan berbatu
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800',
  // 8 — Pengantin wanita close-up
  'https://images.unsplash.com/photo-1594552072238-b8a33785b6cd?w=800',
  // 9 — Couple di bawah pohon
  'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800',
  // 10 — Dekorasi bunga pernikahan
  'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=800',
  // 11 — Couple di ladang bunga
  'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800',
  // 12 — Momen first dance
  'https://images.unsplash.com/photo-1501901609772-df0848060b33?w=800',
]

// Background music: instrumental romantis bebas royalti dari Pixabay
export const defaultMusicUrl =
  './music/boybandpop_beautiful-in-white-shane-filan-westlife.mp3'

// ─── Wedding Data ──────────────────────────────────────────────────────────────

export const weddingData: WeddingData = {
  groom: {
    fullName: 'Gabriel Marchel',
    nickname: 'Mace',
    parentNames: 'Putra dari Bapak H. Syamsul & Ibu Hj. Rahmawati',
    photo: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
    instagram: 'macekaka',
  },
  bride: {
    fullName: 'Malika Anne Shelby',
    nickname: 'Anne',
    parentNames: 'Putri dari Bapak H. Jamaluddin & Ibu Hj. Fatimah',
    photo: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400',
    instagram: 'cucu.ane',
  },
  events: [
    {
      name: 'Akad Nikah',
      date: 'Sabtu, 12 Juli 2025',
      time: '09.00 - 11.00 WITA',
      venue: 'Masjid Agung Sumbawa',
      address: 'Jl. Garuda No. 1, Sumbawa Besar, NTB',
      mapsUrl: 'https://maps.google.com/?q=-8.489,117.417',
    },
    {
      name: 'Resepsi',
      date: 'Sabtu, 12 Juli 2025',
      time: '11.00 - 14.00 WITA',
      venue: 'Gedung Serbaguna Sumbawa',
      address: 'Jl. Diponegoro No. 5, Sumbawa Besar, NTB',
      mapsUrl: 'https://maps.google.com/?q=-8.491,117.419',
    },
  ],
  gallery: dummyGallery,
  musicUrl: defaultMusicUrl,
  quranVerse: defaultQuranVerse,
  loveStory: [
    {
      title: 'Pertama Bertemu',
      description: 'Kami pertama kali bertemu di sebuah acara kampus yang tak terduga.',
      date: 'Januari 2020',
      icon: '✨',
    },
    {
      title: 'Mulai Dekat',
      description: 'Dari teman menjadi sahabat, dari sahabat menjadi lebih dari itu.',
      date: 'Juni 2020',
      icon: '💬',
    },
    {
      title: 'Resmi Bersama',
      description: 'Dengan restu orang tua, kami memulai perjalanan baru bersama.',
      date: 'Desember 2021',
      icon: '💍',
    },
    {
      title: 'Menuju Pelaminan',
      description: 'Alhamdulillah, Allah meridhoi langkah kami menuju pernikahan.',
      date: 'Juli 2025',
      icon: '🕌',
    },
  ],
  wishes: [],
  bankAccounts: [
    {
      bank: 'BCA',
      accountNumber: '1234567890',
      accountName: 'Lorem Ipsum',
    },
    {
      bank: 'Mandiri',
      accountNumber: '0987654321',
      accountName: 'Lorem Ipsum',
    },
  ],
}

// ─── Validation ────────────────────────────────────────────────────────────────

/**
 * Validates a URL string.
 * Returns true if the string is a valid URL, false otherwise.
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validates WeddingData object.
 * Returns true if and only if all required fields are filled with valid values.
 *
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8
 */
export function validateWeddingData(data: WeddingData): boolean {
  // 10.1 — groom and bride fullName must not be empty
  if (!data.groom?.fullName?.trim()) return false
  if (!data.bride?.fullName?.trim()) return false

  // 10.2 — events must have at least one item
  if (!Array.isArray(data.events) || data.events.length < 1) return false

  // 10.3 — gallery must have at least one item
  if (!Array.isArray(data.gallery) || data.gallery.length < 1) return false

  // 10.4 — loveStory must have at least one item
  if (!Array.isArray(data.loveStory) || data.loveStory.length < 1) return false

  // 10.5 — quranVerse fields must not be empty
  if (!data.quranVerse?.arabic?.trim()) return false
  if (!data.quranVerse?.translation?.trim()) return false
  if (!data.quranVerse?.surah?.trim()) return false

  // 10.6 — musicUrl must not be empty
  if (!data.musicUrl?.trim()) return false

  // 10.7 — if mapsUrl is provided, it must be a valid URL
  for (const event of data.events) {
    if (event.mapsUrl && !isValidUrl(event.mapsUrl)) return false
  }

  return true
}
