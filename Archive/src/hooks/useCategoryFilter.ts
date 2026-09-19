import { useMemo, useState } from 'react'

import { projects, workCategories } from '../content/projects'
import type { ProjectCard, ProjectCategory } from '../types/content'

export function useCategoryFilter() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>(workCategories[0])

  const filteredProjects = useMemo<ReadonlyArray<ProjectCard>>(
    () => projects.filter((project) => project.category === activeCategory),
    [activeCategory],
  )

  return {
    categories: workCategories,
    activeCategory,
    setActiveCategory,
    filteredProjects,
  }
}
