import { dampLerp } from '../utils/math.ts'
import {
  TARGETING_LERP_SPEED,
  ARRIVAL_THRESHOLD,
} from '../utils/constants.ts'

/**
 * Move the selected target toward the black hole center (0, 0) on the 2D plane.
 * Returns the new position and whether the target has arrived.
 */
export function updateTargetingMotion(
  x: number,
  y: number,
  dt: number,
): { x: number; y: number; arrived: boolean } {
  const newX = dampLerp(x, 0, TARGETING_LERP_SPEED, dt)
  const newY = dampLerp(y, 0, TARGETING_LERP_SPEED, dt)

  const dist = Math.sqrt(newX * newX + newY * newY)
  const arrived = dist < ARRIVAL_THRESHOLD

  return {
    x: arrived ? 0 : newX,
    y: arrived ? 0 : newY,
    arrived,
  }
}
