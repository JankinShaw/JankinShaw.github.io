/* Keep the animated identity decorative; the complete list is available to assistive technology. */
(() => {
  const text = document.querySelector('[data-identity-text]');
  const button = document.querySelector('[data-identity-pause]');
  if (!text || !button) return;
  const container = text.closest('.identity-animation');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const englishWords = [
    "Large Language Models",
    "Computational Psycholinguistics",
    "Pragmatic Inference",
    "Data Science",
    "Python Programming",
    "Data Analysis",
    "Experimental Design",
    "Surprisal-based Language Prediction",
    "Sentence Comprehension",
    "Implicit Causality"
  ];
  let words = englishWords.map(word => window.siteI18n?.t(word) || word);
  const fonts = ['geist', 'terminal', 'book'];
  const randomBetween = (min, max) => min + Math.random() * (max - min);
  let typingPace = randomBetween(55, 115);
  let deletingPace = randomBetween(22, 48);
  let fontIndex = 0;
  const line = text.closest('.identity-line');
  const equation = document.querySelector('[data-attention-math]');
  const showEquation = (show) => {
    if (!equation) return;
    equation.hidden = !show;
    line.classList.toggle('formula-rendered', show);
  };
  line.dataset.font = fonts[fontIndex];
  line.dataset.formula = 'false';
  let index = 0, position = words[0].length, deleting = true, paused = false, timer;
  const schedule = (delay) => {
    clearTimeout(timer);
    if (!paused && !motion.matches && !document.hidden) timer = setTimeout(tick, delay);
  };
  const tick = () => {
    showEquation(false);
    position += deleting ? -1 : 1;
    text.textContent = words[index].slice(0, position);
    if (position === 0) {
      deleting = false;
      index = (index + 1) % words.length;
      fontIndex = (fontIndex + 1) % fonts.length;
      line.dataset.font = fonts[fontIndex];
      line.dataset.formula = String(words[index].startsWith('Attention('));
      typingPace = randomBetween(55, 115);
      deletingPace = randomBetween(22, 48);
      schedule(randomBetween(300, 750));
    } else if (position === words[index].length) {
      deleting = true;
      const isFormula = words[index].startsWith('Attention(');
      showEquation(isFormula);
      schedule(isFormula ? 5500 : randomBetween(1600, 2800));
    } else {
      const previousCharacter = words[index][position - 1];
      const thinkingPause = !deleting && (previousCharacter === ' ' || Math.random() < 0.07)
        ? randomBetween(120, 320) : 0;
      schedule((deleting ? deletingPace : typingPace) * randomBetween(0.55, 1.5) + thinkingPause);
    }
  };
  const update = () => {
    clearTimeout(timer);
    button.setAttribute('aria-label', window.siteI18n?.t(paused ? 'Resume text animation' : 'Pause text animation') || (paused ? 'Resume text animation' : 'Pause text animation'));
    button.hidden = motion.matches;
    container.classList.toggle('is-paused', paused || motion.matches);
    if (motion.matches) {
      index = 0; position = words[0].length; deleting = true;
      fontIndex = 0; line.dataset.font = fonts[0]; line.dataset.formula = 'false';
      showEquation(false);
      text.textContent = words[0];
    } else schedule(1800);
  };
  button.addEventListener('click', () => {
    paused = !paused;
    button.setAttribute('aria-pressed', String(paused));
    button.setAttribute('aria-label', window.siteI18n?.t(paused ? 'Resume text animation' : 'Pause text animation') || (paused ? 'Resume text animation' : 'Pause text animation'));
    button.textContent = paused ? '▷' : 'Ⅱ';
    update();
  });
  const changeLanguage = () => {
    words = englishWords.map(word => window.siteI18n?.t(word) || word);
    index = 0; position = words[0].length; deleting = true;
    text.textContent = words[0];
    const accessible = container.querySelector('.identity-accessible');
    if (accessible) accessible.textContent = words.join(' · ');
    container.setAttribute('aria-label', window.siteI18n?.t('Research interests') || 'Research interests');
    update();
  };
  document.addEventListener('site-language-change', changeLanguage);
  changeLanguage();
  motion.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  update();
})();

// Limit these restrictions to gallery images; navigation and text remain usable.
document.querySelectorAll('.photo-grid img').forEach((image) => {
  image.addEventListener('dragstart', (event) => event.preventDefault());
  image.addEventListener('contextmenu', (event) => event.preventDefault());
});
