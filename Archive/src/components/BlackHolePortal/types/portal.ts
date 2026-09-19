export type PortalState =
  | 'idle'
  | 'targeting'
  | 'portalPause'
  | 'entering'
  | 'navigating'

export interface PortalTarget {
  id: string
  title: string
  image: string
  url: string
  size: number
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

export interface BlackHolePortalProps {
  targets: PortalTarget[]
  className?: string
  width?: number | string
  height?: number | string
  onEnterStart?: (target: PortalTarget) => void
  onEnterComplete?: (target: PortalTarget) => void
}

export interface PortalStore {
  portalState: PortalState
  selectedTargetId: string | null
  lockedCandidateId: string | null
  activeTargetId: string | null
  hoveredTargetId: string | null
  isInteractionLocked: boolean
  pauseStartTime: number | null

  targets: PortalTarget[]
  setTargets: (targets: PortalTarget[]) => void
  updateTargetPosition: (id: string, x: number, y: number) => void
  updateTargetVelocity: (id: string, vx: number, vy: number) => void

  selectTarget: (id: string) => void
  clickBlackHole: () => void
  setActiveTarget: (id: string | null) => void
  setHoveredTarget: (id: string | null) => void
  enterPortalPause: () => void
  enterEntering: () => void
  enterNavigating: () => void
  reset: () => void
}
