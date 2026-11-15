# ThemeCC

A gallery and open registry of themes for Claude Code, with previews and one-command install. Live site: <https://themecc.vercel.app>.

ThemeCC is an independent project. It is not made, endorsed, or supported by Anthropic. Claude and Claude Code are trademarks of Anthropic.

## Install a theme

Add the marketplace once in a Claude Code session:

```
/plugin marketplace add LinXiaoTao/themecc
```

Then install any theme from the site:

```
/plugin install <name>@themecc
```

CLI themes are named `cli-<slug>` and are applied with `/theme`. Desktop themes are mods that run on your machine with the same access as Claude Code. Read the permissions and review notes on each page first.

## Submit a theme

Open a pull request that adds a directory under `registry/`. Full rules are on the [submit page](https://themecc.vercel.app/submit).

- CLI themes: `registry/cli/<slug>/theme.json` and `meta.json`. A pull request that only adds new CLI themes is merged automatically after checks pass.
- Desktop themes: `registry/desktop/<slug>/theme.json`, a poster, and a short preview video. The mod stays in your own repository and is pinned by commit. A maintainer reviews the source before merging.

Run `pnpm registry:check` before you open the pull request. Do not edit `.claude-plugin/` or `plugins/`. They are generated after merge.

Only themes under MIT, Apache-2.0, BSD, ISC, or CC0 are accepted. To remove a theme, [open an issue](https://github.com/LinXiaoTao/themecc/issues/new?template=takedown.yml).

## Develop

Requires Node 26 and pnpm 10 (`corepack enable`).

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm lint
pnpm typecheck
pnpm test           # unit tests
pnpm test:e2e       # Playwright smoke tests (builds the site)
pnpm registry:check # validate registry entries
pnpm registry:check:remote # verify pinned commits and licenses on GitHub
pnpm registry:build # regenerate .claude-plugin/ and plugins/
```

Stack: Next.js App Router, TypeScript, Tailwind CSS, next-intl (English and Chinese), Zod, Vitest, Playwright, Biome.

## Layout

```
registry/        theme entries (source of truth)
.claude-plugin/  generated marketplace.json
plugins/         generated plugins for CLI themes
src/             site
content/         guides and legal pages (MDX)
scripts/         registry tooling and the one-time seed script
docs/            plan, competitor analysis, keyword research
```

## License

Site code is MIT. Each theme keeps its author's license, shown on its page.
