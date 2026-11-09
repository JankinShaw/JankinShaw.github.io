# Personal Website

Jekyll · GitHub Pages · HTML / CSS / JavaScript · Markdown / YAML

## Structure

- `index.html` — homepage; other root HTML files define individual pages.
- `_data/` — profile, publications, talks, teaching, and experience data.
- `_layouts/` — shared page layouts; `_includes/` — reusable components.
- `libs/custom/` — styles, scripts, and language support.
- `assets/` — images, fonts, PDFs, and other static files.
- `_config.yml` — site settings and build configuration.
- `blog/` — blog pages; `_posts/` — articles; `_blog_archive/` — historical articles.
- `_previews/` — independent local prototypes: `preview-1/` (Journal), `preview-2/` (minimal).
- `_archive/blog/` — complete snapshots of earlier blog designs.
- `_docs/` — detailed personal maintenance notes.

## How to change items

- **Profile / biography:** edit `_data/main_info.yaml`.
- **Publications / talks:** edit `_data/publications.yaml` or `_data/talks.yaml`.
- **Teaching:** edit `_data/classes.yaml`.
- **Experience:** edit `_data/experience.yaml` or `_data/industry.yaml`.
- **Page content:** edit the corresponding root HTML file.
- **Layout / navigation:** edit `_layouts/default.html`.
- **Appearance / behavior:** edit files in `libs/custom/`.
- **Blog entry:** add `_posts/YYYY-MM-DD-title.md`.
- **Local preview:** run `bundle exec jekyll serve`.
- **One-click preview (macOS):** double-click `Preview.command`.

Full maintenance guide: [`_docs/README.md`](./_docs/README.md).
