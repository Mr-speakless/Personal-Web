import type { PortalTarget } from '../components/BlackHolePortal/types/portal.ts'
import { withBase } from '../lib/basePath.ts'
import { projects } from './projects.ts'

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1) * 43758.5453
  return x - Math.floor(x)
}

/** Map project IDs to thumbnail image paths */
const thumbnailByProjectId: Record<string, string> = {
  'themist': withBase('/assets/images/thumbnails/thumbnails_TheMist.png'),
  'covid-impact': withBase('/assets/images/thumbnails/thumbnails_COVID19IMPACT.png'),
  'glory-ai': withBase('/assets/images/thumbnails/thumbnails_GloryAI.png'),
  'eros-trilogy': withBase('/assets/images/thumbnails/thumbnails_ErosTrilogy.png'),
  'chladni-shape': withBase('/assets/images/thumbnails/thumbnails_0.83_1.17HZ.png'),
  'eureka': withBase('/assets/images/thumbnails/thumbnails_Eureka.png'),
  'stjornur': withBase('/assets/images/thumbnails/thumbnails_Stjornur.png'),
  'cue-pm-ai-camera': withBase('/assets/images/thumbnails/thumbnails_CUE.png'),
  'jd-com-ai-lora': withBase('/assets/images/thumbnails/thumbnails_JDcom.png'),
  'cape': withBase('/assets/images/thumbnails/thumbnails_CAPE.png'),
  'solidfied-willing': withBase('/assets/images/thumbnails/thumbnails_SolifiedWilling.png'),
  'oasis': withBase('/assets/images/thumbnails/thumbnails_Oasis.png'),
}

/**
 * Derive portal targets from the projects list.
 * Each project with a thumbnail becomes a floating target behind the black hole.
 */
export const portalTargets: PortalTarget[] = projects
  .filter((p) => thumbnailByProjectId[p.id])
  .map((project, i) => {
    const seed = i + 1
    // Random positions scattered within approximately the visible viewport
    // Camera Z=12, plane Z=-10, FOV=60° → visible ~±12.7 vertical, ~±22 horizontal (16:9)
    const x = (seededRandom(seed * 7) - 0.5) * 32
    const y = (seededRandom(seed * 11) - 0.5) * 26

    return {
      id: project.id,
      title: project.title,
      image: thumbnailByProjectId[project.id],
      url: project.href,
      size: 64,
      x,
      y,
      vx: (seededRandom(seed * 2) - 0.5) * 0.8,
      vy: (seededRandom(seed * 3) - 0.5) * 0.8,
      radius: 1,
    }
  })
