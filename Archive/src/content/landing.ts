import type { AppLanguage } from '../i18n/language'

interface LandingPageContent {
  hero: {
    headline: string
    summary: string
  }
}

const landingPageContentByLanguage: Readonly<Record<AppLanguage, LandingPageContent>> = {
  en: {
    hero: {
      headline: 'HI, I am Shuoyue Wu',
      summary: 'I use design to solve, and storytelling to question.',
    },
  },
  zh: {
    hero: {
      headline: '你好，我是吴烁钺',
      summary: '为经世致用而设计\n为格物求真而创作',
    },
  },
}

export function getLandingPageContent(language: AppLanguage): LandingPageContent {
  return landingPageContentByLanguage[language]
}
