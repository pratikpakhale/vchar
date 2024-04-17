export type googleSearch = (
  query: string,
  options?: googlethisOptions
) => Promise<any>;

export interface googlethisOptions {
  ris: boolean;
  safe: boolean;
  page: number;
  parse_ads: boolean;
  use_mobile_ua: boolean;
  params: googlethisAdditionalParams;
}

export type googleImageSearch = (query: string) => Promise<any>;

export interface googlethisAdditionalParams {
  hl?: string; //host language
  related?: string; // related domain for competetive sites
  intitle?: string; // intitle words to match
  stocks?: string; // related to stocks
  inurl?: string; // in url words to match
  intext?: string; // in text words to match
  before?: string; // before date MM/DD/YYYY also works for YYYY
  after?: string; // after date MM/DD/YYYY also works for YYYY

  // so we use this for not having file types in the search eg: -filetype:pdf -filetype:doc
  filetype?: [string];

  // Find pages linked to with the specified anchor text/phrase. Data is heavily sampled.
  inanchor?: string;

}
