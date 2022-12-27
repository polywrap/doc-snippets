import { SearchOptions } from ".";

export type DocSnippetsConfig = {
  extract: SearchOptions;
  inject: SearchOptions;
  startToken: string;
  endToken: string;
  injectToken: string;
  outputDir: string;
};

export type PartialDocSnippetsConfig = {
  extract?: Partial<SearchOptions>;
  inject?: Partial<SearchOptions>;
  startToken?: string;
  endToken?: string;
  injectToken?: string;
  outputDir?: string;
};
