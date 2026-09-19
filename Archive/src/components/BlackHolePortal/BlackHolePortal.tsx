import { useEffect } from 'react'

import type { BlackHolePortalProps } from './types/portal.ts'
import { useBlackHolePortalStore } from './store/useBlackHolePortalStore.ts'
import { BlackHolePortalCanvas } from './BlackHolePortalCanvas.tsx'
import { PortalOverlayUI } from './PortalOverlayUI.tsx'

export function BlackHolePortal({
  targets,
  className,
  width = '100%',
  height = '100%',
  onEnterStart,
  onEnterComplete,
}: BlackHolePortalProps) {
  const setTargets = useBlackHolePortalStore((s) => s.setTargets)

  useEffect(() => {
    setTargets(targets)
  }, [targets, setTargets])

  const storeTargets = useBlackHolePortalStore((s) => s.targets)

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width,
        height,
        overflow: 'hidden',
      }}
    >
      {storeTargets.length > 0 && (
        <BlackHolePortalCanvas
          targets={storeTargets}
          onEnterStart={onEnterStart}
          onEnterComplete={onEnterComplete}
        />
      )}
      <PortalOverlayUI />
    </div>
  )
}
