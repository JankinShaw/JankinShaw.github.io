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
  initializeRainbowText();
  initializeRainbowBloom();
});

/* A one-second dwell releases a soft, uneven ink wash across the viewport. */
function initializeRainbowBloom() {
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
  const stop = () => {
    clearTimeout(delay);
    if (frame !== null) cancelAnimationFrame(frame);
    delay = null;
    frame = null;
    word = null;
    canvas.classList.remove("is-blooming");
  };

  const bloom = () => {
    delay = null;
    if (!word || !allowed.matches) return;
    const rect = word.getBoundingClientRect();
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
      context.clearRect(0, 0, width, height);
      context.save();
      context.beginPath();
      for (let i = 0; i <= 144; i++) {
        const angle = i / 144 * Math.PI * 2;
        const ripple = 1 + 0.12 * Math.sin(angle * 3 + progress * 2)
          + 0.075 * Math.cos(angle * 5 - progress * 3)
          + 0.035 * Math.sin(angle * 9 + progress);
        const px = x + Math.cos(angle) * radius * ripple;
        const py = y + Math.sin(angle) * radius * ripple;
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
      frame = progress < 1 ? requestAnimationFrame(render) : null;
    };
    frame = requestAnimationFrame(render);
  };

  document.addEventListener("pointerover", (event) => {
    if (!allowed.matches || event.pointerType === "touch") return;
    const next = event.target.closest(".rainbow-word");
    if (next === word) return;
    stop();
    if (!next) return;
    word = next;
    delay = setTimeout(bloom, 1000);
  });
  document.addEventListener("pointerout", (event) => {
    if (word && !word.contains(event.relatedTarget)) stop();
  });
  window.addEventListener("scroll", stop, { passive: true });
  window.addEventListener("resize", stop);
  window.addEventListener("blur", stop);
  document.addEventListener("pointercancel", stop);
  document.addEventListener("visibilitychange", stop);
  allowed.addEventListener("change", stop);
}

/* Wrap words without changing text, links, whitespace, or line-breaking behavior. */
function initializeRainbowText() {
  document.querySelectorAll("main, .site-header").forEach((root) => {
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
