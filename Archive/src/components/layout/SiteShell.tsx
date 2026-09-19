import type { PropsWithChildren } from 'react'
import { withBase } from '../../lib/basePath'

export function SiteShell({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen w-full overflow-x-clip bg-black text-white">
      <div className="pointer-events-none absolute inset-0">
        <img
          src={withBase('/assets/images/backgrounds/stars-landing.png')}
          alt=""
          className="h-full w-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col items-center">
        {children}
      </div>
    </div>
  )
}
