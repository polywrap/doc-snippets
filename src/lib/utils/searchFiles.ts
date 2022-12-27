import { SearchOptions, SearchPattern } from "../types";

import glob from "glob";

export function searchFiles(options: SearchOptions): string[] {
  let results: string[];

  if (typeof options.include === "string") {
    results = findFilePathsWithinDir(
      options.include,
      options.dir,
      options.ignore
    );
  } else {
    results = options.include.flatMap((pattern) =>
      findFilePathsWithinDir(pattern, options.dir, options.ignore)
    );
  }

  return results;
}

function findFilePathsWithinDir(
  globPattern: string,
  dir: string,
  ignore?: SearchPattern
): string[] {
  return glob.sync(globPattern, { ignore: ignore, cwd: dir });
}
