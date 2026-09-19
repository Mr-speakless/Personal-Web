import type { ProjectCard } from '../../types/content'
import { WorkCardOverlay } from './WorkCardOverlay'
import { useRef, type MouseEvent } from 'react'
import { getUICopy } from '../../content/ui'
import { useLanguage } from '../../i18n/language'

interface WorkCardProps {
  project: ProjectCard
}

export function WorkCard({ project }: WorkCardProps) {
  const { language } = useLanguage()
  const uiCopy = getUICopy(language)
  const imageRef = useRef<HTMLImageElement>(null)
  const spotlightRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLAnchorElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Parallax values between -1 and 1
    const normalizedX = (x / rect.width) * 2 - 1
    const normalizedY = (y / rect.height) * 2 - 1

    if (imageRef.current) {
      // 12px max translation for subtle parallax
      imageRef.current.style.transform = `scale(1.08) translate(${normalizedX * -12}px, ${normalizedY * -12}px)`
      imageRef.current.style.transition = 'transform 0.1s ease-out'
    }

    if (spotlightRef.current) {
      spotlightRef.current.style.background = `radial-gradient(800px circle at ${x}px ${y}px, rgba(255,255,255,0.08), transparent 40%)`
    }
  }

  const handleMouseLeave = () => {
    if (imageRef.current) {
      // Return to base scale and position smoothly
      imageRef.current.style.transform = 'scale(1.0) translate(0px, 0px)'
      imageRef.current.style.transition = 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
    }
  }

  const handleMouseEnter = () => {
    if (imageRef.current) {
      // Set to fast follow when mouse is inside
      imageRef.current.style.transition = 'transform 0.1s ease-out'
    }
  }

  return (
    <a
      ref={cardRef}
      href={project.href}
      target={project.href.startsWith('http') ? '_blank' : undefined}
      rel={project.href.startsWith('http') ? 'noopener noreferrer' : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className="group relative flex h-full min-h-[216px] w-full cursor-pointer flex-col overflow-hidden rounded-card bg-[#0a0a0a] shadow-lg transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-2xl"
      aria-label={`${uiCopy.work.openProjectAriaPrefix} ${project.title}`}
    >
      {/* Background Image with Parallax */}
      {project.imageSrc ? (
        <img
          ref={imageRef}
          src={project.imageSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        />
      ) : null}

      {/* Logo block (if no image) */}
      {project.logoSrc && !project.imageSrc ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105">
          <img
            src={project.logoSrc}
            alt=""
            className="h-auto w-[72%] max-w-[260px] rotate-[152deg] opacity-90 transition-opacity duration-500 group-hover:opacity-100"
          />
        </div>
      ) : null}

      {/* Interactive Cursor Spotlight */}
      <div 
        ref={spotlightRef}
        className="pointer-events-none absolute inset-0 z-10 opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-100" 
      />

      {/* Internal Glints / Highlights on edges */}
      <div className="pointer-events-none absolute inset-0 z-40 rounded-card ring-1 ring-inset ring-white/5 transition-shadow duration-500 group-hover:ring-white/20" />

      {/* Overlay contents */}
      <div className="relative z-30 mt-auto w-full">
        <WorkCardOverlay project={project} />
      </div>
    </a>
  )
}
