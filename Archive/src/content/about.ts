import type { AppLanguage } from '../i18n/language'
import { withBase } from '../lib/basePath'

export interface AboutExperienceItem {
  id: string
  role: string
  roleSubline?: string
  organization: string
  organizationSubline?: string
  organizationUrl?: string
  dateRange: string
}

export interface AboutAwardItem {
  id: string
  title: string
  date: string
}

interface AboutPageContent {
  hero: {
    introHeadline: string
    roles: readonly string[]
  }
  portrait: {
    src: string
    alt: string
  }
  biography: {
    title: string
    paragraphs: readonly string[]
  }
  artistStatement: {
    title: string
    paragraphs: readonly string[]
  }
  skills: {
    title: string
    categories: ReadonlyArray<{
      id: string
      name: string
      items: string
    }>
  }
  experience: {
    title: string
    items: ReadonlyArray<AboutExperienceItem>
  }
  awards: {
    title: string
    items: ReadonlyArray<AboutAwardItem>
  }
  resume: {
    label: string
    shortLabel: string
    url: string
  }
  portfolio: {
    label: string
    shortLabel: string
    url: string
  }
}

const aboutPageContentByLanguage: Readonly<Record<AppLanguage, AboutPageContent>> = {
  en: {
    hero: {
      introHeadline: 'HI, I am Shuoyue Wu,\nI am a...',
      roles: ['Artist', 'Product Designer', 'Product Manager', 'Full-stack Developer', 'AI Film maker'],
    },
    portrait: {
      src: withBase('/assets/images/portraits/self-portrait.png'),
      alt: 'Portrait of Shuoyue Wu',
    },
    biography: {
      title: 'About me',
      paragraphs: [
        'I’m Shuoyue Wu, an emerging product builder with a background in design, AI products, and creative technology. I’ve worked across product design and product management, and I’m most excited by building products from concept to user experience with an eye on both market need and technical possibility. Long term, I hope to grow into a cross-disciplinary creator who can bridge product vision, design, development, and go-to-market thinking.',
      ],
    },
    artistStatement: {
      title: 'Artist Statement',
      paragraphs: [
        'I’m a digital media artist currently studying at NYU Tisch. My work explores the boundaries between technology, perception, and storytelling, and I’m interested in how digital and physical media can shape emotion, experience, and meaning.',
        'Through interactive installations and AI-generated imagery, I examine the often fragile, strange, and sometimes absurd relationships between people, society, the environment, and technology. I’m especially drawn to overlooked moments in everyday life, moments that quietly reveal both the tenderness and the contradictions of the world we live in.',
        'Through my work, I hope to invite viewers to pause, reflect, and look again at what feels familiar. My projects have been exhibited in public art spaces, and my AI films have been selected and nominated at several international film festivals.',
      ],
    },
    skills: {
      title: 'Skills',
      categories: [
        {
          id: 'design',
          name: 'Design',
          items: 'Figma · Adobe Creative Suite · Design Systems · Prototyping · User Research / Usability Testing · Diffusion / ComfyUI / LoRA',
        },
        {
          id: 'development',
          name: 'Development',
          items: 'Frontend Development · React · HTML/CSS/JS',
        },
        {
          id: '3d',
          name: '3D & CGI',
          items: 'Blender · Substance',
        },
      ],
    },
    experience: {
      title: 'Experience',
      items: [
        {
          id: 'itp',
          role: 'Graduate (SPS)',
          organization: 'NYU Tisch ITP',
          organizationSubline: '(Interactive Telecommunicatons Program)',
          organizationUrl: 'https://itp.nyu.edu/itp/',
          dateRange: '2025-now',
        },
        {
          id: 'cue',
          role: 'Product Manager Intern',
          organization: 'CUE',
          organizationUrl: 'https://hk.cue.group/#/',
          dateRange: '5/2025-7/2025',
        },
        {
          id: 'jingdong',
          role: 'Visual Designer Intern',
          organization: 'JingDong Group',
          organizationUrl: 'https://corporate.jd.com/',
          dateRange: '5/2024-7/2024',
        },
        {
          id: 'cuc',
          role: 'Undergraduate',
          roleSubline: 'Digital Media Art',
          organization: 'Communication University of China (CUC)',
          dateRange: '2021-2025',
        },
      ],
    },
    awards: {
      title: 'Awards',
      items: [
        {
          id: 'muse',
          title: 'MUSE Design Award, Product Design (CAPE Project)',
          date: '7/2025',
        },
        {
          id: 'ima',
          title: 'Award Winner, IMA International Art Film Festival (EUREKA)',
          date: '5/2025',
        },
        {
          id: 'espsa',
          title:
            'Excellent Science Popularization Service Award, Communication University of China',
          date: '11/2024',
        },
        {
          id: 'exhibition',
          title: 'Finalist, The 6th Art and Science International Exhibition and Symposium',
          date: '1/2024',
        },
        {
          id: 'ncda',
          title: 'Second Prize, The 11th National College Digital Art & Design Awards',
          date: '8/2023',
        },
      ],
    },
    resume: {
      label: 'Download Resume (PDF)',
      shortLabel: 'Resume',
      url: withBase('/assets/PDFs/Shuoyue_Wu_Resume_Mar2026.pdf'),
    },
    portfolio: {
      label: 'View Portfolio',
      shortLabel: 'Portfolio',
      url: 'https://drive.google.com/file/d/1MkFhQ7hDYI8A5Hk1reh1pe3L9sLQ4sAl/view',
    },
  },
  zh: {
    hero: {
      introHeadline: '你好，我是吴烁钺，\n我是一名...',
      roles: ['艺术家', '产品设计师', '产品经理', '全栈开发者', 'AI 电影创作者'],
    },
    portrait: {
      src: withBase('/assets/images/portraits/self-portrait.png'),
      alt: '个人照片',
    },
    biography: {
      title: '关于我',
      paragraphs: [
        '我是吴烁钺，一位在产品与设计领域的新人。我拥有AIGC相关产品的设计与产品经理相关经验，尤为热衷于从概念构思到用户体验的全流程产品构建。我始终兼顾市场需求与技术可行性。从长远来看，我立志成长为一名全周期的创作者（从概念到落地），能够有效地在产品愿景、设计、开发与市场推广思维之间搭建桥梁。',
      ],
    },
    artistStatement: {
      title: '关于艺术创作',
      paragraphs: [
        '我是吴烁钺，一名就读于纽约大学帝势艺术学院（NYU Tisch）的数字媒体艺术家。我的创作实践始终探索科技、感知与叙事之间的边界，致力于发掘数字媒介与实体媒介交融共生的新可能，让技术成为唤醒情感、传递深意的载体。',
        '通过互动装置与人工智能生成影像，我聚焦于人类、社会、环境与科技之间脆弱却又常带荒诞感的联结。那些日常中被忽略的瞬间深深吸引着我，它们藏着现代生活的温柔底色，也映照着我们生存状态里的矛盾与张力。',
        '我希望我的作品能让观者驻足、沉思，直面这个既熟悉又陌生的世界。目前，我的创作已在多个公共艺术空间展出，AI 影像作品也入选并提名了多项国际电影节奖项。',
      ],
    },
    skills: {
      title: '技能',
      categories: [
        {
          id: 'design',
          name: '产品设计',
          items: 'Figma · Adobe Creative Suite · Design Systems · Prototyping · User Research / Usability Testing · Diffusion / ComfyUI / LoRA',
        },
        {
          id: 'development',
          name: '前端开发',
          items: 'Frontend Development · React · HTML/CSS/JS',
        },
        {
          id: '3d',
          name: '三维技术',
          items: 'Blender · Substance',
        },
      ],
    },
    experience: {
      title: '经历',
      items: [
        {
          id: 'itp',
          role: '研究生（SPS）',
          organization: 'NYU Tisch ITP',
          organizationSubline: '（Interactive Telecommunications Program）',
          organizationUrl: 'https://itp.nyu.edu/itp/',
          dateRange: '2025-至今',
        },
        {
          id: 'cue',
          role: '产品经理实习生',
          organization: 'CUE',
          organizationUrl: 'https://hk.cue.group/#/',
          dateRange: '2025.5-2025.7',
        },
        {
          id: 'jingdong',
          role: '视觉设计实习生',
          organization: 'JingDong Group',
          organizationUrl: 'https://corporate.jd.com/',
          dateRange: '2024.5-2024.7',
        },
        {
          id: 'cuc',
          role: '本科',
          roleSubline: '数字媒体艺术',
          organization: '中国传媒大学（CUC）',
          dateRange: '2021-2025',
        },
      ],
    },
    awards: {
      title: '奖项',
      items: [
        {
          id: 'muse',
          title: 'MUSE 设计奖，产品设计（CAPE 项目）',
          date: '2025.7',
        },
        {
          id: 'ima',
          title: 'IMA 国际艺术电影节获奖作品（EUREKA）',
          date: '2025.5',
        },
        {
          id: 'espsa',
          title: '中国传媒大学优秀科普服务奖',
          date: '2024.11',
        },
        {
          id: 'exhibition',
          title: '第六届艺术与科学国际展览暨研讨会入围',
          date: '2024.1',
        },
        {
          id: 'ncda',
          title: '第十一届全国高校数字艺术设计大赛二等奖',
          date: '2023.8',
        },
      ],
    },
    resume: {
      label: '下载简历（PDF）',
      shortLabel: '简历',
      url: withBase('/assets/PDFs/Shuoyue_Wu_Resume_Mar2026.pdf'),
    },
    portfolio: {
      label: '查看作品集',
      shortLabel: '作品集',
      url: 'https://drive.google.com/file/d/1MkFhQ7hDYI8A5Hk1reh1pe3L9sLQ4sAl/view',
    },
  },
}

export function getAboutPageContent(language: AppLanguage): AboutPageContent {
  return aboutPageContentByLanguage[language]
}
