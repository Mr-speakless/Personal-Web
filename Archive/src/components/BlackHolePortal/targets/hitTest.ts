import * as THREE from 'three'

import type { PortalTarget } from '../types/portal.ts'
import { TARGET_PLANE_Z } from '../utils/constants.ts'

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -TARGET_PLANE_Z)
const intersection = new THREE.Vector3()

/**
 * Test if a click at (ndcX, ndcY) hits any target on the 2D plane.
 * Returns the ID of the hit target or null.
 */
export function hitTestTargets(
  ndcX: number,
  ndcY: number,
  camera: THREE.Camera,
  targets: PortalTarget[],
): string | null {
  mouse.set(ndcX, ndcY)
  raycaster.setFromCamera(mouse, camera)

  const hit = raycaster.ray.intersectPlane(plane, intersection)
  if (!hit) return null

  const hitX = intersection.x
  const hitY = intersection.y

  // Find the closest target within click radius
  let closestId: string | null = null
  let closestDist = Infinity

  for (const target of targets) {
    const dx = hitX - target.x
    const dy = hitY - target.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < target.radius * 1.5 && dist < closestDist) {
      closestDist = dist
      closestId = target.id
    }
  }

  return closestId
}

/**
 * Test if a click hits the black hole (center sphere).
 */
export function hitTestBlackHole(
  ndcX: number,
  ndcY: number,
  camera: THREE.Camera,
  eventHorizonRadius: number,
): boolean {
  mouse.set(ndcX, ndcY)
  raycaster.setFromCamera(mouse, camera)

  const sphere = new THREE.Sphere(
    new THREE.Vector3(0, 0, 0),
    eventHorizonRadius,
  )
  return raycaster.ray.intersectsSphere(sphere)
}
