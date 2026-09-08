# Yingjie Xiao — Personal Academic Site

A quiet, editorial portfolio for computational linguistics research. The site is built with Jekyll and deployed as a fully static GitHub Pages site. It has no database, paid CMS, JavaScript framework, or runtime service.

## Site structure

| File or folder | What it controls |
| --- | --- |
| `index.html` | Home page and selected-content previews |
| `about.html` | Biography, research interests, and contact block |
| `research.html` | Publications and presentations |
| `experience.html` | Education, work, and teaching timeline |
| `_data/main_info.yaml` | Identity, biography, links, and research interests |
| `_data/publications.yaml` | Publications and research outputs |
| `_data/talks.yaml` | Conference talks and presentations |
| `_data/experience.yaml` | Education and employment history |
| `_data/classes.yaml` | Teaching experience |
| `_layouts/` | Shared page shells for pages and projects |
| `libs/custom/my_css.css` | Complete visual design system and responsive layout |
| `libs/custom/my_js.js` | Mobile navigation, filters, and restrained reveal effects |
| `assets/` | Profile image, PDFs, the TW-Kai subset, and other static files |

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

The homepage portrait uses two aligned images. `profile_depth_photo` is the person-free background plate, and `profile_depth_foreground` is a full-size PNG with a transparent background containing only the person. Keep both files at the same aspect ratio and pixel dimensions so the layers stay aligned. Put replacements in `assets/profile-pics/`, then update both paths in `_data/main_info.yaml`.

`profile_pic` and `profile_turntable` keep the earlier static portrait and eight-view sprite available. They are not shown on the homepage while the depth portrait is active, so you can switch back later without restoring deleted assets.

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
  --white: #ffffff;
  --ink: #111111;
  --secondary: #656565;
  --faint: #f4f4f2;
  --accent: #74817c;
  --sidebar: 190px;
}
```

Changing these variables updates the whole site consistently. `--white` controls the page background, `--ink` controls primary text, `--secondary` controls supporting text, `--faint` controls the quiet card background, and `--sidebar` controls the desktop navigation width.

## Chinese display labels

The small Traditional Chinese labels use a web subset of Taiwan's official TW-Kai typeface. English remains in Helvetica, except for the homepage name in an OFL Cormorant Garamond subset and the pronunciation in an OFL Libertinus Serif subset. Each subset contains only the glyphs required by the page.

The font is distributed under the SIL Open Font License 1.1. Its attribution notice and complete license are stored in `assets/fonts/FONT-NOTICE.txt` and `assets/fonts/OFL.txt`. If a future page label introduces a new Traditional Chinese character, regenerate the subset or ask a developer to extend it.

## JavaScript and accessibility

All effects are progressive enhancements: content remains available when JavaScript is disabled. Motion is automatically minimized when a visitor enables the operating system's “Reduce Motion” preference. The site deliberately avoids animation libraries and decorative visual effects.

## Deployment and cost

The repository is designed for GitHub Pages. Hosting, the `github.io` address, and HTTPS are free for a public repository. No Cargo, Webflow, server, database, or paid deployment service is required. A separately purchased custom domain is optional.
