# emo / GitHub Pages

> 一个多语言静态个人主页，部署在 GitHub Pages，域名 [emohomepage.ccwu.cc](https://emohomepage.ccwu.cc)。

---

**🇨🇳 中文** — emo 的个人主页，一个零构建、零框架的纯静态网站。支持 8 种语言的 i18n、Canvas 粒子动画、3D 地球、终端打字机、项目筛选和滚动交互效果，全部在浏览器端完成。

**🇺🇸 English** — emo’s personal homepage, a zero-build static site. Eight-language i18n, Canvas particle network, 3D globe, terminal typewriter, project filtering, and scroll-driven interactions — all running in the browser.

**🇰🇷 한국어** — emo의 개인 홈페이지입니다. 빌드 도구나 프레임워크 없이 순수 HTML/CSS/JS로 제작되었습니다. 8개 언어를 지원하며, Canvas 파티클 네트워크, 3D 지구본, 터미널 타자기 효과, 프로젝트 필터 및 스크롤 인터랙션이 모두 브라우저에서 동작합니다.

**🇯🇵 日本語** — emo の個人ホームページです。ビルドツールやフレームワークを一切使わず、純粋な HTML/CSS/JS で構築されています。8 言語の国際化、Canvas パーティクルネットワーク、3D 地球儀、ターミナル風タイプライター、プロジェクトフィルター、スクロール連動エフェクトをすべてブラウザ上で実現しています。

---

## 功能亮点 / Features

| 功能 | 说明 |
|------|------|
| 8 语言 i18n | 简体中文 / English / 한국어 / 日本語 / Deutsch / Español / Français / 繁體中文，语言偏好自动持久化到 `localStorage` |
| Canvas 粒子网络 | 首屏动态节点连线，响应鼠标位置（`data-tech-canvas`） |
| 3D 地球 | Three.js 驱动的小地球，可拖拽旋转（`data-globe-canvas`） |
| 终端打字机 | hero 区域模拟命令行动画（`data-typewriter`） |
| 实时指标 | 动态显示的延迟 / 吞吐 / 可用率数据（`data-live`） |
| 数字递增 | 进入视口时数字从 0 计数到目标值（`data-count`） |
| 项目筛选 | AI / Web / Data 三类过滤 + 3D tilt 卡片（`data-filter` + `data-tilt`） |
| 滚动交互 | 进度条、视差、滚动渐现（`IntersectionObserver`） |
| 无障碍 | `aria-*`、语义标签、`prefers-reduced-motion` 全覆盖 |
| 零构建 | 没有 `package.json`，没有打包器，没有转译器 |

## 技术栈 / Stack

| 层级 | 内容 |
|------|------|
| 页面 | HTML5 语义标签，单文件 347 行 |
| 样式 | CSS Custom Properties（Claude swatch 变量体系），1650+ 行 |
| 交互 | 原生 JS，1080 行，`data-*` 属性驱动，零第三方运行时依赖 |
| 图标 | [Lucide](https://lucide.dev/)（CDN 按需加载） |
| 3D | [Three.js](https://threejs.org/) r160（CDN，仅地球组件使用） |
| 字体 | Inter + 系统后备字体栈 |
| 部署 | GitHub Pages + CNAME 自定义域名 |

## 目录结构 / Structure

```
.
├── index.html          # 单页应用，所有 section 内联
├── styles.css          # 全局样式 + CSS 变量调色板
├── script.js           # 全部交互逻辑 + 8 语言翻译表
├── CNAME               # 自定义域名 emohomepage.ccwu.cc
├── README.md
└── assets/
    ├── claude-workspace.png       # 首屏 hero 示意图
    └── claude-workspace-source.svg # 原始 SVG 源文件
```

## 本地预览 / Preview

```bash
# 一行命令即可启动
python3 -m http.server 8080

# 或者直接用浏览器打开
open index.html
```

## 自定义指南 / Customization

修改以下三个文件即可：

| 你想改 | 改哪个文件 | 示例 |
|--------|-----------|------|
| 名字、简介、链接、邮箱 | `index.html` | 修改 hero、section、footer 区域的文本内容 |
| 颜色主题 | `styles.css` `:root` 块 | 调整 `--swatch-*` 变量（见下方色板表） |
| 翻译文本 | `script.js` `translations` 对象 | 修改或新增任意语言版本的翻译字符串 |

所有交互效果由 `data-*` HTML 属性控制（如 `data-tilt`、`data-filter`、`data-count` 等），新增元素只需复制对应的 `data-*` 属性即可获得相同效果。

## 配色色板 / Color Palette

配色体系源自 [Claude 官网](https://claude.com/product/overview) 公开 CSS 中的 swatch 变量。

### Gray Scale

| 变量 | 色值 | 色块 |
|------|------|------|
| `--swatch-gray-050` | `#faf9f5` | ![](https://img.shields.io/badge/_-faf9f5?style=flat&label=&labelColor=333) |
| `--swatch-gray-150` | `#f0eee6` | ![](https://img.shields.io/badge/_-f0eee6?style=flat&label=&labelColor=333) |
| `--swatch-gray-200` | `#e8e6dc` | ![](https://img.shields.io/badge/_-e8e6dc?style=flat&label=&labelColor=333) |
| `--swatch-gray-300` | `#d1cfc5` | ![](https://img.shields.io/badge/_-d1cfc5?style=flat&label=&labelColor=333) |
| `--swatch-gray-500` | `#87867f` | ![](https://img.shields.io/badge/_-87867f?style=flat&label=&labelColor=333) |
| `--swatch-gray-750` | `#30302e` | ![](https://img.shields.io/badge/_-30302e?style=flat&label=&labelColor=333) |
| `--swatch-gray-950` | `#141413` | ![](https://img.shields.io/badge/_-141413?style=flat&label=&labelColor=333) |

### Accent Colors

| 变量 | 色值 | 用途 |
|------|------|------|
| `--swatch-clay` | `#d97757` | 主强调色 / 주 강조색 / メインアクセント |
| `--swatch-clay-interactive` | `#c96442` | 悬停态 / hover / ホバー |
| `--swatch-oat` | `#e3dacc` | 暖底色调 / 따뜻한 배경 / あたたかい背景 |
| `--swatch-olive` | `#788c5d` | 绿色重点 / 녹색 / グリーン |
| `--swatch-cactus` | `#bcd1ca` | 薄荷清新 / 민트 / ミント |
| `--swatch-sky` | `#6a9bcc` | 蓝色重点 / 파랑 / ブルー |
| `--swatch-heather` | `#cbcadb` | 薰衣草灰 / 라벤더 / ラベンダー |
| `--swatch-fig` | `#c46686` | 玫瑰红 / 로즈 / ローズ |
| `--swatch-coral` | `#ebcece` | 柔和珊瑚 / 코랄 / コーラル |

### 语义映射

```css
--page:     var(--swatch-gray-050);  /* 页面背景 */
--ink:      var(--swatch-gray-950);  /* 文字颜色 */
--accent:   var(--swatch-clay);      /* 主强调色 */
--surface:  var(--swatch-gray-150);  /* 卡片表面 */
--line:     var(--swatch-gray-300);  /* 分割线 */
```

## 致谢 / Credits

- 配色灵感来自 [Claude](https://claude.com) 的公开 CSS
- 图标由 [Lucide](https://lucide.dev) 提供
- 3D 渲染由 [Three.js](https://threejs.org) 提供
- 字体由 [Inter](https://rsms.me/inter/) 提供
