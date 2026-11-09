#!/bin/zsh -f

# Double-click in Finder to preview the current website and blog.
set -eu
cd -- "${0:A:h}/../.."

# Finder/Terminal may inherit Apple's Ruby or Conda's PATH. Use the same
# Homebrew Ruby as the working Jekyll environment, without sourcing profiles.
for preview_ruby in /opt/homebrew/opt/ruby/bin/ruby /usr/local/opt/ruby/bin/ruby; do
  if [[ -x "$preview_ruby" ]]; then
    unset GEM_HOME GEM_PATH
    preview_ruby_bin="${preview_ruby:h}"
    preview_gem_bin="$("$preview_ruby" -e 'require "rubygems"; print Gem.bindir')"
    export PATH="${preview_ruby_bin}:${preview_gem_bin}:${PATH}"
    break
  fi
done

fail() {
  print -r -- "$1"
  print -r -- "Press Enter to close."
  read -r reply
  exit 1
}

command -v bundle >/dev/null 2>&1 || fail "Bundler was not found. Install Ruby and Bundler first."
bundle check || fail "Dependencies could not be loaded with $(command -v ruby). See the error above."

if [[ "${1:-}" == "--check" ]]; then
  print -r -- "Preview environment OK: $(ruby -v)"
  exit 0
fi

preview_port=18523
while lsof -nP -iTCP:${preview_port} -sTCP:LISTEN >/dev/null 2>&1; do
  (( preview_port += 1 ))
  if (( preview_port > 18543 )); then
    fail "Ports 18523–18543 are all in use. Stop an unused preview and try again."
  fi
done
preview_url="http://127.0.0.1:${preview_port}/"

preview_destination="$(mktemp -d "${TMPDIR:-/tmp}/yingjie-site-preview.XXXXXX")"
print -r -- "Blog preview: ${preview_url}"
print -r -- "Press Ctrl+C in this window to stop. Nothing is published."

# Open only after Jekyll has successfully started serving the blog.
(
  for attempt in {1..60}; do
    if curl --noproxy '*' --silent --fail --max-time 1 "$preview_url" >/dev/null 2>&1; then
      open "$preview_url"
      exit 0
    fi
    sleep 1
  done
) &
preview_opener=$!
trap 'kill "$preview_opener" 2>/dev/null || true' EXIT

JEKYLL_ENV=development bundle exec jekyll serve \
  --source _previews/preview-2 \
  --config _previews/preview-2/_config.yml \
  --host 127.0.0.1 \
  --port "$preview_port" \
  --destination "$preview_destination" \
  --disable-disk-cache
