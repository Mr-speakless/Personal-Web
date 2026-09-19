import type { ProjectCard } from '../../types/content'
import { WorkCard } from './WorkCard'

interface WorkCardHalfProps {
  project: ProjectCard
}

export function WorkCardHalf({ project }: WorkCardHalfProps) {
  return (
    <div className="aspect-[546/320] w-full">
      <WorkCard project={project} />
    </div>
  )
}
