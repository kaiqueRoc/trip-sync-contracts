import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { generateOpenApiDocument } from "../src/openapi-document.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "docs", "openapi");
const outFile = join(outDir, "openapi.json");

mkdirSync(outDir, { recursive: true });

const doc = generateOpenApiDocument();
writeFileSync(outFile, `${JSON.stringify(doc, null, 2)}\n`, "utf-8");

console.log(`OpenAPI written to ${outFile}`);
