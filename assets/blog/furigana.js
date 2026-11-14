/* Authors keep writing 漢字（かな）; only Japanese article text is annotated. */
(() => {
  const language = document.documentElement.lang.toLowerCase();
  if (!/^(?:ja|jp)(?:-|$)/.test(language)) return;

  const prose = document.querySelector('.prose');
  if (!prose) return;

  // Match either bracket style, with kana (and optional spaces) as the reading.
  const annotation = /([\p{Script=Han}々〆ヶ]+)(?:（([\p{Script=Hiragana}\p{Script=Katakana}ー\u3099\u309A]+(?:[ \u3000]+[\p{Script=Hiragana}\p{Script=Katakana}ー\u3099\u309A]+)*)）|\(([\p{Script=Hiragana}\p{Script=Katakana}ー\u3099\u309A]+(?:[ \u3000]+[\p{Script=Hiragana}\p{Script=Katakana}ー\u3099\u309A]+)*)\))/gu;
  const walker = document.createTreeWalker(prose, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return node.parentElement.closest('ruby, code, pre, script, style, textarea, math, svg, .MathJax, mjx-container')
        ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    }
  });
  // Collect first so replacing nodes does not disturb traversal.
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  for (const node of nodes) {
    const matches = [...node.data.matchAll(annotation)];
    if (!matches.length) continue;
    const fragment = document.createDocumentFragment();
    let offset = 0;
    for (const match of matches) {
      fragment.append(node.data.slice(offset, match.index));
      const ruby = document.createElement('ruby');
      const reading = document.createElement('rt');
      reading.textContent = match[2] || match[3];
      ruby.append(match[1]);
      const opening = document.createElement('rp');
      opening.textContent = '（';
      const closing = document.createElement('rp');
      closing.textContent = '）';
      ruby.append(opening, reading, closing);
      fragment.append(ruby);
      offset = match.index + match[0].length;
    }
    fragment.append(node.data.slice(offset));
    node.replaceWith(fragment);
  }
})();
