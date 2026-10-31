/* Keep the animated identity decorative; the complete list is available to assistive technology. */
(() => {
  const text = document.querySelector('[data-identity-text]');
  const button = document.querySelector('[data-identity-pause]');
  if (!text || !button) return;
  const container = text.closest('.identity-animation');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const words = [
    "Computational Linguistics",
    "Language Models",
    "Surprisal",
    "Language Prediction",
    "Language Comprehension",
    "Human Sentence Processing",
    "Psycholinguistics",
    "Predictive Processing",
    "Expectation and Prediction",
    "Next-Word Prediction",
    "Contextual Representations",
    "Semantic Processing",
    "Pragmatic Inference",
    "Implicit Causality",
    "Causal Inference",
    "Incremental Processing",
    "Lexical Access",
    "Reading Times",
    "Information Theory",
    "Human–Model Alignment"
  ];
  const fonts = ['geist', 'terminal', 'book'];
  let fontIndex = 0;
  const line = text.closest('.identity-line');
  line.dataset.font = fonts[fontIndex];
  let index = 0, position = words[0].length, deleting = true, paused = false, timer;
  const schedule = (delay) => {
    clearTimeout(timer);
    if (!paused && !motion.matches && !document.hidden) timer = setTimeout(tick, delay);
  };
  const tick = () => {
    position += deleting ? -1 : 1;
    text.textContent = words[index].slice(0, position);
    if (position === 0) {
      deleting = false;
      index = (index + 1) % words.length;
      fontIndex = (fontIndex + 1) % fonts.length;
      line.dataset.font = fonts[fontIndex];
      schedule(400);
    } else if (position === words[index].length) {
      deleting = true;
      schedule(2100);
    } else schedule(deleting ? 40 : 85);
  };
  const update = () => {
    clearTimeout(timer);
    button.hidden = motion.matches;
    container.classList.toggle('is-paused', paused || motion.matches);
    if (motion.matches) {
      index = 0; position = words[0].length; deleting = true;
      fontIndex = 0; line.dataset.font = fonts[0];
      text.textContent = words[0];
    } else schedule(1800);
  };
  button.addEventListener('click', () => {
    paused = !paused;
    button.setAttribute('aria-pressed', String(paused));
    button.setAttribute('aria-label', paused ? 'Resume text animation' : 'Pause text animation');
    button.textContent = paused ? '▷' : 'Ⅱ';
    update();
  });
  motion.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  update();
})();

// Limit these restrictions to gallery images; navigation and text remain usable.
document.querySelectorAll('.photo-grid img').forEach((image) => {
  image.addEventListener('dragstart', (event) => event.preventDefault());
  image.addEventListener('contextmenu', (event) => event.preventDefault());
});
