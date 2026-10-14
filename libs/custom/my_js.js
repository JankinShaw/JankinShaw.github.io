/* Content and navigation work without JavaScript. */
document.addEventListener("DOMContentLoaded", () => {
  initializeAccessibilityOptions();
  const language = initializeLanguage();
  initializeLanguageControls(language);
  initializeTLDRSecret();
  initializeFilters();
  initializeFooterYear();
});

function initializeAccessibilityOptions() {
  const root = document.documentElement;
  const toggle = document.querySelector("[data-accessibility-toggle]");
  const panel = document.querySelector("[data-accessibility-panel]");
  const close = document.querySelector("[data-accessibility-close]");
  if (!toggle || !panel) return;

  const read = (key, fallback) => {
    try { return localStorage.getItem(key) || fallback; } catch (_) { return fallback; }
  };
  const write = (key, value) => {
    try { localStorage.setItem(key, value); } catch (_) { /* Preferences remain active for this page. */ }
  };
  const applySize = (size) => {
    root.dataset.textSize = size;
    panel.querySelectorAll("[data-text-size]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.textSize === size));
    });
  };
  const applySetting = (name, enabled) => {
    root.classList.toggle(name === "contrast" ? "user-high-contrast" : "user-reduced-motion", enabled);
    const input = panel.querySelector(`[data-accessibility-setting="${name}"]`);
    if (input) input.checked = enabled;
    if (name === "motion") {
      if (enabled) {
        document.getAnimations().forEach((animation) => animation.cancel());
        document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
      }
      document.dispatchEvent(new CustomEvent("reduced-motion-change", { detail: { enabled } }));
    }
  };
  const closePanel = (restoreFocus = false) => {
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    if (restoreFocus) toggle.focus();
  };

  applySize(read("accessibility-text-size", "default"));
  applySetting("contrast", read("accessibility-contrast", "false") === "true");
  applySetting("motion", read("accessibility-motion", "false") === "true");

  toggle.addEventListener("click", () => {
    const opening = panel.hidden;
    panel.hidden = !opening;
    toggle.setAttribute("aria-expanded", String(opening));
    if (opening) panel.querySelector("button, input, a")?.focus();
  });
  close?.addEventListener("click", () => closePanel(true));
  panel.querySelectorAll("[data-text-size]").forEach((button) => {
    button.addEventListener("click", () => {
      applySize(button.dataset.textSize);
      write("accessibility-text-size", button.dataset.textSize);
    });
  });
  panel.querySelectorAll("[data-accessibility-setting]").forEach((input) => {
    input.addEventListener("change", () => {
      applySetting(input.dataset.accessibilitySetting, input.checked);
      write(`accessibility-${input.dataset.accessibilitySetting}`, String(input.checked));
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) closePanel(true);
  });
  document.addEventListener("click", (event) => {
    if (!panel.hidden && !panel.contains(event.target) && !toggle.contains(event.target)) closePanel();
  });
}

function initializeLanguageControls(language) {
  const buttons = document.querySelectorAll("[data-language-select]");
  if (!buttons.length) return;
  const update = () => {
    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.languageSelect === document.documentElement.lang));
    });
  };
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      language.cancel();
      language.apply(button.dataset.languageSelect);
      update();
    });
  });
  document.addEventListener("language-selected", update);
  update();
}

/* Three quick taps on the pronunciation open the hidden language museum. */
function initializeTLDRSecret() {
  const door = document.querySelector("[data-tldr-door]");
  if (!door) return;
  let taps = 0;
  let resetTimer = null;
  door.addEventListener("click", () => {
    taps += 1;
    clearTimeout(resetTimer);
    door.classList.remove("is-listening");
    void door.offsetWidth;
    door.classList.add("is-listening");
    if (taps >= 3) {
      door.classList.add("is-opening");
      window.setTimeout(() => { window.location.href = door.dataset.tldrHref; }, 420);
      return;
    }
    resetTimer = window.setTimeout(() => { taps = 0; }, 1800);
  });
}

/* Translate only known text and attributes; preserve academic names and links. */
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
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const original = node.textContent;
    records.push({ node, original, translated: original.match(/^\s*/)[0] + translations[normalize(original)] + original.match(/\s*$/)[0] });
  }
  const attributes = [];
  document.querySelectorAll("[aria-label], [alt], meta[name='description']").forEach((element) => {
    ["aria-label", "alt", "content"].forEach((name) => {
      const original = element.getAttribute(name);
      if (original && translations[normalize(original)]) attributes.push({ element, name, original, translated: translations[normalize(original)] });
    });
  });
  const title = document.title;
  const pageName = title.split(" — ")[0];
  const apply = (locale) => {
    records.forEach(({node, original, translated}) => { node.textContent = locale === "de" ? translated : original; });
    attributes.forEach(({element, name, original, translated}) => element.setAttribute(name, locale === "de" ? translated : original));
    document.documentElement.lang = locale;
    document.title = locale === "de" ? title.replace(pageName, translations[pageName] || pageName) : title;
    try { sessionStorage.setItem("site-language", locale); } catch (_) { /* Storage is optional. */ }
    document.dispatchEvent(new Event("language-selected"));
  };
  let locale = "en";
  try { if (document.querySelector("[data-language-select]") && sessionStorage.getItem("site-language") === "de") locale = "de"; } catch (_) { /* Storage is optional. */ }
  apply(locale);
  return { apply, cancel() {} };
}

function initializeFilters() {
  document.querySelectorAll("[data-filter-group]").forEach((group) => {
    const buttons = group.querySelectorAll("[data-filter]");
    const items = group.querySelectorAll("[data-filter-item]");

    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.classList.contains("is-active")));
      button.addEventListener("click", () => {
        const selected = button.dataset.filter;

        buttons.forEach((candidate) => {
          candidate.classList.toggle("is-active", candidate === button);
          candidate.setAttribute("aria-pressed", String(candidate === button));
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
