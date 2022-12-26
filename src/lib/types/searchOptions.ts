export type SearchPattern = string | string[];

export type SearchOptions = {
  dir: string;
  include: SearchPattern;
  ignore: SearchPattern;
};
