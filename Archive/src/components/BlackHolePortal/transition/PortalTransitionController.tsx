import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

import type { PortalTarget } from '../types/portal.ts'
import { useBlackHolePortalStore } from '../store/useBlackHolePortalStore.ts'
import { isPortalPauseComplete } from './portalTimeline.ts'

interface PortalTransitionControllerProps {
  targets: PortalTarget[]
  onEnterComplete?: (target: PortalTarget) => void
}

export function PortalTransitionController({
  targets,
  onEnterComplete,
}: PortalTransitionControllerProps) {
  const navigated = useRef(false)

  useFrame(() => {
    const state = useBlackHolePortalStore.getState()

    // portalPause → entering
    if (state.portalState === 'portalPause') {
      if (isPortalPauseComplete(state.pauseStartTime)) {
        state.enterEntering()
      }
    }

    // navigating → perform URL jump
    if (state.portalState === 'navigating' && !navigated.current) {
      navigated.current = true

      const candidateId =
        state.lockedCandidateId ?? state.selectedTargetId
      const target = targets.find((t) => t.id === candidateId)

      if (target) {
        onEnterComplete?.(target)

        // Navigate after a small delay for the callback
        setTimeout(() => {
          window.open(target.url, '_blank')
          // Reset the portal state after navigation
          state.reset()
          navigated.current = false
        }, 100)
      }
    }
  })

  return null
}
