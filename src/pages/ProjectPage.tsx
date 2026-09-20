import { Navigation } from '../components/layout/Navigation'
import { Footer } from '../components/layout/Footer'
import { ProjectBlocks } from '../components/projects/ProjectBlocks'
import { CapeStory } from './CapeStory'
import { ErosStory } from './ErosStory'
import { media } from '../content/media'
import type { Project } from '../content/projects'

/**
 * Shared detail page (Figma CoverImage 28:3055, ProjectIntro 28:3062, ProjectGenre 28:3202,
 * then the project's Heading/Paragraph/media blocks). CAPE and Eros Trilogy have bespoke bodies.
 */
export function ProjectPage({ project }: { project: Project }) {
  const intro = project.introLink
    ? (() => {
      const [before, after] = project.intro.split(project.introLink.label)
      return <>{before}<a href={project.introLink.href} target="_blank" rel="noreferrer">{project.introLink.label}</a>{after}</>
    })()
    : project.intro
  return <div className={`project-page project-page--${project.slug}`}>
    <header className="site-header"><Navigation /></header>
    <main>
      <div className="project-cover">
        <div className="project-cover__image"><img src={project.cover} alt={`${project.title} project cover`} style={project.coverFit ? { objectFit: project.coverFit } : undefined} /></div>
        <h1>{project.titleHref ? <a href={project.titleHref} target="_blank" rel="noreferrer">{project.title}</a> : project.title}</h1>
      </div>
      <div className="project-intro"><p><span>/INTRO</span>{intro}</p></div>
      <section className="project-specs" aria-label="Project specifications">
        <span className="project-specs__label">/SPECIFICATIONS</span>
        <div className="project-specs__details">
          <dl>{project.specifications.map(([label, value]) => <div key={label}><dt>{label}</dt><img src={media.work.imgMarker} alt="" /><dd>{value}</dd></div>)}</dl>
          <span className="project-specs__symbol frame"><img src={project.symbol} alt="" aria-hidden="true" /></span>
        </div>
      </section>
      {project.slug === 'cape' ? <CapeStory /> : project.slug === 'eros-trilogy' ? <ErosStory /> : <ProjectBlocks blocks={project.blocks} projectTitle={project.title} />}
    </main>
    <Footer />
  </div>
}
