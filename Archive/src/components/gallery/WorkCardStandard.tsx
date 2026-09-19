import type { ProjectCard } from '../../types/content'
import { WorkCard } from './WorkCard'

interface WorkCardStandardProps {
  project: ProjectCard
}

export function WorkCardStandard({ project }: WorkCardStandardProps) {
  return (
    <div className="aspect-[255/320] w-full">
      <WorkCard project={project} />
    </div>
  )
}
