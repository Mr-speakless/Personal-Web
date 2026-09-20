import { useEffect, useRef, useState } from 'react'
import { Navigation } from '../components/layout/Navigation'
import { Footer } from '../components/layout/Footer'
import { ProjectCard } from '../components/projects/ProjectCard'
import { DotField } from '../features/hero/DotField'
import { LogoScene } from '../features/hero/LogoScene'
import { projects } from '../content/projects'
import { media } from '../content/media'

const disciplines = [
  { number: '/ 001', title: 'AIGC', points: ['Generative AI & ComfyUI Expertise: Stable Diffusion, ComfyUI, node-based generative models.', 'AI Tool Development: Custom scripts, custom nodes, and AIGC pipeline development.', 'Workflow Scaling & Automation: Skilled in optimizing and scaling existing AI workflows.', 'Precision Design Delivery: Strong focus on control, reproducibility, and high-fidelity final outputs.'], icon: media.work.imgSkillVi },
  { number: '/ 002', title: 'Web Development', points: ['Collaborative Workspace', 'UX/UI Design', 'Motion Design', 'Data visualization'], icon: media.work.imgSkillVi1 },
  { number: '/ 003', title: 'Product Design', points: ['Hardware & Physical Computing: Arduino, microcontrollers, and sensor integration.', 'Prototyping, Circuit & Firmware Basics', '3D Modeling, 3D Printing', 'Game Engine and Rendering'], icon: media.work.imgSkillVi2 },
  { number: '/ 004', title: 'FineArt&Installation', points: ['AI Film', 'New Media Art', 'Interactive Installation'], icon: media.work.imgSkillVi3 },
]

export function WorkPage() {
  const introRef = useRef<HTMLDivElement>(null)
  const [floating, setFloating] = useState(false)
  useEffect(() => {
    const element = introRef.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setFloating(!entry.isIntersecting), { rootMargin: '-24px 0px 0px 0px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  return <>
    <div className={`work-floating-nav ${floating ? 'work-floating-nav--visible' : ''}`} inert={!floating} aria-hidden={!floating}><Navigation floating /></div>
    <main>
      <h1 className="visually-hidden">Selected work by Shuoyue Wu</h1>
      <section className="work-hero">
        <div className="work-hero__intro frame" ref={introRef}>
          <div className="work-hero__nav"><Navigation compact /></div>
          <p className="frame">Shuoyue Wu is a creative technologist translating business needs into brand aligned visuals and scalable AI workflows,with experience across ToC, ToB products, and agency.</p>
          <div className="work-hero__contact frame"><p>Contact:</p><a href="mailto:wu11023416@gmail.com">wu11023416@gmail.com</a><p>NY, USA</p><a href="https://www.linkedin.com/in/shuoyue-wu-383703383/" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://www.instagram.com/lucas_wu_muteman/" target="_blank" rel="noreferrer">Instagram</a></div>
        </div>
        <div className="work-hero__stage"><DotField /><LogoScene /></div>
      </section>
      <section className="work-section work-section--selected">
        <h2 className="visually-hidden">Selected Work</h2>
        <div className="work-cards"><ProjectCard project={projects[0]} featured /><div className="work-cards__row"><ProjectCard project={projects[2]} /><ProjectCard project={projects[1]} /></div></div>
      </section>
      <section className="disciplines">
        <div className="disciplines__intro"><p>Continuously exploring and applying emerging AI tools to optimize creative workflows and deliver high-quality design solutions.</p><p>Throughout my studies and recent work experience, the following disciplines have emerged and evolved as key areas of focus.</p></div>
        <div className="disciplines__cards">{disciplines.map((discipline) => <article className="discipline-card frame" key={discipline.number}><div><span>{discipline.number}</span><h3>{discipline.title}</h3><ul>{discipline.points.map((point) => <li key={point}>{point}</li>)}</ul></div><img src={discipline.icon} alt="" /></article>)}</div>
      </section>
      <section className="work-section work-section--more"><h2 className="section-label">More works</h2><div className="work-cards__row"><ProjectCard project={projects[3]} /><ProjectCard project={projects[4]} /></div><div className="work-cards__row"><ProjectCard project={projects[5]} /><ProjectCard project={projects[6]} /></div></section>
    </main>
    <Footer />
  </>
}
