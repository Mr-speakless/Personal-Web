/**
 * Convert source images into web assets.
 *   node scripts/optimize-assets.mjs <srcDir> <outDir> [--max=3072] [--quality=84] [--lossless]
 * Every image becomes a WebP (alpha preserved) no larger than --max on its long edge, so 1200px
 * columns and 1472px cards stay sharp on 2x displays. Basenames are kept; SVGs are copied as-is.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const [srcDir, outDir, ...flags] = process.argv.slice(2)
if (!srcDir || !outDir) { console.error('usage: optimize-assets <srcDir> <outDir> [--max=3072] [--quality=84] [--lossless]'); process.exit(1) }
const opt = Object.fromEntries(flags.map((f) => { const [k, v = 'true'] = f.replace(/^--/, '').split('='); return [k, v] }))
const max = Number(opt.max ?? 3072)
const quality = Number(opt.quality ?? 84)
const lossless = opt.lossless === 'true'

await fs.mkdir(outDir, { recursive: true })
let total = 0
for (const name of (await fs.readdir(srcDir)).sort()) {
  const src = path.join(srcDir, name)
  if (!(await fs.stat(src)).isFile() || name.startsWith('.')) continue
  const ext = path.extname(name).toLowerCase()
  const base = path.basename(name, ext)
  if (ext === '.svg') { await fs.copyFile(src, path.join(outDir, name)); continue }
  if (!['.png', '.jpg', '.jpeg', '.webp', '.gif', '.tif', '.tiff'].includes(ext)) continue
  const image = sharp(src, { animated: false })
  const meta = await image.metadata()
  const out = path.join(outDir, `${base}.webp`)
  const info = await image
    .rotate()
    .resize({ width: max, height: max, fit: 'inside', withoutEnlargement: true })
    .webp({ quality, lossless, alphaQuality: 95, effort: 5, smartSubsample: true })
    .toFile(out)
  total += info.size
  console.log(`${name} ${meta.width}x${meta.height}${meta.hasAlpha ? ' alpha' : ''} -> ${path.basename(out)} ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)}KB`)
}
console.log(`total ${(total / 1024 / 1024).toFixed(1)} MB`)
