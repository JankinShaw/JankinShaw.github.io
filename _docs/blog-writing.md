# Writing a blog post

Use **Markdown** for the article body and **YAML front matter** for its metadata. You do not need HTML.

## Start a post

1. Copy `_blog_preview/_templates/post.md` into `_blog_preview/_posts/`.
2. Name it `YYYY-MM-DD-short-title.md`, for example `2026-11-08-reading-notes.md`. Use the publication date; future-dated posts stay hidden until that date by default.
3. Change the title and tags, then write below the closing `---`.
4. Run `bash _blog_preview/serve.sh` from the repository root and open http://127.0.0.1:4001/. Refresh after saving.

## Metadata

```yaml
---
title: "Reading notes"
tags: [Reading, Notes]
lang: en
---
```

- `title`: article title. Keep quotation marks, especially if the title includes a colon.
- `tags`: a list of keywords, for example `[German, Writing]`. A post can have several tags and appears under each one on `/tags/`. Reuse the same spelling and capitalization. Link anchors are generated automatically; no `topic_id` is needed.
- `lang`: article language, such as `en` or `de`.
- The filename supplies the date and URL slug; `2026-11-08-reading-notes.md` becomes `/reading-notes/` in the local blog.

## Math

Post pages automatically render LaTeX math with MathJax. Write inline math as `$F$` or `$x^2 + y^2$`. For a display equation, leave blank lines around the block:

```text
$$
P(A \mid B) = \frac{P(B \mid A)P(A)}{P(B)}
$$
```

Do not put equations inside backticks or a code fence when you want them rendered. Use `\$` for a literal dollar sign. MathJax is loaded from a pinned CDN URL, so the first load requires internet access. Set `math: false` in front matter to disable it on an individual post. Historical design snapshots remain unchanged.

## Markdown syntax


````markdown
A paragraph is ordinary text. Leave a blank line between paragraphs.

## Section heading

### Smaller heading

**Bold text**, *italic text*, and `inline code`.

[Link text](https://example.com)

- First bullet
- Second bullet

1. First step
2. Second step

> A quotation.

![Description of the image](/assets/images/example.jpg)

```python
print("Hello")
```

| Column A | Column B |
| --- | --- |
| Item | Value |
````

The post title is already rendered as the main heading; start body headings at `##`. A single line break usually continues the same paragraph. Image paths refer to actual files inside `_blog_preview/assets/`, not your main site's separate assets directory.

Templates remain under `_templates/`, outside the published post collection. Historical posts remain in `_archive/`; complete earlier designs remain in the repository's `_archive/blog/`.
