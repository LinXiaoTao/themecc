import { loadThemesOrThrow } from "../src/lib/registry/load";
import { LICENSES } from "../src/lib/registry/schema";

type RepoResponse = {
  private: boolean;
  license: { spdx_id: string | null } | null;
};

const token = process.env.GITHUB_TOKEN;
const headers: Record<string, string> = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "themecc-registry-check",
};
if (token) {
  headers.Authorization = `Bearer ${token}`;
}

async function get(url: string): Promise<Response> {
  return fetch(`https://api.github.com${url}`, { headers });
}

async function main(): Promise<void> {
  const problems: string[] = [];
  const desktop = loadThemesOrThrow().filter(
    (theme) => theme.type === "desktop",
  );

  for (const theme of desktop) {
    const label = `registry/desktop/${theme.slug}`;
    const { repo, sha, path } = theme.source;

    const repoResponse = await get(`/repos/${repo}`);
    if (!repoResponse.ok) {
      problems.push(
        `${label}: repository ${repo} is not reachable (${repoResponse.status})`,
      );
      continue;
    }
    const repoData = (await repoResponse.json()) as RepoResponse;
    if (repoData.private) {
      problems.push(`${label}: repository ${repo} must be public`);
    }
    const spdx = repoData.license?.spdx_id ?? null;
    if (!spdx || !(LICENSES as readonly string[]).includes(spdx)) {
      problems.push(
        `${label}: repository license "${spdx ?? "none"}" is not an accepted license`,
      );
    } else if (spdx !== theme.license) {
      problems.push(
        `${label}: license "${theme.license}" does not match repository license "${spdx}"`,
      );
    }

    const commit = await get(`/repos/${repo}/commits/${sha}`);
    if (!commit.ok) {
      problems.push(`${label}: commit ${sha} was not found in ${repo}`);
      continue;
    }

    const manifestPath = path
      ? `${path}/.claude-plugin/plugin.json`
      : ".claude-plugin/plugin.json";
    const manifest = await get(
      `/repos/${repo}/contents/${manifestPath}?ref=${sha}`,
    );
    if (!manifest.ok) {
      problems.push(`${label}: ${manifestPath} was not found at ${sha}`);
    }
  }

  if (problems.length > 0) {
    for (const problem of problems) {
      console.error(problem);
    }
    process.exit(1);
  }
  console.log(`Remote checks passed for ${desktop.length} desktop theme(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
