import { create } from 'zustand'

import type { PortalStore, PortalTarget } from '../types/portal.ts'

export const useBlackHolePortalStore = create<PortalStore>((set, get) => ({
  portalState: 'idle',
  selectedTargetId: null,
  lockedCandidateId: null,
  activeTargetId: null,
  hoveredTargetId: null,
  isInteractionLocked: false,
  pauseStartTime: null,

  targets: [],

  setTargets: (targets: PortalTarget[]) => set({ targets }),

  updateTargetPosition: (id: string, x: number, y: number) =>
    set((state) => ({
      targets: state.targets.map((t) =>
        t.id === id ? { ...t, x, y } : t,
      ),
    })),

  updateTargetVelocity: (id: string, vx: number, vy: number) =>
    set((state) => ({
      targets: state.targets.map((t) =>
        t.id === id ? { ...t, vx, vy } : t,
      ),
    })),

  selectTarget: (id: string) => {
    const { portalState, isInteractionLocked } = get()
    if (isInteractionLocked) return

    if (portalState === 'idle' || portalState === 'targeting') {
      set({
        portalState: 'targeting',
        selectedTargetId: id,
        lockedCandidateId: null,
      })
    }
  },

  clickBlackHole: () => {
    const { portalState, activeTargetId, isInteractionLocked } = get()
    if (isInteractionLocked) return
    if (portalState !== 'idle') return
    if (!activeTargetId) return

    set({
      portalState: 'portalPause',
      lockedCandidateId: activeTargetId,
      selectedTargetId: activeTargetId,
      isInteractionLocked: true,
      pauseStartTime: performance.now(),
    })
  },

  setActiveTarget: (id: string | null) => {
    const { portalState } = get()
    if (portalState !== 'idle') return
    set({ activeTargetId: id })
  },

  setHoveredTarget: (id: string | null) => {
    if (get().hoveredTargetId !== id) {
      set({ hoveredTargetId: id })
    }
  },

  enterPortalPause: () => {
    set({
      portalState: 'portalPause',
      isInteractionLocked: true,
      pauseStartTime: performance.now(),
    })
  },

  enterEntering: () => {
    set({ portalState: 'entering' })
  },

  enterNavigating: () => {
    set({ portalState: 'navigating' })
  },

  reset: () => {
    set({
      portalState: 'idle',
      selectedTargetId: null,
      lockedCandidateId: null,
      activeTargetId: null,
      hoveredTargetId: null,
      isInteractionLocked: false,
      pauseStartTime: null,
    })
  },
}))
