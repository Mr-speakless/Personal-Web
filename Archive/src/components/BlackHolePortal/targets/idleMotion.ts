import type { PortalTarget } from '../types/portal.ts'
import {
  IDLE_DAMPING,
  IDLE_RANDOM_FORCE,
  BOUNDARY_REPULSION,
} from '../utils/constants.ts'

// Dynamic viewport bounds — updated each frame from camera
let halfW = 20
let halfH = 12

let _globalTime = 0

// Simple seeded hash for per-target phase offsets
function hashId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) | 0
  }
  return (h & 0x7fffffff) / 0x7fffffff
}

// Per-target phase cache (computed once)
const phaseCache = new Map<string, { px1: number; py1: number; px2: number; py2: number }>()

function getPhases(target: PortalTarget) {
  let p = phaseCache.get(target.id)
  if (!p) {
    const h = hashId(target.id)
    p = {
      px1: h * 100,
      py1: h * 137 + 50,
      px2: h * 211 + 80,
      py2: h * 173 + 120,
    }
    phaseCache.set(target.id, p)
  }
  return p
}

/** Call once per frame before updating targets to advance the shared clock */
export function tickIdleClock(dt: number) {
  _globalTime += dt
}

/** Update the floating boundary to match the camera's visible area at the target plane */
export function setViewportBounds(hw: number, hh: number) {
  halfW = hw
  halfH = hh
}

export function updateIdleMotion(
  target: PortalTarget,
  dt: number,
): { x: number; y: number; vx: number; vy: number } {
  let { x, y, vx, vy } = target
  const p = getPhases(target)

  // Smooth drift force: low-frequency sinusoidal waves unique to each icon
  // Two overlapping sine waves per axis for organic, non-repetitive motion
  const driftX =
    Math.sin(_globalTime * 0.15 + p.px1) * 0.12 +
    Math.sin(_globalTime * 0.07 + p.px2) * 0.08
  const driftY =
    Math.sin(_globalTime * 0.12 + p.py1) * 0.10 +
    Math.cos(_globalTime * 0.06 + p.py2) * 0.08

  vx += driftX * IDLE_RANDOM_FORCE
  vy += driftY * IDLE_RANDOM_FORCE

  // Soft boundary repulsion — force scales with penetration depth (no dt, applied directly to velocity)
  const marginX = halfW - target.radius
  const marginY = halfH - target.radius
  const fadeZone = 0.3 // fraction of margin where repulsion ramps up
  if (x > marginX * (1 - fadeZone)) {
    const pen = (x - marginX * (1 - fadeZone)) / (marginX * fadeZone)
    vx -= BOUNDARY_REPULSION * pen * pen * 0.5
  } else if (x < -marginX * (1 - fadeZone)) {
    const pen = (-x - marginX * (1 - fadeZone)) / (marginX * fadeZone)
    vx += BOUNDARY_REPULSION * pen * pen * 0.5
  }
  if (y > marginY * (1 - fadeZone)) {
    const pen = (y - marginY * (1 - fadeZone)) / (marginY * fadeZone)
    vy -= BOUNDARY_REPULSION * pen * pen * 0.5
  } else if (y < -marginY * (1 - fadeZone)) {
    const pen = (-y - marginY * (1 - fadeZone)) / (marginY * fadeZone)
    vy += BOUNDARY_REPULSION * pen * pen * 0.5
  }

  // Strong damping for smooth, floaty feel
  vx *= IDLE_DAMPING
  vy *= IDLE_DAMPING

  // Integrate
  x += vx * dt
  y += vy * dt

  // Hard clamp
  x = Math.max(-halfW + target.radius, Math.min(halfW - target.radius, x))
  y = Math.max(-halfH + target.radius, Math.min(halfH - target.radius, y))

  return { x, y, vx, vy }
}
