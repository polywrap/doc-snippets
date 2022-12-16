import { SearchOptions } from ".";

export type DocSnippetsConfig = {
  extract: SearchOptions;
  inject: SearchOptions;
  outputDir: string;
};

export type PartialDocSnippetsConfig = {
  extract?: Partial<SearchOptions>;
  inject?: Partial<SearchOptions>;
  outputDir?: string;
}