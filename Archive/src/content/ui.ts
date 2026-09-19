import type { AppLanguage } from '../i18n/language'

interface UICopy {
  nav: {
    about: string
    work: string
    blackhole: string
    contact: string
    logoAlt: string
    languageSwitchAriaLabel: string
    languageIconAlt: string
    languageMenuAriaLabel: string
    languageOptionChinese: string
    languageOptionEnglish: string
  }
  about: {
    downloadIconAlt: string
  }
  work: {
    openProjectAriaPrefix: string
  }
  contact: {
    cardTitle: string
    copyTooltip: string
    copiedText: string
    dialogAriaLabel: string
    closeButtonAriaLabel: string
    closeIconAlt: string
    wechatIconAlt: string
  }
}

const uiCopyByLanguage: Readonly<Record<AppLanguage, UICopy>> = {
  en: {
    nav: {
      about: 'About',
      work: 'Work',
      blackhole: 'Blackhole',
      contact: 'Contact',
      logoAlt: 'Shuoyue Wu logo',
      languageSwitchAriaLabel: 'Switch language',
      languageIconAlt: 'Language',
      languageMenuAriaLabel: 'Select language',
      languageOptionChinese: 'Chinese',
      languageOptionEnglish: 'English',
    },
    about: {
      downloadIconAlt: 'Download',
    },
    work: {
      openProjectAriaPrefix: 'Open project',
    },
    contact: {
      cardTitle: 'Contact Me:',
      copyTooltip: 'Click to copy',
      copiedText: 'Copied!',
      dialogAriaLabel: 'Contact information',
      closeButtonAriaLabel: 'Close contact card',
      closeIconAlt: 'Close',
      wechatIconAlt: 'Wechat',
    },
  },
  zh: {
    nav: {
      about: '关于',
      work: '项目',
      blackhole: '黑洞',
      contact: '联系方式',
      logoAlt: '吴烁钺标志',
      languageSwitchAriaLabel: '切换语言',
      languageIconAlt: '语言',
      languageMenuAriaLabel: '选择语言',
      languageOptionChinese: '中文',
      languageOptionEnglish: 'English',
    },
    about: {
      downloadIconAlt: '下载',
    },
    work: {
      openProjectAriaPrefix: '打开项目',
    },
    contact: {
      cardTitle: '联系方式：',
      copyTooltip: '点击复制',
      copiedText: '已复制',
      dialogAriaLabel: '联系信息',
      closeButtonAriaLabel: '关闭联系弹窗',
      closeIconAlt: '关闭',
      wechatIconAlt: '微信',
    },
  },
}

export function getUICopy(language: AppLanguage): UICopy {
  return uiCopyByLanguage[language]
}
