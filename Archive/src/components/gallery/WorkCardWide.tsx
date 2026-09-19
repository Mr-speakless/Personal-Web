import type { ProjectCard } from '../../types/content'
import { WorkCard } from './WorkCard'

interface WorkCardWideProps {
  project: ProjectCard
}

export function WorkCardWide({ project }: WorkCardWideProps) {
  return (
    <div className="aspect-[1128/320] w-full md:col-span-3">
      <WorkCard project={project} />
    </div>
  )
}
