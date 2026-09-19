import type { PropsWithChildren } from 'react'

interface SectionContainerProps extends PropsWithChildren {
  className?: string
}

export function SectionContainer({
  children,
  className = '',
}: SectionContainerProps) {
  const classes = [
    'w-full max-w-[1000px] px-[30px] md:px-0',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <div className={classes}>{children}</div>
}
