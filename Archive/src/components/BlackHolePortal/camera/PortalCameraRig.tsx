import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { PerspectiveCamera } from 'three'

import { useBlackHolePortalStore } from '../store/useBlackHolePortalStore.ts'
import {
  CAMERA_Z,
  CAMERA_DRIFT_RANGE,
  ENTERING_CAMERA_END_Z,
  ENTERING_DURATION,
} from '../utils/constants.ts'
import { dampLerp } from '../utils/math.ts'
import { easeInQuart } from '../utils/easing.ts'

// ============================================================
// Camera Rig — controls position, FOV, and look-at across states
//
// Coordinate system:
//   +X = right,  -X = left
//   +Y = up,     -Y = down
//   +Z = toward viewer (camera default),  -Z = into screen (toward black hole)
//   Black hole center is at origin (0, 0, 0)
//
// Key constants (from constants.ts):
//   CAMERA_Z            — idle rest position along Z (default: 12)
//   CAMERA_DRIFT_RANGE  — max XY offset from mouse (default: 0.3)
//   ENTERING_DURATION   — seconds for the plunge animation (default: 1.2)
//   ENTERING_CAMERA_END_Z — final Z after plunge (default: 0.5)
//
// States:
//   idle        — subtle mouse-follow drift, cam at (mouseX*0.3, mouseY*0.3, 12)
//   portalPause — brief hold before entering, cam centers & zooms slightly
//   entering    — camera accelerates toward black hole (Z: 12→0.5), FOV: 60→100
//
// To adjust the viewing angle:
//   • Change CAMERA_Z in constants.ts to move closer/farther
//   • Add a Y offset to cam.position.y to look down at the disk
//     e.g. cam.position.y = dampLerp(cam.position.y, 2.0, 2, 0.016)
//     then cam.lookAt(0, 0, 0) will tilt the view downward
//   • Add a X offset for a side angle
//   • Change the lookAt target from (0,0,0) to shift the gaze point
//   • FOV is 60° at idle — lower = more telephoto, higher = wider
// ============================================================
export function PortalCameraRig() {
  const { camera } = useThree()
  const mouseX = useRef(0)
  const mouseY = useRef(0)
  const enteringStartTime = useRef<number | null>(null)

  // Track mouse for subtle drift
  useFrame(({ pointer }) => {
    mouseX.current = pointer.x
    mouseY.current = pointer.y

    const state = useBlackHolePortalStore.getState()
    const cam = camera as PerspectiveCamera

    if (state.portalState === 'entering') {
      // Initialize entering start time
      if (enteringStartTime.current === null) {
        enteringStartTime.current = performance.now()
      }

      const elapsed =
        (performance.now() - enteringStartTime.current) / 1000
      const progress = Math.min(elapsed / ENTERING_DURATION, 1)
      const easedProgress = easeInQuart(progress)

      // Camera rushes toward the black hole
      cam.position.z =
        CAMERA_Z + (ENTERING_CAMERA_END_Z - CAMERA_Z) * easedProgress
      cam.position.x = dampLerp(cam.position.x, 0, 8, 0.016)
      cam.position.y = dampLerp(cam.position.y, 0, 8, 0.016)

      // Increase FOV for dramatic effect
      cam.fov = 60 + easedProgress * 40
      cam.updateProjectionMatrix()

      if (progress >= 1) {
        state.enterNavigating()
      }
    } else if (state.portalState === 'portalPause') {
      // Lock camera with slight zoom
      cam.position.x = dampLerp(cam.position.x, 0, 5, 0.016)
      cam.position.y = dampLerp(cam.position.y, 0, 5, 0.016)
      cam.position.z = dampLerp(cam.position.z, CAMERA_Z - 0.5, 3, 0.016)
      enteringStartTime.current = null
    } else {
      // Idle: subtle drift based on mouse
      const targetX = mouseX.current * CAMERA_DRIFT_RANGE

      cam.position.x = dampLerp(cam.position.x, targetX, 2, 0.016)
      cam.position.y = dampLerp(cam.position.y, -1.5, 2, 0.016)
      cam.position.z = dampLerp(cam.position.z, CAMERA_Z, 3, 0.016)

      cam.fov = dampLerp(cam.fov, 60, 3, 0.016)
      cam.updateProjectionMatrix()

      enteringStartTime.current = null
    }

    cam.lookAt(0, 0, 0)
  })

  return null
}
