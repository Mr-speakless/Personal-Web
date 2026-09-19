import { PORTAL_PAUSE_DURATION } from '../utils/constants.ts'

/**
 * Check if the portal pause period has elapsed.
 */
export function isPortalPauseComplete(pauseStartTime: number | null): boolean {
  if (pauseStartTime === null) return false
  const elapsed = (performance.now() - pauseStartTime) / 1000
  return elapsed >= PORTAL_PAUSE_DURATION
}
