import { useCategoryFilter } from '../../../hooks/useCategoryFilter'
import { sectionIds } from '../../../lib/routes'
import { WorkCategoryTabs } from '../../gallery/WorkCategoryTabs'
import { WorkGrid } from '../../gallery/WorkGrid'
import { SectionContainer } from '../../layout/SectionContainer'

export function WorkGallerySection() {
  const { categories, activeCategory, setActiveCategory, filteredProjects } = useCategoryFilter()

  return (
    <SectionContainer className="pt-10 md:pt-16 min-h-screen">
      <section id={sectionIds.work} className="relative w-full">
        <WorkCategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        <div className="mt-10 md:mt-16 min-h-[60vh]">
          <WorkGrid projects={filteredProjects} />
        </div>
      </section>
    </SectionContainer>
  )
}
