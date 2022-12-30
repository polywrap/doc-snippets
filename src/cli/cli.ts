import { combineDocsAndSnippets } from "../lib/combine";
import {
  DocSnippetsConfig,
  ExtractionToken,
  PartialDocSnippetsConfig,
} from "../lib/types";
import { defaultDocSnippetsConfig } from "../lib/defaults";
import { combineOptions } from "./combineOptions";

import { program } from "commander";
import fs from "fs";

type CombineOptions = {
  config?: string;
  outputDir?: string;
  extractDir?: string;
  extractInclude?: string[];
  extractIgnore?: string[];
  injectDir?: string;
  injectInclude?: string[];
  injectIgnore?: string[];
  startTokens?: string[];
  endTokens?: string[];
  inlineStartTokens?: string[];
  inlineEndTokens?: string[];
  injectToken?: string;
};

export const run = async (argv: string[]): Promise<void> => {
  program.name("doc-snippets").description("Tools for documentation snippets.");

  const combineCommand = program
    .command("combine")
    .description(
      "Extract snippets and output documentation files with snippets injected."
    );

  for (const option in combineOptions) {
    combineCommand.option(option, combineOptions[option]);
  }

  combineCommand.action(async (options: CombineOptions) => {
    const configFilePath = options.config ?? "./package.json";
    const config = parseDocSnippetsConfigFile(configFilePath);

    applyCommandOptionsToConfig(options, config);

    console.log("CONFIG:", config);

    await combineDocsAndSnippets(config);
  });

  await program.parseAsync(argv);
};

function parseDocSnippetsConfigFile(configFilePath: string): DocSnippetsConfig {
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
    startTokens: config.startTokens ?? defaultDocSnippetsConfig.startTokens,
    endTokens: config.endTokens ?? defaultDocSnippetsConfig.endTokens,
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

  if (options.startTokens ?? options.inlineStartTokens) {
    const tokens: ExtractionToken[] = [];

    for (const token of options.startTokens ?? []) {
      tokens.push({ pattern: token, inline: false });
    }

    for (const token of options.inlineStartTokens ?? []) {
      tokens.push({ pattern: token, inline: true });
    }
  }

  if (options.endTokens ?? options.inlineEndTokens) {
    const tokens: ExtractionToken[] = [];

    for (const token of options.endTokens ?? []) {
      tokens.push({ pattern: token, inline: false });
    }

    for (const token of options.inlineEndTokens ?? []) {
      tokens.push({ pattern: token, inline: true });
    }
  }

  config.injectToken = options.injectToken ?? config.injectToken;

  config.outputDir = options.outputDir ?? config.outputDir;
}
