import fs from "fs";

export async function injectSnippetsIntoFile(
  snippets: Record<string, string>,
  filePath: string,
  injectToken: string
): Promise<void> {
  let contents = fs.readFileSync(filePath, "utf-8");
  let modified = false;
  let index = 0;

  while (index < contents.length) {
    const snippetStartIdx = contents.indexOf(injectToken, index);

    if (snippetStartIdx < 0) {
      index = contents.length;
      continue;
    }

    const nameStartIdx = snippetStartIdx + injectToken.length;

    let snippetEndIdx = contents.indexOf("\n", nameStartIdx);
    const firstSpaceIdx = contents.indexOf(" ", nameStartIdx);

    // Either there's no newline, or the 1st space char appears earlier than the newline.
    if (snippetEndIdx == -1 || (firstSpaceIdx > 0 && snippetEndIdx > firstSpaceIdx)) {
      snippetEndIdx = firstSpaceIdx;
    }

    // If we're hitting the end of the string while searching for both a newline and a space,
    // the end of the snippet is at the end of the string.
    if (snippetEndIdx == -1) {
      snippetEndIdx = contents.length;
    }

    const name = contents.substring(nameStartIdx, snippetEndIdx);

    if (!snippets[name]) {
      throw Error(`Unknown Snippet: ${name} in ${filePath}`);
    }

    contents =
      contents.substring(0, snippetStartIdx) +
      snippets[name] +
      contents.substring(snippetEndIdx, contents.length);

    console.log("- Inject Snippet", name, "into", filePath);

    modified = true;
    index = snippetStartIdx + snippets[name].length;
  }

  if (modified) {
    fs.writeFileSync(filePath, contents, "utf-8");
  }
}
