import { readFileSync } from "node:fs";
import {
  type ChangedFile,
  checkAutoMerge,
} from "../src/lib/registry/pr-eligibility";

// Reads the pull request file list (JSON array of {status, filename}) from
// stdin. Exits 0 when the change may be merged without review.
const files = JSON.parse(readFileSync(0, "utf8")) as ChangedFile[];
const decision = checkAutoMerge(files);

if (decision.eligible) {
  console.log(`Eligible for auto-merge: ${files.length} CLI theme file(s).`);
  process.exit(0);
}
console.log(`Not eligible for auto-merge: ${decision.reason}`);
process.exit(1);
