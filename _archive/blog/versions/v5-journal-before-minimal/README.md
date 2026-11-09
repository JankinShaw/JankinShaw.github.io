# Journal before minimal design

Complete website source snapshot taken before replacing the live blog with Preview 2. Includes the existing posts, archived posts, layouts, CSS, JS, fonts, includes, configuration and publishing workflow. Academic pages are also included so all dependencies remain recoverable. Git history, caches, secrets and the archive directory itself are excluded.

Preview from repository root:

```sh
python3 _archive/blog/archive.py preview v5-journal-before-minimal --port 18533
```

Open http://127.0.0.1:18533/blog/ . Source is extracted into a temporary folder; original archive is unchanged.

Restore exact source to a new directory:

```sh
python3 _archive/blog/archive.py restore v5-journal-before-minimal /tmp/journal-before-minimal
```
