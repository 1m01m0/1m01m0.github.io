const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const year = document.querySelector("[data-year]");
const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll("[data-category]");
const copyButton = document.querySelector("[data-copy]");
const hero = document.querySelector("[data-hero]");
const root = document.documentElement;
const scrollProgress = document.querySelector("[data-scroll-progress]");
const techCanvas = document.querySelector("[data-tech-canvas]");
const typewriter = document.querySelector("[data-typewriter]");
const liveValues = document.querySelectorAll("[data-live]");
const tiltItems = document.querySelectorAll("[data-tilt]");
const magneticItems = document.querySelectorAll(".button");
const revealItems = document.querySelectorAll(
  ".section-heading, .filter-bar, .project-card, .note-item, .stack-column, .contact-section > *, .site-footer"
);
const countItems = document.querySelectorAll("[data-count]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (year) {
  year.textContent = new Date().getFullYear();
}

if (window.lucide) {
  window.lucide.createIcons();
}

const updateScrollProgress = () => {
  if (!scrollProgress) return;

  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? window.scrollY / max : 0;
  root.style.setProperty("--scroll-progress", progress.toFixed(4));
};

updateScrollProgress();
window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  document.body.classList.toggle("nav-open", Boolean(isOpen));
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  navToggle.innerHTML = isOpen ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';

  if (window.lucide) {
    window.lucide.createIcons();
  }
});

nav?.addEventListener("click", (event) => {
  const target = event.target;

  if (target instanceof HTMLAnchorElement) {
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    navToggle?.setAttribute("aria-expanded", "false");
    if (navToggle) {
      navToggle.innerHTML = '<i data-lucide="menu"></i>';
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter || "all";

    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    projectCards.forEach((card) => {
      card.classList.toggle("is-hidden", filter !== "all" && card.dataset.category !== filter);
    });
  });
});

if (!reduceMotion && hero) {
  window.addEventListener(
    "pointermove",
    (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 18;
      const y = (event.clientY / window.innerHeight - 0.5) * 14;

      hero.style.setProperty("--motion-x", `${x}px`);
      hero.style.setProperty("--motion-y", `${y}px`);
    },
    { passive: true }
  );
}

const commands = [
  "npm run ship -- --pages",
  "node agents/evaluate.mjs --trace",
  "pnpm test:e2e && git push",
  "deploy --target github-pages --palette claude"
];

const runTypewriter = () => {
  if (!typewriter || reduceMotion) return;

  let commandIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const command = commands[commandIndex];
    typewriter.textContent = command.slice(0, charIndex);

    if (!deleting && charIndex < command.length) {
      charIndex += 1;
      window.setTimeout(tick, 46);
      return;
    }

    if (!deleting && charIndex === command.length) {
      deleting = true;
      window.setTimeout(tick, 1200);
      return;
    }

    if (deleting && charIndex > 0) {
      charIndex -= 1;
      window.setTimeout(tick, 22);
      return;
    }

    deleting = false;
    commandIndex = (commandIndex + 1) % commands.length;
    window.setTimeout(tick, 240);
  };

  tick();
};

runTypewriter();

if (!reduceMotion && liveValues.length) {
  window.setInterval(() => {
    liveValues.forEach((item) => {
      const type = item.dataset.live;

      if (type === "latency") {
        item.textContent = String(22 + Math.round(Math.random() * 18));
      }

      if (type === "tokens") {
        item.textContent = (10 + Math.random() * 6).toFixed(1);
      }

      if (type === "uptime") {
        item.textContent = (99.5 + Math.random() * 0.4).toFixed(1);
      }
    });
  }, 900);
}

tiltItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    if (reduceMotion) return;

    const rect = item.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    item.classList.add("is-tilting");
    item.style.setProperty("--tilt-x", `${(-y * 7).toFixed(2)}deg`);
    item.style.setProperty("--tilt-y", `${(x * 9).toFixed(2)}deg`);
  });

  item.addEventListener("pointerleave", () => {
    item.classList.remove("is-tilting");
    item.style.setProperty("--tilt-x", "0deg");
    item.style.setProperty("--tilt-y", "0deg");
  });
});

magneticItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    if (reduceMotion) return;

    const rect = item.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.18;

    item.style.setProperty("--magnet-x", `${x.toFixed(2)}px`);
    item.style.setProperty("--magnet-y", `${y.toFixed(2)}px`);
  });

  item.addEventListener("pointerleave", () => {
    item.style.setProperty("--magnet-x", "0px");
    item.style.setProperty("--magnet-y", "0px");
  });
});

const startCanvas = () => {
  if (!techCanvas || reduceMotion) return;

  const ctx = techCanvas.getContext("2d");
  if (!ctx) return;

  const styles = getComputedStyle(root);
  const colors = [
    styles.getPropertyValue("--swatch-clay").trim(),
    styles.getPropertyValue("--swatch-olive").trim(),
    styles.getPropertyValue("--swatch-sky").trim(),
    styles.getPropertyValue("--swatch-fig").trim()
  ];
  const lineColor = styles.getPropertyValue("--swatch-gray-500").trim();
  const pointer = { x: 0, y: 0, active: false };
  let points = [];
  let width = 0;
  let height = 0;
  let frame = 0;

  const resize = () => {
    const rect = techCanvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    techCanvas.width = Math.round(width * dpr);
    techCanvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.max(26, Math.min(72, Math.floor(width / 22)));
    points = Array.from({ length: count }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.34,
      vy: (Math.random() - 0.5) * 0.34,
      size: 1.8 + Math.random() * 2.6,
      color: colors[index % colors.length]
    }));
  };

  const movePointer = (event) => {
    const rect = techCanvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = true;
  };

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", movePointer, { passive: true });
  window.addEventListener("pointerleave", () => {
    pointer.active = false;
  });

  const draw = () => {
    frame = requestAnimationFrame(draw);
    ctx.clearRect(0, 0, width, height);

    points.forEach((point) => {
      if (pointer.active) {
        const dx = pointer.x - point.x;
        const dy = pointer.y - point.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 180 && distance > 0) {
          point.vx -= (dx / distance) * 0.004;
          point.vy -= (dy / distance) * 0.004;
        }
      }

      point.x += point.vx;
      point.y += point.vy;
      point.vx *= 0.995;
      point.vy *= 0.995;

      if (point.x < 0 || point.x > width) point.vx *= -1;
      if (point.y < 0 || point.y > height) point.vy *= -1;

      point.x = Math.max(0, Math.min(width, point.x));
      point.y = Math.max(0, Math.min(height, point.y));
    });

    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const a = points[i];
        const b = points[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);

        if (distance < 118) {
          ctx.globalAlpha = (1 - distance / 118) * 0.34;
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    points.forEach((point) => {
      ctx.globalAlpha = 0.72;
      ctx.fillStyle = point.color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
  };

  resize();
  draw();

  window.addEventListener("pagehide", () => cancelAnimationFrame(frame));
};

startCanvas();

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -4% 0px", threshold: 0.01 }
  );

  revealItems.forEach((item, index) => {
    item.classList.add("will-reveal");
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const animateCount = (item) => {
  const target = Number(item.dataset.count);
  if (!Number.isFinite(target)) return;

  const suffix = item.dataset.suffix || "";
  const duration = reduceMotion ? 1 : 820;
  const start = performance.now();

  item.textContent = `0${suffix}`;

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - (1 - progress) ** 3;
    item.textContent = `${Math.round(target * eased)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

if ("IntersectionObserver" in window) {
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
  );

  countItems.forEach((item) => {
    countObserver.observe(item);
  });
} else {
  countItems.forEach(animateCount);
}

copyButton?.addEventListener("click", async () => {
  const value = copyButton.dataset.copy;
  if (!value) return;

  try {
    await navigator.clipboard.writeText(value);
    const t = translations[currentLang] || translations.zh;
    copyButton.querySelector("span").textContent = t["contact.copied"];
    window.setTimeout(() => {
      copyButton.querySelector("span").textContent = t["contact.copy"];
    }, 1400);
  } catch {
    window.location.href = `mailto:${value}`;
  }
});

// ── i18n ──
const translations = {
  zh: {
    "nav.lab": "实验室",
    "nav.work": "项目",
    "nav.notes": "写作",
    "nav.stack": "工具箱",
    "nav.contact": "联系",
    "hero.eyebrow": "NJTECH / 南京工业大学",
    "hero.lede": "我来自南京工业大学（NJTECH），把复杂问题拆成清晰的系统、可运行的产品和耐读的文字。这里收藏我近期的项目、研究笔记与开源实验。",
    "hero.cta": "查看项目",
    "intro.text": "南京工业大学（NJTECH）学生，关注 AI 应用、全栈工程、数据产品与开发者体验。喜欢把模糊的想法整理成稳定的接口、克制的界面和可以复用的文档。",
    "stats.projects": "项目原型",
    "stats.notes": "技术笔记",
    "stats.research": "研究方向",
    "lab.title": "会动的技术展示台",
    "lab.desc": "实时 Canvas、滚动触发、3D hover、动态指标和命令行打字，全都在这个静态页面里完成。",
    "work.title": "近期项目",
    "filter.all": "全部",
    "card.qa.title": "知识库问答工作台",
    "card.qa.desc": "面向团队文档的检索、引用和答案审校流程，把模型输出收束进可追踪的工作流。",
    "card.qa.link": "查看仓库",
    "card.ds.title": "设计系统实验室",
    "card.ds.desc": "一套轻量组件、主题变量和可访问性校验页面，用来快速验证产品界面想法。",
    "card.ds.link": "查看仓库",
    "card.dash.title": "个人指标仪表盘",
    "card.dash.desc": "把阅读、训练、写作和代码活动整合到一个本地优先的分析界面。",
    "card.dash.link": "查看仓库",
    "notes.title": "最近在想",
    "note.1": "从提示词到产品协议：让 AI 功能更稳定的三个层次",
    "note.2": "为什么好的内部工具应该更像编辑器，而不是表单集合",
    "note.3": "用小型数据产品记录长期生活，而不是追踪短期波动",
    "stack.title": "工具箱",
    "contact.title": "一起做点有意思的东西。",
    "contact.copy": "复制邮箱",
    "contact.copied": "已复制",
    "footer.palette": "Palette from Claude by Anthropic",
    "aria.brand": "回到首页"
  },
  en: {
    "nav.lab": "Lab",
    "nav.work": "Work",
    "nav.notes": "Notes",
    "nav.stack": "Stack",
    "nav.contact": "Contact",
    "hero.eyebrow": "NJTECH / Nanjing Tech University",
    "hero.lede": "Based at Nanjing Tech University (NJTECH), I break complex problems into clear systems, shippable products, and readable writing. This is where I collect recent projects, research notes, and open-source experiments.",
    "hero.cta": "View Projects",
    "intro.text": "Student at Nanjing Tech University (NJTECH), focused on AI applications, full-stack engineering, data products, and developer experience. I enjoy turning vague ideas into stable interfaces, restrained UIs, and reusable documentation.",
    "stats.projects": "Prototypes",
    "stats.notes": "Tech Notes",
    "stats.research": "Research Areas",
    "lab.title": "Living Tech Showcase",
    "lab.desc": "Real-time Canvas, scroll triggers, 3D hover, live metrics, and a typing CLI — all done inside this static page.",
    "work.title": "Recent Projects",
    "filter.all": "All",
    "card.qa.title": "Knowledge Base Q&A Workbench",
    "card.qa.desc": "Retrieval, citation, and answer review flow for team documentation — funneling model output into a traceable workflow.",
    "card.qa.link": "View Repo",
    "card.ds.title": "Design System Lab",
    "card.ds.desc": "A lightweight component library, theme variables, and accessibility audit pages for rapidly validating product UI ideas.",
    "card.ds.link": "View Repo",
    "card.dash.title": "Personal Metrics Dashboard",
    "card.dash.desc": "Unifying reading, training, writing, and code activity into a local-first analytics interface.",
    "card.dash.link": "View Repo",
    "notes.title": "On My Mind",
    "note.1": "From Prompts to Product Protocols: Three Levels of Stability for AI Features",
    "note.2": "Why Good Internal Tools Should Feel Like Editors, Not Form Collections",
    "note.3": "Using Small Data Products to Track Long-Term Life, Not Short-Term Fluctuations",
    "stack.title": "Toolbox",
    "contact.title": "Let's build something interesting.",
    "contact.copy": "Copy Email",
    "contact.copied": "Copied",
    "footer.palette": "Palette from Claude by Anthropic",
    "aria.brand": "Back to top"
  },
  ko: {
    "nav.lab": "실험실",
    "nav.work": "프로젝트",
    "nav.notes": "글쓰기",
    "nav.stack": "도구",
    "nav.contact": "연락",
    "hero.eyebrow": "NJTECH / 난징공업대학교",
    "hero.lede": "난징공업대학교(NJTECH)에서 복잡한 문제를 명확한 시스템, 실행 가능한 제품, 읽기 쉬운 글로 풀어냅니다. 여기에는 최근 프로젝트, 연구 노트, 오픈소스 실험을 모아두었습니다.",
    "hero.cta": "프로젝트 보기",
    "intro.text": "난징공업대학교(NJTECH) 학생으로 AI 응용, 풀스택 엔지니어링, 데이터 제품, 개발자 경험에 집중합니다. 모호한 아이디어를 안정적인 인터페이스, 절제된 UI, 재사용 가능한 문서로 정리하는 것을 좋아합니다.",
    "stats.projects": "프로토타입",
    "stats.notes": "기술 노트",
    "stats.research": "연구 분야",
    "lab.title": "살아있는 기술 쇼케이스",
    "lab.desc": "실시간 Canvas, 스크롤 트리거, 3D 호버, 라이브 지표, 타이핑 CLI — 모두 이 정적 페이지에서 구현되었습니다.",
    "work.title": "최근 프로젝트",
    "filter.all": "전체",
    "card.qa.title": "지식 베이스 Q&A 워크벤치",
    "card.qa.desc": "팀 문서를 위한 검색, 인용, 답변 검토 흐름 — 모델 출력을 추적 가능한 워크플로우로 집약합니다.",
    "card.qa.link": "저장소 보기",
    "card.ds.title": "디자인 시스템 랩",
    "card.ds.desc": "제품 UI 아이디어를 빠르게 검증하기 위한 경량 컴포넌트, 테마 변수, 접근성 감사 페이지.",
    "card.ds.link": "저장소 보기",
    "card.dash.title": "개인 지표 대시보드",
    "card.dash.desc": "독서, 훈련, 글쓰기, 코드 활동을 로컬 우선 분석 인터페이스로 통합합니다.",
    "card.dash.link": "저장소 보기",
    "notes.title": "최근 생각",
    "note.1": "프롬프트에서 제품 프로토콜로: AI 기능을 더 안정적으로 만드는 세 가지 레벨",
    "note.2": "좋은 내부 도구가 폼 모음이 아닌 에디터처럼 느껴져야 하는 이유",
    "note.3": "단기 변동이 아닌 장기적 삶을 추적하기 위한 소형 데이터 제품 활용",
    "stack.title": "도구 상자",
    "contact.title": "함께 흥미로운 것을 만들어봐요.",
    "contact.copy": "이메일 복사",
    "contact.copied": "복사됨",
    "footer.palette": "Palette from Claude by Anthropic",
    "aria.brand": "맨 위로"
  },
  ja: {
    "nav.lab": "ラボ",
    "nav.work": "プロジェクト",
    "nav.notes": "執筆",
    "nav.stack": "ツール",
    "nav.contact": "連絡",
    "hero.eyebrow": "NJTECH / 南京工業大学",
    "hero.lede": "南京工業大学（NJTECH）で、複雑な問題を明確なシステム、実行可能なプロダクト、読みやすい文章に変換しています。最近のプロジェクト、研究ノート、オープンソース実験を掲載しています。",
    "hero.cta": "プロジェクトを見る",
    "intro.text": "南京工業大学（NJTECH）の学生として、AIアプリ、フルスタックエンジニアリング、データプロダクト、開発者体験に注力しています。漠然としたアイデアを安定したインターフェース、簡潔なUI、再利用可能なドキュメントに整理することが好きです。",
    "stats.projects": "プロトタイプ",
    "stats.notes": "技術ノート",
    "stats.research": "研究分野",
    "lab.title": "動くテック展示台",
    "lab.desc": "リアルタイムCanvas、スクロールトリガー、3Dホバー、ライブメトリクス、タイピングCLI — すべてこの静的ページで実現。",
    "work.title": "最近のプロジェクト",
    "filter.all": "すべて",
    "card.qa.title": "ナレッジベースQ&Aワークベンチ",
    "card.qa.desc": "チームドキュメントの検索・引用・回答レビューフロー。モデル出力を追跡可能なワークフローに集約します。",
    "card.qa.link": "リポジトリを見る",
    "card.ds.title": "デザインシステムラボ",
    "card.ds.desc": "製品UIアイデアを素早く検証するための軽量コンポーネント、テーマ変数、アクセシビリティ検証ページ。",
    "card.ds.link": "リポジトリを見る",
    "card.dash.title": "個人メトリクスダッシュボード",
    "card.dash.desc": "読書・トレーニング・執筆・コード活動をローカルファーストの分析インターフェースに統合。",
    "card.dash.link": "リポジトリを見る",
    "notes.title": "最近考えていること",
    "note.1": "プロンプトからプロダクトプロトコルへ：AI機能を安定させる3つのレベル",
    "note.2": "優れた社内ツールがフォームではなくエディタのように感じるべき理由",
    "note.3": "短期的な変動ではなく長期的な生活を記録するための小さなデータプロダクト",
    "stack.title": "ツールボックス",
    "contact.title": "一緒に面白いものを作りましょう。",
    "contact.copy": "メールをコピー",
    "contact.copied": "コピーしました",
    "footer.palette": "Palette from Claude by Anthropic",
    "aria.brand": "トップへ戻る"
  },
  de: {
    "nav.lab": "Labor",
    "nav.work": "Projekte",
    "nav.notes": "Schreiben",
    "nav.stack": "Werkzeuge",
    "nav.contact": "Kontakt",
    "hero.eyebrow": "NJTECH / Nanjing Tech University",
    "hero.lede": "An der Nanjing Tech University (NJTECH) übersetze ich komplexe Probleme in klare Systeme, lauffähige Produkte und lesbare Texte. Hier sammle ich aktuelle Projekte, Forschungsnotizen und Open-Source-Experimente.",
    "hero.cta": "Projekte ansehen",
    "intro.text": "Student an der Nanjing Tech University (NJTECH) mit Fokus auf KI-Anwendungen, Full-Stack-Engineering, Datenprodukte und Entwicklererfahrung. Ich verwandle vage Ideen gerne in stabile Interfaces, reduzierte UIs und wiederverwendbare Dokumentation.",
    "stats.projects": "Prototypen",
    "stats.notes": "Tech-Notizen",
    "stats.research": "Forschungsgebiete",
    "lab.title": "Lebendiges Tech-Schaufenster",
    "lab.desc": "Echtzeit-Canvas, Scroll-Trigger, 3D-Hover, Live-Metriken und eine tippende CLI — alles in dieser statischen Seite.",
    "work.title": "Aktuelle Projekte",
    "filter.all": "Alle",
    "card.qa.title": "Wissensbasis-Q&A-Werkbank",
    "card.qa.desc": "Such-, Zitat- und Antwortprüfungsablauf für Teamdokumente — Modellausgaben in einen nachverfolgbaren Workflow bündeln.",
    "card.qa.link": "Repo ansehen",
    "card.ds.title": "Design-System-Labor",
    "card.ds.desc": "Leichte Komponenten, Themenvariablen und Barrierefreiheitsprüfseiten zum schnellen Validieren von Produkt-UI-Ideen.",
    "card.ds.link": "Repo ansehen",
    "card.dash.title": "Persönliches Metriken-Dashboard",
    "card.dash.desc": "Lese-, Trainings-, Schreib- und Code-Aktivitäten in einem lokal-first Analyse-Interface vereinen.",
    "card.dash.link": "Repo ansehen",
    "notes.title": "Aktuelle Gedanken",
    "note.1": "Von Prompts zu Produktprotokollen: Drei Ebenen für stabilere KI-Funktionen",
    "note.2": "Warum gute interne Tools eher wie Editoren aussehen sollten als wie Formularsammlungen",
    "note.3": "Kleine Datenprodukte für langfristige Lebensaufzeichnung statt kurzfristiger Schwankungen",
    "stack.title": "Werkzeugkasten",
    "contact.title": "Lass uns etwas Interessantes bauen.",
    "contact.copy": "E-Mail kopieren",
    "contact.copied": "Kopiert",
    "footer.palette": "Palette from Claude by Anthropic",
    "aria.brand": "Zurück zum Anfang"
  },
  es: {
    "nav.lab": "Laboratorio",
    "nav.work": "Proyectos",
    "nav.notes": "Escritura",
    "nav.stack": "Herramientas",
    "nav.contact": "Contacto",
    "hero.eyebrow": "NJTECH / Universidad de Tecnología de Nanjing",
    "hero.lede": "En la Universidad de Tecnología de Nanjing (NJTECH), convierto problemas complejos en sistemas claros, productos funcionales y textos legibles. Aquí guardo proyectos recientes, notas de investigación y experimentos de código abierto.",
    "hero.cta": "Ver proyectos",
    "intro.text": "Estudiante en la Universidad de Tecnología de Nanjing (NJTECH), enfocado en aplicaciones de IA, ingeniería full-stack, productos de datos y experiencia del desarrollador. Me gusta transformar ideas difusas en interfaces estables, UI minimalistas y documentación reutilizable.",
    "stats.projects": "Prototipos",
    "stats.notes": "Notas técnicas",
    "stats.research": "Áreas de investigación",
    "lab.title": "Vitrina tecnológica viva",
    "lab.desc": "Canvas en tiempo real, disparadores de scroll, hover 3D, métricas en vivo y escritura de comandos — todo en esta página estática.",
    "work.title": "Proyectos recientes",
    "filter.all": "Todos",
    "card.qa.title": "Banco de trabajo Q&A",
    "card.qa.desc": "Flujo de búsqueda, citación y revisión de respuestas para documentos de equipo — canalizando la salida del modelo en un flujo de trabajo rastreable.",
    "card.qa.link": "Ver repositorio",
    "card.ds.title": "Laboratorio de sistema de diseño",
    "card.ds.desc": "Componentes ligeros, variables de tema y páginas de auditoría de accesibilidad para validar rápidamente ideas de UI de producto.",
    "card.ds.link": "Ver repositorio",
    "card.dash.title": "Panel de métricas personales",
    "card.dash.desc": "Unifica actividades de lectura, entrenamiento, escritura y código en una interfaz de análisis local primero.",
    "card.dash.link": "Ver repositorio",
    "notes.title": "En mi mente",
    "note.1": "De prompts a protocolos de producto: tres niveles de estabilidad para funciones de IA",
    "note.2": "Por qué las buenas herramientas internas deben sentirse como editores, no como formularios",
    "note.3": "Usar pequeños productos de datos para registrar la vida a largo plazo, no fluctuaciones a corto plazo",
    "stack.title": "Caja de herramientas",
    "contact.title": "Construyamos algo interesante juntos.",
    "contact.copy": "Copiar correo",
    "contact.copied": "Copiado",
    "footer.palette": "Palette from Claude by Anthropic",
    "aria.brand": "Volver arriba"
  },
  fr: {
    "nav.lab": "Labo",
    "nav.work": "Projets",
    "nav.notes": "Écriture",
    "nav.stack": "Outils",
    "nav.contact": "Contact",
    "hero.eyebrow": "NJTECH / Université de Technologie de Nanjing",
    "hero.lede": "À l'Université de Technologie de Nanjing (NJTECH), je transforme des problèmes complexes en systèmes clairs, produits fonctionnels et écrits lisibles. C'est ici que je rassemble mes projets récents, notes de recherche et expériences open source.",
    "hero.cta": "Voir les projets",
    "intro.text": "Étudiant à l'Université de Technologie de Nanjing (NJTECH), spécialisé dans les applications d'IA, le développement full-stack, les produits de données et l'expérience développeur. J'aime transformer des idées floues en interfaces stables, UI épurées et documentation réutilisable.",
    "stats.projects": "Prototypes",
    "stats.notes": "Notes techniques",
    "stats.research": "Domaines de recherche",
    "lab.title": "Vitrine technologique vivante",
    "lab.desc": "Canvas en temps réel, déclencheurs de défilement, survol 3D, métriques en direct et frappe CLI — tout dans cette page statique.",
    "work.title": "Projets récents",
    "filter.all": "Tous",
    "card.qa.title": "Atelier Q&R de base de connaissances",
    "card.qa.desc": "Flux de recherche, citation et révision des réponses pour la documentation d'équipe — canalisant la sortie du modèle dans un workflow traçable.",
    "card.qa.link": "Voir le dépôt",
    "card.ds.title": "Laboratoire de système de design",
    "card.ds.desc": "Composants légers, variables de thème et pages d'audit d'accessibilité pour valider rapidement les idées d'interface produit.",
    "card.ds.link": "Voir le dépôt",
    "card.dash.title": "Tableau de bord personnel",
    "card.dash.desc": "Unification des activités de lecture, entraînement, écriture et code dans une interface analytique locale d'abord.",
    "card.dash.link": "Voir le dépôt",
    "notes.title": "En ce moment",
    "note.1": "Des prompts aux protocoles produit : trois niveaux de stabilité pour les fonctionnalités IA",
    "note.2": "Pourquoi les bons outils internes devraient ressembler à des éditeurs, pas à des formulaires",
    "note.3": "Utiliser de petits produits de données pour enregistrer la vie à long terme, pas les fluctuations à court terme",
    "stack.title": "Boîte à outils",
    "contact.title": "Construisons quelque chose d'intéressant.",
    "contact.copy": "Copier l'e-mail",
    "contact.copied": "Copié",
    "footer.palette": "Palette from Claude by Anthropic",
    "aria.brand": "Retour en haut"
  },
  "zh-TW": {
    "nav.lab": "實驗室",
    "nav.work": "專案",
    "nav.notes": "寫作",
    "nav.stack": "工具箱",
    "nav.contact": "聯絡",
    "hero.eyebrow": "NJTECH / 南京工業大學",
    "hero.lede": "我來自南京工業大學（NJTECH），把複雜問題拆成清晰的系統、可執行的產品和耐讀的文字。這裡收藏我近期的專案、研究筆記與開源實驗。",
    "hero.cta": "查看專案",
    "intro.text": "南京工業大學（NJTECH）學生，關注 AI 應用、全端工程、資料產品與開發者體驗。喜歡把模糊的想法整理成穩定的介面、克制的界面和可以複用的文件。",
    "stats.projects": "專案原型",
    "stats.notes": "技術筆記",
    "stats.research": "研究方向",
    "lab.title": "會動的技術展示台",
    "lab.desc": "即時 Canvas、捲動觸發、3D hover、動態指標和命令列打字，全都在這個靜態頁面裡完成。",
    "work.title": "近期專案",
    "filter.all": "全部",
    "card.qa.title": "知識庫問答工作台",
    "card.qa.desc": "面向團隊文件的檢索、引用和答案審校流程，把模型輸出收束進可追蹤的工作流。",
    "card.qa.link": "查看倉庫",
    "card.ds.title": "設計系統實驗室",
    "card.ds.desc": "一套輕量元件、主題變數和無障礙校驗頁面，用來快速驗證產品介面想法。",
    "card.ds.link": "查看倉庫",
    "card.dash.title": "個人指標儀表板",
    "card.dash.desc": "把閱讀、訓練、寫作和程式活動整合到一個本地優先的分析介面。",
    "card.dash.link": "查看倉庫",
    "notes.title": "最近在想",
    "note.1": "從提示詞到產品協議：讓 AI 功能更穩定的三個層次",
    "note.2": "為什麼好的內部工具應該更像編輯器，而不是表單集合",
    "note.3": "用小型資料產品記錄長期生活，而不是追蹤短期波動",
    "stack.title": "工具箱",
    "contact.title": "一起做點有意思的東西。",
    "contact.copy": "複製信箱",
    "contact.copied": "已複製",
    "footer.palette": "Palette from Claude by Anthropic",
    "aria.brand": "回到首頁"
  }
};

const langLocales = { zh: "zh-CN", en: "en", ko: "ko", ja: "ja", de: "de", es: "es", fr: "fr", "zh-TW": "zh-TW" };
const langNames = { zh: "简体中文", en: "English", ko: "한국어", ja: "日本語", de: "Deutsch", es: "Español", fr: "Français", "zh-TW": "繁體中文" };

let currentLang = "zh";

const applyLang = (lang) => {
  const t = translations[lang];
  if (!t) return;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.textContent = t[key];
  });

  document.querySelector(".brand")?.setAttribute("aria-label", t["aria.brand"] || "");
  document.documentElement.lang = langLocales[lang] || lang;
  document.documentElement.dir = "ltr";

  document.querySelectorAll(".lang-option").forEach((opt) => {
    opt.classList.toggle("is-active", opt.dataset.langVal === lang);
  });

  const langCurrentEl = document.querySelector("[data-lang-current]");
  if (langCurrentEl) langCurrentEl.textContent = langNames[lang];

  currentLang = lang;
};

const langPicker = document.querySelector("[data-lang-picker]");
const langBtn = document.querySelector("[data-lang-btn]");
const langMenuEl = document.querySelector("[data-lang-menu]");

langBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  const isOpen = langPicker.classList.toggle("is-open");
  langBtn.setAttribute("aria-expanded", String(isOpen));
});

langMenuEl?.addEventListener("click", (e) => {
  const option = e.target.closest(".lang-option");
  if (!option) return;
  const lang = option.dataset.langVal;
  if (lang) applyLang(lang);
  langPicker?.classList.remove("is-open");
  langBtn?.setAttribute("aria-expanded", "false");
});

document.addEventListener("click", (e) => {
  if (langPicker && !langPicker.contains(e.target)) {
    langPicker.classList.remove("is-open");
    langBtn?.setAttribute("aria-expanded", "false");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && langPicker?.classList.contains("is-open")) {
    langPicker.classList.remove("is-open");
    langBtn?.setAttribute("aria-expanded", "false");
    langBtn?.focus();
  }
});
