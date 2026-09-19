import type { PortalTarget } from '../types/portal.ts'
import { distance2d } from '../utils/math.ts'

export function resolveCollisions(
  targets: PortalTarget[],
  excludeId: string | null,
): void {
  for (let i = 0; i < targets.length; i++) {
    if (targets[i].id === excludeId) continue

    for (let j = i + 1; j < targets.length; j++) {
      if (targets[j].id === excludeId) continue

      const a = targets[i]
      const b = targets[j]
      const dist = distance2d(a.x, a.y, b.x, b.y)
      const minDist = a.radius + b.radius

      if (dist < minDist && dist > 0.001) {
        const overlap = minDist - dist
        const dx = (b.x - a.x) / dist
        const dy = (b.y - a.y) / dist

        // Push apart equally
        const halfOverlap = overlap * 0.5
        a.x -= dx * halfOverlap
        a.y -= dy * halfOverlap
        b.x += dx * halfOverlap
        b.y += dy * halfOverlap

        // Adjust velocities
        const relVx = a.vx - b.vx
        const relVy = a.vy - b.vy
        const dotNormal = relVx * dx + relVy * dy

        if (dotNormal > 0) {
          a.vx -= dx * dotNormal * 0.5
          a.vy -= dy * dotNormal * 0.5
          b.vx += dx * dotNormal * 0.5
          b.vy += dy * dotNormal * 0.5
        }
      }
    }
  }
}
