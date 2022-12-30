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

  "--start-tokens <tokens...>": "Tokens marking the start of the snippet",

  "--end-tokens <tokens...>": "Tokens marking the end of the snippet",

  "--inline-start-tokens <tokens...>":
    "Inline Tokens marking the start of the snippet",

  "--inline-end-tokens <tokens...>":
    "Inline Tokens marking the end of the snippet",

  "--inject-token <token>": "Token marking the point of snippet injection",
};
