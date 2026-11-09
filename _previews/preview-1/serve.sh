#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
preview_destination="$(mktemp -d "${TMPDIR:-/tmp}/yingjie-journal.XXXXXX")"
bundle exec jekyll serve \
  --source _previews/preview-1 \
  --config _previews/preview-1/_config.yml \
  --destination "$preview_destination" \
  --disable-disk-cache \
  --host 127.0.0.1 \
  --port 4001
