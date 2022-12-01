import { combineDocsAndSnippets } from "./lib/combine";

import { program } from "commander";

export const run = async (argv: string[]): Promise<void> => {
  program.name("doc-snippets").description("Tools for documentation snippets.");

  program
    .command("combine")
    .description(
      "Extracts snippets from the snippets directory and outputs a copy of the documentation directory with snippets injected into it"
    )
    .argument("<snippetsDir>", "The snippets directory")
    .argument("<docsDir>", "The documentation directory")
    .argument("<outputDir>", "The output directory")
    .option("-i, --ignore <paths...>", "Ignore specified paths")
    .option("-e, --exts <exts...>", "Extensions to parse")
    .action(
      async (
        snippetsDir: string,
        docsDir: string,
        outputDir: string,
        { ignore, exts }
      ) => {
        await combineDocsAndSnippets(
          snippetsDir,
          docsDir,
          outputDir,
          exts,
          ignore
        );
      }
    );

  await program.parseAsync(argv);
};
