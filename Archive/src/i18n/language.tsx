import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react'

import { splitLanguagePath, stripBase, withLanguagePath } from '../lib/basePath'

export type AppLanguage = 'en' | 'zh'

interface LanguageContextValue {
  language: AppLanguage
  setLanguage: (language: AppLanguage) => void
  toggleLanguage: () => void
}

const storageKey = 'portfolio-language'
const fallbackLanguage: AppLanguage = 'zh'

const LanguageContext = createContext<LanguageContextValue | null>(null)

function readLanguageFromUrl(): AppLanguage | null {
  if (typeof window === 'undefined') {
    return null
  }

  // Path-based language takes priority: /old/CN/... or /old/ENG/...
  const pathLanguage = splitLanguagePath(stripBase(window.location.pathname)).language

  if (pathLanguage) {
    return pathLanguage
  }

  // Legacy links: ?lang=CN / ?lang=EN and #CN / #EN
  const normalizedQueryLanguage = new URLSearchParams(window.location.search)
    .get('lang')
    ?.trim()
    .toUpperCase()

  if (normalizedQueryLanguage === 'EN') {
    return 'en'
  }

  if (normalizedQueryLanguage === 'CN') {
    return 'zh'
  }

  const normalizedHash = window.location.hash.trim().toUpperCase()

  if (normalizedHash === '#EN') {
    return 'en'
  }

  if (normalizedHash === '#CN') {
    return 'zh'
  }

  return null
}

function writeLanguagePathToUrl(language: AppLanguage) {
  if (typeof window === 'undefined') {
    return
  }

  const { language: currentLanguage, path } = splitLanguagePath(
    stripBase(window.location.pathname),
  )

  if (currentLanguage === language) {
    return
  }

  const nextUrl = new URL(window.location.href)
  nextUrl.pathname = withLanguagePath(path, language)
  nextUrl.searchParams.delete('lang')
  window.history.replaceState(window.history.state, '', nextUrl.toString())
}

function readInitialLanguage(): AppLanguage {
  const applyLanguageToDocument = (language: AppLanguage) => {
    document.documentElement.setAttribute('lang', language === 'zh' ? 'zh-CN' : 'en')
    document.documentElement.setAttribute('data-lang', language)
  }

  if (typeof window === 'undefined') {
    return fallbackLanguage
  }

  const queryLanguage = readLanguageFromUrl()

  if (queryLanguage) {
    applyLanguageToDocument(queryLanguage)
    return queryLanguage
  }

  const storedLanguage = window.localStorage.getItem(storageKey)

  if (storedLanguage === 'en' || storedLanguage === 'zh') {
    applyLanguageToDocument(storedLanguage)
    return storedLanguage
  }

  applyLanguageToDocument(fallbackLanguage)
  return fallbackLanguage
}

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] = useState<AppLanguage>(readInitialLanguage)

  const setLanguage = (nextLanguage: AppLanguage) => {
    setLanguageState(nextLanguage)
    writeLanguagePathToUrl(nextLanguage)
  }

  useEffect(() => {
    writeLanguagePathToUrl(language)
  }, [language])

  useEffect(() => {
    window.localStorage.setItem(storageKey, language)
    document.documentElement.setAttribute('lang', language === 'zh' ? 'zh-CN' : 'en')
    document.documentElement.setAttribute('data-lang', language)
  }, [language])

  useEffect(() => {
    const syncLanguageWithUrl = () => {
      const urlLanguage = readLanguageFromUrl()

      if (!urlLanguage) {
        return
      }

      setLanguageState((currentLanguage) =>
        currentLanguage === urlLanguage ? currentLanguage : urlLanguage,
      )
    }

    window.addEventListener('hashchange', syncLanguageWithUrl)
    window.addEventListener('popstate', syncLanguageWithUrl)

    return () => {
      window.removeEventListener('hashchange', syncLanguageWithUrl)
      window.removeEventListener('popstate', syncLanguageWithUrl)
    }
  }, [])

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en')
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }

  return context
}
