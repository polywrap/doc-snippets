import { SearchOptions } from "./types";
import { searchFiles } from "./utils";

import fs from "fs";
import path from "path";

export async function extractSnippets(
  options: SearchOptions,
  snippetStartToken: string,
  snippetEndToken: string
): Promise<Record<string, string>> {
  const snippets: Record<string, string> = {};

  const filePaths = searchFiles(options);

  for (const filePath of filePaths) {
    await extractSnippetsFromFile(
      snippets,
      path.join(options.dir, filePath),
      snippetStartToken,
      snippetEndToken
    );
  }

  return snippets;
}

export async function extractSnippetsFromFile(
  snippets: Record<string, string>,
  filePath: string,
  snippetStartToken: string,
  snippetEndToken: string
): Promise<void> {
  const contents = fs.readFileSync(filePath, "utf-8");
  let index = 0;

  while (index < contents.length) {
    const startIdx = contents.indexOf(snippetStartToken, index);

    if (startIdx < 0) {
      index = contents.length;
      continue;
    }

    const nameStartIdx = startIdx + snippetStartToken.length;
    const lineEndIdx = contents.indexOf("\n", nameStartIdx);

    // Find end of snippet name. This is either the end of the line,
    // or the first occurence of a space after the snippet's name starts.
    let nameEndIdx = contents.indexOf(" ", nameStartIdx);
    if (nameEndIdx < 0 || nameEndIdx > lineEndIdx) {
      nameEndIdx = lineEndIdx;
    }

    const name = contents.substring(nameStartIdx, nameEndIdx);
    //  contents.substr(nameStartIdx, nameEndIdx - nameStartIdx);

    const snippetStartIdx = lineEndIdx + 1;
    let snippetEndIdx = contents.indexOf(snippetEndToken, snippetStartIdx);

    // Walk back from the $end until we hit the first \n
    while (contents[snippetEndIdx] !== "\n") {
      snippetEndIdx -= 1;
    }

    const snippet = contents.substring(snippetStartIdx, snippetEndIdx);

    console.log("- Extract Snippet", name);

    if (snippets[name]) {
      throw Error(`Duplicate Snippet Definition: ${name}`);
    }

    snippets[name] = snippet;

    index = snippetEndIdx + snippetEndToken.length;
  }
}
