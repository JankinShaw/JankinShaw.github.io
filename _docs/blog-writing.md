# Writing a blog post

Use **Markdown** for the article body and **YAML front matter** for its metadata. You do not need HTML.

## Start a post

1. Copy `_blog_preview/_templates/post.md` into `_blog_preview/_posts/`.
2. Name it `YYYY-MM-DD-short-title.md`, for example `2026-11-08-reading-notes.md`. Use the publication date; future-dated posts stay hidden until that date by default.
3. Change the title and topic, then write below the closing `---`.
4. Run `bash _blog_preview/serve.sh` from the repository root and open http://127.0.0.1:4001/. Refresh after saving.

## Metadata

```yaml
---
title: "Reading notes"
topic: Reading
topic_id: reading
lang: en
---
```

- `title`: article title. Keep quotation marks, especially if the title includes a colon.
- `topic`: visible category name, such as `Essays`, `Language`, or `Reading`.
- `topic_id`: matching URL anchor, such as `essays`, `language`, or `reading`. Use lowercase letters and hyphens, consistently for the same category.
- `lang`: article language, such as `en` or `de`.
- The filename supplies the date and URL slug; `2026-11-08-reading-notes.md` becomes `/reading-notes/` in the local blog.

## Markdown basics

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
