export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function distance2d(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  const dx = x2 - x1
  const dy = y2 - y1
  return Math.sqrt(dx * dx + dy * dy)
}

export function normalize2d(
  x: number,
  y: number,
): [number, number] {
  const len = Math.sqrt(x * x + y * y)
  if (len === 0) return [0, 0]
  return [x / len, y / len]
}

export function dampLerp(
  current: number,
  target: number,
  speed: number,
  dt: number,
): number {
  return lerp(current, target, 1 - Math.exp(-speed * dt))
}
