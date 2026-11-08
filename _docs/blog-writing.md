# Writing a blog post

Use **Markdown** for the article body and **YAML front matter** for its metadata. You do not need HTML.

## Start a post

1. Copy `_templates/blog-post.md` into `_posts/`.
2. Name it `YYYY-MM-DD-short-title.md`, for example `2026-11-08-reading-notes.md`. Use the publication date; future-dated posts stay hidden until that date by default.
3. Change the title and tags, then write below the closing `---`.
4. Run `bundle exec jekyll serve` from the repository root and open http://127.0.0.1:4000/blog/. Refresh after saving.

## Automatic update date

Article pages show “Last updated on …” below the body. `_plugins/git_last_updated.rb` reads the most recent Git commit affecting that file, following renames. No front-matter date needs maintenance. Untracked new files have no update line until committed; uncommitted local edits do not change the date. Formatting and typo commits count as updates; unrelated files and repeat deployments do not.

The production workflow `.github/workflows/pages.yml` fetches full history and builds Jekyll with the plugin enabled. For initial setup, set **Settings → Pages → Build and deployment → Source → GitHub Actions** in the main `JankinShaw.github.io` repository. The branch-based default Pages builder disables custom plugins and cannot provide this automatic date. Afterwards, pushing `master` builds and deploys automatically. Normal local `bundle exec jekyll serve` also computes dates from committed history. Historical standalone snapshots remain unchanged.

## Metadata

Every article automatically displays the author Yingjie Xiao beside its date. Dates use the format `November 8, 2026`. No author field is required.

```yaml
---
title: "Reading notes"
tags: [Reading, Notes]
lang: en
---
```

- `title`: article title. Keep quotation marks, especially if the title includes a colon.
- `tags`: a list of keywords, for example `[German, Writing]`. A post can have several tags and appears under each one on `/blog/tags/`. Reuse the same spelling and capitalization. Link anchors are generated automatically; no `topic_id` is needed.
- `lang`: article language, such as `en` or `de`.
- The filename supplies the date and URL slug; `2026-11-08-reading-notes.md` becomes `/blog/reading-notes/`.

## Images

Article images automatically show a magnifying-glass cursor and open a larger preview when clicked. Click the image/background or press Esc to close. Keyboard users can focus the image button and press Enter. Images already linked to another page keep their existing link behavior. Use ordinary Markdown image syntax; no extra metadata is required.

## Table of Contents

The article template automatically builds a collapsible Table of Contents from Markdown headings (`##`, `###`, etc.) at the beginning of the article, expanded by default and collapsible on all screens. Subheadings are nested; links jump to the matching section. No headings means no visible directory. Use `toc: false` in front matter to disable it on one post. The directory is a JavaScript enhancement; the full article remains readable without JavaScript.

## Math

Post pages automatically render LaTeX math with MathJax. Write inline math as `$F$` or `$x^2 + y^2$`. For a display equation, leave blank lines around the block:

```text
$$
P(A \mid B) = \frac{P(B \mid A)P(A)}{P(B)}
$$
```

Keep `$$` on their own lines with blank lines before and after the block. Kramdown may interpret double-dollar formulas mixed into a prose paragraph as inline math before MathJax receives them.

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

The post title is already rendered as the main heading; start body headings at `##`. A single line break usually continues the same paragraph. Image paths refer to actual files inside `assets/blog/`; use `/assets/blog/…` for their URLs.

Templates remain under `_templates/`, outside the published post collection. Historical articles are in `_blog_archive/` and appear at `/blog/archive/`. Complete earlier designs remain in `_archive/blog/`. The former `_blog_preview/` is retained as a pre-publication copy; edit `_posts/` for the live blog.
