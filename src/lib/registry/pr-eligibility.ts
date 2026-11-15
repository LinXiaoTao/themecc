export type ChangedFile = {
  status: string;
  filename: string;
};

export type AutoMergeDecision =
  | { eligible: true }
  | { eligible: false; reason: string };

const CLI_THEME_FILE =
  /^registry\/cli\/[a-z0-9]+(?:-[a-z0-9]+)*\/(?:theme|meta)\.json$/;

export const MAX_AUTO_MERGE_FILES = 20;

/**
 * A pull request may be merged without review only when every file is a newly
 * added CLI theme file. Edits to existing entries, desktop mods, code, and
 * workflows always need a maintainer.
 */
export function checkAutoMerge(files: ChangedFile[]): AutoMergeDecision {
  if (files.length === 0) {
    return { eligible: false, reason: "No changed files." };
  }
  if (files.length > MAX_AUTO_MERGE_FILES) {
    return {
      eligible: false,
      reason: `More than ${MAX_AUTO_MERGE_FILES} files changed.`,
    };
  }
  for (const file of files) {
    if (file.status !== "added") {
      return {
        eligible: false,
        reason: `${file.filename} is ${file.status}, not added.`,
      };
    }
    if (!CLI_THEME_FILE.test(file.filename)) {
      return {
        eligible: false,
        reason: `${file.filename} is not a CLI theme file.`,
      };
    }
  }
  return { eligible: true };
}
