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
  date: string                // "Jumat, 26 Juni 2026"
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

// Gallery: 12 foto HD dari Unsplash (bebas lisensi) — resolusi 1600px
export const dummyGallery: string[] = [
  // 1 — Couple romantis di taman bunga
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=90&auto=format&fit=crop',
  // 2 — Pasangan di pantai golden hour
  'https://images.unsplash.com/photo-1529636798458-92182e662485?w=1600&q=90&auto=format&fit=crop',
  // 3 — Pengantin wanita dengan buket bunga
  'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1600&q=90&auto=format&fit=crop',
  // 4 — Couple berpegangan tangan close-up
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1600&q=90&auto=format&fit=crop',
  // 5 — Pengantin di altar gereja
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1600&q=90&auto=format&fit=crop',
  // 6 — Detail cincin pernikahan emas
  'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1600&q=90&auto=format&fit=crop',
  // 7 — Couple berjalan di jalan berbatu
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1600&q=90&auto=format&fit=crop',
  // 8 — Pengantin wanita portrait HD
  'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=1600&q=90&auto=format&fit=crop',
  // 9 — Couple di bawah pohon saat sunset
  'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1600&q=90&auto=format&fit=crop',
  // 10 — Dekorasi bunga pernikahan mewah
  'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=1600&q=90&auto=format&fit=crop',
  // 11 — Couple di ladang bunga lavender
  'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1600&q=90&auto=format&fit=crop',
  // 12 — First dance momen bahagia
  'https://images.unsplash.com/photo-1501901609772-df0848060b33?w=1600&q=90&auto=format&fit=crop',
]

// Background music: instrumental romantis bebas royalti dari Pixabay
export const defaultMusicUrl =
  './music/boybandpop_beautiful-in-white-shane-filan-westlife.mp3'

// ─── Wedding Data ──────────────────────────────────────────────────────────────

export const weddingData: WeddingData = {
  groom: {
    fullName: 'Yudi Maryadi',
    nickname: 'Yudi',
    parentNames: 'Putra dari Bapak H. A Maryadi & Ibu Zakiah',
    photo: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=90&auto=format&fit=crop',
    instagram: 'yudimaryadi_',
  },
  bride: {
    fullName: 'Aliza Rizky Shafara',
    nickname: 'Kiki',
    parentNames: 'Putri dari Bapak Azil & Ibu Maria Mahdalena',
    photo: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=90&auto=format&fit=crop',
    instagram: 'alizarizkyy',
  },
  events: [
    {
      name: 'Akad Nikah',
      date: '26 Juni 2026',
      time: '09.00 - 11.00 WITA',
      venue: 'Rumah Mempelai Wanita',
      address: 'Jl. Pasar Baru, No. 12 Arken Taliwang',
      mapsUrl: 'https://maps.google.com/?q=-8.489,117.417',
    },
    {
      name: 'Resepsi',
      date: '26 Juni 2026',
      time: '11.00 - 14.00 WITA',
      venue: 'Villa Muara Nanga',
      address: 'Jl. Telaga Bertong, Sumbawa Barat, NTB',
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
      accountName: 'Yudi Maryadi',
    },
    {
      bank: 'Mandiri',
      accountNumber: '0987654321',
      accountName: 'Aliza Rizky Shafara',
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
