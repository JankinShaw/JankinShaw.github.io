#!/usr/bin/env python3
"""Preserve complete source snapshots; build and preview disposable copies."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys
import tarfile
import tempfile
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parent.parent
VERSIONS = ROOT / 'versions'
EXCLUDED = {'.git', '.aws', '.codex', '.agents', '.idea', '.vscode',
            '_site', '.jekyll-cache', '.jekyll-metadata', '.sass-cache',
            '__pycache__', 'node_modules', '.DS_Store', '.env', '.venv'}


def run(command):
    subprocess.run(command, cwd=REPO, check=True)


def metadata(version):
    if not re.fullmatch(r'[a-zA-Z0-9][a-zA-Z0-9_-]*', version):
        raise ValueError('版本名只能包含字母、数字、连字符和下划线。')
    folder = VERSIONS / version
    meta = json.loads((folder / 'metadata.json').read_text())
    snapshot = folder / 'source.tar.gz'
    if hashlib.sha256(snapshot.read_bytes()).hexdigest() != meta['sha256']:
        raise ValueError('快照校验失败，未解压。')
    return folder, meta


def extract(version, target):
    folder, meta = metadata(version)
    with tarfile.open(folder / 'source.tar.gz') as archive:
        # Compatible with macOS's bundled Python, including pre-3.12 tarfile.
        for member in archive.getmembers():
            path = Path(member.name)
            if path.is_absolute() or '..' in path.parts or not (member.isfile() or member.isdir()):
                raise ValueError(f'不支持的压缩包条目：{member.name}')
        archive.extractall(target)
    return meta


def prepare(version, workspace):
    source = workspace / 'source'
    meta = extract(version, source)
    # Preview-only adapters never change the stored source snapshot.
    if meta.get('compatibility') == 'historical-blog':
        blog = source / 'blog.html'
        text = blog.read_text()
        text = text.replace('---\n', '---\npermalink: /blog/\n', 1)
        blog.write_text(text)
        post = source / '_layouts/post.html'
        if not post.exists():
            post.write_text('---\nlayout: default\n---\n<article class="docs-section">{{ content }}</article>\n')
    # Existing feed.xml is preserved; an obsolete feed plugin is unnecessary.
    overrides = workspace / 'preview.yml'
    overrides.write_text('plugins: []\nurl: "http://127.0.0.1"\nbaseurl: ""\ngoogle_analytics_id: ""\n')
    return source, overrides, meta


def save(args):
    if not re.fullmatch(r'[a-zA-Z0-9][a-zA-Z0-9_-]*', args.version):
        raise ValueError('版本名只能包含字母、数字、连字符和下划线。')
    source = Path(args.source).resolve()
    if not source.is_dir() or not (source / '_config.yml').is_file():
        raise ValueError('源目录需要包含 Jekyll 的 _config.yml。')
    folder = VERSIONS / args.version
    if folder.exists():
        raise ValueError('该版本已存在，请使用新名称；不会覆盖已有归档。')
    files = [p for p in sorted(source.rglob('*')) if p.is_file() and not p.is_symlink()
             and ROOT not in p.parents
             and not any(part in EXCLUDED or part.startswith('.env')
                         for part in p.relative_to(source).parts)]
    folder.mkdir()
    snapshot = folder / 'source.tar.gz'
    with tarfile.open(snapshot, 'w:gz') as archive:
        for path in files:
            archive.add(path, arcname=path.relative_to(source), recursive=False)
    (folder / 'FILES.txt').write_text(''.join(str(p.relative_to(source)) + '\n' for p in files))
    meta = {'id': args.version, 'title': args.title or args.version,
            'saved_at': datetime.now(timezone.utc).isoformat(),
            'sha256': hashlib.sha256(snapshot.read_bytes()).hexdigest(),
            'entry': args.entry, 'compatibility': 'none',
            'description': '本地 Jekyll 源码完整快照；含文章、布局、样式和静态资源。'}
    (folder / 'metadata.json').write_text(json.dumps(meta, ensure_ascii=False, indent=2) + '\n')
    print(f'已保存 {args.version}：{len(files)} 个文件。原目录未改动。')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest='command', required=True)
    commands.add_parser('list')
    for action in ['preview', 'build', 'restore']:
        command = commands.add_parser(action)
        command.add_argument('version')
        if action == 'preview':
            command.add_argument('--port', type=int, default=4002)
        if action == 'restore':
            command.add_argument('destination', help='必须是尚不存在的新目录')
    command = commands.add_parser('save')
    command.add_argument('version')
    command.add_argument('--source', default=str(REPO / '_previews' / 'preview-1'))
    command.add_argument('--title')
    command.add_argument('--entry', default='/')
    args = parser.parse_args()
    if args.command == 'list':
        for path in sorted(VERSIONS.glob('*/metadata.json')):
            meta = json.loads(path.read_text())
            print(f"{meta['id']}  —  {meta['title']}")
        return
    if args.command == 'save':
        save(args)
        return
    if args.command == 'restore':
        target = Path(args.destination).resolve()
        if target.exists():
            raise ValueError('目标目录已存在；请选择新目录，以免覆盖文件。')
        extract(args.version, target)
        print(f'已原样恢复到 {target}。预览原架构可使用 archive.py preview。')
        return
    with tempfile.TemporaryDirectory(prefix='yingjie-blog-archive-') as temporary:
        workspace = Path(temporary)
        source, overrides, meta = prepare(args.version, workspace)
        command = ['bundle', 'exec', 'jekyll', 'serve' if args.command == 'preview' else 'build',
                   '--source', str(source), '--config', f'{source / "_config.yml"},{overrides}',
                   '--destination', str(workspace / 'site'), '--disable-disk-cache']
        if args.command == 'preview':
            command += ['--host', '127.0.0.1', '--port', str(args.port)]
            print(f"本地预览：http://127.0.0.1:{args.port}{meta['entry']}\n按 Ctrl-C 结束。", flush=True)
        try:
            run(command)
        except KeyboardInterrupt:
            pass
        if args.command == 'build':
            pages = list((workspace / 'site').rglob('*.html'))
            if not pages:
                raise ValueError('构建未生成 HTML 页面。')
            entry = workspace / 'site' / meta['entry'].lstrip('/') / 'index.html'
            if not entry.exists():
                raise ValueError(f'缺少预期入口：{meta["entry"]}')
            print(f'验证通过：{args.version}，生成 {len(pages)} 个 HTML 页面，入口存在。')


if __name__ == '__main__':
    try:
        main()
    except (ValueError, FileNotFoundError, subprocess.CalledProcessError) as error:
        print(f'错误：{error}', file=sys.stderr)
        sys.exit(1)
