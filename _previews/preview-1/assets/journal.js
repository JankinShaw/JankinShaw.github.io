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

(() => {
  const toc = document.querySelector('.post-toc');
  const prose = document.querySelector('.post .prose');
  if (!toc || !prose) return;
  const headings = [...prose.querySelectorAll('h1, h2, h3, h4, h5, h6')]
    .filter(heading => !heading.closest('pre, code'));
  if (!headings.length) return;
  const root = toc.querySelector('ul');
  const ancestors = [];
  headings.forEach((heading, index) => {
    if (!heading.id || document.getElementById(heading.id) !== heading) {
      let id = `section-${index + 1}`;
      while (document.getElementById(id)) id += '-section';
      heading.id = id;
    }
    const level = Number(heading.tagName.slice(1));
    while (ancestors.length && ancestors[ancestors.length - 1].level >= level) ancestors.pop();
    let list = root;
    if (ancestors.length) {
      const parent = ancestors[ancestors.length - 1].item;
      list = parent.querySelector(':scope > ul');
      if (!list) {
        list = document.createElement('ul');
        parent.append(list);
      }
    }
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${encodeURIComponent(heading.id)}`;
    link.textContent = heading.textContent.trim();
    item.append(link);
    list.append(item);
    ancestors.push({level, item});
  });
  toc.open = true;
  toc.hidden = false;
  const links = [...root.querySelectorAll('a')];
  const updateActive = () => {
    let active = 0;
    headings.forEach((heading, index) => {
      if (heading.getBoundingClientRect().top <= 180) active = index;
    });
    links.forEach((link, index) => {
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  let queued = false;
  window.addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { updateActive(); queued = false; });
  }, {passive: true});
  updateActive();
})();

(() => {
  const images = [...document.querySelectorAll('.post .prose img')]
    .filter(image => !image.closest('a, button, picture'));
  if (!images.length) return;
  const dialog = document.createElement('dialog');
  dialog.className = 'image-zoom-dialog';
  dialog.setAttribute('aria-label', 'Image preview');
  const close = document.createElement('button');
  close.className = 'image-zoom-close';
  close.type = 'button';
  close.textContent = '×';
  close.setAttribute('aria-label', 'Close image preview');
  const preview = document.createElement('img');
  dialog.append(close, preview);
  document.body.append(dialog);
  const dismiss = () => dialog.close();
  close.addEventListener('click', dismiss);
  dialog.addEventListener('click', event => {
    if (event.target !== close) dismiss();
  });
  dialog.addEventListener('close', () => document.documentElement.classList.remove('image-zoom-open'));
  images.forEach(image => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'image-zoom-trigger';
    button.setAttribute('aria-label', image.alt ? `Enlarge image: ${image.alt}` : 'Enlarge image');
    image.replaceWith(button);
    button.append(image);
    button.addEventListener('click', () => {
      preview.src = image.currentSrc || image.src;
      preview.alt = image.alt;
      dialog.showModal();
      document.documentElement.classList.add('image-zoom-open');
    });
  });
})();
