'use client'

import { useAppState } from '@/hooks/useAppState'
import { CoverScreen } from './CoverScreen'
import { AnimationLayer } from './AnimationLayer'
import { MusicPlayer } from './MusicPlayer'
import { type WeddingData } from '@/lib/weddingData'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

// Lazy import InvitationContent to avoid circular deps at module level
import dynamic from 'next/dynamic'

const InvitationContent = dynamic(
  () => import('./InvitationContent').then((m) => ({ default: m.InvitationContent })),
  { ssr: false }
)

// Requirements: 1.1, 1.2, 1.3, 1.6, 1.7, 1.8, 12.9

interface WeddingAppProps {
  data: WeddingData
}

function WeddingAppInner({ data }: WeddingAppProps) {
  const { state, dispatch } = useAppState()
  const searchParams = useSearchParams()

  // Read ?to= param — decode URI component for names with spaces
  const guestName = searchParams.get('to')
    ? decodeURIComponent(searchParams.get('to')!)
    : ''

  return (
    <main className="min-h-screen bg-w-bg font-poppins overflow-x-hidden">
      {/* COVER phase */}
      {state === 'COVER' && (
        <CoverScreen
          groomName={data.groom.nickname}
          brideName={data.bride.nickname}
          couplePhoto={data.groom.photo}
          isVisible={true}
          guestName={guestName}
          onOpenClick={() => dispatch('OPEN_CLICKED')}
        />
      )}

      {/* ANIMATING phase */}
      {state === 'ANIMATING' && (
        <AnimationLayer
          isActive={true}
          onComplete={() => dispatch('ANIMATION_COMPLETE')}
        />
      )}

      {/* CONTENT phase */}
      {state === 'CONTENT' && (
        <>
          <InvitationContent isVisible={true} data={data} guestName={guestName} />
          <MusicPlayer musicUrl={data.musicUrl} autoPlay={true} />
        </>
      )}
    </main>
  )
}

export function WeddingApp({ data }: WeddingAppProps) {
  return (
    <Suspense fallback={null}>
      <WeddingAppInner data={data} />
    </Suspense>
  )
}
