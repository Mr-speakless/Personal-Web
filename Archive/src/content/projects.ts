import type { AppLanguage } from '../i18n/language'
import { withBase } from '../lib/basePath'
import type { ProjectCard, ProjectCategory } from '../types/content'

export const workCategories: ReadonlyArray<ProjectCategory> = [
  'WebDesign',
  'ArtWorks',
  'WorkExperience',
  'ProductDesign',
]

const workCategoryLabels: Readonly<Record<ProjectCategory, Record<AppLanguage, string>>> = {
  WebDesign: {
    en: 'Web Design',
    zh: '网页设计',
  },
  ArtWorks: {
    en: 'Art Works',
    zh: '艺术作品',
  },
  WorkExperience: {
    en: 'Work Experience',
    zh: '工作经历',
  },
  ProductDesign: {
    en: 'Product Design',
    zh: '产品设计',
  },
}

const imageTheMist = withBase('/assets/images/projects/TheMistCard.png')
const imageCovid = withBase('/assets/images/projects/COVID-19_IMPACT.png')
const logoGlory = withBase('/assets/images/projects/glory-ai-logo.svg')
const imageErosTrilogy = withBase('/assets/images/projects/Eros%20Trilogy_Origin.png')
const imageChladniShape = withBase('/assets/images/projects/0.83-1.17HZ.png')
const imageEureka = withBase('/assets/images/projects/Erueka.png')
const imageStjornur = withBase('/assets/images/projects/Stjornur.png')
const imageCue = withBase('/assets/images/projects/CUE.png')
const imageJdLora = withBase('/assets/images/projects/JingDong.png')
const imageCape = withBase('/assets/images/projects/CAPE.png')
const imageSolidfiedWilling = withBase('/assets/images/projects/SolifiedWilling.png')
const imageOasis = withBase('/assets/images/projects/Oasis.png')

export const projects: ReadonlyArray<ProjectCard> = [
  {
    id: 'themist',
    title: 'TheMist',
    category: 'WebDesign',
    variant: 'standard',
    imageSrc: imageTheMist,
    href: 'http://143.198.31.226/',
    titleFont: 'audiowide',
    overlayTone: 'themist',
    customTag: {
      en: 'Web Dashboard',
      zh: '网页 数据可视化',
    },
  },
  {
    id: 'covid-impact',
    title: 'COVID-19 IMPACT DashBoard',
    category: 'WebDesign',
    variant: 'standard',
    imageSrc: imageCovid,
    href: 'https://mr-speakless.github.io/ITP-dataVisualize-dashboard/',
    titleFont: 'mono',
    overlayTone: 'covid',
    customTag: {
      en: 'Web Dashboard',
      zh: '网页 数据可视化',
    },
  },
  {
    id: 'glory-ai',
    title: 'GLory.AI',
    category: 'WebDesign',
    variant: 'standard',
    logoSrc: logoGlory,
    href: 'https://gloryai.net/',
    titleFont: 'display',
    overlayTone: 'glory',
    customTag: {
      en: 'AI Platform',
      zh: 'AI 应用平台',
    },
  },
  {
    id: 'eros-trilogy',
    title: 'Eros Trilogy',
    category: 'ArtWorks',
    variant: 'half',
    imageSrc: imageErosTrilogy,
    href: 'https://readymag.website/u2761448707/5176451/yaxianshen-erosthilogy/',
    titleFont: 'display',
    overlayTone: 'neutral',
    customTag: {
      en: 'Art Installation',
      zh: '艺术装置',
    },
  },
  {
    id: 'chladni-shape',
    title: '0.83-1.17HZ',
    category: 'ArtWorks',
    variant: 'half',
    imageSrc: imageChladniShape,
    href: 'https://youtu.be/soa8h9AfMrg',
    titleFont: 'sans',
    overlayTone: 'themist',
  },
  {
    id: 'eureka',
    title: 'Eureka',
    category: 'ArtWorks',
    variant: 'half',
    imageSrc: imageEureka,
    href: 'https://readymag.website/u2761448707/5176451/yaxianshen-eureka/',
    titleFont: 'sans',
    overlayTone: 'covid',
    customTag: {
      en: 'AI Film',
      zh: 'AI 影像',
    },
  },
  {
    id: 'stjornur',
    title: 'Stjornur',
    category: 'ArtWorks',
    variant: 'half',
    imageSrc: imageStjornur,
    href: 'https://readymag.website/u2761448707/5176451/yaxianshen-stujouor/',
    titleFont: 'sans',
    overlayTone: 'covid',
    customTag: {
      en: 'Animation',
      zh: '动画',
    },
  },
  {
    id: 'cue-pm-ai-camera',
    title: 'CUE_PM_AICamera',
    category: 'WorkExperience',
    variant: 'half',
    imageSrc: imageCue,
    href: 'https://drive.google.com/file/d/1DEnfVb-WmpDh34XuHa1WOaBb1a-f_T-X/view?usp=drive_link',
    titleFont: 'audiowide',
    overlayTone: 'covid',
    customTag: {
      en: 'Product Manager',
      zh: '产品经理',
    },
  },
  {
    id: 'jd-com-ai-lora',
    title: 'JD.com_AI_Lora',
    category: 'WorkExperience',
    variant: 'half',
    imageSrc: imageJdLora,
    href: 'https://drive.google.com/file/d/1lVeJ6XojqVNTt16-bItfFj1m9i4pZ24q/view?usp=drive_link',
    titleFont: 'sans',
    overlayTone: 'neutral',
    customTag: {
      en: 'Visual Designer',
      zh: '视觉设计师',
    },
  },
  {
    id: 'cape',
    title: 'CAPE',
    category: 'ProductDesign',
    variant: 'standard',
    imageSrc: imageCape,
    href: 'https://readymag.website/u2761448707/5176451/yaxianshen-cape/',
    titleFont: 'sans',
    overlayTone: 'neutral',
    customTag: {
      en: 'Product Design',
      zh: '产品设计',
    },
  },
  {
    id: 'solidfied-willing',
    title: 'Solidified Willing',
    category: 'ProductDesign',
    variant: 'standard',
    imageSrc: imageSolidfiedWilling,
    href: 'https://readymag.website/u2761448707/5176451/yaxianshen-solifiedwilling/',
    titleFont: 'sans',
    overlayTone: 'themist',
    customTag: {
      en: 'UI/UX',
      zh: 'UI/UX',
    },
  },
  {
    id: 'oasis',
    title: 'Oasis',
    category: 'ProductDesign',
    variant: 'standard',
    imageSrc: imageOasis,
    href: 'https://readymag.website/u2761448707/5176451/yaxianshen-oasis/',
    titleFont: 'sans',
    overlayTone: 'covid',
    customTag: {
      en: 'Product Design',
      zh: '产品设计',
    },
  },
]

export function getWorkCategoryLabel(category: ProjectCategory, language: AppLanguage): string {
  return workCategoryLabels[category][language]
}
