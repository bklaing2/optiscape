import { resolve } from "$app/paths";


// @ts-expect-error
export const FOLIATE_VIEW = resolve('/foliate-js/view.js');

export const LINKS = {
  github: 'https://github.com/bklaing2/optiscape',
  buyMeACoffee: 'https://buymeacoffee.com/blaing',
  standardEbooks: 'https://standardebooks.org/',
} as const;
