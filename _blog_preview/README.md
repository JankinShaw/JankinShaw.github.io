# Local journal prototype

This is a standalone Jekyll source directory inside the existing Jekyll checkout. The main site's layouts, styles, pages, navigation, and production configuration are unchanged. Jekyll ignores `_blog_preview` during a normal root build because the directory starts with an underscore. Do not add it to the production `include` list.

## Preview

From the repository root:

```sh
bash _blog_preview/serve.sh
```

Open http://127.0.0.1:4001. Stop with Ctrl-C. The script generates the site in a temporary directory, binds only to loopback, and disables disk caching. No publication is performed.

## Edit

- `_layouts/base.html`: independent blog shell and navigation.
- `_layouts/post.html`: article template.
- `assets/journal.css`: independent colors, typography, and responsive styles.
- `_posts/YYYY-MM-DD-slug.md`: Markdown articles; filename determines date and URL.
- `index.html`, `writing.html`, `topics.html`, `about.md`: homepage, archive, topics, about.

Sample posts have been removed. Copy `_templates/post.md` to `_posts/YYYY-MM-DD-slug.md` to start writing; see [the writing guide](../_docs/blog-writing.md). Templates and instructions are not published as blog articles. Original articles in `_archive/` retain their real content and dates. The blog has no analytics, external font requests, framework, or new Ruby dependency. ET Book fonts and their license are copied from the existing site's font assets. Chinese uses available system serif fonts. A light/dark toggle uses local browser storage, with an OS preference fallback.

Design inspiration: James Zhan's [V4 redesign discussion](https://journal.james-zhan.com/redesign-v4/). This is an original Jekyll implementation, not a copy of his source, content, or branding. The typeface differs from his Rosario font.

## Original blog archive

The `_archive/` collection preserves the two original posts byte for byte, including their original front matter, dates, tags, and text:

- `2025-02-24-german-learning.md`
- `2025-02-24-my-first-post.md`

Commit `35e5dbdd49f3215fb09fd962143a12681c0490d5` deleted them on 2026-09-07. They were restored from that commit's parent, the final revision before deletion. Visit `/archive/` on the local preview server to read them. Archived pages identify them as original archived articles rather than samples. The existing main site's `/archive/` academic homepage is unchanged; it runs under a separate Jekyll source and is not the preview's `/archive/`.

## Later integration

After selecting the design, move the layouts into the main site's `_layouts` under unique names, move stylesheet/script/fonts into a blog-specific asset directory, create a `blog` collection (or use posts), set URLs under `/blog/`, and add a single Blog link to the existing navigation. Check all routes using Jekyll's `relative_url`. This prototype is deliberately not wired into the production site yet.
