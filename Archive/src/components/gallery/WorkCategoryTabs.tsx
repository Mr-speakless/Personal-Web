import { useEffect, useRef, useState } from 'react'
import { getWorkCategoryLabel } from '../../content/projects'
import { useLanguage } from '../../i18n/language'
import type { ProjectCategory } from '../../types/content'

interface WorkCategoryTabsProps {
  categories: ReadonlyArray<ProjectCategory>
  activeCategory: ProjectCategory
  onSelectCategory: (category: ProjectCategory) => void
}

export function WorkCategoryTabs({
  categories,
  activeCategory,
  onSelectCategory,
}: WorkCategoryTabsProps) {
  const { language } = useLanguage()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollRatio, setScrollRatio] = useState(0)
  const [thumbRatio, setThumbRatio] = useState(1)
  const [overflows, setOverflows] = useState(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const update = () => {
      const hasOverflow = el.scrollWidth > el.clientWidth + 4
      setOverflows(hasOverflow)
      if (hasOverflow) {
        setThumbRatio(el.clientWidth / el.scrollWidth)
        setScrollRatio(el.scrollLeft / (el.scrollWidth - el.clientWidth))
      }
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [categories])

  return (
    <div>
      {/* Scroll progress track — mobile only */}
      {overflows && (
        <div className="mb-3 h-[1.5px] w-full rounded-full bg-white/[0.06] md:hidden">
          <div
            className="h-full rounded-full bg-white/20 transition-[left,width] duration-100 ease-out"
            style={{
              width: `${thumbRatio * 100}%`,
              marginLeft: `${scrollRatio * (1 - thumbRatio) * 100}%`,
            }}
          />
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex w-full items-center gap-6 overflow-x-auto overflow-y-hidden md:gap-8 scrollbar-hide"
      >
        {categories.map((category) => {
          const isActive = category === activeCategory

          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelectCategory(category)}
              className={`group relative whitespace-nowrap pb-2 pt-2 font-sans-en text-sm-title leading-sm-title tracking-wide transition-colors duration-300 md:text-title md:leading-title ${
                isActive
                  ? 'text-white'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              {getWorkCategoryLabel(category, language)}
              {/* Minimal Underline for active state */}
              {isActive && (
                <span className="absolute bottom-0 left-0 h-[1.5px] w-full bg-white opacity-80" />
              )}
              {!isActive && (
                <span className="absolute bottom-0 left-0 h-[1.5px] w-full origin-left scale-x-0 bg-white/40 transition-transform duration-300 group-hover:scale-x-100" />
                )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
