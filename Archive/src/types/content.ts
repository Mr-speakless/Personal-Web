export type ProjectCategory = 'WebDesign' | 'ArtWorks' | 'WorkExperience' | 'ProductDesign'

export type WorkCardVariant = 'standard' | 'wide' | 'half'

export interface LocalizedTextValue {
  en: string
  zh: string
}

export interface ProjectCard {
  id: string
  title: string
  category: ProjectCategory
  variant: WorkCardVariant
  imageSrc?: string
  logoSrc?: string
  href: string
  titleFont: 'audiowide' | 'mono' | 'display' | 'sans'
  overlayTone: 'themist' | 'covid' | 'glory' | 'neutral'
  customTag?: LocalizedTextValue
}
