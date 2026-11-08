# 中文完整版 Journal

保留最初的完整中文文案、四篇示例文章、两篇旧文 Archive，以及整套布局、字体、样式和脚本。来源为改成英文简洁版之前保存的 `v3-local-journal`，未重新拼接或改写。

在仓库根目录运行：

```sh
python3 _archive/blog/archive.py preview v3-chinese-journal --port 4003
```

首页：http://127.0.0.1:4003/  
示例文章：http://127.0.0.1:4003/writing/  
旧文归档：http://127.0.0.1:4003/archive/

原样恢复到新目录：

```sh
python3 _archive/blog/archive.py restore v3-chinese-journal /tmp/yingjie-chinese-journal
```

当前英文博客 `_blog_preview/` 独立保留。此快照不包含后来添加的徽章，忠实保留当时版本。
