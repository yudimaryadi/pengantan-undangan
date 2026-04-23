'use client'

import { useRef } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { HeroSection } from './sections/HeroSection'
import { QuranVerseSection } from './sections/QuranVerseSection'
import { CoupleSection } from './sections/CoupleSection'
import { CountdownSection } from './sections/CountdownSection'
import { EventSection } from './sections/EventSection'
import { GallerySection } from './sections/GallerySection'
import { LoveStorySection } from './sections/LoveStorySection'
import { WishesSection } from './sections/WishesSection'
import { ClosingSection } from './sections/ClosingSection'
import { type WeddingData } from '@/lib/weddingData'

// Requirements: 8.1, 8.2, 8.3, 8.4

interface InvitationContentProps {
  isVisible: boolean
  data: WeddingData
  guestName?: string
}

// Google Calendar URL builder
function buildGoogleCalendarUrl(data: WeddingData): string {
  const event = data.events[0]
  if (!event) return ''

  const title = encodeURIComponent(`Pernikahan ${data.groom.nickname} & ${data.bride.nickname}`)
  const details = encodeURIComponent(`${event.venue}, ${event.address}`)
  const location = encodeURIComponent(event.address)

  // Use a fixed date for the calendar link (2025-07-12)
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=20250712T020000Z/20250712T070000Z`
}

export function InvitationContent({ isVisible, data, guestName }: InvitationContentProps) {
  // Create refs for each section for scroll reveal
  const heroRef = useRef<HTMLDivElement>(null)
  const quranRef = useRef<HTMLDivElement>(null)
  const coupleRef = useRef<HTMLDivElement>(null)
  const countdownRef = useRef<HTMLDivElement>(null)
  const eventRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const loveStoryRef = useRef<HTMLDivElement>(null)
  const wishesRef = useRef<HTMLDivElement>(null)
  const closingRef = useRef<HTMLDivElement>(null)

  const sectionRefs = [
    heroRef,
    quranRef,
    coupleRef,
    countdownRef,
    eventRef,
    galleryRef,
    loveStoryRef,
    wishesRef,
    closingRef,
  ]

  const visibleSet = useScrollReveal(sectionRefs)

  if (!isVisible) return null

  const googleCalendarUrl = buildGoogleCalendarUrl(data)
  const eventDate = data.events[0]?.date ?? ''

  return (
    <div className="overflow-x-hidden">
      {/* 1. Hero Section */}
      <div ref={heroRef}>
        <HeroSection
          groom={data.groom}
          bride={data.bride}
          eventDate={eventDate}
          isVisible={visibleSet.has(0)}
        />
      </div>

      {/* 2. Quran Verse Section — dark background (forest) */}
      <div ref={quranRef}>
        <QuranVerseSection
          verse={data.quranVerse}
          isVisible={visibleSet.has(1)}
        />
      </div>

      {/* 3. Couple Section — light background (cream) */}
      <div ref={coupleRef}>
        <CoupleSection
          groom={data.groom}
          bride={data.bride}
          isVisible={visibleSet.has(2)}
        />
      </div>

      {/* 4. Countdown Section — dark background (maroon) */}
      <div ref={countdownRef}>
        <CountdownSection
          targetDate="2026-10-12T09:00:00+08:00"
          eventName="Hari Pernikahan Kami"
          googleCalendarUrl={googleCalendarUrl}
          isVisible={visibleSet.has(3)}
        />
      </div>

      {/* 5. Event Section — light background (ivory) */}
      <div ref={eventRef}>
        <EventSection
          events={data.events}
          isVisible={visibleSet.has(4)}
        />
      </div>

      {/* 6. Gallery Section — dark background (maroon) */}
      <div ref={galleryRef}>
        <GallerySection
          photos={data.gallery}
          isVisible={visibleSet.has(5)}
        />
      </div>

      {/* 7. Love Story Section — light background (ivory) */}
      <div ref={loveStoryRef}>
        <LoveStorySection
          items={data.loveStory}
          isVisible={visibleSet.has(6)}
        />
      </div>

      {/* 8. Wishes Section — dark background (forest) */}
      <div ref={wishesRef}>
        <WishesSection
          isVisible={visibleSet.has(7)}
          guestName={guestName}
        />
      </div>

      {/* 9. Closing Section — dark background (maroon) */}
      <div ref={closingRef}>
        <ClosingSection
          groomName={data.groom.nickname}
          brideName={data.bride.nickname}
          groomFullName={data.groom.fullName}
          brideFullName={data.bride.fullName}
          bankAccounts={data.bankAccounts}
          isVisible={visibleSet.has(8)}
        />
      </div>
    </div>
  )
}
