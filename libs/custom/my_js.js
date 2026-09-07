/* The JavaScript layer is progressive enhancement; all content remains usable without it. */
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  initializeNavigation();
  initializeScrollEffects(reducedMotion);
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
