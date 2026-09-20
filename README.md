# Shuoyue Wu — Personal Portfolio

Shuoyue Wu 的英文个人作品站。新站使用 Vite + React + TypeScript，发布在 `https://shuoyuewu.com/`；旧站位于 `Archive/`，发布在 `/old/`，包括 `/old/CN` 和 `/old/ENG`。

## 本地运行

需要 Node.js 22 和 npm。

```bash
npm ci
npm run dev
npm run typecheck
npm run lint
npm run build
npm run preview
```

`npm run build` 会生成 `dist/`，包括九个清洁 URL 的 `index.html`、`404.html`、`sitemap.xml` 与各页元数据。预览根页通常是 `http://localhost:4173/`；详情页可直接打开并刷新，如 `/work/noe/`。

## 页面与更新作品

首版页面：Work（`/`）、About（`/about/`）、Noe、CUE、JingDong、COVID19、Eureka、CAPE、ErosTrilogy 七个详情页。路由见 `src/config/routes.json`，作品文字、媒体顺序、卡片与详情页映射见 `src/content/projects.ts`。添加作品时，先读 Figma 的新 frame、截图与 annotation，再新增项目数据、路由元信息与 Figma 素材；若需要新编排，可扩展 `StorySection` 或添加局部页面模块。无需 CMS。

Didact Gothic 由 `index.html` 中 Google Fonts 的 link 加载，正常体 400；字体不可用时以 sans-serif 回退。Figma 图像与 SVG 保存在 `public/assets/figma/`，映射在 `src/content/media.ts`；大位图已缩至最长边 2000px 并压缩为 JPEG。原始 `LOGO3D.obj` 保留在仓库根目录，运行副本在 `public/assets/3d/LOGO3D.obj`。动效与灯光的可调数值及单位见 `src/config/motion.ts`。

## 发布与旧站

`.github/workflows/deploy.yml` 在推送到 `main` 后运行两套依赖安装和构建：新站 `dist/` 复制到站点根目录，`Archive/dist/` 复制到 `/old/`。本地构建和预览不代表已推送或已上线。域名和 DNS 由用户管理。旧版说明见 `Archive/README.md`。

设计来源、映射与差异见 `docs/design-map.md`；当前验证和待办见 `PROGRESS.md`。

## 更新卡片图与 3D 参数

- 卡片 Default/Hover 图放在 `public/assets/cards/`（建议 2000px 宽 JPG），在 `src/content/projects.ts` 的 `cardImage` / `cardHover` 引用；未设 `cardHover` 时 Hover 使用详情页 `cover`。
- 首页 3D Logo 的旋转、相机、材质、环境面板、面光与手电筒参数都在 `src/config/motion.ts`，每项附单位说明；开发模式下浏览器控制台可用 `__logoDebug.material` 等实时试值。
- 详情页新增图片时，在 `blocks` 里用 `full(src, 高度)` / `half(src, 高度)` 填 Figma 裁切框高度即可得到相同裁切。

## 图片质量与素材流程（2026-09-19 起）

- 所有位图统一输出为 WebP（保留透明通道），长边最多 3072px，质量 84（卡片 86）。1200px 内容列 / 1472px 卡片在 2x 屏幕上仍然清晰。
- 转换脚本：`node scripts/optimize-assets.mjs <源目录> <输出目录> [--max=3072] [--quality=84]`（依赖 devDependency `sharp`）。源图不入库；从 Figma 用 MCP 的 `get_design_context` / `download_assets` 取原图，或直接用你本地的原图。
- 带透明的截图/拼贴（Noe 流水线截图、Eros 视觉练习图等）同样走 WebP，不再压成 JPG，避免透明区域变白/变黑。
- 已知源图本身分辨率偏低（Figma 里就是这个尺寸）：CUE 封面 1365px、JingDong 封面 1427px、Eros 胶片图 1592px、Eros 对抗截图 1024px。要更清晰需替换 Figma 里的源图。

## 方框与角块参数

`src/config/frame.ts` 暴露 `strokePx`（描边宽）和 `cornerPx`（角块边长），启动时写入 CSS 变量 `--stroke` / `--corner`。所有方框用 `.frame`（描边 + 四角角块）；相邻方框用 `.cells` / `.stack` 让描边重叠一次，交界处的角块只出现一次；`.frame--subtle` 用灰色角块（页脚），`.frame--plain` 只描边不带角块（密集行组）。
