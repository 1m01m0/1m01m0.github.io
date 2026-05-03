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
  ".section-heading, .filter-bar, .project-card, .toy-card, .note-item, .stack-column, .education-card, .contact-section > *, .site-footer"
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

/* Apple-style hero scroll effect */
const heroCopy = document.querySelector(".hero-copy");
const updateHeroScroll = () => {
  if (!heroCopy) return;
  const scrollY = window.scrollY;
  const heroHeight = window.innerHeight;
  const progress = Math.min(scrollY / heroHeight, 1);
  const opacity = 1 - progress * 1.2;
  const scale = 1 - progress * 0.08;
  heroCopy.style.opacity = Math.max(opacity, 0);
  heroCopy.style.transform = `scale(${Math.max(scale, 0.85)})`;
};

/* Canvas parallax on scroll */
const updateCanvasParallax = () => {
  if (!techCanvas) return;
  const scrollY = window.scrollY;
  const heroHeight = window.innerHeight;
  if (scrollY > heroHeight) return;
  const offset = scrollY * 0.35;
  techCanvas.style.transform = `translateY(${offset}px)`;
};

/* Merged scroll handler with rAF throttling */
let scrollTicking = false;
const onScroll = () => {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      updateScrollProgress();
      updateHeroScroll();
      updateCanvasParallax();
      scrollTicking = false;
    });
    scrollTicking = true;
  }
};
window.addEventListener("scroll", onScroll, { passive: true });
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
  }, { passive: true });

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
  }, { passive: true });

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

    const count = Math.max(34, Math.min(88, Math.floor(width / 17)));
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

  let canvasVisible = true;
  const drawLoop = () => {
    if (!canvasVisible) return;
    draw();
  };
  drawLoop();

  if ("IntersectionObserver" in window) {
    const canvasObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const wasVisible = canvasVisible;
          canvasVisible = entry.isIntersecting;
          if (!wasVisible && canvasVisible) drawLoop();
        });
      },
      { threshold: 0 }
    );
    canvasObserver.observe(hero);
  }

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

const translations = {
  zh: {
    "nav.summary": "简介",
    "nav.education": "教育",
    "nav.skills": "技能",
    "nav.research": "研究方向",
    "nav.lab": "实验室",
    "nav.writings": "笔记",
    "nav.contact": "联系",
    "hero.eyebrow": "2024-2028 / NJTECH / 人工智能",
    "hero.lede": "我来自南京工业大学（NJTECH），人工智能专业本科在读。研究方向为大语言模型（LLM）、自然语言处理（NLP）与强化学习（RL）。这里收藏我近期的项目、研究笔记与开源实验。",
    "hero.cta": "查看项目",
    "summary.eyebrow": "Summary",
    "summary.title": "个人简介",
    "summary.text": "南京工业大学（NJTECH）人工智能专业学生，关注大语言模型（LLM）、NLP、强化学习、全栈工程与开发者体验。喜欢把模糊的想法整理成稳定的接口、克制的界面和可以复用的文档。",
    "stats.projects": "项目原型",
    "stats.notes": "技术笔记",
    "stats.research": "研究方向",
    "education.eyebrow": "Education",
    "education.title": "教育背景",
    "education.school": "南京工业大学 (NJTECH)",
    "education.degree": "人工智能 本科",
    "education.date": "2024 - 2028 (预计)",
    "education.focus_label": "研究方向：",
    "education.focus": "大语言模型 (LLM)、自然语言处理 (NLP)、强化学习 (RL)",
    "education.courses_label": "相关课程：",
    "education.courses": "数据结构、算法分析、机器学习、自然语言处理、深度学习、操作系统、计算机网络",
    "skills.eyebrow": "Skills",
    "skills.title": "专业技能",
    "research.eyebrow": "Toy Box",
    "research.title": "感兴趣的 toy",
    "lab.title": "会动的技术展示台",
    "lab.desc": "实时 Canvas、滚动触发、3D hover、动态指标和命令行打字，全都在这个静态页面里完成。",
    "filter.all": "全部",
    "research.qa.title": "知识库问答工作台",
    "research.qa.desc": "面向团队文档的检索、引用和答案审校流程，我正在研究 RAG 在文档审校中的实践效果。",
    "research.qa.link": "了解更多",
    "research.ds.title": "设计系统实验室",
    "research.ds.desc": "一套轻量组件、主题变量和可访问性校验页面，关注前端设计系统的工程化实践。",
    "research.ds.link": "了解更多",
    "research.dash.title": "个人指标仪表盘",
    "research.dash.desc": "把阅读、训练、写作和代码活动整合到一个本地优先的分析界面，探索个人数据产品的可能性。",
    "research.dash.link": "了解更多",
    "research.edict.title": "三省六部制",
    "research.edict.desc": "基于 OpenClaw 的多智能体编排系统，探索 9 个专业化 AI Agent 的协作模式与审计追踪机制。",
    "research.edict.link": "了解更多",
    "research.openclaw.title": "OpenClaw",
    "research.openclaw.desc": "跨平台个人 AI 助手框架，支持多通道消息接入与本地部署，我正在研究其架构设计与扩展能力。",
    "research.openclaw.link": "了解更多",
    "research.linux.title": "Linux Kernel",
    "research.linux.desc": "Linux 操作系统内核开源项目，用于系统级开发与研究，我正在探索其底层的架构设计。",
    "research.linux.link": "了解更多",
    "writings.eyebrow": "Writings",
    "writings.title": "研究笔记",
    "note.1": "从提示词到产品协议：让 AI 功能更稳定的三个层次",
    "note.2": "为什么好的内部工具应该更像编辑器，而不是表单集合",
    "note.3": "用小型数据产品记录长期生活，而不是追踪短期波动",
    "contact.title": "一起做点有意思的东西。",
    "contact.copy": "复制邮箱",
    "contact.copied": "已复制",
    "footer.palette": "coding by emo",
    "nav.toy": "MY_TOY",
    "toy.eyebrow": "MY_TOY",
    "toy.title": "我的作品",
    "toy.claude.title": "Claude Desktop 中文汉化",
    "toy.claude.desc": "为 macOS 版 Claude Desktop 提供完整简体中文汉化，包括界面翻译、语言白名单修补和硬编码文案替换，并注入中文字体切换运行时。",
    "toy.converter.title": "格式转换工具集",
    "toy.converter.desc": "适用于 Claude Code / Claude Cowork / OpenCode / Codex 的格式转换 Skill 集合。支持图片和文档格式互转。",
    "toy.link": "查看仓库",
    "aria.brand": "回到首页"
  },
  en: {
    "nav.summary": "Summary",
    "nav.education": "Education",
    "nav.skills": "Skills",
    "nav.research": "Interests",
    "nav.lab": "Lab",
    "nav.writings": "Notes",
    "nav.contact": "Contact",
    "hero.eyebrow": "2024-2028 / B.S. Artificial Intelligence / NJTECH",
    "hero.lede": "Undergraduate in Artificial Intelligence at Nanjing Tech University (NJTECH), focusing on Large Language Models (LLM), NLP, and Reinforcement Learning (RL). Here I collect recent projects, research notes, and open-source experiments.",
    "hero.cta": "View Projects",
    "summary.eyebrow": "Summary",
    "summary.title": "About Me",
    "summary.text": "Artificial Intelligence student at Nanjing Tech University (NJTECH), focused on Large Language Models (LLM), NLP, Reinforcement Learning, full-stack engineering, and developer experience. I enjoy turning vague ideas into stable interfaces, restrained UIs, and reusable documentation.",
    "stats.projects": "Prototypes",
    "stats.notes": "Tech Notes",
    "stats.research": "Research Areas",
    "education.eyebrow": "Education",
    "education.title": "Education",
    "education.school": "Nanjing Tech University (NJTECH)",
    "education.degree": "B.S. in Artificial Intelligence",
    "education.date": "2024 - 2028 (Expected)",
    "education.focus_label": "Research Focus: ",
    "education.focus": "Large Language Models (LLM), Natural Language Processing (NLP), Reinforcement Learning (RL)",
    "education.courses_label": "Coursework: ",
    "education.courses": "Data Structures, Algorithm Analysis, Machine Learning, NLP, Deep Learning, Operating Systems, Computer Networks",
    "skills.eyebrow": "Skills",
    "skills.title": "Skills",
    "research.eyebrow": "Toy Box",
    "research.title": "Interested Toys",
    "lab.title": "Living Tech Showcase",
    "lab.desc": "Real-time Canvas, scroll triggers, 3D hover, live metrics, and a typing CLI — all done inside this static page.",
    "filter.all": "All",
    "research.qa.title": "Knowledge Base Q&A Workbench",
    "research.qa.desc": "Retrieval, citation, and answer review flow for team documentation — I'm studying the practical impact of RAG on document review.",
    "research.qa.link": "Learn More",
    "research.ds.title": "Design System Lab",
    "research.ds.desc": "A lightweight component library, theme variables, and accessibility audit pages — exploring engineering practices for frontend design systems.",
    "research.ds.link": "Learn More",
    "research.dash.title": "Personal Metrics Dashboard",
    "research.dash.desc": "Unifying reading, training, writing, and code activity into a local-first analytics interface — exploring the potential of personal data products.",
    "research.dash.link": "Learn More",
    "research.edict.title": "EDICT",
    "research.edict.desc": "A multi-agent orchestration system built on OpenClaw — exploring collaboration patterns and audit trail mechanisms of 9 specialized AI agents.",
    "research.edict.link": "Learn More",
    "research.openclaw.title": "OpenClaw",
    "research.openclaw.desc": "A cross-platform personal AI assistant framework with multi-channel messaging and local-first deployment — I'm studying its architecture and extensibility.",
    "research.openclaw.link": "Learn More",
    "research.linux.title": "Linux Kernel",
    "research.linux.desc": "The open-source Linux operating system kernel project. I am exploring its underlying architecture and system-level design.",
    "research.linux.link": "Learn More",
    "writings.eyebrow": "Writings",
    "writings.title": "Notes",
    "note.1": "From Prompts to Product Protocols: Three Levels of Stability for AI Features",
    "note.2": "Why Good Internal Tools Should Feel Like Editors, Not Form Collections",
    "note.3": "Using Small Data Products to Track Long-Term Life, Not Short-Term Fluctuations",
    "contact.title": "Let's build something interesting.",
    "contact.copy": "Copy Email",
    "contact.copied": "Copied",
    "footer.palette": "coding by emo",
    "nav.toy": "MY_TOY",
    "toy.eyebrow": "MY_TOY",
    "toy.title": "My Works",
    "toy.claude.title": "Claude Desktop Chinese Localization",
    "toy.claude.desc": "Complete Simplified Chinese localization for macOS Claude Desktop, including UI translation, language allowlist patching, hardcoded text replacement, and Chinese font switching runtime injection.",
    "toy.converter.title": "Format Converter Skills",
    "toy.converter.desc": "Format conversion Skill collection for Claude Code / Claude Cowork / OpenCode / Codex. Supports image and document format interconversion.",
    "toy.link": "View Repository",
    "aria.brand": "Back to top"
  },
  ko: {
    "nav.summary": "소개",
    "nav.education": "학력",
    "nav.skills": "기술",
    "nav.research": "연구",
    "nav.lab": "실험실",
    "nav.writings": "글",
    "nav.contact": "연락",
    "hero.eyebrow": "2024-2028 / NJTECH / 인공지능",
    "hero.lede": "난징공업대학교(NJTECH) 인공지능학과 학부생으로, 대규모 언어 모델(LLM), NLP, 강화 학습(RL)을 연구합니다. 여기에는 최근 프로젝트, 연구 노트, 오픈소스 실험을 모아두었습니다.",
    "hero.cta": "프로젝트 보기",
    "summary.eyebrow": "Summary",
    "summary.title": "자기소개",
    "summary.text": "난징공업대학교(NJTECH) 인공지능학과 학생으로 대규모 언어 모델(LLM), NLP, 강화 학습, 풀스택 엔지니어링, 개발자 경험에 집중합니다. 모호한 아이디어를 안정적인 인터페이스, 절제된 UI, 재사용 가능한 문서로 정리하는 것을 좋아합니다.",
    "stats.projects": "프로토타입",
    "stats.notes": "기술 노트",
    "stats.research": "연구 분야",
    "education.eyebrow": "Education",
    "education.title": "교육 배경",
    "education.school": "난징공업대학교 (NJTECH)",
    "education.degree": "인공지능 학사",
    "education.date": "2024 - 2028 (예정)",
    "education.focus_label": "연구 방향: ",
    "education.focus": "대규모 언어 모델 (LLM), 자연어 처리 (NLP), 강화 학습 (RL)",
    "education.courses_label": "관련 과목: ",
    "education.courses": "자료구조, 알고리즘 분석, 기계학습, 자연어처리, 딥러닝, 운영체제, 컴퓨터 네트워크",
    "skills.eyebrow": "Skills",
    "skills.title": "기술 스택",
    "research.eyebrow": "Toy Box",
    "research.title": "관심있는 toy",
    "lab.title": "살아있는 기술 쇼케이스",
    "lab.desc": "실시간 Canvas, 스크롤 트리거, 3D 호버, 라이브 지표, 타이핑 CLI — 모두 이 정적 페이지에서 구현되었습니다.",
    "filter.all": "전체",
    "research.qa.title": "지식 베이스 Q&A 워크벤치",
    "research.qa.desc": "팀 문서를 위한 검색, 인용, 답변 검토 흐름 — RAG가 문서 검토에 미치는 실질적 영향을 연구 중입니다.",
    "research.qa.link": "더 알아보기",
    "research.ds.title": "디자인 시스템 랩",
    "research.ds.desc": "제품 UI 아이디어를 빠르게 검증하기 위한 경량 컴포넌트, 테마 변수, 접근성 감사 페이지 — 프론트엔드 디자인 시스템의 엔지니어링 관행을 탐구합니다.",
    "research.ds.link": "더 알아보기",
    "research.dash.title": "개인 지표 대시보드",
    "research.dash.desc": "독서, 훈련, 글쓰기, 코드 활동을 로컬 우선 분석 인터페이스로 통합 — 개인 데이터 제품의 가능성을 탐구합니다.",
    "research.dash.link": "더 알아보기",
    "research.edict.title": "EDICT·삼성육부제",
    "research.edict.desc": "OpenClaw 기반 멀티 에이전트 오케스트레이션 시스템 — 9개의 전문 AI 에이전트 협업 패턴과 감사 추적 메커니즘을 탐구합니다.",
    "research.edict.link": "더 알아보기",
    "research.openclaw.title": "OpenClaw",
    "research.openclaw.desc": "크로스플랫폼 개인 AI 비서 프레임워크, 멀티채널 메시징과 로컬 우선 배포 — 아키텍처와 확장성을 연구 중입니다.",
    "research.openclaw.link": "더 알아보기",
    "research.linux.title": "Linux Kernel",
    "research.linux.desc": "리눅스 운영체제 커널 오픈소스 프로젝트. 시스템 레벨 개발과 아키텍처 설계를 탐구하고 있습니다.",
    "research.linux.link": "더 알아보기",
    "writings.eyebrow": "Writings",
    "writings.title": "연구 노트",
    "note.1": "프롬프트에서 제품 프로토콜로: AI 기능을 더 안정적으로 만드는 세 가지 레벨",
    "note.2": "좋은 내부 도구가 폼 모음이 아닌 에디터처럼 느껴져야 하는 이유",
    "note.3": "단기 변동이 아닌 장기적 삶을 추적하기 위한 소형 데이터 제품 활용",
    "contact.title": "함께 흥미로운 것을 만들어봐요.",
    "contact.copy": "이메일 복사",
    "contact.copied": "복사됨",
    "footer.palette": "coding by emo",
    "nav.toy": "MY_TOY",
    "toy.eyebrow": "MY_TOY",
    "toy.title": "내 작품",
    "toy.claude.title": "Claude Desktop 중국어 현지화",
    "toy.claude.desc": "macOS Claude Desktop을 위한 완전한 간체 중국어 현지화. UI 번역, 언어 화이트리스트 패치, 하드코딩된 텍스트 교체, 중국어 글꼴 전환 런타임 주입을 포함합니다.",
    "toy.converter.title": "포맷 변환 스킬",
    "toy.converter.desc": "Claude Code / Claude Cowork / OpenCode / Codex용 포맷 변환 Skill 모음. 이미지 및 문서 포맷 상호 변환을 지원합니다.",
    "toy.link": "저장소 보기",
    "aria.brand": "맨 위로"
  },
  ja: {
    "nav.summary": "概要",
    "nav.education": "学歴",
    "nav.skills": "スキル",
    "nav.research": "研究",
    "nav.lab": "ラボ",
    "nav.writings": "執筆",
    "nav.contact": "連絡",
    "hero.eyebrow": "2024-2028 / NJTECH / 人工知能",
    "hero.lede": "南京工業大学（NJTECH）人工知能専攻の学部生として、大規模言語モデル（LLM）、NLP、強化学習（RL）を研究しています。最近のプロジェクト、研究ノート、オープンソース実験を掲載しています。",
    "hero.cta": "プロジェクトを見る",
    "summary.eyebrow": "Summary",
    "summary.title": "自己紹介",
    "summary.text": "南京工業大学（NJTECH）人工知能専攻の学生として、大規模言語モデル（LLM）、NLP、強化学習、フルスタックエンジニアリング、開発者体験に注力しています。漠然としたアイデアを安定したインターフェース、簡潔なUI、再利用可能なドキュメントに整理することが好きです。",
    "stats.projects": "プロトタイプ",
    "stats.notes": "技術ノート",
    "stats.research": "研究分野",
    "education.eyebrow": "Education",
    "education.title": "学歴",
    "education.school": "南京工業大学 (NJTECH)",
    "education.degree": "人工知能学士",
    "education.date": "2024 - 2028 (予定)",
    "education.focus_label": "研究分野: ",
    "education.focus": "大規模言語モデル (LLM), 自然言語処理 (NLP), 強化学習 (RL)",
    "education.courses_label": "関連科目: ",
    "education.courses": "データ構造, アルゴリズム解析, 機械学習, 自然言語処理, 深層学習, オペレーティングシステム, コンピュータネットワーク",
    "skills.eyebrow": "Skills",
    "skills.title": "スキル",
    "research.eyebrow": "Toy Box",
    "research.title": "気になる toy",
    "lab.title": "動くテック展示台",
    "lab.desc": "リアルタイムCanvas、スクロールトリガー、3Dホバー、ライブメトリクス、タイピングCLI — すべてこの静的ページで実現。",
    "filter.all": "すべて",
    "research.qa.title": "ナレッジベースQ&Aワークベンチ",
    "research.qa.desc": "チームドキュメントの検索・引用・回答レビューフロー — ドキュメントレビューにおけるRAGの実践的効果を研究中です。",
    "research.qa.link": "詳細を見る",
    "research.ds.title": "デザインシステムラボ",
    "research.ds.desc": "製品UIアイデアを素早く検証するための軽量コンポーネント、テーマ変数、アクセシビリティ検証ページ — フロントエンドデザインシステムのエンジニアリング実践を探求。",
    "research.ds.link": "詳細を見る",
    "research.dash.title": "個人メトリクスダッシュボード",
    "research.dash.desc": "読書・トレーニング・執筆・コード活動をローカルファーストの分析インターフェースに統合 — 個人データプロダクトの可能性を模索。",
    "research.dash.link": "詳細を見る",
    "research.edict.title": "EDICT·三省六部制",
    "research.edict.desc": "OpenClaw ベースのマルチエージェントオーケストレーションシステム — 9つの専門 AI エージェントの協調パターンと監査証跡メカニズムを探索。",
    "research.edict.link": "詳細を見る",
    "research.openclaw.title": "OpenClaw",
    "research.openclaw.desc": "クロスプラットフォームのパーソナル AI アシスタントフレームワーク、マルチチャンネルメッセージングとローカルファースト展開 — アーキテクチャと拡張性を研究中。",
    "research.openclaw.link": "詳細を見る",
    "research.linux.title": "Linux Kernel",
    "research.linux.desc": "Linuxオペレーティングシステムカーネルのオープンソースプロジェクト。システムレベルの開発とアーキテクチャ設計を探求しています。",
    "research.linux.link": "詳細を見る",
    "writings.eyebrow": "Writings",
    "writings.title": "研究ノート",
    "note.1": "プロンプトからプロダクトプロトコルへ：AI機能を安定させる3つのレベル",
    "note.2": "優れた社内ツールがフォームではなくエディタのように感じるべき理由",
    "note.3": "短期的な変動ではなく長期的な生活を記録するための小さなデータプロダクト",
    "contact.title": "一緒に面白いものを作りましょう。",
    "contact.copy": "メールをコピー",
    "contact.copied": "コピーしました",
    "footer.palette": "coding by emo",
    "nav.toy": "MY_TOY",
    "toy.eyebrow": "MY_TOY",
    "toy.title": "作品",
    "toy.claude.title": "Claude Desktop 中国語ローカライズ",
    "toy.claude.desc": "macOS Claude Desktop 用の完全な簡体字中国語ローカライズ。UI翻訳、言語ホワイトリストパッチ、ハードコードされたテキスト置換、中国語フォント切り替えランタイム注入を含みます。",
    "toy.converter.title": "フォーマット変換スキル",
    "toy.converter.desc": "Claude Code / Claude Cowork / OpenCode / Codex 向けフォーマット変換 Skill コレクション。画像およびドキュメントのフォーマット相互変換をサポート。",
    "toy.link": "リポジトリを見る",
    "aria.brand": "トップへ戻る"
  },
  de: {
    "nav.summary": "Profil",
    "nav.education": "Bildung",
    "nav.skills": "Fähigkeiten",
    "nav.research": "Forschung",
    "nav.lab": "Labor",
    "nav.writings": "Texte",
    "nav.contact": "Kontakt",
    "hero.eyebrow": "2024-2028 / B.S. Künstliche Intelligenz / NJTECH",
    "hero.lede": "Bachelor-Student der Künstlichen Intelligenz an der Nanjing Tech University (NJTECH) mit Schwerpunkt auf Large Language Models (LLM), NLP und Reinforcement Learning (RL). Hier sammle ich aktuelle Projekte, Forschungsnotizen und Open-Source-Experimente.",
    "hero.cta": "Projekte ansehen",
    "summary.eyebrow": "Summary",
    "summary.title": "Über Mich",
    "summary.text": "Student der Künstlichen Intelligenz an der Nanjing Tech University (NJTECH) mit Fokus auf Large Language Models (LLM), NLP, Reinforcement Learning, Full-Stack-Engineering und Entwicklererfahrung. Ich verwandle vage Ideen gerne in stabile Interfaces, reduzierte UIs und wiederverwendbare Dokumentation.",
    "stats.projects": "Prototypen",
    "stats.notes": "Tech-Notizen",
    "stats.research": "Forschungsgebiete",
    "education.eyebrow": "Education",
    "education.title": "Bildung",
    "education.school": "Nanjing Tech University (NJTECH)",
    "education.degree": "B.S. Künstliche Intelligenz",
    "education.date": "2024 - 2028 (Erwartet)",
    "education.focus_label": "Forschungsschwerpunkt: ",
    "education.focus": "Large Language Models (LLM), Natural Language Processing (NLP), Reinforcement Learning (RL)",
    "education.courses_label": "Kurse: ",
    "education.courses": "Datenstrukturen, Algorithmenanalyse, Maschinelles Lernen, NLP, Deep Learning, Betriebssysteme, Computernetzwerke",
    "skills.eyebrow": "Skills",
    "skills.title": "Fähigkeiten",
    "research.eyebrow": "Toy Box",
    "research.title": "Interessierte Toys",
    "lab.title": "Lebendiges Tech-Schaufenster",
    "lab.desc": "Echtzeit-Canvas, Scroll-Trigger, 3D-Hover, Live-Metriken und eine tippende CLI — alles in dieser statischen Seite.",
    "filter.all": "Alle",
    "research.qa.title": "Wissensbasis-Q&A-Werkbank",
    "research.qa.desc": "Such-, Zitat- und Antwortprüfungsablauf für Teamdokumente — ich untersuche die praktische Wirkung von RAG auf Dokumentenprüfung.",
    "research.qa.link": "Mehr erfahren",
    "research.ds.title": "Design-System-Labor",
    "research.ds.desc": "Leichte Komponenten, Themenvariablen und Barrierefreiheitsprüfseiten — Erkundung von Engineering-Praktiken für Frontend-Designsysteme.",
    "research.ds.link": "Mehr erfahren",
    "research.dash.title": "Persönliches Metriken-Dashboard",
    "research.dash.desc": "Lese-, Trainings-, Schreib- und Code-Aktivitäten in einem lokal-first Analyse-Interface — Erkundung persönlicher Datenprodukte.",
    "research.dash.link": "Mehr erfahren",
    "research.edict.title": "EDICT",
    "research.edict.desc": "Ein auf OpenClaw basierendes Multi-Agenten-Orchestrierungssystem — Erforschung von Kollaborationsmustern und Audit-Trail-Mechanismen von 9 spezialisierten KI-Agenten.",
    "research.edict.link": "Mehr erfahren",
    "research.openclaw.title": "OpenClaw",
    "research.openclaw.desc": "Ein plattformübergreifendes persönliches KI-Assistenten-Framework mit Mehrkanal-Messaging und lokal-first Bereitstellung — ich studiere seine Architektur und Erweiterbarkeit.",
    "research.openclaw.link": "Mehr erfahren",
    "research.linux.title": "Linux Kernel",
    "research.linux.desc": "Das Open-Source-Projekt des Linux-Betriebssystem-Kernels. Ich untersuche die zugrunde liegende Architektur und Systementwicklung.",
    "research.linux.link": "Mehr erfahren",
    "writings.eyebrow": "Writings",
    "writings.title": "Notizen",
    "note.1": "Von Prompts zu Produktprotokollen: Drei Ebenen für stabilere KI-Funktionen",
    "note.2": "Warum gute interne Tools eher wie Editoren aussehen sollten als wie Formularsammlungen",
    "note.3": "Kleine Datenprodukte für langfristige Lebensaufzeichnung statt kurzfristiger Schwankungen",
    "contact.title": "Lass uns etwas Interessantes bauen.",
    "contact.copy": "E-Mail kopieren",
    "contact.copied": "Kopiert",
    "footer.palette": "coding by emo",
    "nav.toy": "MY_TOY",
    "toy.eyebrow": "MY_TOY",
    "toy.title": "Meine Werke",
    "toy.claude.title": "Claude Desktop Chinesische Lokalisierung",
    "toy.claude.desc": "Vollständige Vereinfachte-Chinesisch-Lokalisierung für macOS Claude Desktop, inkl. UI-Übersetzung, Sprach-Allowlist-Patch, hartcodierte Textersetzung und Chinesische Schriftart-Switching-Runtime-Injektion.",
    "toy.converter.title": "Format-Konverter Skills",
    "toy.converter.desc": "Format-Konvertierungs-Skill-Sammlung für Claude Code / Claude Cowork / OpenCode / Codex. Unterstützt Bild- und Dokumentformat-Konvertierung.",
    "toy.link": "Repository ansehen",
    "aria.brand": "Zurück zum Anfang"
  },
  es: {
    "nav.summary": "Perfil",
    "nav.education": "Formación",
    "nav.skills": "Habilidades",
    "nav.research": "Investigación",
    "nav.lab": "Laboratorio",
    "nav.writings": "Escritos",
    "nav.contact": "Contacto",
    "hero.eyebrow": "2024-2028 / Lic. en Inteligencia Artificial / NJTECH",
    "hero.lede": "Estudiante de grado en Inteligencia Artificial en la Universidad de Tecnología de Nanjing (NJTECH), enfocado en Modelos de Lenguaje a Gran Escala (LLM), NLP y Aprendizaje por Refuerzo (RL). Aquí guardo proyectos recientes, notas de investigación y experimentos de código abierto.",
    "hero.cta": "Ver proyectos",
    "summary.eyebrow": "Summary",
    "summary.title": "Sobre Mí",
    "summary.text": "Estudiante de Inteligencia Artificial en la Universidad de Tecnología de Nanjing (NJTECH), enfocado en Modelos de Lenguaje a Gran Escala (LLM), NLP, Aprendizaje por Refuerzo, ingeniería full-stack y experiencia del desarrollador. Me gusta transformar ideas difusas en interfaces estables, UI minimalistas y documentación reutilizable.",
    "stats.projects": "Prototipos",
    "stats.notes": "Notas técnicas",
    "stats.research": "Áreas de investigación",
    "education.eyebrow": "Education",
    "education.title": "Formación Académica",
    "education.school": "Nanjing Tech University (NJTECH)",
    "education.degree": "Licenciatura en Inteligencia Artificial",
    "education.date": "2024 - 2028 (Previsto)",
    "education.focus_label": "Enfoque de investigación: ",
    "education.focus": "Modelos de Lenguaje a Gran Escala (LLM), Procesamiento de Lenguaje Natural (NLP), Aprendizaje por Refuerzo (RL)",
    "education.courses_label": "Cursos: ",
    "education.courses": "Estructuras de Datos, Análisis de Algoritmos, Aprendizaje Automático, NLP, Aprendizaje Profundo, Sistemas Operativos, Redes",
    "skills.eyebrow": "Skills",
    "skills.title": "Habilidades",
    "research.eyebrow": "Toy Box",
    "research.title": "Toys Interesantes",
    "lab.title": "Vitrina tecnológica viva",
    "lab.desc": "Canvas en tiempo real, disparadores de scroll, hover 3D, métricas en vivo y escritura de comandos — todo en esta página estática.",
    "filter.all": "Todos",
    "research.qa.title": "Banco de trabajo Q&A",
    "research.qa.desc": "Flujo de búsqueda, citación y revisión de respuestas para documentos de equipo — investigando el impacto práctico de RAG en la revisión documental.",
    "research.qa.link": "Más info",
    "research.ds.title": "Laboratorio de sistema de diseño",
    "research.ds.desc": "Componentes ligeros, variables de tema y páginas de auditoría de accesibilidad — explorando prácticas de ingeniería para sistemas de diseño frontend.",
    "research.ds.link": "Más info",
    "research.dash.title": "Panel de métricas personales",
    "research.dash.desc": "Unifica actividades de lectura, entrenamiento, escritura y código en una interfaz de análisis local primero — explorando productos de datos personales.",
    "research.dash.link": "Más info",
    "research.edict.title": "EDICT",
    "research.edict.desc": "Sistema de orquestación multi-agente basado en OpenClaw — explorando patrones de colaboración y mecanismos de auditoría de 9 agentes de IA especializados.",
    "research.edict.link": "Más info",
    "research.openclaw.title": "OpenClaw",
    "research.openclaw.desc": "Framework de asistente personal de IA multiplataforma con mensajería multicanal y despliegue local primero — estudiando su arquitectura y extensibilidad.",
    "research.openclaw.link": "Más info",
    "research.linux.title": "Linux Kernel",
    "research.linux.desc": "El proyecto de código abierto del kernel del sistema operativo Linux. Estoy explorando su arquitectura y diseño a nivel de sistema.",
    "research.linux.link": "Más info",
    "writings.eyebrow": "Writings",
    "writings.title": "Notas",
    "note.1": "De prompts a protocolos de producto: tres niveles de estabilidad para funciones de IA",
    "note.2": "Por qué las buenas herramientas internas deben sentirse como editores, no como formularios",
    "note.3": "Usar pequeños productos de datos para registrar la vida a largo plazo, no fluctuaciones a corto plazo",
    "contact.title": "Construyamos algo interesante juntos.",
    "contact.copy": "Copiar correo",
    "contact.copied": "Copiado",
    "footer.palette": "coding by emo",
    "nav.toy": "MY_TOY",
    "toy.eyebrow": "MY_TOY",
    "toy.title": "Mis Obras",
    "toy.claude.title": "Localización China de Claude Desktop",
    "toy.claude.desc": "Localización completa en chino simplificado para macOS Claude Desktop, incluyendo traducción de UI, parche de lista blanca de idiomas, reemplazo de texto codificado e inyección de runtime de cambio de fuente china.",
    "toy.converter.title": "Skills de Conversión de Formato",
    "toy.converter.desc": "Colección de Skills de conversión de formato para Claude Code / Claude Cowork / OpenCode / Codex. Soporta conversión mutua de formatos de imagen y documento.",
    "toy.link": "Ver Repositorio",
    "aria.brand": "Volver arriba"
  },
  fr: {
    "nav.summary": "Profil",
    "nav.education": "Formation",
    "nav.skills": "Compétences",
    "nav.research": "Recherche",
    "nav.lab": "Labo",
    "nav.writings": "Écrits",
    "nav.contact": "Contact",
    "hero.eyebrow": "2024-2028 / Licence Intelligence Artificielle / NJTECH",
    "hero.lede": "Étudiant en licence d'Intelligence Artificielle à l'Université de Technologie de Nanjing (NJTECH), spécialisé en Grands Modèles de Langage (LLM), NLP et Apprentissage par Renforcement (RL). C'est ici que je rassemble mes projets récents, notes de recherche et expériences open source.",
    "hero.cta": "Voir les projets",
    "summary.eyebrow": "Summary",
    "summary.title": "À Propos",
    "summary.text": "Étudiant en Intelligence Artificielle à l'Université de Technologie de Nanjing (NJTECH), spécialisé en Grands Modèles de Langage (LLM), NLP, Apprentissage par Renforcement, développement full-stack et expérience développeur. J'aime transformer des idées floues en interfaces stables, UI épurées et documentation réutilisable.",
    "stats.projects": "Prototypes",
    "stats.notes": "Notes techniques",
    "stats.research": "Domaines de recherche",
    "education.eyebrow": "Education",
    "education.title": "Formation",
    "education.school": "Nanjing Tech University (NJTECH)",
    "education.degree": "Licence en Intelligence Artificielle",
    "education.date": "2024 - 2028 (Prévu)",
    "education.focus_label": "Axe de recherche : ",
    "education.focus": "Grands Modèles de Langage (LLM), Traitement du Langage Naturel (NLP), Apprentissage par Renforcement (RL)",
    "education.courses_label": "Cours : ",
    "education.courses": "Structures de Données, Analyse d'Algorithmes, Apprentissage Automatique, NLP, Apprentissage Profond, Systèmes d'Exploitation, Réseaux",
    "skills.eyebrow": "Skills",
    "skills.title": "Compétences",
    "research.eyebrow": "Toy Box",
    "research.title": "Toys Intéressants",
    "lab.title": "Vitrine technologique vivante",
    "lab.desc": "Canvas en temps réel, déclencheurs de défilement, survol 3D, métriques en direct et frappe CLI — tout dans cette page statique.",
    "filter.all": "Tous",
    "research.qa.title": "Atelier Q&R de base de connaissances",
    "research.qa.desc": "Flux de recherche, citation et révision des réponses pour la documentation d'équipe — j'étudie l'impact pratique du RAG sur la révision documentaire.",
    "research.qa.link": "En savoir plus",
    "research.ds.title": "Laboratoire de système de design",
    "research.ds.desc": "Composants légers, variables de thème et pages d'audit d'accessibilité — exploration des pratiques d'ingénierie pour les systèmes de design frontend.",
    "research.ds.link": "En savoir plus",
    "research.dash.title": "Tableau de bord personnel",
    "research.dash.desc": "Unification des activités de lecture, entraînement, écriture et code dans une interface analytique locale d'abord — exploration des produits de données personnels.",
    "research.dash.link": "En savoir plus",
    "research.edict.title": "EDICT",
    "research.edict.desc": "Système d'orchestration multi-agents basé sur OpenClaw — exploration des modèles de collaboration et des mécanismes de piste d'audit de 9 agents IA spécialisés.",
    "research.edict.link": "En savoir plus",
    "research.openclaw.title": "OpenClaw",
    "research.openclaw.desc": "Framework d'assistant personnel IA multiplateforme avec messagerie multicanal et déploiement local d'abord — j'étudie son architecture et son extensibilité.",
    "research.openclaw.link": "En savoir plus",
    "research.linux.title": "Linux Kernel",
    "research.linux.desc": "Le projet open-source du noyau du système d'exploitation Linux. J'explore son architecture sous-jacente et sa conception au niveau système.",
    "research.linux.link": "En savoir plus",
    "writings.eyebrow": "Writings",
    "writings.title": "Notes",
    "note.1": "Des prompts aux protocoles produit : trois niveaux de stabilité pour les fonctionnalités IA",
    "note.2": "Pourquoi les bons outils internes devraient ressembler à des éditeurs, pas à des formulaires",
    "note.3": "Utiliser de petits produits de données pour enregistrer la vie à long terme, pas les fluctuations à court terme",
    "contact.title": "Construisons quelque chose d'intéressant.",
    "contact.copy": "Copier l'e-mail",
    "contact.copied": "Copié",
    "footer.palette": "coding by emo",
    "nav.toy": "MY_TOY",
    "toy.eyebrow": "MY_TOY",
    "toy.title": "Mes Œuvres",
    "toy.claude.title": "Localisation Chinoise de Claude Desktop",
    "toy.claude.desc": "Localisation complète en chinois simplifié pour macOS Claude Desktop, incluant la traduction de l'UI, le patch de la liste blanche des langues, le remplacement de texte codé en dur et l'injection du runtime de changement de police chinoise.",
    "toy.converter.title": "Skills de Conversion de Format",
    "toy.converter.desc": "Collection de Skills de conversion de format pour Claude Code / Claude Cowork / OpenCode / Codex. Prend en charge la conversion mutuelle des formats image et document.",
    "toy.link": "Voir le Dépôt",
    "aria.brand": "Retour en haut"
  },
  "zh-TW": {
    "nav.summary": "簡介",
    "nav.education": "教育",
    "nav.skills": "技能",
    "nav.research": "研究方向",
    "nav.lab": "實驗室",
    "nav.writings": "筆記",
    "nav.contact": "聯絡",
    "hero.eyebrow": "2024-2028 / NJTECH / 人工智慧",
    "hero.lede": "我來自南京工業大學（NJTECH），人工智慧專業本科在讀。研究方向為大語言模型（LLM）、自然語言處理（NLP）與強化學習（RL）。這裡收藏我近期的專案、研究筆記與開源實驗。",
    "hero.cta": "查看專案",
    "summary.eyebrow": "Summary",
    "summary.title": "個人簡介",
    "summary.text": "南京工業大學（NJTECH）人工智慧專業學生，關注大語言模型（LLM）、NLP、強化學習、全端工程與開發者體驗。喜歡把模糊的想法整理成穩定的介面、克制的界面和可以複用的文件。",
    "stats.projects": "專案原型",
    "stats.notes": "技術筆記",
    "stats.research": "研究方向",
    "education.eyebrow": "Education",
    "education.title": "教育背景",
    "education.school": "南京工業大學 (NJTECH)",
    "education.degree": "人工智慧 本科",
    "education.date": "2024 - 2028 (預計)",
    "education.focus_label": "研究方向：",
    "education.focus": "大語言模型 (LLM)、自然語言處理 (NLP)、強化學習 (RL)",
    "education.courses_label": "相關課程：",
    "education.courses": "資料結構、演算法分析、機器學習、自然語言處理、深度學習、作業系統、電腦網路",
    "skills.eyebrow": "Skills",
    "skills.title": "專業技能",
    "research.eyebrow": "Toy Box",
    "research.title": "感興趣的 toy",
    "lab.title": "會動的技術展示台",
    "lab.desc": "即時 Canvas、捲動觸發、3D hover、動態指標和命令列打字，全都在這個靜態頁面裡完成。",
    "filter.all": "全部",
    "research.qa.title": "知識庫問答工作台",
    "research.qa.desc": "面向團隊文件的檢索、引用和答案審校流程，我正在研究 RAG 在文件審校中的實務效果。",
    "research.qa.link": "了解更多",
    "research.ds.title": "設計系統實驗室",
    "research.ds.desc": "一套輕量元件、主題變數和無障礙校驗頁面，關注前端設計系統的工程化實踐。",
    "research.ds.link": "了解更多",
    "research.dash.title": "個人指標儀表板",
    "research.dash.desc": "把閱讀、訓練、寫作和程式活動整合到一個本地優先的分析介面，探索個人資料產品的可能性。",
    "research.dash.link": "了解更多",
    "research.edict.title": "三省六部制",
    "research.edict.desc": "基於 OpenClaw 的多智能體編排系統，探索 9 個專業化 AI Agent 的協作模式與審計追蹤機制。",
    "research.edict.link": "了解更多",
    "research.openclaw.title": "OpenClaw",
    "research.openclaw.desc": "跨平台個人 AI 助手框架，支援多通道訊息接入與本地部署，我正在研究其架構設計與擴充能力。",
    "research.openclaw.link": "了解更多",
    "research.linux.title": "Linux Kernel",
    "research.linux.desc": "Linux 作業系統核心開源專案，用於系統級開發與研究，我正在探索其底層的架構設計。",
    "research.linux.link": "了解更多",
    "writings.eyebrow": "Writings",
    "writings.title": "研究筆記",
    "note.1": "從提示詞到產品協議：讓 AI 功能更穩定的三個層次",
    "note.2": "為什麼好的內部工具應該更像編輯器，而不是表單集合",
    "note.3": "用小型資料產品記錄長期生活，而不是追蹤短期波動",
    "contact.title": "一起做點有意思的東西。",
    "contact.copy": "複製信箱",
    "contact.copied": "已複製",
    "footer.palette": "coding by emo",
    "nav.toy": "MY_TOY",
    "toy.eyebrow": "MY_TOY",
    "toy.title": "我的作品",
    "toy.claude.title": "Claude Desktop 中文漢化",
    "toy.claude.desc": "為 macOS 版 Claude Desktop 提供完整簡體中文漢化，包括介面翻譯、語言白名單修補和硬編碼文案替換，並注入中文字體切換運行時。",
    "toy.converter.title": "格式轉換工具集",
    "toy.converter.desc": "適用於 Claude Code / Claude Cowork / OpenCode / Codex 的格式轉換 Skill 集合。支援圖片和文件格式互轉。",
    "toy.link": "查看倉庫",
    "aria.brand": "回到首頁"
  }
};

const langLocales = { zh: "zh-CN", en: "en", ko: "ko", ja: "ja", de: "de", es: "es", fr: "fr", "zh-TW": "zh-TW" };
const langNames = { zh: "🇨🇳 简体中文", en: "🇺🇸 English", ko: "🇰🇷 한국어", ja: "🇯🇵 日本語", de: "🇩🇪 Deutsch", es: "🇪🇸 Español", fr: "🇫🇷 Français", "zh-TW": "🇭🇰 繁體中文" };

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

  // 关闭移动端导航菜单
  if (nav?.classList.contains("is-open")) {
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

(function initGlobe() {
  var card = document.querySelector('[data-globe-card]');
  var canvas = document.querySelector('[data-globe-canvas]');
  if (!card || !canvas || typeof THREE === 'undefined') return;

  var scene, camera, renderer, earthMesh;
  var isDragging = false;
  var prevX = 0, prevY = 0;
  var velocityX = 0, velocityY = 0;
  var autoRotate = !reduceMotion;
  var animFrameId;
  var isVisible = false;
  var canvasSize;

  function setupScene() {
    canvasSize = canvas.clientWidth || 260;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.z = 3.8;

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(canvasSize, canvasSize, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    var geometry = new THREE.SphereGeometry(1.25, 64, 64);

    var loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';
    var texture = loader.load(
      'https://unpkg.com/three-globe@2.45.2/example/img/earth-blue-marble.jpg',
      function() {
        if (earthMesh) earthMesh.material.needsUpdate = true;
      }
    );

    var material = new THREE.MeshPhongMaterial({
      map: texture,
      specular: 0x222222,
      shininess: 12
    });

    earthMesh = new THREE.Mesh(geometry, material);
    scene.add(earthMesh);

    var ambientLight = new THREE.AmbientLight(0x506080, 1.4);
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    var fillLight = new THREE.DirectionalLight(0x8899cc, 0.6);
    fillLight.position.set(-3, -1, -3);
    scene.add(fillLight);

    var atmosphereGeom = new THREE.SphereGeometry(1.33, 64, 64);
    var atmosphereMat = new THREE.MeshPhongMaterial({
      color: 0x4a90d9,
      transparent: true,
      opacity: 0.07,
      side: THREE.FrontSide
    });
    var atmosphere = new THREE.Mesh(atmosphereGeom, atmosphereMat);
    scene.add(atmosphere);
  }

  function resize() {
    var size = canvas.clientWidth || canvasSize;
    if (!size || size === canvasSize) return;
    renderer.setSize(size, size, false);
    canvasSize = size;
  }

  function animate() {
    animFrameId = requestAnimationFrame(animate);

    if (!isVisible) return;

    if (!isDragging && autoRotate) {
      earthMesh.rotation.y += 0.0025;
    }

    velocityX *= 0.94;
    velocityY *= 0.94;
    earthMesh.rotation.y += velocityX;
    earthMesh.rotation.x += velocityY;
    earthMesh.rotation.x = Math.max(-Math.PI / 2.4, Math.min(Math.PI / 2.4, earthMesh.rotation.x));

    renderer.render(scene, camera);
  }

  function onPointerDown(e) {
    e.preventDefault();
    isDragging = true;
    prevX = e.clientX;
    prevY = e.clientY;
    velocityX = 0;
    velocityY = 0;
    card.style.cursor = 'grabbing';
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    var dx = e.clientX - prevX;
    var dy = e.clientY - prevY;
    velocityX = dx * 0.006;
    velocityY = dy * 0.006;
    prevX = e.clientX;
    prevY = e.clientY;
  }

  function onPointerUp() {
    isDragging = false;
    card.style.cursor = '';
  }

  function setupEvents() {
    card.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      isVisible = entry.isIntersecting;
    });
  }, { threshold: 0.1 });

  setupScene();
  setupEvents();
  animate();
  observer.observe(card);

  window.addEventListener('resize', function() {
    resize();
  });

  if (autoRotate) {
    var mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    mql.addEventListener('change', function(e) {
      autoRotate = !e.matches;
    });
  }
})();

applyLang(currentLang);
