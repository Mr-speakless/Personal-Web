import type { AppLanguage } from '../i18n/language'

// The archived site lives under /old/ and each language has its own path:
//   /old/CN/...  -> Chinese
//   /old/ENG/... -> English
export const languagePathSegment: Record<AppLanguage, string> = {
  zh: 'CN',
  en: 'ENG',
}

const languageBySegment: Record<string, AppLanguage> = {
  CN: 'zh',
  ZH: 'zh',
  ENG: 'en',
  EN: 'en',
}

export function withBase(path: string): string {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path
  return `${import.meta.env.BASE_URL}${normalizedPath}`
}

export function stripBase(pathname: string): string {
  const base = import.meta.env.BASE_URL
  if (base === '/') {
    return pathname || '/'
  }

  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base
  if (pathname === normalizedBase) {
    return '/'
  }

  if (pathname.startsWith(`${normalizedBase}/`)) {
    return pathname.slice(normalizedBase.length) || '/'
  }

  return pathname || '/'
}

/**
 * Splits a pathname (with base already stripped) into its language segment and
 * the app-level route. `/CN/about` -> { language: 'zh', path: '/about' }.
 */
export function splitLanguagePath(pathname: string): {
  language: AppLanguage | null
  path: string
} {
  const [, firstSegment = '', ...rest] = pathname.split('/')
  const language = languageBySegment[firstSegment.toUpperCase()] ?? null

  if (!language) {
    return { language: null, path: pathname || '/' }
  }

  const remainder = rest.join('/')
  return { language, path: remainder ? `/${remainder}` : '/' }
}

/** Builds a full href for an app route under the given language path. */
export function withLanguagePath(path: string, language: AppLanguage): string {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path
  const localizedPath = normalizedPath
    ? `${languagePathSegment[language]}/${normalizedPath}`
    : `${languagePathSegment[language]}/`

  return withBase(localizedPath)
}
