/* Local dictionaries only: no external translation service or network request. */
(() => {
  const locales = ['en', 'de', 'fr'];
  const normalize = value => value.trim().replace(/\s+/g, ' ');
  const entries = window.siteLocaleData || {};
  const dictionaries = { en: {}, de: {}, fr: {} };
  if (typeof germanTranslations !== 'undefined') Object.assign(dictionaries.de, germanTranslations);
  Object.entries(entries).forEach(([key, values]) => {
    ['de', 'fr'].forEach((locale, index) => { dictionaries[locale][key] = values[index]; });
  });
  let locale = 'en';
  const translate = (value, language = locale) => {
    if (language === 'en') return value;
    const clean = normalize(value);
    const dictionary = dictionaries[language];
    let translated = dictionary[clean];
    // Mixed-content lists put a dash and the job title into a single text node.
    if (!translated && clean.startsWith('— ')) {
      const tail = dictionary[clean.slice(2)];
      if (tail) translated = '— ' + tail;
    }
    if (!translated && clean.includes(' — ')) {
      const parts = clean.split(' — ');
      if (parts.some(part => dictionary[part])) translated = parts.map(part => dictionary[part] || part).join(' — ');
    }
    return translated ? value.match(/^\s*/)[0] + translated + value.match(/\s*$/)[0] : value;
  };
  const records = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return node.parentElement.closest('script, style, [data-no-translate], .identity-animation')
        ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    }
  });
  while (walker.nextNode()) records.push({node: walker.currentNode, original: walker.currentNode.textContent});
  const attributes = [];
  document.querySelectorAll('[alt], [aria-label], meta[name="description"]').forEach(element => {
    if (element.closest('[data-no-translate], .identity-animation')) return;
    ['alt', 'aria-label', 'content'].forEach(name => {
      if (element.hasAttribute(name)) attributes.push({element, name, original: element.getAttribute(name)});
    });
  });
  const originalTitle = document.title;
  const apply = next => {
    if (!locales.includes(next)) return;
    locale = next;
    document.documentElement.lang = next;
    document.documentElement.dataset.locale = next;
    records.forEach(({node, original}) => { node.textContent = translate(original); });
    attributes.forEach(({element, name, original}) => element.setAttribute(name, translate(original)));
    const titleParts = originalTitle.split(' — ');
    document.title = titleParts.map(part => translate(part)).join(' — ');
    document.querySelectorAll('[data-site-language]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.siteLanguage === next));
    });
    try { localStorage.setItem('site-locale', next); } catch (_) { /* Storage is optional. */ }
    document.dispatchEvent(new CustomEvent('site-language-change', {detail: {locale: next}}));
  };
  window.siteI18n = { t: translate, apply, get locale() { return locale; } };
  document.querySelectorAll('[data-site-language]').forEach(button => {
    button.addEventListener('click', () => apply(button.dataset.siteLanguage));
  });
  let saved = 'en';
  try { saved = localStorage.getItem('site-locale') || 'en'; } catch (_) { /* Use English by default. */ }
  apply(locales.includes(saved) ? saved : 'en');
})();
