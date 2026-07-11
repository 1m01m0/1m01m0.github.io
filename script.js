(() => {
  "use strict";

  const root = document.documentElement;
  const gate = document.querySelector("[data-access-gate]");
  const form = document.querySelector("[data-access-form]");
  const passwordInput = document.querySelector("[data-access-password]");
  const revealButton = document.querySelector("[data-access-reveal]");
  const submitButton = document.querySelector("[data-access-submit]");
  const submitLabel = document.querySelector("[data-access-submit-label]");
  const status = document.querySelector("[data-access-status]");
  const payloadNode = document.querySelector("#protected-payload");
  const encoder = typeof window.TextEncoder === "function" ? new window.TextEncoder() : null;
  const decoder = typeof window.TextDecoder === "function" ? new window.TextDecoder("utf-8", { fatal: true }) : null;
  const additionalData = encoder?.encode("emo-static-gate:v1");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let isBusy = false;
  let isUnlocked = false;

  const setStatus = (message, isError = false) => {
    if (!status || !passwordInput) return;
    status.textContent = message;
    status.classList.toggle("is-error", isError);
    passwordInput.setAttribute("aria-invalid", String(isError));
  };

  const setBusy = (busy) => {
    isBusy = busy;
    form?.classList.toggle("is-busy", busy);
    form?.setAttribute("aria-busy", String(busy));
    if (passwordInput) passwordInput.readOnly = busy;
    if (revealButton) revealButton.disabled = busy;
    if (submitButton) submitButton.disabled = busy;
    if (submitLabel) submitLabel.textContent = busy ? "正在验证" : "解锁访问";
  };

  const showFatalError = (message) => {
    setBusy(false);
    setStatus(message, true);
    if (passwordInput) passwordInput.disabled = true;
    if (revealButton) revealButton.disabled = true;
    if (submitButton) submitButton.disabled = true;
  };

  const base64ToBytes = (value) => {
    const binary = window.atob(value);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    return bytes;
  };

  const validatePayload = (payload) => {
    if (
      payload?.version !== 1 ||
      payload.algorithm !== "AES-256-GCM" ||
      payload.kdf !== "PBKDF2-SHA-256" ||
      !Number.isInteger(payload.iterations) ||
      payload.iterations < 100_000 ||
      typeof payload.salt !== "string" ||
      typeof payload.iv !== "string" ||
      typeof payload.ciphertext !== "string"
    ) {
      throw new Error("Unsupported encrypted payload");
    }

    const salt = base64ToBytes(payload.salt);
    const iv = base64ToBytes(payload.iv);
    const ciphertext = base64ToBytes(payload.ciphertext);

    if (salt.byteLength < 16 || iv.byteLength !== 12 || ciphertext.byteLength <= 16) {
      throw new Error("Invalid encrypted payload");
    }

    return { ...payload, salt, iv, ciphertext };
  };

  const deriveKey = async (password, payload) => {
    if (!encoder) throw new Error("TextEncoder is unavailable");
    const material = await window.crypto.subtle.importKey(
      "raw",
      encoder.encode(password.normalize("NFKC")),
      "PBKDF2",
      false,
      ["deriveKey"],
    );

    return window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        hash: "SHA-256",
        salt: payload.salt,
        iterations: payload.iterations,
      },
      material,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"],
    );
  };

  const decryptBundle = async (key, payload) => {
    if (!decoder || !additionalData) throw new Error("TextDecoder is unavailable");
    const plaintext = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: payload.iv,
        additionalData,
        tagLength: 128,
      },
      key,
      payload.ciphertext,
    );
    const bundle = JSON.parse(decoder.decode(plaintext));

    if (bundle?.version !== 1 || typeof bundle.html !== "string" || typeof bundle.script !== "string") {
      throw new Error("Unsupported protected site bundle");
    }

    return bundle;
  };

  const waitForGateExit = () => {
    if (reduceMotion) return Promise.resolve();
    return new Promise((resolve) => window.setTimeout(resolve, 200));
  };

  const waitForContentPaint = () =>
    new Promise((resolve) => {
      let settled = false;
      let timeoutId;
      const finish = () => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeoutId);
        resolve();
      };

      timeoutId = window.setTimeout(finish, 120);
      window.requestAnimationFrame(() => window.requestAnimationFrame(finish));
    });

  const loadClassicScript = (src, globalName) => {
    if (globalName && window[globalName]) return Promise.resolve(true);

    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.crossOrigin = "anonymous";
      script.onload = () => resolve(true);
      script.onerror = () => {
        script.remove();
        resolve(false);
      };
      document.head.append(script);
    });
  };

  const loadThree = async () => {
    if (window.THREE) return true;

    try {
      window.THREE = await import("./assets/vendor/three.module.js");
      return true;
    } catch {
      return false;
    }
  };

  const prepareProtectedApp = () =>
    Promise.all([
      loadThree(),
      loadClassicScript("assets/vendor/lucide.min.js", "lucide"),
    ]);

  const bootProtectedApp = (source) => {
    const appScript = document.createElement("script");
    appScript.textContent = `${source}\n//# sourceURL=protected-app.js`;
    document.body.append(appScript);
    appScript.remove();
  };

  const copyBodyAttributes = (sourceBody) => {
    for (const attribute of Array.from(document.body.attributes)) {
      document.body.removeAttribute(attribute.name);
    }

    for (const attribute of Array.from(sourceBody.attributes)) {
      document.body.setAttribute(attribute.name, attribute.value);
    }
  };

  const enhanceProtectedNavigation = () => {
    const header = document.querySelector("[data-header]");
    const nav = document.querySelector("[data-nav]");
    const navToggle = document.querySelector("[data-nav-toggle]");

    if (!(header instanceof HTMLElement) || !(nav instanceof HTMLElement) || nav.dataset.enhanced === "true") return;

    const links = Array.from(nav.children).filter(
      (element) => element instanceof HTMLAnchorElement && element.hash.length > 1,
    );
    if (links.length === 0) return;

    nav.dataset.enhanced = "true";

    const navLinks = document.createElement("div");
    navLinks.className = "nav-links";
    nav.insertBefore(navLinks, links[0]);
    links.forEach((link) => navLinks.append(link));

    const indicator = document.createElement("span");
    indicator.className = "nav-active-indicator";
    indicator.setAttribute("aria-hidden", "true");
    navLinks.prepend(indicator);

    const scrim = document.createElement("div");
    scrim.className = "nav-scrim";
    scrim.setAttribute("aria-hidden", "true");
    document.body.append(scrim);

    const sections = links
      .map((link) => {
        let id;
        try {
          id = decodeURIComponent(link.hash.slice(1));
        } catch {
          return null;
        }
        const section = document.getElementById(id);
        return section ? { link, section } : null;
      })
      .filter(Boolean);
    const langButton = nav.querySelector("[data-lang-btn]");
    const langPicker = nav.querySelector("[data-lang-picker]");
    const langMenu = nav.querySelector("[data-lang-menu]");
    const langOptions = Array.from(nav.querySelectorAll(".lang-option"));
    const mobileNavQuery = window.matchMedia("(max-width: 1060px)");

    let activeLink = null;
    let scrollFrame = 0;

    const layoutIndicator = () => {
      if (!activeLink) {
        navLinks.classList.remove("has-active");
        return;
      }

      navLinks.style.setProperty("--nav-indicator-x", `${activeLink.offsetLeft}px`);
      navLinks.style.setProperty("--nav-indicator-width", `${activeLink.offsetWidth}px`);
      navLinks.classList.add("has-active");
    };

    const setActiveLink = (nextLink) => {
      if (activeLink === nextLink) {
        layoutIndicator();
        return;
      }

      activeLink = nextLink;
      links.forEach((link) => {
        const isActive = link === activeLink;
        link.classList.toggle("is-active", isActive);
        if (isActive) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
      layoutIndicator();
    };

    const updateNavigationState = () => {
      scrollFrame = 0;
      header.classList.toggle("is-scrolled", window.scrollY > 24);

      const marker = window.scrollY + Math.min(window.innerHeight * 0.36, 320);
      let nextLink = null;
      for (const item of sections) {
        if (item.section.offsetTop <= marker) nextLink = item.link;
        else break;
      }

      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8) {
        nextLink = sections.at(-1)?.link || nextLink;
      }
      setActiveLink(nextLink);
    };

    const scheduleNavigationUpdate = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(updateNavigationState);
    };

    const closeNavigation = () => {
      if (nav.classList.contains("is-open")) navToggle?.click();
    };

    const syncNavigationAvailability = () => {
      const isUnavailable = mobileNavQuery.matches && !nav.classList.contains("is-open");
      nav.toggleAttribute("inert", isUnavailable);
    };

    const navStateObserver = new MutationObserver(syncNavigationAvailability);
    navStateObserver.observe(nav, { attributes: true, attributeFilter: ["class"] });
    syncNavigationAvailability();

    mobileNavQuery.addEventListener("change", (event) => {
      langPicker?.classList.remove("is-open");
      langButton?.setAttribute("aria-expanded", "false");
      if (!event.matches) {
        closeNavigation();
        nav.classList.remove("is-open");
        document.body.classList.remove("nav-open");
        navToggle?.setAttribute("aria-expanded", "false");
      }
      syncNavigationAvailability();
      window.requestAnimationFrame(layoutIndicator);
    });

    scrim.addEventListener("click", closeNavigation);
    window.addEventListener("scroll", scheduleNavigationUpdate, { passive: true });
    window.addEventListener("resize", scheduleNavigationUpdate, { passive: true });

    links.forEach((link) => {
      link.addEventListener("click", () => setActiveLink(link));
    });

    const syncLanguageTabStops = () => {
      const isMenuOpen = Boolean(langPicker?.classList.contains("is-open"));
      langMenu?.toggleAttribute("inert", !isMenuOpen);
      langOptions.forEach((option) => {
        const isActive = option.classList.contains("is-active");
        option.tabIndex = isMenuOpen && isActive ? 0 : -1;
        option.setAttribute("aria-selected", String(isActive));
      });
    };

    syncLanguageTabStops();
    if (typeof MutationObserver === "function" && langOptions.length > 0) {
      const languageObserver = new MutationObserver(syncLanguageTabStops);
      if (langPicker) languageObserver.observe(langPicker, { attributes: true, attributeFilter: ["class"] });
      langOptions.forEach((option) => languageObserver.observe(option, { attributes: true, attributeFilter: ["class"] }));
    }

    langButton?.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowDown") return;
      event.preventDefault();
      if (langButton.getAttribute("aria-expanded") !== "true") langButton.click();
      syncLanguageTabStops();
      (langOptions.find((option) => option.classList.contains("is-active")) || langOptions[0])?.focus();
    });

    langPicker?.addEventListener("focusout", () => {
      window.requestAnimationFrame(() => {
        if (langPicker.contains(document.activeElement)) return;
        langPicker.classList.remove("is-open");
        langButton?.setAttribute("aria-expanded", "false");
        syncLanguageTabStops();
      });
    });

    langOptions.forEach((option, index) => {
      option.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          option.click();
          const focusTarget = mobileNavQuery.matches && !nav.classList.contains("is-open") ? navToggle : langButton;
          focusTarget?.focus({ preventScroll: true });
          return;
        }

        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
        event.preventDefault();
        const direction = event.key === "ArrowDown" ? 1 : -1;
        const nextIndex = (index + direction + langOptions.length) % langOptions.length;
        langOptions.forEach((item, itemIndex) => {
          item.tabIndex = itemIndex === nextIndex ? 0 : -1;
        });
        langOptions[nextIndex]?.focus();
      });
    });

    nav.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest(".lang-option")) {
        window.requestAnimationFrame(() => {
          syncLanguageTabStops();
          layoutIndicator();
          if (mobileNavQuery.matches && !nav.classList.contains("is-open")) {
            navToggle?.focus({ preventScroll: true });
          }
        });
      }
    });

    document.addEventListener("keydown", (event) => {
      if (!nav.classList.contains("is-open")) return;

      if (event.key === "Escape") {
        if (langPicker?.classList.contains("is-open")) return;
        event.preventDefault();
        closeNavigation();
        navToggle?.focus({ preventScroll: true });
        return;
      }

      if (event.key !== "Tab" || !mobileNavQuery.matches) return;
      const focusable = [navToggle, ...nav.querySelectorAll('a, button, .lang-option[tabindex="0"]')].filter((element) => {
        if (!(element instanceof HTMLElement) || element.offsetParent === null) return false;
        if (element.classList.contains("lang-option")) {
          return Boolean(element.closest("[data-lang-picker]")?.classList.contains("is-open"));
        }
        return true;
      });
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    if (typeof ResizeObserver === "function") {
      const resizeObserver = new ResizeObserver(layoutIndicator);
      resizeObserver.observe(navLinks);
      links.forEach((link) => resizeObserver.observe(link));
    }

    updateNavigationState();
  };

  const enhanceProjectGrid = () => {
    const grid = document.querySelector(".project-grid");
    if (!(grid instanceof HTMLElement)) return;

    const cards = Array.from(grid.querySelectorAll(".project-card"));
    if (cards.length === 0) return;

    grid.dataset.projectRail = "true";
    grid.tabIndex = 0;
    grid.setAttribute("role", "region");
    grid.setAttribute("aria-labelledby", "research-title");
    cards.forEach((card) => card.removeAttribute("data-tilt"));

    let previousVisibleSignature = "";
    const syncVisibleCount = () => {
      const visibleCards = cards.filter((card) => !card.classList.contains("is-hidden"));
      const visibleSignature = visibleCards.map((card) => cards.indexOf(card)).join(",");
      grid.dataset.visibleCount = String(visibleCards.length);
      if (previousVisibleSignature && visibleSignature !== previousVisibleSignature) grid.scrollLeft = 0;
      previousVisibleSignature = visibleSignature;
    };

    if (typeof MutationObserver === "function") {
      const cardObserver = new MutationObserver(syncVisibleCount);
      cards.forEach((card) => cardObserver.observe(card, { attributes: true, attributeFilter: ["class"] }));
    }
    syncVisibleCount();
  };

  const enhanceStoryPresentation = () => {
    const hero = document.querySelector("[data-hero]");
    const heroCopy = hero?.querySelector(".hero-copy");
    if (!(hero instanceof HTMLElement) || !(heroCopy instanceof HTMLElement) || hero.dataset.storyEnhanced === "true") return;

    hero.dataset.storyEnhanced = "true";
    document.body.classList.add("story-layout");
    hero.querySelector("[data-tech-canvas]")?.remove();
    hero.querySelector(".hero-motion")?.remove();
    hero.querySelector(".hero-console")?.remove();

    const stage = document.createElement("div");
    stage.className = "hero-stage";

    const visual = document.createElement("figure");
    visual.className = "hero-product";
    visual.setAttribute("aria-hidden", "true");

    const image = document.createElement("img");
    image.src = "assets/claude-workspace.png";
    image.alt = "";
    image.width = 1600;
    image.height = 1600;
    image.decoding = "async";
    image.fetchPriority = "high";
    visual.append(image);

    hero.prepend(stage);
    stage.append(visual, heroCopy);

    let storyFrame = 0;
    const updateStoryProgress = () => {
      storyFrame = 0;
      if (reduceMotion) {
        hero.style.setProperty("--story-progress", "0");
        return;
      }

      const rect = hero.getBoundingClientRect();
      const travel = Math.max(hero.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(-rect.top / travel, 0), 1);
      hero.style.setProperty("--story-progress", progress.toFixed(4));
    };

    const scheduleStoryProgress = () => {
      if (storyFrame) return;
      storyFrame = window.requestAnimationFrame(updateStoryProgress);
    };

    window.addEventListener("scroll", scheduleStoryProgress, { passive: true });
    window.addEventListener("resize", scheduleStoryProgress, { passive: true });
    updateStoryProgress();
  };

  const focusProtectedContent = () => {
    let focusTarget = document.querySelector("#top");

    if (window.location.hash.length > 1) {
      try {
        const targetId = decodeURIComponent(window.location.hash.slice(1));
        focusTarget = document.getElementById(targetId) || focusTarget;
      } catch {
        // A malformed fragment should not prevent the protected page from opening.
      }
    }

    if (!(focusTarget instanceof HTMLElement)) return;

    focusTarget.setAttribute("tabindex", "-1");
    focusTarget.focus({ preventScroll: true });
    focusTarget.addEventListener("blur", () => focusTarget.removeAttribute("tabindex"), { once: true });

    if (window.location.hash.length > 1) {
      const header = document.querySelector("[data-header]");
      const headerOffset = header instanceof HTMLElement ? Math.ceil(header.getBoundingClientRect().bottom + 16) : 96;
      const targetTop = focusTarget.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: Math.max(0, targetTop), behavior: "auto" });
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  };

  const mountProtectedSite = async (bundle) => {
    const parsed = new DOMParser().parseFromString(bundle.html, "text/html");
    parsed.body.querySelectorAll("script").forEach((script) => script.remove());
    await prepareProtectedApp();

    const protectedDescription = parsed.head.querySelector('meta[name="description"]')?.content;
    const currentDescription = document.head.querySelector('meta[name="description"]');
    if (parsed.title) document.title = parsed.title;
    if (protectedDescription && currentDescription) currentDescription.content = protectedDescription;
    if (parsed.documentElement.lang) root.lang = parsed.documentElement.lang;

    root.classList.add("is-unlocking");
    await waitForGateExit();

    const fragment = document.createDocumentFragment();
    for (const child of Array.from(parsed.body.childNodes)) {
      fragment.append(document.importNode(child, true));
    }

    copyBodyAttributes(parsed.body);
    document.body.replaceChildren(fragment);
    root.classList.remove("is-gated", "is-unlocking");
    enhanceProtectedNavigation();
    enhanceProjectGrid();
    enhanceStoryPresentation();

    await waitForContentPaint();
    bootProtectedApp(bundle.script);
    focusProtectedContent();
  };

  const announceWrongPassword = () => {
    setBusy(false);
    setStatus("密码不正确，请重试。", true);
    form?.classList.remove("is-shaking");
    window.requestAnimationFrame(() => form?.classList.add("is-shaking"));
    if (passwordInput) {
      passwordInput.value = "";
      passwordInput.focus({ preventScroll: true });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isBusy || isUnlocked || !passwordInput) return;

    let candidate = passwordInput.value;
    if (candidate.length === 0) {
      setStatus("请输入访问密码。", true);
      passwordInput.focus({ preventScroll: true });
      return;
    }

    setStatus("正在安全验证…");
    setBusy(true);

    let bundle;
    try {
      const key = await deriveKey(candidate, protectedPayload);
      candidate = "";
      passwordInput.value = "";
      bundle = await decryptBundle(key, protectedPayload);
    } catch {
      candidate = "";
      announceWrongPassword();
      return;
    }

    isUnlocked = true;
    try {
      setStatus("密码正确，正在加载页面…");
      await mountProtectedSite(bundle);
    } catch {
      isUnlocked = false;
      showFatalError("密码已通过，但页面加载失败。请刷新后重试。");
    }
  };

  const trapFocus = (event) => {
    if (event.key !== "Tab" || isUnlocked || !gate) return;
    const focusable = Array.from(
      gate.querySelectorAll('input:not(:disabled), button:not(:disabled), [href], [tabindex]:not([tabindex="-1"])'),
    ).filter((element) => element instanceof HTMLElement && element.offsetParent !== null);

    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  let protectedPayload;
  try {
    if (!gate || !form || !passwordInput || !submitButton || !status || !payloadNode) {
      throw new Error("Password gate markup is incomplete");
    }
    if (!window.crypto?.subtle || !encoder || !decoder) {
      throw new Error("Web Crypto is unavailable");
    }

    protectedPayload = validatePayload(JSON.parse(payloadNode.textContent));
  } catch {
    showFatalError("安全验证组件无法启动，请使用最新版浏览器后重试。");
    return;
  }

  revealButton?.addEventListener("click", () => {
    if (!passwordInput) return;
    const willReveal = passwordInput.type === "password";
    passwordInput.type = willReveal ? "text" : "password";
    revealButton.textContent = willReveal ? "隐藏" : "显示";
    revealButton.setAttribute("aria-pressed", String(willReveal));
    passwordInput.focus({ preventScroll: true });
  });

  passwordInput.addEventListener("input", () => {
    form.classList.remove("is-shaking");
    if (passwordInput.getAttribute("aria-invalid") === "true") setStatus("");
  });

  form.addEventListener("submit", handleSubmit);
  document.addEventListener("keydown", trapFocus);
  window.addEventListener("pageshow", (event) => {
    if (event.persisted && !root.classList.contains("is-gated")) window.location.reload();
  });

  window.requestAnimationFrame(() => passwordInput.focus({ preventScroll: true }));
})();
