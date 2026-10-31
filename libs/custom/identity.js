/* Topic first, then its matching code. Snippets are highlighted, never executed. */
(() => {
  const text = document.querySelector('[data-identity-text]');
  const button = document.querySelector('[data-identity-pause]');
  const topics = window.identityTopics;
  if (!text || !button || !topics?.length) return;
  const container = text.closest('.identity-animation');
  const line = text.closest('.identity-line');
  const caption = container.querySelector('[data-identity-caption]');
  const accessible = container.querySelector('.identity-accessible');
  const result = container.querySelector('[data-identity-result]');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const t = value => window.siteI18n?.t(value) || value;
  const random = (min, max) => min + Math.random() * (max - min);
  const fonts = ['geist', 'terminal', 'book'];
  const highlighter = window.hljs;
  // Detect once from complete snippets. Partial input is too ambiguous to classify reliably.
  const languages = new Map(topics.filter(topic => topic.snippet).map(topic => {
    const snippet = topic.snippet;
    const detected = highlighter?.highlightAuto(snippet.code, ['python', 'javascript']).language;
    return [snippet, detected === snippet.language ? detected : snippet.language];
  }));
  let entries, index = 0, position = 0, phase = 'typing', paused = false, timer;
  let fontIndex = 0, delay = 1100, dueAt = 0, typingPace = random(32, 65);
  const makeEntries = () => topics.flatMap(topic => {
    const word = {kind: 'word', topic: t(topic.title), text: t(topic.title)};
    return topic.snippet ? [word, {
      kind: 'code', topic: t(topic.title), text: topic.snippet.code,
      label: t(topic.snippet.label), language: languages.get(topic.snippet), output: topic.snippet.output
    }] : [word];
  });
  const renderStyle = () => {
    const entry = entries[index];
    if (result) { result.hidden = true; result.replaceChildren(); }
    container.classList.toggle('has-example', entry.kind === 'code');
    line.dataset.kind = entry.kind;
    line.dataset.phase = phase;
    line.dataset.language = entry.language || '';
    line.dataset.topic = entry.topic;
    line.dataset.font = entry.kind === 'code' ? 'terminal' : fonts[fontIndex];
    if (caption) {
      caption.replaceChildren();
      caption.hidden = entry.kind !== 'code';
      if (!caption.hidden) {
        const title = document.createElement('span');
        title.className = 'identity-code-topic'; title.textContent = entry.topic;
        const label = document.createElement('span');
        label.className = 'identity-code-label'; label.textContent = entry.label;
        caption.append(title, label);
      }
    }
  };
  const renderText = () => {
    const entry = entries[index];
    const source = entry.text.slice(0, position);
    if (entry.kind === 'code' && highlighter) {
      // highlight() escapes the source; no source HTML is injected directly.
      text.innerHTML = highlighter.highlight(source, {language: entry.language, ignoreIllegals: true}).value;
    } else text.textContent = source;
    line.dataset.phase = phase;
  };
  const blocked = () => paused || motion.matches || document.hidden;
  const schedule = duration => {
    clearTimeout(timer); delay = duration;
    if (!blocked()) { dueAt = Date.now() + duration; timer = setTimeout(tick, duration); }
  };
  const advance = () => {
    index = (index + 1) % entries.length;
    position = 0; phase = 'typing';
    if (entries[index].kind === 'word') fontIndex = (fontIndex + 1) % fonts.length;
    typingPace = random(32, 65);
    renderStyle(); renderText(); schedule(random(120, 250));
  };
  const tick = () => {
    const entry = entries[index];
    const code = entry.kind === 'code';
    if (phase === 'hold') {
      // Move from the topic to its code without slowly erasing the heading first.
      if (entry.kind === 'word' && entries[(index + 1) % entries.length].kind === 'code') return advance();
      phase = 'deleting';
      if (result) result.hidden = true;
    }
    if (phase === 'typing') {
      // Code arrives in fast bursts; words retain a human typing rhythm.
      position = Math.min(entry.text.length, position + (code ? Math.floor(random(4, 9)) : 1));
      if (position === entry.text.length) {
        phase = 'hold'; renderText();
        if (code && result && window.identityResults) window.identityResults.render(entry.output, result, t);
        return schedule(code ? 7000 : random(1100, 1700));
      }
      renderText();
      const char = entry.text[position - 1];
      const pause = char === '\n' ? random(15, 45) : !code && (char === ' ' || Math.random() < .05) ? random(60, 140) : 0;
      schedule((code ? random(5, 12) : typingPace * random(.6, 1.4)) + pause);
    } else {
      position = Math.max(0, position - (code ? Math.floor(random(10, 19)) : 1));
      renderText();
      if (!position) return advance();
      schedule(code ? random(5, 10) : random(12, 28));
    }
  };
  const updateControls = () => {
    button.hidden = motion.matches;
    button.setAttribute('aria-label', t(paused ? 'Resume text animation' : 'Pause text animation'));
    button.setAttribute('aria-pressed', String(paused));
    button.textContent = paused ? '▷' : 'Ⅱ';
    container.classList.toggle('is-paused', paused || motion.matches);
  };
  const freeze = () => { delay = Math.max(0, dueAt - Date.now()); clearTimeout(timer); };
  const reset = () => {
    clearTimeout(timer); entries = makeEntries(); index = 0; fontIndex = 0;
    position = entries[0].text.length; phase = 'hold';
    renderStyle(); renderText(); updateControls();
    if (accessible) accessible.textContent = topics.map(topic => t(topic.title)).join(' · ') + '. ' + t('Illustrative Python and JavaScript examples for language research and data quality.');
    container.setAttribute('aria-label', t('Research & practical skills'));
    schedule(1100);
  };
  button.addEventListener('click', () => {
    if (!paused) freeze();
    paused = !paused; updateControls();
    if (!paused) schedule(delay);
  });
  document.addEventListener('site-language-change', reset);
  motion.addEventListener('change', reset);
  document.addEventListener('visibilitychange', () => { if (document.hidden) freeze(); else schedule(delay); });
  reset();
})();

document.querySelectorAll('.photo-grid img').forEach(image => {
  image.addEventListener('dragstart', event => event.preventDefault());
  image.addEventListener('contextmenu', event => event.preventDefault());
});
