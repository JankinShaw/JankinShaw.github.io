# Yingjie Xiao — Personal Academic Site

A Tufte-inspired academic website with an ivory background, locally hosted ET Book typography, red text navigation, and a continuous reading column. The site is built with Jekyll and deployed as a fully static GitHub Pages site. It has no database, paid CMS, JavaScript framework, or runtime service.

## Site structure

| File or folder | What it controls |
| --- | --- |
| `index.html` | Photograph-only landing page with an Academics link |
| `academics.html` | Original academic homepage, preserved at `/academics/` |
| `beyond-academia.html` | Public speaking, debating, and university theatre |
| `about.html` | Biography, research interests, and contact block |
| `research.html` | Publications and presentations |
| `experience.html` | Education, work, and teaching timeline |
| `_data/main_info.yaml` | Identity, biography, links, and research interests |
| `_data/publications.yaml` | Publications and research outputs |
| `_data/talks.yaml` | Conference talks and presentations |
| `_data/experience.yaml` | Education and employment history |
| `_data/classes.yaml` | Teaching experience |
| `tldr.html` | Hidden interactive language museum at `/tldr/` |
| `_layouts/` | Shared page shells for pages and projects |
| `libs/custom/my_css.css` | Complete visual design system and responsive layout |
| `libs/custom/my_js.js` | Display preferences, English/German language selection, research filters, and hidden-page entry |
| `assets/` | ET Book fonts, pronunciation font, profile images, PDFs, and other static files |

## Preview locally

Ruby and Bundler are required only for local previews. They are not needed by visitors.

```bash
bundle install
bundle exec jekyll serve
```

Open `http://127.0.0.1:4000`. The production site is published by GitHub Pages after changes are pushed to the configured publishing branch.

If Jekyll is already installed globally, `jekyll serve` also works.

## Add or edit personal information

Edit `_data/main_info.yaml`. Keep the indentation exactly as shown because YAML uses spaces to represent structure.

```yaml
name: "Your name"
role: "Your current role"
institution: "Your institution"
bio:
  - "First biography paragraph."
  - "Second biography paragraph."
interests:
  - "First research interest"
  - "Second research interest"
```

The landing page displays `assets/photography/lakeside-tree.jpg` in its original proportions without cropping, with whitespace around the photograph. Its separate layout and `libs/custom/photography.css` use locally hosted Geist (SIL OFL 1.1; license in `assets/fonts/geist/`). The original text-only academic homepage is preserved at `/academics/` with matching sans-serif typography in `libs/custom/academics.css`. Earlier portrait assets and their data fields are retained.

## Add a publication

Add a new item below `papers:` in `_data/publications.yaml`. The newest entries may be placed first for easier maintenance; the Research page sorts them by year.

```yaml
  - title: "Title of the publication"
    year: "2026"
    authors: "Yingjie Xiao and Collaborator Name"
    venue: "Conference or journal name"
    paper_pdf: "/assets/publications/example.pdf"
    slides: "/assets/publications/example-slides.pdf"
    poster:
    video:
    code: "https://github.com/example/project"
    al: y
    sla: n
    selected: y
```

All optional link fields can be left blank. Use `al: y` for Applied Linguistics, `sla: y` for Second Language Acquisition, and `cognition: y` for Cognition. These values power the filters on the Research page.

For a local PDF, copy the file into `assets/publications/` and use a path beginning with `/assets/`. An external HTTPS URL also works.

## Add a talk or presentation

Add an item below `talks:` in `_data/talks.yaml`.

```yaml
  - name: "Conference or event name"
    time: "September 2026"
    title: "Title of the presentation"
    category: "current"
    link: "https://example.com/presentation"
```

## Add education or work experience

Add an item below `experiences:` in `_data/experience.yaml`. Entries appear in file order, so keep the newest item first.

```yaml
  - place: "Institution or company"
    time: "2026 - Present"
    title: "Degree, programme, or job title"
    subtitle: "Optional details"
    category: "school"
```

Use `category: "school"` for education and `category: "work"` for employment.

## Add teaching experience

Add an item below `classes:` in `_data/classes.yaml`.

```yaml
  - name: "Course name"
    time: "Winter 2026"
    title: "Teaching Assistant"
    category: "current"
    link: "https://example.edu/course"
```

## Change colors or spacing

The main visual settings are CSS custom properties at the top of `libs/custom/my_css.css`.

```css
:root {
  --paper: #fffff8;
  --ink: #111;
  --secondary: #555;
  --accent: #a00000;
  --line: #d9d9cf;
}
```

`--paper` controls the background, `--ink` the main text, `--secondary` supporting text, `--accent` navigation and links, and `--line` subtle borders. The desktop reading column is 55% of the available width and expands on mobile.

## Typography

ET Book roman, italic, and bold are served locally from `assets/fonts/et-book/`. The MIT license and attribution are included in that directory. Pronunciation uses the existing Libertinus subset. Earlier font assets and their licenses are retained.

## JavaScript and accessibility

All effects are progressive enhancements: content remains available when JavaScript is disabled. Motion is automatically minimized when a visitor enables the operating system's “Reduce Motion” preference. The site deliberately avoids animation libraries and decorative visual effects.

## Deployment and cost

The repository is designed for GitHub Pages. Hosting, the `github.io` address, and HTTPS are free for a public repository. No Cargo, Webflow, server, database, or paid deployment service is required. A separately purchased custom domain is optional.

Academics uses four compact columns on desktop, two on medium screens, and one on mobile. All academic content is retained.

The landing page now displays a centered 2×2 square image grid: autumn leaf, code study, dictionary, and language models. The website stores only physically cropped square derivatives. Full-frame copies are excluded from both source assets and the generated site.

`/archive/` preserves the previous academic homepage design with its own layout (`_layouts/archive.html`) and stylesheet (`libs/custom/archive.css`), so future visual changes do not affect it. The archive has no public navigation entry and remains accessible by its direct URL.
