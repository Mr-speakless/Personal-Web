/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      maxWidth: {
        site: 'var(--site-max-width)',
      },
      fontFamily: {
        'serif-en': ['var(--font-serif-en)'],
        'sans-en': ['var(--font-sans-en)'],
        accent: ['var(--font-accent)'],
        mono: ['var(--font-mono)'],
        display: ['var(--font-display)'],
      },
      fontSize: {
        's-headline': ['var(--text-s-headline-size)', { lineHeight: 'var(--text-s-headline-leading)' }],
        headline: ['var(--text-headline-size)', { lineHeight: 'var(--text-headline-leading)' }],
        title: ['var(--text-title-size)', { lineHeight: 'var(--text-title-leading)' }],
        body: ['var(--text-body-size)', { lineHeight: 'var(--text-body-leading)' }],
        label: ['var(--text-label-size)', { lineHeight: 'var(--text-label-leading)' }],
        'sm-headline': ['var(--text-sm-headline-size)', { lineHeight: 'var(--text-sm-headline-leading)' }],
        'sm-title': ['var(--text-sm-title-size)', { lineHeight: 'var(--text-sm-title-leading)' }],
        'sm-body': ['var(--text-sm-body-size)', { lineHeight: 'var(--text-sm-body-leading)' }],
        'sm-label': ['var(--text-sm-label-size)', { lineHeight: 'var(--text-sm-label-leading)' }],
      },
      lineHeight: {
        's-headline': 'var(--text-s-headline-leading)',
        headline: 'var(--text-headline-leading)',
        title: 'var(--text-title-leading)',
        body: 'var(--text-body-leading)',
        label: 'var(--text-label-leading)',
        'sm-headline': 'var(--text-sm-headline-leading)',
        'sm-title': 'var(--text-sm-title-leading)',
        'sm-body': 'var(--text-sm-body-leading)',
        'sm-label': 'var(--text-sm-label-leading)',
      },
      colors: {
        neutral: {
          100: 'var(--color-neutral-100)',
          90: 'var(--color-neutral-90)',
          80: 'var(--color-neutral-80)',
          70: 'var(--color-neutral-70)',
          60: 'var(--color-neutral-60)',
          50: 'var(--color-neutral-50)',
          40: 'var(--color-neutral-40)',
          30: 'var(--color-neutral-30)',
          20: 'var(--color-neutral-20)',
          10: 'var(--color-neutral-10)',
        },
        secondary: {
          100: 'var(--color-secondary-100)',
          90: 'var(--color-secondary-90)',
          80: 'var(--color-secondary-80)',
          70: 'var(--color-secondary-70)',
          60: 'var(--color-secondary-60)',
          50: 'var(--color-secondary-50)',
          40: 'var(--color-secondary-40)',
          30: 'var(--color-secondary-30)',
          20: 'var(--color-secondary-20)',
          10: 'var(--color-secondary-10)',
        },
      },
      borderRadius: {
        card: 'var(--radius-card)',
        pill: '9999px',
      },
      backgroundImage: {
        stars: "url('/assets/images/backgrounds/stars-landing.png')",
        'overlay-glory': 'linear-gradient(205deg, var(--overlay-glory-start) 9.3944%, var(--overlay-glory-end) 107.58%)',
      },
      backgroundColor: {
        'overlay-themist': 'var(--overlay-themist)',
        'overlay-covid': 'var(--overlay-covid)',
      },
    },
  },
  plugins: [],
}
