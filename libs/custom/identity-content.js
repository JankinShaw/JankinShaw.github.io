/* Three concise examples: language models, experiments, and practical data work. */
window.identityTopics = [
  {
    title: 'Next-token Prediction · PyTorch',
    snippet: {
      language: 'python', label: 'Language models · From scores to a prediction', output: 'next-token',
      code: `import torch

tokens = ["language", "meaning", "data"]
# Example scores from a language model
logits = torch.tensor([2.1, 0.7, -0.2])
probs = torch.softmax(logits, dim=-1)
next_token = tokens[probs.argmax().item()]
print(next_token)`
    }
  },
  {
    title: 'Self-paced Reading · JavaScript',
    snippet: {
      language: 'javascript', label: 'Experiment design · Randomizing trial order', output: 'randomization',
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
  {
    title: 'Data Validation & Cleaning · Python',
    snippet: {
      language: 'python', label: 'Data quality · Preparing usable records', output: 'data-quality',
      code: `rows = [
    {"id": 1, "text": " language "},
    {"id": 2, "text": ""},
    {"id": 3, "text": None},
]
clean = [
    {"id": r["id"], "text": r["text"].strip()}
    for r in rows
    if isinstance(r["text"], str)
    and r["text"].strip()
]
print(f"{len(clean)} / {len(rows)} ready")`
    }
  }
];
