(() => {
  const root = document.documentElement;
  const button = document.querySelector('.theme-toggle');
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : media.matches;
  const update = () => {
    const dark = isDark();
    button.setAttribute('aria-pressed', String(dark));
    button.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
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

(() => {
  const filters = [...document.querySelectorAll('[data-tag-filter]')];
  if (!filters.length) return;
  const posts = [...document.querySelectorAll('[data-post-tags]')].map(element => ({
    element, tags: JSON.parse(element.dataset.postTags)
  }));
  const update = () => {
    const active = filters.find(link => link.hash === location.hash) || filters[0];
    const tag = active.dataset.tagFilter;
    filters.forEach(link => {
      if (link === active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    let visible = 0;
    posts.forEach(({element, tags}) => {
      element.hidden = !!tag && !tags.includes(tag);
      if (!element.hidden) visible++;
    });
    document.querySelector('.tag-empty').hidden = visible !== 0;
  };
  window.addEventListener('hashchange', update);
  update();
})();
