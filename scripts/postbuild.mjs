import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises'
import routes from '../src/config/routes.json' with { type: 'json' }

const out = new URL('../dist/', import.meta.url)
const html = await readFile(new URL('index.html', out), 'utf8')
const origin = 'https://shuoyuewu.com'
const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')

for (const route of routes) {
  const url = origin + (route.path === '/' ? '/' : route.path + '/')
  const page = html
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(route.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escape(route.description)}" />`)
    .replace('</head>', `<link rel="canonical" href="${url}" /><meta property="og:type" content="website" /><meta property="og:title" content="${escape(route.title)}" /><meta property="og:description" content="${escape(route.description)}" /><meta property="og:url" content="${url}" /><meta name="twitter:card" content="summary" /></head>`)
  if (route.path === '/') {
    await writeFile(new URL('index.html', out), page)
  } else {
    const dir = new URL(route.path.slice(1) + '/', out)
    await mkdir(dir, { recursive: true })
    await writeFile(new URL('index.html', dir), page)
  }
}
const urls = routes.map((route) => `  <url><loc>${origin}${route.path === '/' ? '/' : route.path + '/'}</loc></url>`).join('\n')
await writeFile(new URL('sitemap.xml', out), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
await copyFile(new URL('index.html', out), new URL('404.html', out))
