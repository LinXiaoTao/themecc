import { loadRegistry } from "../src/lib/registry/load";

const { themes, errors } = loadRegistry();

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`${error.file}: ${error.message}`);
  }
  console.error(`\n${errors.length} problem(s) found in the registry.`);
  process.exit(1);
}

const desktop = themes.filter((theme) => theme.type === "desktop").length;
const cli = themes.length - desktop;
console.log(`Registry OK: ${desktop} desktop theme(s), ${cli} CLI theme(s).`);
