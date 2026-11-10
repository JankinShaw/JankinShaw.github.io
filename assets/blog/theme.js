(() => {
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  const storageKey = 'blog-color-theme';
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
  } catch (_) {}
  const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : system.matches;
  document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.theme-toggle');
    if (!button) return;
    const update = () => {
      const label = isDark() ? 'Switch to light mode' : 'Switch to dark mode';
      button.setAttribute('aria-label', label);
      button.setAttribute('title', label);
      button.setAttribute('aria-pressed', String(isDark()));
    };
    button.addEventListener('click', () => {
      const theme = isDark() ? 'light' : 'dark';
      root.dataset.theme = theme;
      try { localStorage.setItem(storageKey, theme); } catch (_) {}
      update();
    });
    system.addEventListener('change', update);
    window.addEventListener('storage', event => {
      if (event.key !== storageKey) return;
      if (event.newValue === 'light' || event.newValue === 'dark') root.dataset.theme = event.newValue;
      else delete root.dataset.theme;
      update();
    });
    update();
    button.hidden = false;
  });
})();
