/* Small previews computed from the same example inputs as the displayed snippets.
   Python snippets are not executed in the browser. No fabricated training metrics. */
(() => {
  const compute = (kind, rng = Math.random) => {
    if (kind === 'surprisal') {
      const probabilities = [.5, .125, .25, .0625];
      return {kind, values: probabilities.map(p => -Math.log2(p))};
    }
    if (kind === 'validation') {
      const rows = [{id: 1, rt: 410}, {id: 2, rt: null}, {id: 3, rt: -5}];
      return {kind, rows, valid: rows.filter(row => typeof row.rt === 'number' && row.rt > 0)};
    }
    if (kind === 'curation') {
      const raw = [' language ', '', 'language', 'meaning'];
      return {kind, raw, clean: [...new Set(raw.map(value => value.trim()).filter(Boolean))]};
    }
    if (kind === 'randomization') {
      const before = ['A1', 'B1', 'A2', 'B2'];
      let after;
      // Demonstration-only constraint: redraw if the original order is sampled.
      do {
        after = [...before];
        for (let i = after.length - 1; i > 0; i--) {
          const j = Math.floor(rng() * (i + 1));
          [after[i], after[j]] = [after[j], after[i]];
        }
      } while (after.every((value, i) => value === before[i]));
      return {kind, before, after};
    }
    if (kind === 'reading-times') {
      const values = [410, 395, 432, 408];
      return {kind, values, mean: values.reduce((sum, value) => sum + value, 0) / values.length};
    }
    return null;
  };
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const svgNode = (tag, attributes) => {
    const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, String(value)));
    return node;
  };
  const render = (kind, host, t = value => value) => {
    const data = compute(kind);
    host.replaceChildren(); host.hidden = true;
    if (!data) return;
    host.dataset.result = kind;
    host.setAttribute('role', 'group');
    host.setAttribute('aria-label', t('Example output'));
    host.append(element('p', 'result-kicker', t('Example output')));
    if (kind === 'surprisal') {
      host.append(element('p', 'result-title', t('Token surprisal')));
      const chart = svgNode('svg', {viewBox: '0 0 144 94', role: 'img', 'aria-label': '1, 3, 2, 4 bits'});
      data.values.forEach((value, i) => {
        chart.append(svgNode('rect', {x: 12 + i * 34, y: 76 - value * 16, width: 20, height: value * 16, fill: '#597f86'}));
        const label = svgNode('text', {x: 22 + i * 34, y: 90, 'text-anchor': 'middle', 'font-size': 9, fill: '#666'});
        label.textContent = String(value); chart.append(label);
      });
      host.append(chart, element('p', 'result-note', t('Bits per token · Example probabilities')));
    } else if (kind === 'validation') {
      host.append(element('p', 'result-title', t('Data quality check')));
      const table = element('table', 'validation-preview');
      data.rows.forEach(row => {
        const tr = element('tr');
        tr.append(element('td', '', String(row.id)), element('td', '', row.rt === null ? 'None' : String(row.rt)), element('td', '', row.rt > 0 ? t('Valid') : t('Flagged')));
        table.append(tr);
      });
      host.append(table, element('p', 'result-value', `${data.valid.length} / ${data.rows.length}`), element('p', 'result-note', t('Valid records')));
    } else if (kind === 'curation') {
      host.append(element('p', 'result-title', t('Clean dataset')));
      host.append(element('p', 'result-note', t('Trim · Remove blanks · Deduplicate')));
      host.append(element('pre', 'console-preview', data.clean.map(value => `"${value}"`).join('\n')));
      host.append(element('p', 'result-value', `${data.raw.length} → ${data.clean.length}`), element('p', 'result-note', t('Rows before → after')));
    } else if (kind === 'randomization') {
      host.append(element('p', 'result-title', t('Trial order')));
      [ ['Before', data.before], ['After', data.after] ].forEach(([label, trials]) => {
        host.append(element('p', 'result-note', t(label)));
        const row = element('div', 'trial-preview');
        trials.forEach((trial, i) => {
          const token = element('span', trial[0] === 'A' ? 'trial-token condition-a' : 'trial-token condition-b', trial);
          token.style.setProperty('--cell-delay', `${i * 85}ms`); row.append(token);
        });
        host.append(row);
      });
      host.append(element('p', 'result-note', t('2 cause · 2 control')));
    } else if (kind === 'reading-times') {
      host.append(element('p', 'result-title', t('Reading times')));
      const chart = svgNode('svg', {viewBox: '0 0 144 94', role: 'img', 'aria-label': `${t('Mean RT')}: ${data.mean.toFixed(2)} ms`});
      const baseline = 76, scale = 60 / 450;
      chart.append(svgNode('line', {x1: 6, y1: baseline, x2: 138, y2: baseline, stroke: '#d8dddb'}));
      data.values.forEach((value, i) => {
        const bar = svgNode('rect', {x: 14 + i * 32, y: baseline - value * scale, width: 18, height: value * scale, fill: '#597f86', class: 'result-bar'});
        bar.style.setProperty('--cell-delay', `${i * 80}ms`); chart.append(bar);
        const label = svgNode('text', {x: 23 + i * 32, y: 90, 'text-anchor': 'middle', fill: '#777', 'font-size': 8});
        label.textContent = String(i + 1); chart.append(label);
      });
      chart.append(svgNode('line', {x1: 6, x2: 138, y1: baseline - data.mean * scale, y2: baseline - data.mean * scale, stroke: '#9b572a', 'stroke-dasharray': '3 2'}));
      host.append(chart, element('p', 'result-value', `${data.mean.toFixed(2)} ms`), element('p', 'result-note', t('Mean RT')));
    }
    host.hidden = false;
  };
  window.identityResults = {compute, render};
})();
