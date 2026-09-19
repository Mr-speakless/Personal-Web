import { getWorkCategoryLabel } from '../../content/projects'
import { useLanguage } from '../../i18n/language'
import { withBase } from '../../lib/basePath'
import type { ProjectCard } from '../../types/content'

interface WorkCardOverlayProps {
  project: ProjectCard
}

function overlayToneClass(overlayTone: ProjectCard['overlayTone']) {
  if (overlayTone === 'themist') return 'bg-overlay-themist backdrop-blur-md'
  if (overlayTone === 'covid') return 'bg-overlay-covid backdrop-blur-md'
  if (overlayTone === 'glory') return 'bg-overlay-glory backdrop-blur-md'

  return 'bg-black/40 backdrop-blur-md'
}

export function WorkCardOverlay({ project }: WorkCardOverlayProps) {
  const { language } = useLanguage()
  const categoryLabel = getWorkCategoryLabel(project.category, language)
  const tagLabel = project.customTag?.[language] ?? categoryLabel

  return (
    <div
      className={`relative flex w-full items-end justify-between overflow-hidden rounded-b-card px-4 py-3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:px-5 md:py-3.5 group-hover:bg-black/80 ${overlayToneClass(project.overlayTone)}`}
    >
      {/* Top border highlight for glass effect */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      <div className="z-10 flex min-w-0 flex-1 flex-col justify-end overflow-visible pr-3 md:pr-4">
        {/* Category Badge - Slide up expansion */}
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <div className="translate-y-4 pb-1.5 text-white/90 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100 md:pb-2">
              <span className="inline-block rounded-full border border-white/20 bg-white/10 px-2 py-0.5 font-sans-en text-[10px] uppercase tracking-widest backdrop-blur-sm md:px-2.5 md:text-xs">
                {tagLabel}
              </span>
            </div>
          </div>
        </div>
        
        {/* Title */}
        <h3 className="font-sans-en text-sm-title leading-sm-title text-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:text-title md:leading-title">
          {project.title}
        </h3>
      </div>
      
      {/* Icon Circle */}
      <div
        aria-hidden
        className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/5 shadow-[0_4px_10px_rgba(0,0,0,0.1)] backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:border-white/0 group-hover:bg-white group-hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] md:h-11 md:w-11"
      >
        <div className="relative flex h-full w-full items-center justify-center">
            {/* Original Arrow */}
            <img
              src={withBase('/assets/icons/LinkArrow.svg')}
              alt=""
              className="absolute h-[11px] w-[11px] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-8 group-hover:translate-x-8 md:h-[14px] md:w-[14px]"
            />
            {/* Slide-in Arrow */}
            <img
              src={withBase('/assets/icons/LinkArrow.svg')}
              alt=""
              className="absolute h-[11px] w-[11px] -translate-x-8 translate-y-8 invert transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-0 group-hover:translate-y-0 md:h-[14px] md:w-[14px]"
            />
        </div>
      </div>
    </div>
  )
}
