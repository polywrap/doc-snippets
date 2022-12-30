import { DocSnippetsConfig } from "../types";

export const defaultDocSnippetsConfig: DocSnippetsConfig = {
  extract: {
    dir: "./src",
    include: "./**/*.{js,ts,json,yaml,txt,md,graphql,cue}",
    ignore: "./**/node_modules/**",
  },
  inject: {
    dir: "./src/docs",
    include: "./**/*.md",
    ignore: "./**/node_modules/**",
  },
  startTokens: [{ pattern: "$start: ", inline: false }],
  endTokens: [{ pattern: "$end", inline: false }],
  injectToken: "$snippet: ",
  outputDir: "./docs",
};
