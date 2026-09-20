# 架构与实现决定

## 实际结构

| 路径 | 职责 |
| --- | --- |
| `src/main.tsx` | 根据 pathname 选择页面；清洁 URL 的目录索引由构建脚本提供 |
| `src/config/routes.json` | 公共路由、标题、description；构建脚本也读取 |
| `src/config/motion.ts` | 动画、点阵、金属材质、灯光和鼠标响应的有类型默认参数 |
| `src/config/frame.ts` | 方框描边宽度与角块尺寸（写入 `--stroke` / `--corner`） |
| `scripts/optimize-assets.mjs` | sharp 转 WebP 的素材脚本（长边 3072、保留透明） |
| `src/content/projects.ts` | 七个项目的 slug、卡片图/封面、文案、规格，以及按 Figma 顺序的 `blocks`（heading/paragraphs/note/video/media/columns，图片带裁切比例） |
| `src/content/media.ts` | Figma 导出素材的稳定本地路径 |
| `src/pages/` | Work、About、共用详情模板 `ProjectPage`，以及 `CapeStory`、`ErosStory` 两个定制正文 |
| `src/components/layout/` | Navigation、Footer（角块由 `.frame` CSS 绘制，不再有 BorderCorners 组件） |
| `src/components/projects/` | `ProjectCard`、`ProjectBlocks`（blocks 渲染器与 `Media` 裁切图片盒） |
| `src/features/hero/` | 点阵 canvas 与 Three.js OBJ 模型 |
| `src/styles/global.css` | 设计 tokens、布局和小屏临时样式 |
| `scripts/postbuild.mjs` | 静态页面目录、逐页 SEO 元数据、sitemap、404 |
| `public/assets/figma/` | 从当前 Figma 画板导出并压缩的本地媒体 |
| `public/assets/3d/` | 用户 OBJ 的运行副本 |
| `public/assets/cards/` | 用户提供的卡片 Default/Hover 图（压缩到 2000px 宽） |
| `Archive/` | 独立旧站，Vite base 为 `/old/` |

## 页面与内容

主页以卡片复用七个项目；卡片链接由项目的 `path` 字段确定。卡片 Default 状态整卡满铺图片，Hover 才展开 144px 元信息。共用详情页面渲染封面、介绍、规格，然后由 `ProjectBlocks` 按 `blocks` 顺序输出标题、段落、视频与裁切图片（`aspect-ratio` 来自 Figma 裁切框，`object-fit: cover`），图片列最大 1200px 居中。CAPE 与 Eros Trilogy 使用定制正文：CAPE 的研究信息图为 Figma 分区导出，Eros 的三处研究拼贴与气泡遮罩为导出，其余为 HTML/Flex。

桌面以 Flexbox 表达 2:1:1 导航、卡片行、信息栏、研究区。主体按可用宽度伸缩，内容决定高度。小屏通过 flex-wrap/column 顺序堆叠，不隐藏项目。75% 的介绍区以容器宽度计算。

方框系统：`.frame` 画描边，并用 `::after` 的四个背景渐变方块在描边中线的四角画角块（`inset: stroke/2 − corner/2`）。相邻方框通过 `-var(--stroke)` 负外边距重叠描边（`.cells` 横向、`.stack` 纵向、导航/首页介绍格的内嵌单元格），因此共享边只有一条线、共享角只显示一个角块。卡片元信息用 `clip-path: inset(-corner)` 而非 `overflow: hidden` 裁切高度动画，避免切掉角块。SkillVI 符号 SVG 自带的边框矩形已移除，由 `.frame` 统一描边。

## Three.js 与交互

Hero 直接使用 Three.js 和 OBJLoader 加载用户提供的 `LOGO3D.obj`，用 `MeshPhysicalMaterial`（金属/清漆/虹彩）、一个由发光面板组成的工作室环境（PMREM 烘焙，`motion.logo.environment`）、四个矩形面光源（需 `RectAreaLightUniformsLib.init()`）和一个跟随指针的 SpotLight 手电筒呈现金属。模型只绕竖直轴旋转，外层 pivot 提供固定俯仰；静态 Figma 渲染图在首帧后淡出，模型高度按 `fitHeight` 与静态图对齐。开发模式下 `window.__logoDebug` 暴露 scene/material/step 供调参。点阵为 Figma 的 15×9 方点，独立 canvas 绘制；指针 75px 范围内放大变亮并递减。页面不可见或 Hero 离屏时暂停渲染，卸载时释放监听、几何、材质、环境图和 WebGL renderer。减少动画偏好时停止持续旋转；WebGL 不可用或模型失败时展示 Figma 静态图。参数见 `src/config/motion.ts`；材质与灯光观感仍待用户视觉确认。

Work 介绍区离屏后显示距顶部 24px 的固定导航，Logo 从左侧滑入并改变链接占位。按钮与卡片采用 350ms 初值；卡片图片同时移动和渐变，标签文字上下滑动。链接都是语义化锚点，触屏仍能点开项目。

## 路由与发布

Vite base 为 `/`。运行时用 pathname 匹配页面；构建后每个已知路径都有实体 `index.html`，支持 GitHub Pages 直接请求和刷新。`postbuild.mjs` 根据同一份路由表写每页 title、description、canonical、Open Graph 基本标签及 sitemap。分享图未在设计中确定，故尚无 `og:image`。

GitHub Actions 使用 Node 22，并分别以根目录和 `Archive/` 的 lockfile 做 npm 缓存及 `npm ci`。组合产物时新站放根路径，旧站放 `/old/`；不改旧站源码或既有路由。
