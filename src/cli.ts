import { combineDocsAndSnippets } from "./lib/combine";
import { DocSnippetsConfig, PartialDocSnippetsConfig } from "./lib/types";

import { program } from "commander";

import fs from "fs";
import { defaultDocSnippetsConfig } from "./lib/defaults";

type CombineOptions = {
  config?: string;
  outputDir?: string;
  extractDir?: string;
  extractInclude?: string[];
  extractIgnore?: string[];
  injectDir?: string;
  injectInclude?: string[];
  injectIgnore?: string[];
  startToken?: string,
  endToken?: string,
  injectToken?: string,
};

export const run = async (argv: string[]): Promise<void> => {
  program.name("doc-snippets").description("Tools for documentation snippets.");

  program
    .command("combine")
    .description(
      "Extract snippets and output documentation files with snippets injected."
    )
    .option(
      "-c --config <path>",
      "Path to configuration file (default: './package.json')"
    )
    .option("-o --output-dir <path>", "Combined documentation output directory")
    .option(
      "--extract-dir <path>",
      "The base directory within which to search for snippets"
    )
    .option(
      "--extract-include <paths...>",
      "Include specified paths or glob patterns in snippet extraction"
    )
    .option(
      "--extract-ignore <paths...>",
      "Ignore specified paths or glob patterns in snippet extraction"
    )
    .option(
      "--inject-dir <path>",
      "The base directory within which to search for injectable files"
    )
    .option(
      "--inject-include <paths...>",
      "Include specified paths or glob patterns in snippet injection"
    )
    .option(
      "--inject-ignore <paths...>",
      "Ignore specified paths or glob patterns in snippet injection"
    )
    .option(
      "--start-token <token>",
      "Token marking the start of the snippet"
    )
    .option(
      "--end-token <token>",
      "Token marking the end of the snippet"
    )
    .option(
      "--inject-token <token>",
      "Token marking the point of snippet injection"
    )
    .action(async (options: CombineOptions) => {
      const configFilePath = options.config ?? "./package.json";
      const config = parseDocSnippetsConfig(configFilePath);

      applyCommandOptionsToConfig(options, config);
      console.log("OPTIONS", options)
      console.log("CONFIG", config)

      await combineDocsAndSnippets(config);
    });

  await program.parseAsync(argv);
};

function parseDocSnippetsConfig(configFilePath: string): DocSnippetsConfig {
  const configFileContents = fs.readFileSync(configFilePath, {
    encoding: "utf-8",
  });

  const configJson = JSON.parse(configFileContents);

  const config = configJson["doc-snippets"] as PartialDocSnippetsConfig;

  const resultConfig: DocSnippetsConfig = {
    extract: {
      dir: config.extract?.dir ?? defaultDocSnippetsConfig.extract.dir,
      ignore: config.extract?.ignore ?? defaultDocSnippetsConfig.extract.ignore,
      include:
        config.extract?.include ?? defaultDocSnippetsConfig.extract.include,
    },
    inject: {
      dir: config.inject?.dir ?? defaultDocSnippetsConfig.inject.dir,
      ignore: config.inject?.ignore ?? defaultDocSnippetsConfig.inject.ignore,
      include:
        config.inject?.include ?? defaultDocSnippetsConfig.inject.include,
    },
    startToken: config.startToken ?? defaultDocSnippetsConfig.startToken,
    endToken: config.endToken ?? defaultDocSnippetsConfig.endToken,
    injectToken: config.injectToken ?? defaultDocSnippetsConfig.injectToken,
    outputDir: config.outputDir ?? defaultDocSnippetsConfig.outputDir,
  };

  return resultConfig;
}

function applyCommandOptionsToConfig(
  options: CombineOptions,
  config: DocSnippetsConfig
) {
  config.extract.dir = options.extractDir ?? config.extract.dir;
  config.extract.include = options.extractInclude ?? config.extract.include;
  config.extract.ignore = options.extractIgnore ?? config.extract.ignore;

  config.inject.dir = options.extractDir ?? config.inject.dir;
  config.inject.include = options.extractInclude ?? config.inject.include;
  config.inject.ignore = options.extractIgnore ?? config.inject.ignore;

  config.startToken = options.startToken ?? config.startToken;
  config.endToken = options.endToken ?? config.endToken;
  config.injectToken = options.injectToken ?? config.injectToken;

  config.outputDir = options.outputDir ?? config.outputDir;
}
