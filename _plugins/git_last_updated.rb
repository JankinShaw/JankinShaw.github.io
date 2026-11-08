# Derive article dates from committed file history, never checkout/build time.
require "open3"
require "pathname"
require "time"

Jekyll::Hooks.register :site, :post_read do |site|
  _root, _error, repository = Open3.capture3("git", "-C", site.source, "rev-parse", "--show-toplevel")
  next unless repository.success?

  shallow, = Open3.capture3("git", "-C", site.source, "rev-parse", "--is-shallow-repository")
  if shallow.strip == "true"
    raise Jekyll::Errors::FatalException, "Article update dates require full Git history. Use checkout fetch-depth: 0."
  end

  documents = site.posts.docs + (site.collections["blog_archive"]&.docs || [])
  documents.each do |document|
    path = Pathname.new(document.path).relative_path_from(Pathname.new(site.source)).to_s
    timestamp, error, result = Open3.capture3(
      "git", "-C", site.source, "log", "-1", "--follow", "--format=%cI", "--", path
    )
    unless result.success?
      raise Jekyll::Errors::FatalException, "Cannot read Git history for #{path}: #{error}"
    end
    # Untracked articles have no committed update date yet.
    next if timestamp.strip.empty?
    document.data["git_last_modified_at"] = Time.iso8601(timestamp.strip)
  end
end
