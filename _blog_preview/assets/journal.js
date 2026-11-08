(() => {
  const root = document.documentElement;
  const button = document.querySelector('.theme-toggle');
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : media.matches;
  const update = () => {
    const dark = isDark();
    button.setAttribute('aria-pressed', String(dark));
    button.setAttribute('aria-label', dark ? '切换为浅色' : '切换为深色');
  };
  button.hidden = false;
  update();
  media.addEventListener('change', update);
  button.addEventListener('click', () => {
    root.dataset.theme = isDark() ? 'light' : 'dark';
    try { localStorage.setItem('journal-theme', root.dataset.theme); } catch (_) {}
    update();
  });
})();
