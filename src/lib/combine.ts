import { extractSnippets } from "./extract";
import { injectSnippets } from "./inject";

import * as fse from "fs-extra";
import fs from "fs";

export async function combineDocsAndSnippets(
  snippetsDir: string,
  docsDir: string,
  outputDir: string,
  ignorePaths?: string[]
): Promise<void> {
  console.log(`- Copy ${docsDir} to ${outputDir}`);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  fse.copySync(docsDir, outputDir, { overwrite: true });

  console.log("- Extract Snippets");
  const snippets = await extractSnippets(snippetsDir, ignorePaths);

  console.log("- Inject Snippets");
  await injectSnippets(snippets, outputDir);

  console.log(
    `Successfully combined documentation and snippets into ${outputDir}`
  );
}
