# Figma 设计映射

设计文件：`FueBrub7aXMt8Jl0pnoF6Q`（个人网站设计2）。本次按用户提供的当前节点读取了 design context、annotation 和截图；CAPE 总 frame 过大，继续读取封面、介绍、规格、设计展示、草图、研究、测量、测试和致谢的子节点。忽略评论区。画板以 1512px 为参考宽度。

| 当前 frame | 路由 | 代码 | 目前状态 |
| --- | --- | --- | --- |
| Work / Desktop `35:3836` | `/` | `WorkPage`、`ProjectCard`、`LogoScene`、`DotField` | 已实现、技术检查通过、待用户视觉验收 |
| About / Desktop `35:4033` | `/about/` | `AboutPage` | 已实现、技术检查通过、待用户视觉验收 |
| Noe `35:4055` | `/work/noe/` | `projects.ts`（blocks）、`ProjectBlocks` | 2026-09-19 按 Figma 裁切框/分栏重排，headless 截图核对 |
| CUE `71:8057` | `/work/cue/` | 同上 | 同上 |
| JingDong `71:8172` | `/work/jingdong/` | 同上（`columns` 组合块） | 同上 |
| COVID19 `71:8287` | `/work/covid19/` | 同上 | 同上 |
| Eureka `71:8402` | `/work/eureka/` | 同上（双列 `columns`） | 同上；补齐 R5/R6 素材 |
| CAPE `71:8517` | `/work/cape/` | `CapeStory` | 2026-09-19 按 Figma 复核：标题/背景带/28px 节奏/奖项行；研究图为分区导出 |
| ErosTrilogy `80:8779` | `/work/eros-trilogy/` | `ErosStory` | 2026-09-19 按 Figma 重建（分区读取 139:8795、133:7567、133:7775、133:7934、133:8428） |
| JG / Components & States `12:8` | 共用 | Navigation、Footer、ProjectCard 等 | 已读取并应用，待用户视觉验收 |

## annotation 与实现

| 要求 | 实现位置 | 状态 |
| --- | --- | --- |
| Hero 点阵，约 75px 半径，按距离渐弱 | `DotField`、`motion.dots` | 已实现 |
| OBJ 持续旋转、光滑高反光 PBR、三四个基础面光和指针强光 | `LogoScene`、`motion.logo` | 已实现，材质观感待审 |
| Work 介绍区离屏后固定导航，顶部 24px，Logo 滑入并挤动链接 | `WorkPage`、Navigation CSS | 已实现 |
| 按钮 hover 前景背景反转，350ms | `.pill-link` | 已实现 |
| 卡片 default/hover 图片上移渐隐与封面渐显、标签上下滑动、144px 元信息 | `ProjectCard` CSS | 已实现 |
| 四角标记随容器边界伸缩 | `BorderCorners` | 已实现 |
| Work 介绍及 About 文本占容器可用宽度的 75% | `.disciplines__intro`、`.about-intro h1` | 已实现 |
| Noe 正式视频 `hNUpk2jYVL4`（用户要求从头播放） | `projects.ts` | 已实现（2026-09-20） |
| Noe 新增段落 + LinkedIn 嵌入（159:1647、159:1650，annotation 给出 iframe） | `projects.ts` `embed` block | 已实现（2026-09-19） |
| COVID19 三张图片链接指定 dashboard | `projects.ts`、`StorySection` | 已实现 |
| Eureka 视频 `_Y6XSFS4PVM` | `projects.ts` | 已实现 |
| Eros 两个视频 `gqkByELFMBA`、`3lSUb1UaHg4` | `projects.ts` | 已实现 |

动画配置：`transitionMs` 毫秒、`navigationTopPx` 像素、点阵距离/大小/透明度像素与单位区间、Logo 旋转弧度每秒、材质 0–1 参数、灯光强度及位置场景单位，均在 `src/config/motion.ts` 附注释。75px 和 24px、350ms 来自设计；其他数值为可调实现默认值。

## 详情页内容模型（2026-09-19）

`src/content/projects.ts` 的 `blocks` 按 Figma 画板顺序列出：`heading`（Heading 71:7908：上方 40px、通栏细线、56px）、`paragraphs`（Paragraph 71:7873：1200px 列、28px/29.4、段间 28px）、`note`（44px）、`video`（列内 16:9）、`media`（一行图片：1 张=通栏、2 张=对开，间距 28px）、`columns`（并排的图片堆叠，可指定各列宽度比例与居中）。每张图带 `ratio = Figma 裁切框宽/高`，用 `aspect-ratio + object-fit: cover` 复现 Figma 的自动裁切；`full(src, h)`/`half(src, h)` 辅助函数直接填 Figma 中 1200/586 宽框的高度。CoverImage 为 1068:601 裁切、40px 上下留白、右下 27×60px 黑底标题；/INTRO 为内联 12px 标签 + 44px；/SPECIFICATIONS 为 160px 标签列 + 分隔线行 + 188px 符号。

Eros 与 CAPE 为定制页面：Eros 的三处研究拼贴（Group 2239、Group 2240、SmokingPics）与气泡遮罩为 Figma 导出，位于 `public/assets/figma/eros/exports/`；Metaphor 两组拼贴按 Figma 返回的百分比定位。CAPE 的研究信息图沿用分区导出（`public/assets/figma/capeexports/`），标题、粉色结论框、奖项行（133:5303）为 HTML。

## Work 卡片与 Hero（2026-09-19）

- JG / Project Card：Default 状态（15:32、16:33）= 图片满铺整张卡片（485px @1512，无圆角）+ 标签；Hover（14:18、16:42）= 图片收为 16px 圆角 + 144px 元信息（TYPE/Sector/DATE + SkillVI）。代码中 `.project-card__details` 高度 0→144px 过渡，图片交叉淡入并位移，标签文字上滑/下入。
- 用户 2026-09-19 提供的卡片图（`/Users/lucas/Documents/Temp/PersonalWeb/Cover|Hover`，含后补的 CUE）已转为 WebP 放在 `public/assets/cards/`：Default 用 `cardImage`，Hover 用 `cardHover`（未提供时回退到详情页 `cover`）。
- Hero（35:3846）：4px `--jg-subtle` 方点，间距由 `motion.dots.spacingPx`（50px，约为 Figma 15×9 的两倍密度，用户要求）推导；静态渲染图 `image 1` 左右各内缩 13.6%（Figma 200/1472）并 cover；3D 模型高度 = 舞台高度 × `motion.logo.fitHeight`，首帧后静态图淡出。
- JG / Navigation（13:18）：Logo 容器 `h-full + 8px padding`，随 54px 行高填充；姓名/邮箱列 368px、28px 字号；四角标记 `--jg-subtle`。

## 方框角块规则（2026-09-19 用户指定，覆盖 Figma 中不精确的位置）

- 每个方框四角各一个角块，角块中心落在描边中线的交点上。
- 方框与方框相邻处（导航的姓名/邮箱格、首页介绍格、卡片元信息行与符号格、页脚四格、About 四栏）描边重叠为一条线，交界角块只出现一次。
- 过密的行组（About C.V. 行）只在外框四角显示角块，行之间只用分隔线。
- 参数：`src/config/frame.ts`（描边 1px、角块 4px），角块颜色 `--jg-surface`（默认）/ `--jg-subtle`（页脚）。

## 素材与弹性解释

`src/content/media.ts` 把当前页面 Figma context 中的素材映射到 `public/assets/figma/<页面>/`。2026-09-19 起全部位图重新从 Figma 原图导出为 WebP（长边 ≤3072、保留透明），CAPE 研究图按 2.5× 重新导出；见 README「图片质量与素材流程」。CAPE 的复杂信息图从已读取的子节点导出成局部媒体，标题与页段为 HTML。未使用 Assests 的 Archived 历史设计。根目录用户文件 `LOGO3D.obj` 原样保留，副本用于运行。

Figma 某些 section 没有 Fill Container/Auto Layout 网页行为：代码用 Flexbox 的比例、换行和最小宽度补齐，页高由文字驱动；卡片的图像区域保持比例与裁切意图。小屏为临时可读布局，尚非设计验收。没有用 Grid。

## 待用户确认与视觉复核

- 用户审阅字体与换行、桌面间距、图片裁切、卡片 hover、导航出现时机、Logo 金属与光源观感（`motion.logo.material`、`environment.panels`、`pointerLight` 可手调）、CAPE 研究图在屏幕上的可读性。
- CUE 画板 2026-09-19 更新：B2B 段落新增首句、Consumer Product 两张竖图改为 978:1459 / 586:875 contain（首张白底）。COVID19 封面标题链接到 dashboard；Eureka 封面 contain。About 头像用 1280×1920 原图按 Figma 裁切（object-position 50% 17%）。
- 视频框按 16:9 实现；Figma 占位为 1200×620（Noe）/1200×675（Eureka、Eros）。
- Figma 文案可能含原稿笔误，例如 `NewYork`、`BoB`、`Transsion.lnc`、`studies.The`、`word`；现按画板保留，修改前请用户确认。
- 分享预览图尚未指定；已经有 title、description、canonical、Open Graph 文字元数据，`og:image` 待素材。
- 组件页出现的旧模板链接 `jackygrob.com` 未进入新站。没有确定目标的旧模板链接未发布。
