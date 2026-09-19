import { useEffect, useState } from 'react'

import AboutPage from '../pages/AboutPage'
import BlackHolePage from '../pages/BlackHolePage'
import { splitLanguagePath, stripBase, withLanguagePath } from '../lib/basePath'
import type { AppLanguage } from '../i18n/language'
import LandingPage from '../pages/LandingPage'

function getPathname() {
  const { path } = splitLanguagePath(stripBase(window.location.pathname))
  const normalizedPath = path.toLowerCase()

  if (normalizedPath.length > 1 && normalizedPath.endsWith('/')) {
    return normalizedPath.slice(0, -1)
  }

  return normalizedPath
}

function getCurrentLanguage(): AppLanguage {
  const { language } = splitLanguagePath(stripBase(window.location.pathname))

  if (language) {
    return language
  }

  const queryLanguage = new URLSearchParams(window.location.search).get('lang')?.toUpperCase()
  return queryLanguage === 'EN' || queryLanguage === 'ENG' ? 'en' : 'zh'
}

export function navigate(path: string) {
  if (getPathname() === path.toLowerCase()) {
    return
  }

  window.history.pushState({}, '', withLanguagePath(path, getCurrentLanguage()))
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function AppRouter() {
  const [pathname, setPathname] = useState(getPathname())

  useEffect(() => {
    const onRouteChange = () => setPathname(getPathname())
    window.addEventListener('popstate', onRouteChange)
    return () => window.removeEventListener('popstate', onRouteChange)
  }, [])

  if (pathname === '/about') {
    return <AboutPage />
  }

  if (pathname === '/blackhole') {
    return <BlackHolePage />
  }

  return <LandingPage />
}
