# 博客架构归档

这里保存**完整博客版本**，不仅是文章。每份 `source.tar.gz` 都含该版本的页面、文章、布局、样式、脚本及仓库内静态资源。快照保留原始文件，附来源提交、文件清单及 SHA-256 校验值；无需联网或检出旧分支即可恢复源码。

此目录以 `_` 开头，主站默认 Jekyll 构建不会发布它。主站现有 `/archive/` 学术页面不变。归档中的历史信息可能过时，预览只在本机运行。

| 版本 | 内容 | 保存节点 |
| --- | --- | --- |
| `v1-skeleton` | 早期 Skeleton 个人页中的 Blog，标签筛选、RSS、原始文章 | `3103eaa`，第一次整体重构之前 |
| `v2-writing` | 重新设计的 Writing 列表、专用文章布局、标签筛选与 RSS | `2113d05`，移除博客之前 |
| `v3-local-journal` | 目前参考 James 博客制作的本地样稿，含中英文示例和旧文 Archive | 本地文件快照 |
| `v4-english-before-publication` | 正式接入 `/blog/` 前的英文完整版本，含当前文章、目录、公式与样式 | 发布前本地源码快照 |
| `v3-chinese-journal` | 原始中文完整版：完整介绍文案、四篇示例文章、两篇旧文 Archive | 从修改为英文精简版之前的原始快照完整保存 |

中文完整版独立预览：`python3 _archive/blog/archive.py preview v3-chinese-journal --port 4003`，打开 http://127.0.0.1:4003/。详情见 [`versions/v3-chinese-journal/README.md`](versions/v3-chinese-journal/README.md)。

前两版使用整个历史仓库的源码快照，保证模板所依赖的数据、字体、图片等也一起保留。旧文的不同历史修订分别留在各自版本中。`_blog_preview/_archive/` 是最新样稿中的旧文阅读入口，并不替代这里的架构归档。

## 启动旧版预览

在当前仓库根目录执行；使用现有 Ruby、Bundler、Jekyll 环境，无需新安装依赖：

```sh
python3 _archive/blog/archive.py list
python3 _archive/blog/archive.py preview v1-skeleton
```

打开 **http://127.0.0.1:4002/blog/**。按 Ctrl-C 停止。换第二版：

```sh
python3 _archive/blog/archive.py preview v2-writing
```

第三版入口为 **http://127.0.0.1:4002/**：

```sh
python3 _archive/blog/archive.py preview v3-local-journal
```

端口可改为 `--port 4003`。现有样稿仍通过 `bash _blog_preview/serve.sh` 在 4001 预览。归档预览解压到临时目录，退出时清理，不覆盖主站或快照。

### 兼容处理

第一版原仓库缺少 `_layouts/post.html`，配置引用了 `jekyll-feed`，但已有独立 `feed.xml`。预览工具仅在临时副本补充文章外壳、关闭该可选插件，并将旧版博客入口统一为 `/blog/`。第二版也仅在临时副本统一入口。归档文件不变；两版均使用当前仓库的 Gemfile 运行。旧版引用的 Google Fonts 和 Creative Commons 图标仍是外链，离线时可能使用替代字体或不显示图标，其余仓库内资源均保留。

## 原样恢复源码到新目录

```sh
python3 _archive/blog/archive.py restore v1-skeleton /tmp/yingjie-blog-v1
```

目标必须是尚不存在的新目录，避免覆盖。恢复会先核验压缩包，不添加兼容修改。也可以直接用标准解压工具打开快照；并不依赖这个脚本才能取回文件。

## 以后保存一个版本

开始更换架构、修改旧内容前，运行：

```sh
python3 _archive/blog/archive.py save journal-2026-11-09 --title "当时的博客版本"
```

默认完整保存 `_blog_preview` 下的源文件和文章。保存其他 Jekyll 源目录可指定 `--source /绝对路径 --entry /`。不覆盖已有版本，不移动或删除源目录。构建产物、Git 数据、归档目录本身、环境文件和常见缓存会排除；**这是手动快照，不是自动备份**。以后新增的内容需要再次执行 save 才会进入新归档。

## 检查归档仍可构建

```sh
python3 _archive/blog/archive.py build v1-skeleton
python3 _archive/blog/archive.py build v2-writing
python3 _archive/blog/archive.py build v3-local-journal
```
