import { getInjectionTokenCaptureRegExp } from "./utils/regexp";

import fs from "fs";

export async function injectSnippetsIntoFile(
  snippets: Record<string, string>,
  filePath: string,
  injectToken: string
): Promise<void> {
  let contents = fs.readFileSync(filePath, "utf-8");
  let modified = false;

  const injectionRegExp = getInjectionTokenCaptureRegExp(injectToken);

  let nextMatch: RegExpMatchArray | null = null;

  while ((nextMatch = contents.match(injectionRegExp))) {
    const snippetName = nextMatch[1];

    const snippetStartIdx = nextMatch.index as number; //Unless
    const snippetEndIdx = snippetStartIdx + nextMatch[0].length;

    if (!snippets[snippetName]) {
      throw Error(`Unknown Snippet: ${snippetName} in ${filePath}`);
    }

    contents =
      contents.substring(0, snippetStartIdx) +
      snippets[snippetName] +
      contents.substring(snippetEndIdx, contents.length);

    console.log("- Inject Snippet", snippetName, "into", filePath);

    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, contents, "utf-8");
  }
}
