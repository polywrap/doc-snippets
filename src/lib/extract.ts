import { SearchOptions, Snippet, ExtractionToken } from "./types";
import { searchFiles } from "./utils";
import { getSnippetCaptureRegExp } from "./utils/regexp";
import { getSnippetFromRegExpMatch } from "./utils/regexp/getSnippetFromRegExpMatch";

import fs from "fs";
import path from "path";

export async function extractSnippets(
  options: SearchOptions,
  startTokens: ExtractionToken[],
  endTokens: ExtractionToken[]
): Promise<Record<string, string>> {
  const snippets: Record<string, string> = {};

  const filePaths = searchFiles(options);

  for (const filePath of filePaths) {
    await extractSnippetsFromFile(
      snippets,
      path.join(options.dir, filePath),
      startTokens,
      endTokens
    );
  }

  return snippets;
}

export async function extractSnippetsFromFile(
  snippets: Record<string, string>,
  filePath: string,
  snippetStartTokens: ExtractionToken[],
  snippetEndTokens: ExtractionToken[]
): Promise<void> {
  const fileContents = fs.readFileSync(filePath, "utf-8");

  const foundSnippets = findSnippets(
    fileContents,
    snippetStartTokens,
    snippetEndTokens
  );

  for (const snippet of foundSnippets) {
    console.log(`- Extract Snippet ${snippet.name} in ${filePath}`);

    if (snippets[snippet.name]) {
      throw Error(
        `Duplicate Snippet Definition: ${snippet.name} in ${filePath}`
      );
    }

    snippets[snippet.name] = snippet.contents;
  }
}

function findSnippets(
  contents: string,
  snippetStartTokens: ExtractionToken[],
  snippetEndTokens: ExtractionToken[]
): Snippet[] {
  const regExp = getSnippetCaptureRegExp(snippetStartTokens, snippetEndTokens);

  const matches = contents.matchAll(regExp);

  const snippets: Snippet[] = [];

  for (const match of matches) {
    snippets.push(getSnippetFromRegExpMatch(match));
  }

  return snippets;
}
