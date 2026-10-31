/* Specific research interests and practical tasks. Snippets use illustrative data. */
window.identityTopics = [
  {
    title: 'Language-model Surprisal',
    snippet: {
      language: 'python', label: 'Python · From token probabilities to surprisal', output: 'surprisal',
      code: `from math import log2

# Example conditional probabilities
probabilities = [0.5, 0.125, 0.25, 0.0625]
surprisal = [-log2(p) for p in probabilities]
print(surprisal)  # bits per token`
    }
  },
  {
    title: 'Self-paced Reading Experiments',
    snippet: {
      language: 'javascript', label: 'JavaScript · Randomizing trial order', output: 'randomization',
      code: `// A: cause; B: control
const original = ["A1", "B1", "A2", "B2"];
let trials;
// Demo: redraw an unchanged order
do {
  trials = [...original];
  for (let i = trials.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [trials[i], trials[j]] =
      [trials[j], trials[i]];
  }
} while (trials.every(
  (value, i) => value === original[i]
));`
    }
  },
  { title: 'Implicit Causality & Sentence Processing' },
  { title: 'Pragmatic Inference in Context' },
  {
    title: 'Python-based Data Validation',
    snippet: {
      language: 'python', label: 'Python · Checking missing and invalid values', output: 'validation',
      code: `rows = [
    {"id": 1, "rt": 410},
    {"id": 2, "rt": None},
    {"id": 3, "rt": -5},
]
valid = [r for r in rows
    if isinstance(r["rt"], (int, float))
    and r["rt"] > 0]
print(f"{len(valid)} / {len(rows)} valid")`
    }
  },
  {
    title: 'Dataset Cleaning & Curation',
    snippet: {
      language: 'python', label: 'Python · Cleaning and deduplicating text', output: 'curation',
      code: `raw = [" language ", "", "language", "meaning"]
clean = list(dict.fromkeys(
    value.strip() for value in raw
    if value.strip()
))
print(clean)`
    }
  },
  {
    title: 'Reading-time Analysis with Python',
    snippet: {
      language: 'python', label: 'Python · Summarizing reading times', output: 'reading-times',
      code: `from statistics import mean

reading_times = [410, 395, 432, 408]
mean_rt = mean(reading_times)
print(f"Mean RT: {mean_rt:.2f} ms")`
    }
  },
  { title: 'Corpus-based Language Analysis' }
];
