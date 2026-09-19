import type { ProjectCard } from '../../types/content'
import { WorkCardHalf } from './WorkCardHalf'
import { WorkCardStandard } from './WorkCardStandard'
import { WorkCardWide } from './WorkCardWide'

interface WorkGridProps {
  projects: ReadonlyArray<ProjectCard>
}

export function WorkGrid({ projects }: WorkGridProps) {
  const hasStandardOnly = projects.every((project) => project.variant === 'standard')
  const hasHalfOnly = projects.every((project) => project.variant === 'half')
  const hasWideOnly = projects.every((project) => project.variant === 'wide')

  const gridClass = hasStandardOnly
    ? 'grid-cols-2 md:grid-cols-3'
    : hasHalfOnly
      ? 'grid-cols-1 md:grid-cols-2'
      : hasWideOnly
        ? 'grid-cols-1'
        : 'grid-cols-1 md:grid-cols-3'

  return (
    <div className={`grid w-full gap-3 md:gap-9 ${gridClass}`}>
      {projects.map((project) =>
        project.variant === 'standard' ? (
          <WorkCardStandard key={project.id} project={project} />
        ) : project.variant === 'half' ? (
          <WorkCardHalf key={project.id} project={project} />
        ) : (
          <WorkCardWide key={project.id} project={project} />
        ),
      )}
    </div>
  )
}
