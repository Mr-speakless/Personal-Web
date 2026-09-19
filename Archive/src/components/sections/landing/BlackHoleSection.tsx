import { portalTargets } from '../../../content/portalTargets.ts'
import { sectionIds } from '../../../lib/routes.ts'
import { BlackHolePortal } from '../../BlackHolePortal/BlackHolePortal.tsx'

export function BlackHoleSection() {
  return (
    <section
      id={sectionIds.blackhole}
      className="relative h-screen w-screen overflow-hidden"
      aria-label="Black hole interactive portal"
    >
      <BlackHolePortal
        targets={portalTargets}
        width="100%"
        height="100%"
      />
    </section>
  )
}
