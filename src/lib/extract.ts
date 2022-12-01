import { defaultParseExts, defaultIgnorePaths } from "./defaults";

import path from "path";
import fs from "fs";
import ignore, { Ignore } from "ignore";

/**
 * @typedef ExtractSnippetsOptions
 * @type {object}
 * @property {string[]} [parseExts] A list of file extensions which will be parsed for Snippets
 * @property {string[]} [ignorePaths] A list of paths in `gitignore` format which will be ignored when parsing
 */
type ExtractSnippetsOptions = {
  parseExts?: string[];
  ignorePaths?: string[];
};

/**
 * Extract snippets from all files within a directory
 * @param {string} dir The directory to search and extract snippets from
 * @param {ExtractSnippetsOptions} options Extraction options
 * @returns {Record<string, string>} A Record containing all extracted Snippets
 */
export async function extractSnippets(
  dir: string,
  options?: ExtractSnippetsOptions
): Promise<Record<string, string>> {
  const snippets: Record<string, string> = {};

  const ignoreInstance = ignore();

  if (options?.ignorePaths) {
    ignoreInstance.add(options.ignorePaths);
  } else {
    ignoreInstance.add(defaultIgnorePaths);
  }

  const exts = options?.parseExts ?? defaultParseExts;

  await searchAndExtractSnippetsFromDir(snippets, dir, exts, ignoreInstance);

  return snippets;
}

async function searchAndExtractSnippetsFromDir(
  snippets: Record<string, string>,
  dir: string,
  exts: string[],
  ignoreInstance: Ignore
) {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });

  const match = (str: string, tests: string[]) => {
    for (const test of tests) {
      if (str.indexOf(test) > -1) {
        return true;
      }
    }
    return false;
  };

  for (const dirent of dirents) {
    const direntPath = path.join(dir, dirent.name);

    if (ignoreInstance.test(direntPath).ignored) {
      continue;
    }

    if (dirent.isFile() && match(dirent.name, exts)) {
      await extractSnippetsFromFile(snippets, direntPath);
    } else if (dirent.isDirectory()) {
      await searchAndExtractSnippetsFromDir(
        snippets,
        direntPath,
        exts,
        ignoreInstance
      );
    }
  }
}

async function extractSnippetsFromFile(
  snippets: Record<string, string>,
  filePath: string
) {
  const contents = fs.readFileSync(filePath, "utf-8");
  let index = 0;

  while (index < contents.length) {
    const start = "$start: ";
    const end = "$end";
    const startIdx = contents.indexOf(start, index);

    if (startIdx < 0) {
      index = contents.length;
      continue;
    }

    const nameStartIdx = startIdx + start.length;
    const nameEndIdx = contents.indexOf("\n", nameStartIdx);
    const name = contents.substr(nameStartIdx, nameEndIdx - nameStartIdx);

    const snippetStartIdx = nameEndIdx + 1;
    let snippetEndIdx = contents.indexOf(end, snippetStartIdx);

    // Walk back from the $end until we hit the first \n
    while (contents[snippetEndIdx] !== "\n") {
      snippetEndIdx -= 1;
    }

    const snippet = contents.substr(
      snippetStartIdx,
      snippetEndIdx - snippetStartIdx
    );

    console.log("- Extract Snippet", name);

    if (snippets[name]) {
      throw Error(`Duplicate Snippet Definition: ${name}`);
    }

    snippets[name] = snippet;

    index = snippetEndIdx + end.length;
  }
}
