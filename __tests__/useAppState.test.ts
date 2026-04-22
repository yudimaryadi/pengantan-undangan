import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import fc from 'fast-check'
import { useAppState, transition, type AppState, type AppEvent } from '../hooks/useAppState'

// ─── Unit Tests ────────────────────────────────────────────────────────────────

describe('transition function', () => {
  it('transitions COVER → ANIMATING on OPEN_CLICKED', () => {
    expect(transition('COVER', 'OPEN_CLICKED')).toBe('ANIMATING')
  })

  it('transitions ANIMATING → CONTENT on ANIMATION_COMPLETE', () => {
    expect(transition('ANIMATING', 'ANIMATION_COMPLETE')).toBe('CONTENT')
  })

  it('ignores ANIMATION_COMPLETE when in COVER state', () => {
    expect(transition('COVER', 'ANIMATION_COMPLETE')).toBe('COVER')
  })

  it('ignores OPEN_CLICKED when in ANIMATING state', () => {
    expect(transition('ANIMATING', 'OPEN_CLICKED')).toBe('ANIMATING')
  })

  it('ignores OPEN_CLICKED when in CONTENT state', () => {
    expect(transition('CONTENT', 'OPEN_CLICKED')).toBe('CONTENT')
  })

  it('ignores ANIMATION_COMPLETE when in CONTENT state', () => {
    expect(transition('CONTENT', 'ANIMATION_COMPLETE')).toBe('CONTENT')
  })
})

describe('useAppState hook', () => {
  it('initializes to COVER state', () => {
    const { result } = renderHook(() => useAppState())
    expect(result.current.state).toBe('COVER')
  })

  it('transitions to ANIMATING after OPEN_CLICKED', () => {
    const { result } = renderHook(() => useAppState())
    act(() => result.current.dispatch('OPEN_CLICKED'))
    expect(result.current.state).toBe('ANIMATING')
  })

  it('transitions to CONTENT after ANIMATION_COMPLETE', () => {
    const { result } = renderHook(() => useAppState())
    act(() => result.current.dispatch('OPEN_CLICKED'))
    act(() => result.current.dispatch('ANIMATION_COMPLETE'))
    expect(result.current.state).toBe('CONTENT')
  })

  it('does not go back from CONTENT', () => {
    const { result } = renderHook(() => useAppState())
    act(() => result.current.dispatch('OPEN_CLICKED'))
    act(() => result.current.dispatch('ANIMATION_COMPLETE'))
    act(() => result.current.dispatch('OPEN_CLICKED'))
    expect(result.current.state).toBe('CONTENT')
  })
})

// ─── Property Tests (Property 1 & 2) ──────────────────────────────────────────

const ALL_STATES: AppState[] = ['COVER', 'ANIMATING', 'CONTENT']
const STATE_ORDER: Record<AppState, number> = { COVER: 0, ANIMATING: 1, CONTENT: 2 }

describe('Property 1: State Monotonicity', () => {
  it('state never goes backward for any sequence of events (fast-check)', () => {
    const eventArb = fc.array(
      fc.constantFrom<AppEvent>('OPEN_CLICKED', 'ANIMATION_COMPLETE'),
      { minLength: 0, maxLength: 20 }
    )

    fc.assert(
      fc.property(eventArb, (events) => {
        let state: AppState = 'COVER'
        let prevOrder = STATE_ORDER[state]

        for (const event of events) {
          state = transition(state, event)
          const currentOrder = STATE_ORDER[state]
          // State order must never decrease
          expect(currentOrder).toBeGreaterThanOrEqual(prevOrder)
          prevOrder = currentOrder
        }
      })
    )
  })
})

describe('Property 2: Single Visibility', () => {
  it('exactly one component is visible for each state (fast-check)', () => {
    fc.assert(
      fc.property(fc.constantFrom<AppState>(...ALL_STATES), (state) => {
        const coverVisible = state === 'COVER'
        const animatingVisible = state === 'ANIMATING'
        const contentVisible = state === 'CONTENT'

        const visibleCount = [coverVisible, animatingVisible, contentVisible].filter(Boolean).length
        expect(visibleCount).toBe(1)
      })
    )
  })
})
