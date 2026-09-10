/* The JavaScript layer is progressive enhancement; all content remains usable without it. */
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  initializeNavigation();
  initializeScrollEffects(reducedMotion);
  initializeDepthPortrait(reducedMotion);
  initializePortraitTurntable(reducedMotion);
  initializeFilters();
  initializeFooterYear();
  const language = initializeLanguage();
  initializeRainbowText();
  initializeRainbowBloom(language);
});

function sparkleWord(element) {
  if (!element.animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  element.animate([
    { opacity: 0.15, filter: "blur(3px)", textShadow: "0 0 12px #fff, 0 0 20px #b5a1ff" },
    { opacity: 1, filter: "blur(0px)", textShadow: "0 0 6px #fff, 0 0 10px #77dbe9", offset: 0.45 },
    { opacity: 1, filter: "blur(0px)", textShadow: "0 0 0 transparent" }
  ], { duration: 600, easing: "ease-out" });
}

/* Clipped copies of the old word fly apart while its real replacement stays selectable. */
function initializeWordShatter() {
  const layer = document.createElement("div");
  layer.className = "word-shards";
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);
  const clips = ["polygon(0 0, 58% 0, 42% 55%, 0 80%)", "polygon(58% 0, 100% 0, 100% 55%, 42% 55%)", "polygon(0 80%, 42% 55%, 65% 100%, 0 100%)", "polygon(42% 55%, 100% 55%, 100% 100%, 65% 100%)"];
  return (element) => {
    if (!element.animate || layer.childElementCount > 160) return;
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    clips.forEach((clip, index) => {
      const shard = document.createElement("span");
      shard.className = "word-shard";
      shard.textContent = element.textContent;
      Object.assign(shard.style, {
        left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`,
        font: style.font, lineHeight: `${rect.height}px`, letterSpacing: style.letterSpacing,
        color: style.color, clipPath: clip, textShadow: "0 0 3px white, 0 0 8px #b4a0ff"
      });
      layer.appendChild(shard);
      const signX = index % 2 ? 1 : -1;
      const signY = index < 2 ? -1 : 1;
      const animation = shard.animate([
        { transform: "translate(0, 0) rotate(0deg)", opacity: 1, filter: "brightness(1)" },
        { opacity: 1, filter: "brightness(2)", offset: 0.18 },
        { transform: `translate(${signX * (18 + index * 7)}px, ${signY * (15 + index * 5)}px) rotate(${signX * 18}deg) scale(0.4)`, opacity: 0, filter: "brightness(2) blur(2px)" }
      ], { duration: 620, easing: "cubic-bezier(.16,1,.3,1)" });
      animation.finished.then(() => shard.remove(), () => shard.remove());
    });
  };
}

/* Keep both copies in stable inline containers, including after word wrapping. */
function initializeLanguage() {
  const normalize = (text) => text.trim().replace(/\s+/g, " ");
  const translations = typeof germanTranslations === "undefined" ? {} : germanTranslations;
  const records = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return node.parentElement.closest("script, style, [data-no-translate]") || !translations[normalize(node.textContent)]
        ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    const original = node.textContent;
    const translated = original.match(/^\s*/)[0] + translations[normalize(original)] + original.match(/\s*$/)[0];
    const element = document.createElement("span");
    element.textContent = original;
    node.replaceWith(element);
    records.push({ element, original, translated });
  });
  const attributes = [];
  document.querySelectorAll("[aria-label], [alt], meta[name='description']").forEach((element) => {
    if (element.closest("[data-no-translate]")) return;
    ["aria-label", "alt", "content"].forEach((name) => {
      const original = element.getAttribute(name);
      if (original && translations[normalize(original)]) {
        attributes.push({element, name, original, translated: translations[normalize(original)]});
      }
    });
  });
  const title = document.title;
  const pageName = title.split(" — ")[0];
  const shatter = initializeWordShatter();
  let selected = "en";
  let target = "de";
  let waveRecords = [];
  try {
    const saved = sessionStorage.getItem("site-language");
    if (saved === "en" || saved === "de") { selected = saved; }
  } catch (_) { /* The switch also works when browser storage is unavailable. */ }

  const apply = (locale, persist = true) => {
    waveRecords = [];
    selected = locale;
    if (persist) {
      try { sessionStorage.setItem("site-language", locale); } catch (_) { /* Optional persistence. */ }
    }
    records.forEach(({element, original, translated}) => {
      element.textContent = locale === "de" ? translated : original;
      element.removeAttribute("lang");
    });
    attributes.forEach(({element, name, original, translated}) => element.setAttribute(name, locale === "de" ? translated : original));
    document.documentElement.lang = locale;
    document.title = locale === "de" ? title.replace(pageName, translations[pageName] || pageName) : title;
    initializeRainbowText();
    document.dispatchEvent(new Event("language-selected"));
  };
  if (selected === "de") apply("de", false);
  return {
    apply,
    canAuto: () => waveRecords.length === 0,
    finish: () => apply(target),
    begin: (origin) => {
      if (origin) { shatter(origin); sparkleWord(origin); }
      target = selected === "en" ? "de" : "en";
      waveRecords = records.map((record) => {
        const words = Array.from(record.element.querySelectorAll(".rainbow-word"));
        const destination = target === "de" ? record.translated : record.original;
        const targets = destination.trim().split(/\s+/);
        // Preserve the authored German sentence order, even when word counts differ.
        const slots = words.length ? words.map((element, index) => ({
          element,
          text: targets.slice(
            Math.round(index * targets.length / words.length),
            Math.round((index + 1) * targets.length / words.length)
          ).join(" "),
          done: false
        })) : [{element: record.element, text: destination, done: false}];
        return {record, slots, destination, done: false};
      });
    },
    advance: (contains) => {
      // Read all positions before writing text; German reflow is measured next frame.
      const reached = [];
      waveRecords.forEach((entry) => {
        if (entry.done) return;
        entry.slots.forEach((slot) => {
          if (slot.done) return;
          const rect = slot.element.getBoundingClientRect();
          if (rect.width && rect.height && rect.bottom > 0 && rect.top < window.innerHeight &&
              rect.right > 0 && rect.left < window.innerWidth &&
              contains(rect.left + rect.width / 2, rect.top + rect.height / 2)) reached.push(slot);
        });
      });
      reached.forEach((slot) => {
        shatter(slot.element);
        slot.element.textContent = slot.text;
        slot.element.lang = target;
        sparkleWord(slot.element);
        slot.done = true;
      });
      waveRecords.forEach((entry) => {
        if (entry.done || !entry.slots.every((slot) => slot.done)) return;
        entry.done = true;
        entry.record.element.textContent = entry.destination;
        entry.record.element.lang = target;
        initializeRainbowText([entry.record.element]);
        sparkleWord(entry.record.element);
      });
    },
    cancel: () => {
      if (!waveRecords.length) return;
      waveRecords.forEach(({record}) => {
        record.element.textContent = selected === "de" ? record.translated : record.original;
        record.element.removeAttribute("lang");
      });
      waveRecords = [];
      initializeRainbowText();
    }
  };
}

/* Each fresh dwell toggles the current language in either direction. */
function initializeRainbowBloom(language) {
  const allowed = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
  const canvas = document.createElement("canvas");
  canvas.className = "rainbow-bloom";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  const context = canvas.getContext("2d");
  if (!context) return;

  let word = null;
  let delay = null;
  let frame = null;
  let running = false;
  const stop = () => {
    clearTimeout(delay);
    if (frame !== null) cancelAnimationFrame(frame);
    delay = null;
    frame = null;
    word = null;
    running = false;
    language.cancel();
    canvas.classList.remove("is-blooming");
  };

  const bloom = () => {
    delay = null;
    if (!word || !allowed.matches || !language.canAuto()) return;
    const rect = word.getBoundingClientRect();
    running = true;
    language.begin(word);
    const width = window.innerWidth;
    const height = window.innerHeight;
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const reach = Math.hypot(Math.max(x, width - x), Math.max(y, height - y)) * 1.42;
    const colors = ["#d4bcfa", "#a8d9fc", "#a9ecdf", "#c9edb2", "#ffe498", "#ffc0a7", "#f3bcdc"];
    const paint = context.createLinearGradient(0, height * 0.15, width, height * 0.85);
    colors.forEach((color, index) => paint.addColorStop(index / (colors.length - 1), color));
    const started = performance.now();
    canvas.classList.add("is-blooming");

    const render = (now) => {
      const progress = Math.min((now - started) / 6500, 1);
      const radius = 8 + reach * (progress * progress * (3 - 2 * progress));
      const edgeAt = (angle) => radius * (1 + 0.12 * Math.sin(angle * 3 + progress * 2)
        + 0.075 * Math.cos(angle * 5 - progress * 3)
        + 0.035 * Math.sin(angle * 9 + progress));
      context.clearRect(0, 0, width, height);
      context.save();
      context.beginPath();
      for (let i = 0; i <= 144; i++) {
        const angle = i / 144 * Math.PI * 2;
        const px = x + Math.cos(angle) * edgeAt(angle);
        const py = y + Math.sin(angle) * edgeAt(angle);
        if (i === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      }
      context.closePath();
      context.clip();
      context.fillStyle = paint;
      context.fillRect(0, 0, width, height);
      // Translucent pools soften the bands into a watercolor-like spectrum.
      [[0.2, 0.75, "#cbb7fa"], [0.55, 0.2, "#fff0b9"], [0.85, 0.65, "#f6b8d8"]].forEach(([cx, cy, color]) => {
        const pool = context.createRadialGradient(width * cx, height * cy, 0, width * cx, height * cy, Math.max(width, height) * 0.55);
        pool.addColorStop(0, color);
        pool.addColorStop(1, "transparent");
        context.fillStyle = pool;
        context.fillRect(0, 0, width, height);
      });
      context.restore();
      // The visible flood edge and the translation boundary share the same geometry.
      language.advance((px, py) => Math.hypot(px - x, py - y) <= edgeAt(Math.atan2(py - y, px - x)));
      frame = progress < 1 ? requestAnimationFrame(render) : null;
      if (progress === 1) {
        language.finish();
        stop();
      }
    };
    frame = requestAnimationFrame(render);
  };

  const trackWord = (event) => {
    if (running || !language.canAuto() || !allowed.matches || event.pointerType === "touch") return;
    const next = event.target.closest(".rainbow-word");
    if (next === word) return;
    stop();
    if (!next) return;
    word = next;
    delay = setTimeout(bloom, 1000);
  };
  document.addEventListener("pointerover", trackWord);
  document.addEventListener("pointermove", trackWord);
  document.addEventListener("pointerout", (event) => {
    if (!running && word && !word.contains(event.relatedTarget)) stop();
  });
  window.addEventListener("scroll", () => { if (!running) stop(); }, { passive: true });
  window.addEventListener("resize", stop);
  window.addEventListener("blur", stop);
  document.addEventListener("pointercancel", stop);
  document.addEventListener("visibilitychange", stop);
  allowed.addEventListener("change", stop);
  document.addEventListener("language-selected", stop);
}

/* Wrap words without changing text, links, whitespace, or line-breaking behavior. */
function initializeRainbowText(roots = document.querySelectorAll("main, .site-header, .site-footer")) {
  roots.forEach((root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.textContent.trim() || node.parentElement.closest(
          "script, style, pre, code, textarea, button, .sr-only, .pronunciation, .rainbow-word, [aria-hidden='true']"
        )) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (!part.trim()) {
          fragment.appendChild(document.createTextNode(part));
          return;
        }
        const word = document.createElement("span");
        word.className = "rainbow-word";
        word.textContent = part;
        fragment.appendChild(word);
      });
      node.replaceWith(fragment);
    });
  });
}

/* Keep the compact navigation accessible on small screens. */
function initializeNavigation() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const navigation = document.querySelector("[data-site-nav]");

  if (!toggle || !navigation) return;

  const closeNavigation = () => {
    toggle.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNavigation);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNavigation();
  });

  document.addEventListener("click", (event) => {
    if (!navigation.contains(event.target) && !toggle.contains(event.target)) {
      closeNavigation();
    }
  });
}

/* Create a restrained two-layer parallax effect from one source photograph. */
function initializeDepthPortrait(reducedMotion) {
  const portrait = document.querySelector("[data-depth-portrait]");
  if (!portrait || reducedMotion) return;

  const stage = portrait.querySelector(".depth-stage");
  if (!stage) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let animationFrame = null;

  const render = () => {
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    stage.style.setProperty("--depth-x", `${currentX * 5.5}px`);
    stage.style.setProperty("--depth-y", `${currentY * 4.2}px`);
    stage.style.setProperty("--depth-bg-x", `${currentX * -1.6}px`);
    stage.style.setProperty("--depth-bg-y", `${currentY * -1.2}px`);
    stage.style.setProperty("--depth-rotate-x", `${currentY * -1.2}deg`);
    stage.style.setProperty("--depth-rotate-y", `${currentX * 1.45}deg`);
    stage.style.setProperty("--depth-light-x", `${50 + currentX * 18}%`);
    stage.style.setProperty("--depth-light-y", `${42 + currentY * 16}%`);

    const distance = Math.abs(targetX - currentX) + Math.abs(targetY - currentY);
    if (distance > 0.002) {
      animationFrame = requestAnimationFrame(render);
    } else {
      animationFrame = null;
    }
  };

  const requestRender = () => {
    if (animationFrame === null) animationFrame = requestAnimationFrame(render);
  };

  const update = (clientX, clientY) => {
    const bounds = stage.getBoundingClientRect();
    targetX = Math.max(-1, Math.min(1, ((clientX - bounds.left) / bounds.width) * 2 - 1));
    targetY = Math.max(-1, Math.min(1, ((clientY - bounds.top) / bounds.height) * 2 - 1));
    requestRender();
  };

  const reset = () => {
    targetX = 0;
    targetY = 0;
    requestRender();
  };

  portrait.addEventListener("pointermove", (event) => update(event.clientX, event.clientY));
  portrait.addEventListener("pointerleave", reset);
  portrait.addEventListener("pointercancel", reset);
}

/* Blend adjacent views from one sprite sheet for a crisp, lightweight turntable. */
function initializePortraitTurntable(reducedMotion) {
  const turntable = document.querySelector("[data-portrait-turntable]");
  if (!turntable) return;

  const stage = turntable.querySelector(".portrait-stage");
  const layerA = turntable.querySelector(".portrait-layer-a");
  const layerB = turntable.querySelector(".portrait-layer-b");
  const sprite = turntable.dataset.sprite;
  if (!stage || !layerA || !layerB || !sprite) return;

  const layers = [layerA, layerB];
  const columns = 4;
  const frames = 8;
  let angle = 0;
  let velocity = 0;
  let pointerX = 0;
  let dragging = false;
  let lastTime = performance.now();

  layers.forEach((layer) => {
    layer.style.backgroundImage = `url("${sprite}")`;
  });

  const setFrame = (layer, frame) => {
    const normalized = (frame + frames) % frames;
    const column = normalized % columns;
    const row = Math.floor(normalized / columns);
    layer.style.backgroundPosition = `${(column / (columns - 1)) * 100}% ${row * 100}%`;
  };

  const render = () => {
    const wrapped = ((angle % frames) + frames) % frames;
    const lower = Math.floor(wrapped);
    const blend = wrapped - lower;
    setFrame(layerA, lower);
    setFrame(layerB, lower + 1);
    layerA.style.opacity = String(1 - blend);
    layerB.style.opacity = String(blend);
  };

  const animate = (time) => {
    const elapsed = Math.min(time - lastTime, 32);
    lastTime = time;
    if (!dragging && !reducedMotion) {
      if (Math.abs(velocity) > 0.00008) {
        angle += velocity * elapsed;
        velocity *= Math.pow(0.985, elapsed);
      } else {
        velocity = 0;
        angle += (Math.round(angle) - angle) * Math.min(1, elapsed / 90);
      }
      render();
    }
    requestAnimationFrame(animate);
  };

  turntable.addEventListener("pointerdown", (event) => {
    dragging = true;
    pointerX = event.clientX;
    velocity = 0;
    turntable.setPointerCapture(event.pointerId);
    turntable.classList.add("is-dragging");
  });

  turntable.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const delta = event.clientX - pointerX;
    pointerX = event.clientX;
    angle -= delta / 72;
    velocity = -delta / 3500;
    render();
  });

  const endDrag = (event) => {
    if (!dragging) return;
    dragging = false;
    turntable.classList.remove("is-dragging");
    if (turntable.hasPointerCapture(event.pointerId)) {
      turntable.releasePointerCapture(event.pointerId);
    }
  };

  turntable.addEventListener("pointerup", endDrag);
  turntable.addEventListener("pointercancel", endDrag);
  turntable.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    angle += event.key === "ArrowLeft" ? -0.25 : 0.25;
    render();
  });

  stage.classList.add("is-ready");
  render();
  requestAnimationFrame(animate);
}

/* Reveal sections once as the reader moves through the page. */
function initializeScrollEffects(reducedMotion) {
  const reveals = document.querySelectorAll(".reveal");

  if (reducedMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((element) => element.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 }
    );

    reveals.forEach((element) => observer.observe(element));
  }

}

/* Filter research entries without requiring a page reload. */
function initializeFilters() {
  document.querySelectorAll("[data-filter-group]").forEach((group) => {
    const buttons = group.querySelectorAll("[data-filter]");
    const items = group.querySelectorAll("[data-filter-item]");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const selected = button.dataset.filter;

        buttons.forEach((candidate) => {
          candidate.classList.toggle("is-active", candidate === button);
        });

        items.forEach((item) => {
          const categories = (item.dataset.categories || "").split(/\s+/);
          const shouldShow = selected === "all" || categories.includes(selected);
          item.hidden = !shouldShow;
        });
      });
    });
  });
}

/* Keep the footer date accurate without requiring a content edit each year. */
function initializeFooterYear() {
  const year = document.querySelector("[data-current-year]");
  if (year) year.textContent = String(new Date().getFullYear());
}
