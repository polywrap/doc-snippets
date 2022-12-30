import { extractSnippets } from "./extract";
import { injectSnippetsIntoFile as injectSnippetsIntoFile } from "./inject";
import { DocSnippetsConfig } from "./types";
import { searchFiles } from "./utils";

import fs from "fs";
import path from "path";

export async function combineDocsAndSnippets(
  config: DocSnippetsConfig
): Promise<void> {
  console.log("- Extract Snippets");

  const snippets = await extractSnippets(
    config.extract,
    config.startTokens,
    config.endTokens
  );

  console.log(`- Copy files from ${config.inject.dir} to ${config.outputDir}`);

  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir);
  }

  const injectableFiles = searchFiles(config.inject);

  for (const file of injectableFiles) {
    const srcFilePath = path.join(config.inject.dir, file);
    const dstFilePath = path.join(config.outputDir, file);

    console.log(`- Copy ${srcFilePath} to ${dstFilePath}`);

    await fs.promises.cp(srcFilePath, dstFilePath, { recursive: true });
  }

  console.log("- Inject snippets");

  for (const file of injectableFiles) {
    const filePath = path.join(config.outputDir, file);

    await injectSnippetsIntoFile(snippets, filePath, config.injectToken);
  }

  console.log(
    `Successfully combined documentation and snippets into ${config.outputDir}`
  );
}
