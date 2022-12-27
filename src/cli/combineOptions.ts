/* eslint-disable @typescript-eslint/naming-convention */
export const combineOptions: Record<string, string> = {
  "-c --config <path>":
    "Path to configuration file (default: './package.json')",

  "-o --output-dir <path>": "Combined documentation output directory",

  "--extract-dir <path>":
    "The base directory within which to search for snippets",

  "--extract-include <paths...>":
    "Include specified paths or glob patterns in snippet extraction",

  "--extract-ignore <paths...>":
    "Ignore specified paths or glob patterns in snippet extraction",

  "--inject-dir <path>":
    "The base directory within which to search for injectable files",

  "--inject-include <paths...>":
    "Include specified paths or glob patterns in snippet injection",

  "--inject-ignore <paths...>":
    "Ignore specified paths or glob patterns in snippet injection",

  "--start-token <token>": "Token marking the start of the snippet",

  "--end-token <token>": "Token marking the end of the snippet",

  "--inject-token <token>": "Token marking the point of snippet injection",
};
