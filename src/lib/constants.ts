import { resolve } from "$app/paths";

export const SEARCH_PARAMS = {
  COLLECTION: 'collection',
  SHELF: 'shelf',
  FILTER_SHELVES: 'filter-shelves',
} as const


// @ts-expect-error
export const FOLIATE_VIEW = resolve('/foliate-js/view.js');

export const LINKS = {
  github: 'https://github.com/bklaing2/optiscape',
  buyMeACoffee: 'https://buymeacoffee.com/blaing',
  standardEbooks: 'https://standardebooks.org/',
} as const;
