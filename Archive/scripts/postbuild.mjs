// GitHub Pages is a static host, so every language/route the SPA handles is
// pre-generated as a real folder holding a copy of dist/index.html:
//   dist/CN/index.html, dist/CN/about/index.html, dist/ENG/blackhole/index.html, ...
// A dist/404.html copy also covers any other deep link.
import { copyFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const dist = new URL('../dist/', import.meta.url).pathname
const entry = join(dist, 'index.html')
// Both cases so /old/CN and /old/cn resolve on a case-sensitive static host.
const languages = ['CN', 'ENG', 'cn', 'eng']
const routes = ['', 'about', 'blackhole']

for (const language of languages) {
  for (const route of routes) {
    const dir = join(dist, language, route)
    mkdirSync(dir, { recursive: true })
    copyFileSync(entry, join(dir, 'index.html'))
  }
}

copyFileSync(entry, join(dist, '404.html'))
console.log(`Pre-generated ${languages.length * routes.length} route folders under dist/`)
