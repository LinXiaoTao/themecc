import { describe, expect, it } from "vitest";
import { checkAutoMerge, MAX_AUTO_MERGE_FILES } from "./pr-eligibility";

const added = (filename: string) => ({ status: "added", filename });

describe("checkAutoMerge", () => {
  it("accepts new CLI theme files", () => {
    const result = checkAutoMerge([
      added("registry/cli/my-theme/theme.json"),
      added("registry/cli/my-theme/meta.json"),
    ]);
    expect(result.eligible).toBe(true);
  });

  it("rejects an empty change", () => {
    expect(checkAutoMerge([]).eligible).toBe(false);
  });

  it("rejects edits to existing entries", () => {
    const result = checkAutoMerge([
      { status: "modified", filename: "registry/cli/nord/meta.json" },
    ]);
    expect(result.eligible).toBe(false);
  });

  it("rejects removals and renames", () => {
    for (const status of ["removed", "renamed"]) {
      const result = checkAutoMerge([
        { status, filename: "registry/cli/nord/theme.json" },
      ]);
      expect(result.eligible).toBe(false);
    }
  });

  it("rejects desktop mods", () => {
    const result = checkAutoMerge([
      added("registry/desktop/my-mod/theme.json"),
    ]);
    expect(result.eligible).toBe(false);
  });

  it("rejects any file outside the theme files", () => {
    for (const filename of [
      "registry/cli/my-theme/poster.webp",
      "registry/cli/my-theme/extra/theme.json",
      "registry/cli/My_Theme/theme.json",
      "registry/cli/../../.github/workflows/ci.yml",
      ".claude-plugin/marketplace.json",
      "plugins/cli-my-theme/themes/my-theme.json",
      "src/lib/registry/schema.ts",
    ]) {
      expect(checkAutoMerge([added(filename)]).eligible, filename).toBe(false);
    }
  });

  it("rejects a valid file mixed with an ineligible one", () => {
    const result = checkAutoMerge([
      added("registry/cli/my-theme/theme.json"),
      added(".github/workflows/ci.yml"),
    ]);
    expect(result.eligible).toBe(false);
  });

  it("rejects very large changes", () => {
    const files = Array.from({ length: MAX_AUTO_MERGE_FILES + 1 }, (_, i) =>
      added(`registry/cli/theme-${i}/theme.json`),
    );
    expect(checkAutoMerge(files).eligible).toBe(false);
  });
});
