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
});

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
