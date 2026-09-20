import { media } from '../../content/media'
import type { Project } from '../../content/projects'

/**
 * JG / Project Card (Figma 15:41). Default: the teaser image fills the whole card and only the
 * label shows. Hover/focus: the image shrinks to a 16px-radius panel, the hero cover fades in and
 * the 144px metadata strip is revealed. Label text slides up and its twin slides in from below.
 */
export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  return <a className={`project-card frame ${featured ? 'project-card--featured' : ''}`} href={`${project.path}/`} aria-label={`View ${project.cardTitle} project`}>
    <div className="project-card__image">
      <img className="project-card__image-default" src={project.cardImage} alt="" loading={featured ? 'eager' : 'lazy'} />
      <img className="project-card__image-hover" src={project.cardHover ?? project.cover} alt="" loading="lazy" />
      <span className="project-card__label"><span>{project.cardTitle}</span><span aria-hidden="true">{project.cardTitle}</span></span>
    </div>
    <div className="project-card__details">
      <div className="project-card__metadata stack">
        <div className="detail-row frame"><span>TYPE</span><img src={media.work.imgMarker} alt="" /><span>{project.cardType}</span></div>
        <div className="detail-row frame"><span>Sector</span><img src={media.work.imgMarker} alt="" /><span>{project.cardSector}</span></div>
        <div className="detail-row frame"><span>DATE</span><img src={media.work.imgMarker} alt="" /><span>{project.cardDate}</span></div>
      </div>
      <div className="project-card__symbol frame"><img src={project.symbol} alt="" /></div>
    </div>
  </a>
}
