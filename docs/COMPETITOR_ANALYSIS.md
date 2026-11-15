# 竞品分析:Claude Code 主题收录站

分析日期:2026-11-15

主要分析对象:

- claudepluginhub.com/themes
- gabs-utilities.com/theme
- claudecodexplugins.com/categories/themes

补充发现的对照站(通过搜索确认,未逐一深入分析):

- 站点:nilaykabariya.blog/claude-code-themes、codexskins.app、codigrate.com、claudemods.si/mods/themes
- GitHub 仓库:livlign/ccthemes、amondnet/claude-code-themes、matcra587/claude-themes、testy-cool/awesome-claude-code-mods、0toshigami/claude-desktop-themes、ishuagrawal/claude-code-themes、amandamartin-dev/claude-mods

数据标注规则:精确值来自 sitemap 或页面所见;"未获取"表示没有拿到数据,不估算。

## 1. 一句话定位

| 站点 | 定位 |
|---|---|
| claudepluginhub.com | 全品类 Claude Code 插件目录,Themes 只是其中一个组件分类。有 Premium 付费和侧栏广告(Carbon) |
| gabs-utilities.com/theme | 单作者的 62 款暗色 CLI 主题站,每款一页,含调色板和对比度说明 |
| claudecodexplugins.com | 全品类 Claude/Codex 插件目录,站内列出多个 AI 导航站作为展示渠道 |
| nilaykabariya.blog | 81 个 CLI 主题,模拟终端实时预览,一行命令安装 |
| codexskins.app | 22 个 CLI 主题,实时渲染预览,可复制安装提示词,有中文教程 |
| codigrate.com | 25 个 CLI 主题,部分付费 |
| claudemods.si | mods 目录,Themes 分类 140 个条目(含状态栏、spinner 等,不限于桌面背景) |

## 2. 核心功能

| 功能 | claudepluginhub | gabs | claudecodexplugins | nilaykabariya / codexskins |
|---|---|---|---|---|
| 主题列表 | 有,991 个,按插件星数排序 | 有,62 个 | 有,9 个插件 | 有 |
| 视觉预览 | 无(只有文字描述) | 色块 + 画廊页 | 无 | 有,模拟终端 |
| 安装方式 | 复制命令 | 复制 marketplace 命令 | 复制命令 | 复制一行命令 |
| 区分桌面 mod 与 CLI 主题 | 否 | 否(只有 CLI) | 否 | 否(只有 CLI) |
| 提交 / 认领 | 有 | 无 | 有(Add plugin) | 无 |
| 登录 | 浏览不需要 | 不需要 | 不需要 | 不需要 |

主流程(以 gabs 为例):首页 → 主题详情 → 复制安装命令,共 3 步。

## 3. 信息架构

| 站点 | sitemap 条目 | 分布 |
|---|---|---|
| claudepluginhub.com | 约 55k(45000 + 9996) | /plugins 28031、/marketplaces 12288、/mcp-servers 4328、/skills 约 4.9k、/themes 379、/commands 1894、/agents 1504 |
| gabs-utilities.com | 68 | /theme/* 63 个,指南 3 页 |
| claudecodexplugins.com | 20654 | /plugins 20448、/categories 201 |

claudepluginhub 和 claudecodexplugins 都是程序化页面,依据是 GitHub 上已索引的插件仓库。

## 4. 获客手段

| 渠道 | 做法 | 证据 | 可借鉴性 |
|---|---|---|---|
| SEO | 大量程序化详情页;gabs 做每主题一页并带对比度数据 | 上述 sitemap 规模 | 借鉴 gabs 的"每页有独有数据";不借鉴无独有价值的程序化页 |
| 内容 | 教程文章(安装指南、语义色说明) | gabs 有 3 页指南;搜索结果中有大量教程文章 | 借鉴,做中英文指南 |
| 产品内增长 | 提交 / 认领入口;ccthemes 提供贡献命令 | 页面所见 | 借鉴 PR 投稿 |
| 付费 / 合作 | claudepluginhub 有 Premium 与广告;claudecodexplugins 的 Get Featured | 页面所见 | 不做 |
| 外链来源 | 未获取(未使用 SimilarWeb、Ahrefs) | - | - |

## 5. 技术信号

| 站点 | 技术 | 性能 |
|---|---|---|
| claudepluginhub.com | Cloudflare;对未验证浏览器出现机器人验证;Lighthouse 请求返回 403 | LCP 230 ms、CLS 0.00(用户 Chrome 实验室数据,2026-11-15;CrUX 无该页面数据;INP 未获取) |
| gabs-utilities.com | GitHub Pages 静态站 | 未获取 |
| claudecodexplugins.com | Next.js + Vercel,Cloudflare 在前 | 未获取 |

## 6. 结论

### 值得学习

1. gabs 每个主题一页,写明各颜色作用和对比度。证据:gabs-utilities.com/theme 页面。
2. 一条命令安装整个合集(`claude plugin marketplace add ...`)。
3. livlign/ccthemes 已经把"贡献"做成命令和 PR 流程。
4. claudepluginhub 对 mod 标注风险标签(读文件、联网、运行程序)。
5. nilaykabariya 对移植主题标明来源、许可证,并声明非原项目官方。

### 可以改进

1. claudepluginhub、claudecodexplugins 的主题列表没有视觉预览。改进:每个主题有预览。
2. claudepluginhub 的 Themes 前排混入 PPT 演示主题(如 presentation-skills 的 Sunset Zine、Bauhaus Bold),与 Claude Code 界面无关。改进:只收 Claude Code 的主题,CI 校验格式。
3. 没有看到按类型给出正确安装步骤的站点,也没有看到对桌面动画背景提供预览视频的站点。桌面主题分散在各作者的仓库里,没有统一的、带预览的收录站。
4. 评论区的诉求没人系统解决:如何分享主题、高对比度、diff 可读性、版本要求、性能影响、mods 安全。

### 复刻范围

| 优先级 | 功能 |
|---|---|
| P0 | 桌面主题(为主)与 CLI 主题的列表页、详情页;预览图 / 视频;一键复制安装命令;registry 仓库 PR 提交与 CI 校验;自动生成 marketplace.json;中英文双语 |
| P1 | CLI 主题的网页模拟终端预览与对比度估算;按明暗、版本、动画筛选;mod 权限声明与风险标签;提交指南页和安装教程页 |
| P2 | 主题合集;RSS;每周新增 |

明确不做:账号系统、评论、评分、广告、付费、全站抓取竞品站内容、无独有内容的程序化页面。

## 7. 合规与风险

- 竞品站点的文案、截图、品牌不能复用。竞品站上的主题可能是站长原创作品且许可证不明确,不从竞品站点抓取主题。
- "Claude"、"Claude Code"、"Clawd" 属于 Anthropic,站点需声明非官方,不使用其 Logo 和 Clawd 形象。
- mods 不在沙盒里运行,权限与 Claude Code 相同。收录桌面 mod 必须固定 commit sha 并人工审核。
- claudepluginhub 的 robots 对 ClaudeBot 等 AI 爬虫设为禁止,本次分析只做人工浏览和 sitemap 统计,没有抓取其页面内容。
- 版本要求(来自官方文档):桌面背景 `$.theme.set` 需要 Claude Code v2.1.319 及以上;桌面配色需要 v2.1.324 及以上;CLI 自定义主题需要 v2.1.118 及以上。桌面主题仅在本地桌面会话生效。

## 8. 需要用户补充的信息

- [ ] 上线前用户自己在 GA4、GSC、Bing 的账号登录(P7 阶段)
- [ ] 最终生产域名(Gate 3 确认)
