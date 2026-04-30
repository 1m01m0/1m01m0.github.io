<div align="center">

# emo · GitHub Pages

**🇨🇳 中文 · 🇬🇧 English · 🇰🇷 한국어 · 🇯🇵 日本語**

<p>
  <a href="#zh">🇨🇳 中文</a> ·
  <a href="#en">🇬🇧 English</a> ·
  <a href="#ko">🇰🇷 한국어</a> ·
  <a href="#ja">🇯🇵 日本語</a>
</p>

</div>

---

> 域名 / Domain / 도메인 / ドメイン：**[emohomepage.ccwu.cc](https://emohomepage.ccwu.cc)**

---

<a id="zh"></a>

## 🇨🇳 中文

emo 的个人主页 — 零构建、零框架的纯静态网站。支持 8 种语言的 i18n、Canvas 粒子网络、3D 地球、终端打字机、项目筛选和滚动驱动交互，全部在浏览器端完成。

### 功能亮点

| 功能 | 说明 |
|------|------|
| 8 语言 i18n | 简体中文 / English / 한국어 / 日本語 / Deutsch / Español / Français / 繁體中文，语言偏好自动持久化到 `localStorage` |
| Canvas 粒子网络 | 首屏动态节点连线，响应鼠标位置（`data-tech-canvas`） |
| 3D 地球 | Three.js 驱动的小地球，可拖拽旋转（`data-globe-canvas`） |
| 终端打字机 | hero 区域模拟命令行动画（`data-typewriter`） |
| 实时指标 | 动态显示延迟 / 吞吐 / 可用率（`data-live`） |
| 数字递增 | 进入视口时从 0 计数到目标值（`data-count`） |
| 项目筛选 | AI / Web / Data 三类过滤 + 3D tilt 卡片（`data-filter` + `data-tilt`） |
| 滚动交互 | 进度条、视差、滚动渐现（`IntersectionObserver`） |
| 无障碍 | `aria-*`、语义标签、`prefers-reduced-motion` 全覆盖 |
| 零构建 | 没有 `package.json`，没有打包器，没有转译器 |

### 技术栈

| 层级 | 内容 |
|------|------|
| 页面 | HTML5 语义标签，单文件 |
| 样式 | CSS Custom Properties（Claude swatch 变量体系） |
| 交互 | 原生 JS，`data-*` 属性驱动，零第三方运行时依赖 |
| 图标 | [Lucide](https://lucide.dev/)（CDN 按需加载） |
| 3D | [Three.js](https://threejs.org/) r160（CDN，仅地球组件使用） |
| 字体 | Inter + 系统后备字体栈 |
| 部署 | GitHub Pages + CNAME 自定义域名 |

### 目录结构

```
.
├── index.html          # 单页应用，所有 section 内联
├── styles.css          # 全局样式 + CSS 变量调色板
├── script.js           # 交互逻辑 + 8 语言翻译表
├── CNAME               # 自定义域名
├── README.md
└── assets/
    ├── claude-workspace.png
    └── claude-workspace-source.svg
```

### 本地预览

```bash
python3 -m http.server 8080
# 或用浏览器直接打开 index.html
```

### 自定义指南

| 你想改 | 文件 | 做法 |
|--------|------|------|
| 名字、简介、链接、邮箱 | `index.html` | 修改 hero、section、footer 区域的文本 |
| 颜色主题 | `styles.css` `:root` 块 | 调整 `--swatch-*` 变量（见下方色板） |
| 翻译文本 | `script.js` `translations` 对象 | 修改或新增语言版本的翻译字符串 |

所有交互效果由 `data-*` HTML 属性控制（`data-tilt`、`data-filter`、`data-count` 等），新增元素只需复制对应属性即可获得相同效果。

### 配色色板

配色体系源自 [Claude 官网](https://claude.com/product/overview) 公开 CSS 中的 swatch 变量。

**Gray Scale**

| 变量 | 色值 |
|------|------|
| `--swatch-gray-050` | `#faf9f5` |
| `--swatch-gray-150` | `#f0eee6` |
| `--swatch-gray-200` | `#e8e6dc` |
| `--swatch-gray-300` | `#d1cfc5` |
| `--swatch-gray-500` | `#87867f` |
| `--swatch-gray-750` | `#30302e` |
| `--swatch-gray-950` | `#141413` |

**Accent Colors**

| 变量 | 色值 | 用途 |
|------|------|------|
| `--swatch-clay` | `#d97757` | 主强调色 |
| `--swatch-clay-interactive` | `#c96442` | 悬停态 |
| `--swatch-oat` | `#e3dacc` | 暖底色调 |
| `--swatch-olive` | `#788c5d` | 绿色重点 |
| `--swatch-cactus` | `#bcd1ca` | 薄荷清新 |
| `--swatch-sky` | `#6a9bcc` | 蓝色重点 |
| `--swatch-heather` | `#cbcadb` | 薰衣草灰 |
| `--swatch-fig` | `#c46686` | 玫瑰红 |
| `--swatch-coral` | `#ebcece` | 柔和珊瑚 |

**语义映射**

```css
--page:     var(--swatch-gray-050);  /* 页面背景 */
--ink:      var(--swatch-gray-950);  /* 文字颜色 */
--accent:   var(--swatch-clay);      /* 主强调色 */
--surface:  var(--swatch-gray-150);  /* 卡片表面 */
--line:     var(--swatch-gray-300);  /* 分割线 */
```

### 致谢

- 配色灵感来自 [Claude](https://claude.com) 的公开 CSS
- 图标由 [Lucide](https://lucide.dev) 提供
- 3D 渲染由 [Three.js](https://threejs.org) 提供
- 字体由 [Inter](https://rsms.me/inter/) 提供

---

<a id="en"></a>

## 🇬🇧 English

emo's personal homepage — a zero-build, zero-framework static site. Eight-language i18n, Canvas particle network, 3D globe, terminal typewriter, project filtering, and scroll-driven interactions — all running natively in the browser.

### Features

| Feature | Description |
|---------|-------------|
| 8-language i18n | 简体中文 / English / 한국어 / 日本語 / Deutsch / Español / Français / 繁體中文, with persistent language preference in `localStorage` |
| Canvas particle network | Dynamic node connections in the hero area, responding to mouse position (`data-tech-canvas`) |
| 3D globe | Three.js-powered globe with drag-to-rotate (`data-globe-canvas`) |
| Terminal typewriter | Simulated CLI animation in the hero area (`data-typewriter`) |
| Live metrics | Real-time latency / throughput / uptime display (`data-live`) |
| Count-up animation | Numbers animate from zero as they scroll into view (`data-count`) |
| Project filtering | AI / Web / Data category filters with 3D tilt cards (`data-filter` + `data-tilt`) |
| Scroll interactions | Progress bar, parallax, scroll-triggered reveals (`IntersectionObserver`) |
| Accessibility | `aria-*` attributes, semantic markup, `prefers-reduced-motion` support |
| Zero build | No `package.json`, no bundler, no transpiler |

### Tech Stack

| Layer | Details |
|-------|---------|
| Markup | HTML5 semantic elements, single file |
| Styling | CSS Custom Properties (Claude swatch variable system) |
| Scripting | Vanilla JS, `data-*` attribute-driven, zero third-party runtime dependencies |
| Icons | [Lucide](https://lucide.dev/) (lazy-loaded via CDN) |
| 3D | [Three.js](https://threejs.org/) r160 (CDN, used only for the globe) |
| Typography | Inter + system fallback font stack |
| Deployment | GitHub Pages with CNAME custom domain |

### Directory Structure

```
.
├── index.html          # Single-page app, all sections inline
├── styles.css          # Global styles + CSS variable palette
├── script.js           # Interaction logic + 8-language translation table
├── CNAME               # Custom domain
├── README.md
└── assets/
    ├── claude-workspace.png
    └── claude-workspace-source.svg
```

### Local Preview

```bash
python3 -m http.server 8080
# Or open index.html directly in a browser
```

### Customization Guide

| What to change | File | How |
|----------------|------|-----|
| Name, bio, links, email | `index.html` | Edit text content in the hero, section, and footer areas |
| Color theme | `styles.css` `:root` block | Adjust `--swatch-*` variables (see palette below) |
| Translation strings | `script.js` `translations` object | Add or modify translation entries for any locale |

All interactive effects are controlled by `data-*` HTML attributes (`data-tilt`, `data-filter`, `data-count`, etc.). Copy the corresponding attributes to new elements to get the same effects.

### Color Palette

Palette derived from the public CSS of the [Claude](https://claude.com/product/overview) website.

**Gray Scale**

| Variable | Hex |
|----------|-----|
| `--swatch-gray-050` | `#faf9f5` |
| `--swatch-gray-150` | `#f0eee6` |
| `--swatch-gray-200` | `#e8e6dc` |
| `--swatch-gray-300` | `#d1cfc5` |
| `--swatch-gray-500` | `#87867f` |
| `--swatch-gray-750` | `#30302e` |
| `--swatch-gray-950` | `#141413` |

**Accent Colors**

| Variable | Hex | Role |
|----------|-----|------|
| `--swatch-clay` | `#d97757` | Primary accent |
| `--swatch-clay-interactive` | `#c96442` | Hover / active state |
| `--swatch-oat` | `#e3dacc` | Warm background |
| `--swatch-olive` | `#788c5d` | Green accent |
| `--swatch-cactus` | `#bcd1ca` | Mint accent |
| `--swatch-sky` | `#6a9bcc` | Blue accent |
| `--swatch-heather` | `#cbcadb` | Lavender gray |
| `--swatch-fig` | `#c46686` | Rose accent |
| `--swatch-coral` | `#ebcece` | Soft coral |

**Semantic Aliases**

```css
--page:     var(--swatch-gray-050);  /* Page background */
--ink:      var(--swatch-gray-950);  /* Text color */
--accent:   var(--swatch-clay);      /* Primary accent */
--surface:  var(--swatch-gray-150);  /* Card surface */
--line:     var(--swatch-gray-300);  /* Divider */
```

### Credits

- Color palette inspired by [Claude](https://claude.com)'s public CSS
- Icons by [Lucide](https://lucide.dev)
- 3D rendering by [Three.js](https://threejs.org)
- Typography by [Inter](https://rsms.me/inter/)

---

<a id="ko"></a>

## 🇰🇷 한국어

emo의 개인 홈페이지 — 빌드 도구나 프레임워크 없이 순수한 정적 사이트로 제작되었습니다. 8개 언어 국제화(i18n), Canvas 파티클 네트워크, 3D 지구본, 터미널 타자기 효과, 프로젝트 필터링 및 스크롤 기반 인터랙션을 모두 브라우저에서 실행합니다.

### 주요 기능

| 기능 | 설명 |
|------|------|
| 8개 언어 i18n | 简体中文 / English / 한국어 / 日本語 / Deutsch / Español / Français / 繁體中文, `localStorage`에 언어 설정 유지 |
| Canvas 파티클 네트워크 | 마우스 움직임에 반응하는 동적 노드 연결 (`data-tech-canvas`) |
| 3D 지구본 | Three.js 기반, 드래그로 회전 가능 (`data-globe-canvas`) |
| 터미널 타자기 | hero 영역의 CLI 애니메이션 시뮬레이션 (`data-typewriter`) |
| 실시간 지표 | 지연 시간 / 처리량 / 가동률 실시간 표시 (`data-live`) |
| 숫자 증가 애니메이션 | 화면에 나타나면 0부터 목표값까지 카운트 (`data-count`) |
| 프로젝트 필터링 | AI / Web / Data 카테고리 필터 + 3D 틸트 카드 (`data-filter` + `data-tilt`) |
| 스크롤 인터랙션 | 진행 표시줄, 패럴랙스, 스크롤 시 페이드인 (`IntersectionObserver`) |
| 접근성 | `aria-*` 속성, 시맨틱 마크업, `prefers-reduced-motion` 지원 |
| 제로 빌드 | `package.json`, 번들러, 트랜스파일러 없음 |

### 기술 스택

| 계층 | 내용 |
|------|------|
| 마크업 | HTML5 시맨틱 요소, 단일 파일 |
| 스타일 | CSS Custom Properties (Claude swatch 변수 체계) |
| 스크립트 | Vanilla JS, `data-*` 속성 기반, 서드파티 런타임 종속성 없음 |
| 아이콘 | [Lucide](https://lucide.dev/) (CDN 지연 로딩) |
| 3D | [Three.js](https://threejs.org/) r160 (CDN, 지구본에만 사용) |
| 타이포그래피 | Inter + 시스템 대체 폰트 |
| 배포 | GitHub Pages + CNAME 커스텀 도메인 |

### 디렉토리 구조

```
.
├── index.html          # 단일 페이지, 모든 섹션 내장
├── styles.css          # 전역 스타일 + CSS 변수 팔레트
├── script.js           # 인터랙션 로직 + 8개 언어 번역 테이블
├── CNAME               # 커스텀 도메인
├── README.md
└── assets/
    ├── claude-workspace.png
    └── claude-workspace-source.svg
```

### 로컬 미리보기

```bash
python3 -m http.server 8080
# 또는 브라우저에서 index.html 직접 열기
```

### 커스터마이징 가이드

| 변경할 항목 | 파일 | 방법 |
|-------------|------|------|
| 이름, 소개, 링크, 이메일 | `index.html` | hero, section, footer 영역의 텍스트 수정 |
| 컬러 테마 | `styles.css` `:root` 블록 | `--swatch-*` 변수 조정 (아래 팔레트 참조) |
| 번역 문자열 | `script.js` `translations` 객체 | 원하는 언어의 번역 항목 추가/수정 |

모든 인터랙션 효과는 `data-*` HTML 속성(`data-tilt`, `data-filter`, `data-count` 등)으로 제어됩니다. 새 요소에 해당 속성을 복사하면 동일한 효과를 적용할 수 있습니다.

### 컬러 팔레트

[Claude 웹사이트](https://claude.com/product/overview)의 공개 CSS에서 파생된 팔레트입니다.

**Gray Scale**

| 변수 | 색상 값 |
|------|---------|
| `--swatch-gray-050` | `#faf9f5` |
| `--swatch-gray-150` | `#f0eee6` |
| `--swatch-gray-200` | `#e8e6dc` |
| `--swatch-gray-300` | `#d1cfc5` |
| `--swatch-gray-500` | `#87867f` |
| `--swatch-gray-750` | `#30302e` |
| `--swatch-gray-950` | `#141413` |

**Accent Colors**

| 변수 | 색상 값 | 용도 |
|------|---------|------|
| `--swatch-clay` | `#d97757` | 주요 강조색 |
| `--swatch-clay-interactive` | `#c96442` | 호버 / 활성 상태 |
| `--swatch-oat` | `#e3dacc` | 따뜻한 배경 |
| `--swatch-olive` | `#788c5d` | 그린 포인트 |
| `--swatch-cactus` | `#bcd1ca` | 민트 포인트 |
| `--swatch-sky` | `#6a9bcc` | 블루 포인트 |
| `--swatch-heather` | `#cbcadb` | 라벤더 그레이 |
| `--swatch-fig` | `#c46686` | 로즈 포인트 |
| `--swatch-coral` | `#ebcece` | 소프트 코랄 |

**시맨틱 별칭**

```css
--page:     var(--swatch-gray-050);  /* 페이지 배경 */
--ink:      var(--swatch-gray-950);  /* 텍스트 색상 */
--accent:   var(--swatch-clay);      /* 주요 강조색 */
--surface:  var(--swatch-gray-150);  /* 카드 표면 */
--line:     var(--swatch-gray-300);  /* 구분선 */
```

### 크레딧

- 컬러 팔레트는 [Claude](https://claude.com)의 공개 CSS에서 영감을 받았습니다
- 아이콘: [Lucide](https://lucide.dev)
- 3D 렌더링: [Three.js](https://threejs.org)
- 타이포그래피: [Inter](https://rsms.me/inter/)

---

<a id="ja"></a>

## 🇯🇵 日本語

emo の個人ホームページ — ビルドツールやフレームワークを一切使わない純粋な静的サイトです。8 言語の国際化、Canvas パーティクルネットワーク、3D 地球儀、ターミナル風タイプライター、プロジェクトフィルタリング、スクロール連動インタラクションをすべてブラウザ上で実行します。

### 主な機能

| 機能 | 説明 |
|------|------|
| 8 言語 i18n | 简体中文 / English / 한국어 / 日本語 / Deutsch / Español / Français / 繁體中文、言語設定は `localStorage` に保持 |
| Canvas パーティクルネットワーク | マウスの動きに反応する動的ノード接続 (`data-tech-canvas`) |
| 3D 地球儀 | Three.js 製、ドラッグで回転可能 (`data-globe-canvas`) |
| ターミナルタイプライター | hero エリアの CLI 風アニメーション (`data-typewriter`) |
| リアルタイム指標 | レイテンシ / スループット / 稼働率の動的表示 (`data-live`) |
| カウントアップアニメーション | 画面表示時に 0 から目標値までカウント (`data-count`) |
| プロジェクトフィルター | AI / Web / Data カテゴリフィルター + 3D チルトカード (`data-filter` + `data-tilt`) |
| スクロールインタラクション | プログレスバー、パララックス、スクロール連動フェードイン (`IntersectionObserver`) |
| アクセシビリティ | `aria-*` 属性、セマンティックマークアップ、`prefers-reduced-motion` 対応 |
| ゼロビルド | `package.json` なし、バンドラーなし、トランスパイラなし |

### 技術スタック

| 層 | 内容 |
|------|------|
| マークアップ | HTML5 セマンティック要素、単一ファイル |
| スタイル | CSS Custom Properties (Claude swatch 変数体系) |
| スクリプト | Vanilla JS、`data-*` 属性駆動、サードパーティランタイム依存なし |
| アイコン | [Lucide](https://lucide.dev/) (CDN 経由の遅延ロード) |
| 3D | [Three.js](https://threejs.org/) r160 (CDN、地球儀のみに使用) |
| タイポグラフィ | Inter + システムフォールバックフォント |
| デプロイ | GitHub Pages + CNAME カスタムドメイン |

### ディレクトリ構成

```
.
├── index.html          # 単一ページ、全セクションを内包
├── styles.css          # グローバルスタイル + CSS 変数パレット
├── script.js           # インタラクションロジック + 8 言語翻訳テーブル
├── CNAME               # カスタムドメイン
├── README.md
└── assets/
    ├── claude-workspace.png
    └── claude-workspace-source.svg
```

### ローカルプレビュー

```bash
python3 -m http.server 8080
# またはブラウザで index.html を直接開く
```

### カスタマイズガイド

| 変更したい項目 | ファイル | 方法 |
|----------------|----------|------|
| 名前、自己紹介、リンク、メール | `index.html` | hero、section、footer 領域のテキストを編集 |
| カラーテーマ | `styles.css` `:root` ブロック | `--swatch-*` 変数を調整 (下記パレット参照) |
| 翻訳文字列 | `script.js` `translations` オブジェクト | 任意の言語の翻訳エントリを追加・修正 |

すべてのインタラクション効果は `data-*` HTML 属性 (`data-tilt`、`data-filter`、`data-count` など) によって制御されます。新しい要素に対応する属性をコピーするだけで同じ効果が得られます。

### カラーパレット

[Claude ウェブサイト](https://claude.com/product/overview)の公開 CSS から抽出したパレットです。

**Gray Scale**

| 変数 | カラーコード |
|------|-------------|
| `--swatch-gray-050` | `#faf9f5` |
| `--swatch-gray-150` | `#f0eee6` |
| `--swatch-gray-200` | `#e8e6dc` |
| `--swatch-gray-300` | `#d1cfc5` |
| `--swatch-gray-500` | `#87867f` |
| `--swatch-gray-750` | `#30302e` |
| `--swatch-gray-950` | `#141413` |

**Accent Colors**

| 変数 | カラーコード | 用途 |
|------|-------------|------|
| `--swatch-clay` | `#d97757` | メインアクセント |
| `--swatch-clay-interactive` | `#c96442` | ホバー / アクティブ状態 |
| `--swatch-oat` | `#e3dacc` | 暖かい背景 |
| `--swatch-olive` | `#788c5d` | グリーンアクセント |
| `--swatch-cactus` | `#bcd1ca` | ミントアクセント |
| `--swatch-sky` | `#6a9bcc` | ブルーアクセント |
| `--swatch-heather` | `#cbcadb` | ラベンダーグレー |
| `--swatch-fig` | `#c46686` | ローズアクセント |
| `--swatch-coral` | `#ebcece` | ソフトコーラル |

**セマンティックエイリアス**

```css
--page:     var(--swatch-gray-050);  /* ページ背景 */
--ink:      var(--swatch-gray-950);  /* テキスト色 */
--accent:   var(--swatch-clay);      /* メインアクセント */
--surface:  var(--swatch-gray-150);  /* カード表面 */
--line:     var(--swatch-gray-300);  /* 区切り線 */
```

### クレジット

- カラーパレットは [Claude](https://claude.com) の公開 CSS から着想を得ました
- アイコン: [Lucide](https://lucide.dev)
- 3D レンダリング: [Three.js](https://threejs.org)
- タイポグラフィ: [Inter](https://rsms.me/inter/)
