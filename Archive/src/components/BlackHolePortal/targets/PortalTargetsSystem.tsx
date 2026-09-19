import { useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

import * as THREE from 'three'
import type { PortalTarget } from '../types/portal.ts'
import { useBlackHolePortalStore } from '../store/useBlackHolePortalStore.ts'
import { EVENT_HORIZON_RADIUS, TARGET_PLANE_Z } from '../utils/constants.ts'
import { distance2d } from '../utils/math.ts'
import { tickIdleClock, setViewportBounds, updateIdleMotion } from './idleMotion.ts'
import { resolveCollisions } from './collision2d.ts'
import { updateTargetingMotion } from './targetingMotion.ts'
import { hitTestTargets, hitTestBlackHole } from './hitTest.ts'

interface PortalTargetsSystemProps {
  mutableTargets: PortalTarget[]
  onEnterStart?: (target: PortalTarget) => void
}

export function PortalTargetsSystem({
  mutableTargets,
  onEnterStart,
}: PortalTargetsSystemProps) {
  const { camera } = useThree()
  const store = useBlackHolePortalStore

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    const state = store.getState()
    const { portalState, selectedTargetId, isInteractionLocked } = state

    const targets = mutableTargets

    // Slow down during portalPause
    const speedMultiplier =
      portalState === 'portalPause' || portalState === 'entering' ? 0.02 : 1

    // Compute visible bounds at the target plane from camera FOV & aspect
    const perspCam = camera as THREE.PerspectiveCamera
    const dist = perspCam.position.z - TARGET_PLANE_Z // distance from camera to icon plane
    const vFov = (perspCam.fov * Math.PI) / 180
    const visibleHalfH = Math.tan(vFov / 2) * dist
    const visibleHalfW = visibleHalfH * perspCam.aspect
    setViewportBounds(visibleHalfW, visibleHalfH)

    // Advance idle clock once per frame (not per target)
    tickIdleClock(dt * speedMultiplier)

    // Update idle targets
    for (const target of targets) {
      if (target.id === selectedTargetId && portalState === 'targeting') {
        const result = updateTargetingMotion(target.x, target.y, dt)
        target.x = result.x
        target.y = result.y
        target.vx = 0
        target.vy = 0

        if (result.arrived && !isInteractionLocked) {
          onEnterStart?.(target)
          store.getState().enterPortalPause()
        }
      } else {
        const motion = updateIdleMotion(target, dt * speedMultiplier)
        target.x = motion.x
        target.y = motion.y
        target.vx = motion.vx
        target.vy = motion.vy
      }
    }

    resolveCollisions(targets, selectedTargetId)

    // Compute natural activeTarget (closest to center)
    if (portalState === 'idle') {
      let closestId: string | null = null
      let closestDist = Infinity

      for (const target of targets) {
        const dist = distance2d(target.x, target.y, 0, 0)
        if (dist < closestDist) {
          closestDist = dist
          closestId = target.id
        }
      }

      if (closestDist < 4) {
        state.setActiveTarget(closestId)
      } else {
        state.setActiveTarget(null)
      }
    }
  })

  const getNdc = useCallback(
    (event: { nativeEvent: MouseEvent }) => {
      const rect = (
        event.nativeEvent.target as HTMLElement
      )?.getBoundingClientRect()
      if (!rect) return null
      return {
        x: ((event.nativeEvent.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((event.nativeEvent.clientY - rect.top) / rect.height) * 2 + 1,
      }
    },
    [],
  )

  const handleClick = useCallback(
    (event: { nativeEvent: MouseEvent }) => {
      const state = store.getState()
      if (state.isInteractionLocked) return

      const ndc = getNdc(event)
      if (!ndc) return

      const hitId = hitTestTargets(ndc.x, ndc.y, camera, mutableTargets)

      if (hitId) {
        state.selectTarget(hitId)
        return
      }

      if (hitTestBlackHole(ndc.x, ndc.y, camera, EVENT_HORIZON_RADIUS * 1.5)) {
        state.clickBlackHole()
      }
    },
    [camera, mutableTargets, getNdc],
  )

  const handlePointerMove = useCallback(
    (event: { nativeEvent: MouseEvent }) => {
      const ndc = getNdc(event)
      if (!ndc) return

      const hitId = hitTestTargets(ndc.x, ndc.y, camera, mutableTargets)
      store.getState().setHoveredTarget(hitId)

      // Update cursor
      const canvas = (event.nativeEvent.target as HTMLElement)?.closest('canvas')
      if (canvas) {
        canvas.style.cursor = hitId ? 'pointer' : 'default'
      }
    },
    [camera, mutableTargets, getNdc],
  )

  const handlePointerLeave = useCallback(() => {
    store.getState().setHoveredTarget(null)
  }, [])

  return (
    <group onClick={handleClick} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      <mesh visible={false}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  )
}
