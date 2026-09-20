import React, { lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { AboutPage } from './pages/AboutPage'
import { ProjectPage } from './pages/ProjectPage'
import { projectByPath } from './content/projects'
import { motion } from './config/motion'
import { frame } from './config/frame'
import './styles/global.css'

const WorkPage = lazy(() => import('./pages/WorkPage').then((module) => ({ default: module.WorkPage })))

document.documentElement.style.setProperty('--motion-ms', `${motion.transitionMs}ms`)
document.documentElement.style.setProperty('--motion-ease', motion.easing)
document.documentElement.style.setProperty('--nav-top', `${motion.navigationTopPx}px`)
document.documentElement.style.setProperty('--stroke', `${frame.strokePx}px`)
document.documentElement.style.setProperty('--corner', `${frame.cornerPx}px`)

const path = window.location.pathname.replace(/\/$/, '') || '/'
const project = projectByPath.get(path)
const page = path === '/' ? <WorkPage /> : path === '/about' ? <AboutPage /> : project ? <ProjectPage project={project} /> : <div className="not-found"><h1>Page not found</h1><a href="/">Return to Work</a></div>

createRoot(document.getElementById('root')!).render(<React.StrictMode><React.Suspense fallback={null}>{page}</React.Suspense></React.StrictMode>)
