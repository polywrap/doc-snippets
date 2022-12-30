import { ExtractionToken, SearchOptions } from ".";

export type DocSnippetsConfig = {
  extract: SearchOptions;
  inject: SearchOptions;
  startTokens: ExtractionToken[];
  endTokens: ExtractionToken[];
  injectToken: string;
  outputDir: string;
};

export type PartialDocSnippetsConfig = {
  extract?: Partial<SearchOptions>;
  inject?: Partial<SearchOptions>;
  startTokens?: ExtractionToken[];
  endTokens?: ExtractionToken[];
  injectToken?: string;
  outputDir?: string;
};
