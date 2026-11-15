# ThemeCC 实施方案

方案日期:2026-11-15。Gate 2 已确认。

## 1. 目标与范围

- 目标用户:使用 Claude Code 桌面版或 CLI,想换主题的开发者;想发布主题的作者。
- 核心价值:预览主题、确认版本要求与风险、复制命令安装、通过 GitHub PR 提交收录。
- 定位:桌面 mods 动画主题为主,CLI 配色主题为辅,统一收录,每个条目按类型给出正确的安装步骤。
- MVP 范围:见 `docs/COMPETITOR_ANALYSIS.md` 的 P0。P1、P2 在 P0 完成后按 GSC 数据决定。
- 差异点:桌面主题带预览视频;固定 commit sha;标明版本要求和权限风险;一个 marketplace 安装站内全部主题。
- 不做:账号、评论、评分、广告、付费、全站抓取竞品站、无独有内容的程序化页面。

## 2. 关键词与信息架构

关键词研究见 `docs/KEYWORDS.md`。

### URL 设计

规则:小写、连字符、内容不放在查询参数里、URL 稳定。默认英文不带前缀,中文使用 `/zh`。

| 页面类型     | URL 模式                                 | 渲染方式          | 目标意图                   | 数量                 |
| ------------ | ---------------------------------------- | ----------------- | -------------------------- | -------------------- |
| 首页         | `/`、`/zh`                               | SSG               | claude code themes         | 2                    |
| 桌面主题列表 | `/desktop`                               | SSG               | claude code desktop themes | 2                    |
| CLI 主题列表 | `/cli`                                   | SSG               | claude code cli themes     | 2                    |
| 主题详情     | `/themes/[slug]`                         | SSG,slug 全站唯一 | 主题名 + claude code theme | 每个条目 2           |
| 提交指南     | `/submit`                                | SSG               | 提交主题                   | 2                    |
| 指南         | `/guides/[slug]`                         | SSG,MDX           | 教程类词                   | 4 篇起,每篇 2 种语言 |
| 隐私、条款   | `/privacy`、`/terms`                     | SSG               | 合规                       | 各 2                 |
| marketplace  | 仓库根 `.claude-plugin/marketplace.json` | Action 生成       | 安装入口                   | 1                    |

筛选只在客户端过滤,不生成参数 URL,不进 sitemap。不做作者页、颜色页等程序化页面。

## 3. 技术选型

版本为 2026-11-15 的 npm 最新版。

| 项     | 选择                                                 | 理由                                                                 | 备选                                                                        |
| ------ | ---------------------------------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 包管理 | pnpm 10,`packageManager` 固定,`.nvmrc` 固定 Node LTS | 默认栈                                                               | -                                                                           |
| 框架   | Next.js 16.4.6,App Router,React 19.3.1,全站 SSG      | 内容站,无需运行时服务                                                | -                                                                           |
| 语言   | TypeScript strict                                    | 默认栈                                                               | 若 npm 最新的 7.0.2 与 Next、Biome、Vitest 不兼容,回退到最新稳定 6.x 并记录 |
| 样式   | Tailwind 4.3.5 + shadcn 4.23.0                       | 默认栈                                                               | -                                                                           |
| 多语言 | next-intl 4.15.1,`localePrefix: 'as-needed'`         | 英文无前缀,中文 `/zh`,支持 hreflang                                  | -                                                                           |
| 校验   | Zod 4.6.7                                            | 同一份 schema 校验 registry 和环境变量,导出 JSON Schema 供投稿者使用 | -                                                                           |
| 质量   | Biome 2.6.7、Vitest 5.1.0、Playwright 1.65.1         | 默认栈                                                               | -                                                                           |
| 内容   | MDX(指南)+ JSON(主题)                                | 无数据库                                                             | -                                                                           |
| 部署   | Vercel + GitHub 自动构建                             | 默认栈                                                               | -                                                                           |

实现前用 Context7 再次核对 Next.js、next-intl、Claude Code 官方文档对应的 API,不凭记忆写。

## 4. 目录结构

```text
registry/            主题数据(投稿入口)
  desktop/<slug>/    theme.json + poster.webp + preview.mp4
  cli/<slug>/        theme.json(官方主题格式)+ meta.json
plugins/             由脚本生成的 CLI 主题小插件(cli-<slug>)
.claude-plugin/      生成的 marketplace.json
scripts/             registry 校验、marketplace 生成、种子收集
src/app/[locale]/    页面
src/components/      UI 组件
src/config/site.ts   站点信息(域名、站点名、统计 ID、验证 token)
src/i18n/            路由与消息
src/lib/registry/    Zod schema、读取、安装命令构造、对比度计算
content/guides/      MDX 指南(en、zh)
docs/                本方案、竞品分析、关键词
.github/             CI、投稿 CI、marketplace 生成 Action、CODEOWNERS、PR 与 Issue 模板
```

## 5. 数据与状态

### registry 条目

桌面主题 `registry/desktop/<slug>/theme.json`:

- `slug`、`name`、`description`(en 必填,zh 可选)
- `author.github`、`license`(SPDX)
- `source`:`{ repo, path?, sha }`,sha 为 40 位提交哈希
- `plugin`:插件名,必须等于 slug
- `minClaudeCode`、`colorScheme`(light/dark 数组)、`motion`(布尔)
- `permissions`:`{ network, files, commands }`,由审核者核对后填写
- `preview`:`{ video, poster }`

CLI 主题 `registry/cli/<slug>/theme.json` 使用 Claude Code 官方格式 `{ name, base, overrides }`,`meta.json` 记录作者、许可证、上游链接、标签。

### 安装命令

- 桌面主题:`/plugin marketplace add LinXiaoTao/themecc`(一次),然后 `/plugin install <slug>@themecc`。
- CLI 主题:同一个 marketplace 安装;备选单文件 `curl` 命令写入 `~/.claude/themes/<slug>.json`。首次创建该目录后需重启 Claude Code 一次。

### marketplace 生成

脚本读取 registry 生成 `.claude-plugin/marketplace.json`。桌面条目使用 `github` 源并带 `sha`。CLI 条目生成 `plugins/cli-<slug>/`。生成后用 `claude plugin validate` 校验。

已核实:官方文档中 `url` 与 `git-subdir` 源都支持 `sha`。所以桌面条目生成 `{source:"url", url, sha}`,带 `path` 的条目生成 `{source:"git-subdir", url, path, sha}`,monorepo 子目录可以收录。URL 一律使用完整的 `https://github.com/<repo>.git`,因为 `owner/repo` 简写会通过 SSH 克隆,未配置 SSH 密钥的用户会失败。

### marketplace 提交者

合并到 main 后,GitHub Action 重新生成并提交,提交作者设为 `leo <linxiaotao1993@gmail.com>`,避免 Vercel 因提交者与团队成员不匹配而进入 BLOCKED 状态。上线后验证机器人提交能否正常触发部署。

### 投稿流程

1. 作者 fork,在 `registry/` 下添加目录,运行 `pnpm registry:check`。
2. PR 触发 `ci.yml`:schema 校验(`registry:check`);远程校验(`registry:check:remote`:sha 在目标仓库存在、仓库公开、许可证符合);预览文件存在且体积合规(视频 ≤ 8 MB、≤ 15 秒,poster ≤ 300 KB)。本机未安装 `claude` CLI,`claude plugin validate` 暂未纳入 CI。
3. CLI 主题:`registry-automerge.yml` 只对「全部文件都是新增、且路径为 `registry/cli/<slug>/(theme|meta).json`」的 PR 启用 auto-merge。修改已有条目或改动其他路径的 PR 一律人工审核。该 workflow 使用 `pull_request_target`,只通过 API 读取文件路径,不检出也不执行 PR 的代码。auto-merge 需要仓库开启 Allow auto-merge,并在 `main` 上把 `check` 设为必需检查,这两项是仓库设置,需要用户确认后再改。
4. 桌面 mod:`CODEOWNERS` 要求 owner 审核,按清单检查网络请求、文件读写、命令执行、混淆代码,通过才合并。
5. 合并后 `registry-sync.yml` 重新生成 marketplace 并以 `leo <linxiaotao1993@gmail.com>` 提交。合并提交的作者是投稿者,不一定是 Vercel 团队成员,可能触发 BLOCKED;机器人的提交是 main 上最新的一个,由它完成部署。因此每次投稿合并会产生两次部署。

### 初始内容(种子)

- 只从 GitHub 仓库收集,用 GitHub API 核对许可证,只收 MIT、Apache-2.0、BSD、ISC、CC0。无许可证的不收。
- 不从竞品站点抓取内容。
- CLI 主题:复制主题 JSON,保留作者、许可证、上游链接和版权声明。
- 桌面 mod:仅收录链接并固定 sha,不复制源码。激活方式因 mod 而异(`/deep-field`、`/rainy-window on|off` 等),用可选字段 `usage` 记录,没有 `usage` 时显示通用说明。
- 实际收录:CLI 25 个(`scripts/seed-manifest.ts`,每条保留上游仓库、固定 commit 与版权声明),桌面 3 个(deep-field、firefly-meadow、rainy-window)。
- 已排除:0toshigami(行为侵入性强)、theme-examples(固定 commit 下使用的 API 已被移除)、matcra587(无许可证)、一个堆砌「50 dark themes」的重复内容仓库。
- 桌面条目的 `reviewed` 由我只做了表层审查(API 调用检索与 README)后填写,署名为 LinXiaoTao,需要你本人复核后确认。
- 桌面预览是作者自己的截图或视频,页面注明归作者所有。
- 描述由我们自己撰写。预览:CLI 由令牌渲染的模拟终端生成;桌面主题由我们在真实应用中截取并署名。
- 种子脚本是一次性手动运行,不做定时抓取,不在运行时请求 GitHub。
- 提供下架方式:作者提 Issue 或 PR 即移除。

### 环境变量

| 名称                     | 用途                    | 是否公开 |
| ------------------------ | ----------------------- | -------- |
| `NEXT_PUBLIC_SITE_URL`   | canonical、sitemap      | 是       |
| `NEXT_PUBLIC_GA_ID`      | GA4                     | 是       |
| `NEXT_PUBLIC_GSC_TOKEN`  | Search Console 验证标签 | 是       |
| `NEXT_PUBLIC_BING_TOKEN` | Bing 验证标签           | 是       |

CI 使用 GitHub 内置 `GITHUB_TOKEN`,不新增密钥。

## 6. SEO 方案

- title:详情页 `{名称} – Claude Code {桌面|CLI} theme | ThemeCC`;列表页 `Claude Code {desktop|CLI} themes: previews & install | ThemeCC`。description 含类型、明暗、版本要求,各页不重复。
- 结构化数据:`WebSite`、`BreadcrumbList`;列表页 `ItemList`;详情页 `CreativeWork`。
- sitemap:`sitemap.xml` 含 `alternates.languages`。每页 canonical 加 hreflang(`en`、`zh-Hans`、`x-default`)。
- 内容质量:每个详情页含预览、颜色令牌、版本要求、权限声明、作者和许可证。缺预览或描述的条目不生成详情页,不进 sitemap。
- 性能预算:LCP < 2.5s、INP < 200ms、CLS < 0.1。视频 `preload="none"`,先显示 poster,点击才播放,尊重 `prefers-reduced-motion`。
- OG 图:桌面主题用作者的 poster;其余页面使用站点统一的 `/og.png`(`src/app/og.png/route.tsx`,构建时生成)。不使用 `opengraph-image` 文件约定,因为根目录没有 layout 时它不会注入 meta 标签,且需要 `metadataBase`。

## 7. 统计与事件

GA4 使用 Consent Mode v2,默认拒绝,页面带简洁的同意横幅。自写 `GoogleAnalytics` 组件,只在生产部署加载(`VERCEL_ENV`),`localStorage` 里 `themecc-consent` 为 `granted` 时才授予 `analytics_storage`。预览部署为 noindex 且不加载统计。

| 事件                   | 触发点                    | 参数                     |
| ---------------------- | ------------------------- | ------------------------ |
| `copy_install`         | 点击复制安装命令          | `slug`、`type`、`method` |
| `copy_marketplace_add` | 复制 marketplace 添加命令 | `placement`              |
| `preview_play`         | 播放预览视频              | `slug`                   |
| `outbound_repo_click`  | 点击作者仓库              | `slug`                   |
| `submit_click`         | 点击提交入口              | `placement`              |
| `filter_use`           | 使用筛选                  | `filter`、`value`        |

转化事件:`copy_install`。

## 8. 部署

- 仓库:`LinXiaoTao/themecc`,公开。这与 skill 默认的 private 不同,是用户确认的选择:别人需要 fork 并提 PR,`/plugin marketplace add` 需要公开读取。`docs/` 会随之公开。
- Vercel 项目 `themecc`,连接 GitHub,`main` 自动上线,PR 自动预览。
- 先用 `*.vercel.app`,上线后绑定域名。Gate 3 确认 canonical。
- 回滚:Vercel 控制台回滚到上一个部署。

## 9. 测试与验收

- 单元测试:schema 校验、marketplace 生成、安装命令构造、对比度计算。
- Playwright 冒烟(桌面与移动两个项目,共 40 条):首页、语言切换、hreflang、列表筛选、详情页、复制按钮写入剪贴板、各页面无横向溢出、JSON-LD、OG 图、404、`/sitemap.xml`、`/robots.txt`。
- 验收命令:`pnpm lint && pnpm typecheck && pnpm test && pnpm build`。
- SEO 验收:`seo_audit.py`;Lighthouse 移动端 SEO、无障碍、最佳实践 ≥ 95,性能 ≥ 90。
- CLI 主题对比度:官方文档没有公开 base 预设各 token 的具体值,所以只对 `overrides` 里的颜色和假定的终端背景计算对比度,页面标注"估算"。

## 10. 合规

- 页脚声明:非 Anthropic 官方,不隶属于 Anthropic。不使用 Claude Logo 和 Clawd 形象。
- 隐私政策、使用条款、Cookie 同意(目标市场含欧盟和英国)。
- 投稿者须声明拥有预览素材的权利。提供下架和举报联系方式。
- 字体使用系统字体栈或可商用开源字体。

## 11. 风险与待确认

| 风险 / 问题                                               | 影响                          | 方案                                              |
| --------------------------------------------------------- | ----------------------------- | ------------------------------------------------- |
| 竞争拥挤,流量未知                                         | 增长慢                        | 桌面优先定位;上线后看 GSC 再决定投入              |
| 预览素材版权                                              | 侵权投诉                      | 投稿者声明权利;自截素材署名;提供下架方式          |
| mod 不在沙盒里运行                                        | 用户机器风险                  | 固定 sha、人工审核、风险提示、可下架              |
| Claude Code 格式变化快                                    | 安装命令失效                  | 条目记录版本要求;`claude plugin validate` 待接入  |
| 机器人提交 marketplace                                    | Vercel 可能 BLOCKED           | 提交作者设为 leo;部署后验证                       |
| 官方 `git-subdir` 源 `sha` 支持                           | monorepo 主题                 | 已核实支持                                        |
| 站点代码许可证                                            | 贡献者需要明确的授权          | 仓库添加 MIT LICENSE(未经你指定,可更改)         |
| TypeScript 7 兼容性                                       | 构建报错                      | 脚手架时验证,必要时回退                           |
| 官方插件 `themes/` 的 manifest 键为 `experimental.themes` | 生成的 CLI 小插件可能不被识别 | 实现时核对官方文档和实测 `claude plugin validate` |

## 12. 里程碑

1. 脚手架、CI、站点配置、Zod schema。
2. registry、marketplace 生成、投稿 CI 与测试。
3. 页面:首页、列表、详情、提交页、安装交互、统计事件、中英文。
4. 内容:4 篇指南(中英文)、种子条目、SEO 元素、OG 图。
5. 部署、Lighthouse、验收。
6. 域名、GSC、Bing、GA4 接入。
