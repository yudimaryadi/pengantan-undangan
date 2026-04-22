'use client'

import { useReducer } from 'react'

// ─── Types ─────────────────────────────────────────────────────────────────────

export type AppState = 'COVER' | 'ANIMATING' | 'CONTENT'
export type AppEvent = 'OPEN_CLICKED' | 'ANIMATION_COMPLETE'

export interface UseAppStateReturn {
  state: AppState
  dispatch: (event: AppEvent) => void
}

// ─── State Machine ─────────────────────────────────────────────────────────────

/**
 * Pure state transition function.
 * State only moves forward: COVER → ANIMATING → CONTENT.
 * Invalid events for the current state are ignored.
 *
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
 */
export function transition(currentState: AppState, event: AppEvent): AppState {
  if (currentState === 'COVER' && event === 'OPEN_CLICKED') {
    return 'ANIMATING'
  }
  if (currentState === 'ANIMATING' && event === 'ANIMATION_COMPLETE') {
    return 'CONTENT'
  }
  // Invalid event for current state — ignore and keep current state
  return currentState
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Custom hook that manages the app phase state machine.
 * Initializes to COVER state.
 *
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
 */
export function useAppState(): UseAppStateReturn {
  const [state, dispatch] = useReducer(
    (currentState: AppState, event: AppEvent) => transition(currentState, event),
    'COVER' as AppState
  )

  return { state, dispatch }
}
