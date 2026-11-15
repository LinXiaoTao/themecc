# 上线与收录记录

更新日期:2026-11-15

## 站点

| 项 | 值 |
|----|----|
| 生产地址 | https://themecc.vercel.app |
| 仓库 | https://github.com/LinXiaoTao/themecc |
| Vercel 项目 | `linxiaotaos-projects/themecc` |
| 联系方式 | 仅 GitHub Issues,不公开邮箱 |
| 域名计划 | 先用 `*.vercel.app`。购买域名后迁移,迁移时需要同步更新 GSC、Bing、GA4、`NEXT_PUBLIC_SITE_URL`,并设置旧域名 301 |

## Google Search Console

| 项 | 状态 |
|----|------|
| 属性类型 | URL prefix:`https://themecc.vercel.app/`(`*.vercel.app` 不能使用 Domain 属性) |
| 验证方式 | HTML meta 标签,token 默认值在 `src/config/site.ts`(`siteConfig.verification.google`),不要删除 |
| 验证时间 | 2026-11-15,Ownership verified |
| Sitemap | `/sitemap.xml`,2026-11-15 提交,状态 Success,发现 80 个页面 |
| 首页索引状态 | Discovered - currently not indexed(新站正常) |
| 手动请求索引 | 2026-11-15 返回 Quota Exceeded(新属性当日配额为 0),**待办:次日重试** |

次日请求索引的 URL(不批量提交):

- `https://themecc.vercel.app/`
- `https://themecc.vercel.app/desktop`
- `https://themecc.vercel.app/cli`
- `https://themecc.vercel.app/submit`
- `https://themecc.vercel.app/zh`

## Bing Webmaster Tools

| 项 | 状态 |
|----|------|
| 添加方式 | 从 GSC 导入(Google 授权范围:`webmasters.readonly`) |
| Sitemap | 已随 GSC 导入,状态 Processing |
| URL 提交 | 2026-11-15 提交 5 个 URL:`/`、`/desktop`、`/cli`、`/submit`、`/zh` |
| IndexNow | 未启用,按需再加 |

## Google Analytics 4

| 项 | 值 |
|----|----|
| Measurement ID | `G-DJ210WN6HK`(只存在于 Vercel Production 环境变量 `NEXT_PUBLIC_GA_MEASUREMENT_ID`,不写入代码默认值) |
| 数据流 | ThemeCC web:`https://themecc.vercel.app` |
| 同意模式 | Consent Mode v2,默认 denied,`localStorage` 键 `themecc-consent` |
| 与 GSC 关联 | 2026-11-15 已创建(Link created) |
| 待办 | `copy_install` 事件出现在 Events 报告后,将其标记为关键事件;GSC 数据最多 48 小时后出现在 GA 的 Search Console 报告 |

## 上线后跟进

| 时间 | 事项 |
|------|------|
| 第 2 天 | 重试 GSC 请求索引(上面 5 个 URL) |
| 第 3~7 天 | GSC「网页索引」与「站点地图」报告,处理 Discovered - currently not indexed;Bing「站点地图」状态 |
| 每周 | GSC 效果报告中的查询词与页面,调整 title / description 与内容 |
| 第 2~4 周 | Core Web Vitals 字段数据;GA 中把 `copy_install` 标为关键事件 |
| 外链与渠道 | 按 `growth-playbook` 执行,发布前文案需确认 |
| 内容 | 收录新主题的 PR 周期性抽查,程序化页面质量抽查 |
