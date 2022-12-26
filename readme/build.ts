import fs from "fs";
import path from "path";

import { combineOptions } from "../src/cli";
import { injectSnippetsIntoFile } from "../src/lib/inject";

const snippets: Record<string, string> = {};

snippets["combine-options"] = "";

for (const option in combineOptions) {
  snippets[
    "combine-options"
  ] += `- \`${option}\` - ${combineOptions[option]}\n`;
}

const sourceFilePath = path.join(__dirname, "README.md");
const destFilePath = path.join(__dirname, "../README.md");

fs.copyFileSync(sourceFilePath, destFilePath);

injectSnippetsIntoFile(snippets, destFilePath, "%snippet: ");
