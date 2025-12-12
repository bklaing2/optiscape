// Copied from https://github.com/readest/readest/blob/31aeb2289cf597a9db809607d2362a3a8c6d5d66/apps/readest-app/src/types/view.ts

// @ts-ignore
import type { TTS } from 'foliate-js/tts.js';

// interface LanguageMap {
//   [key: string]: string;
// }

interface Contributor {
  name: string // | LanguageMap;
}

interface TOCItem {
  id: number;
  label: string;
  href: string;
  cfi?: string;
  location?: Location;
  subitems?: TOCItem[];
}

interface SectionItem {
  id: string;
  cfi: string;
  size: number;
  linear: string;
  location?: Location;
}

interface BookDoc {
  metadata: {
    // NOTE: the title and author fields should be formatted
    title: string // | LanguageMap;
    author: Contributor // | string;
    language: string | string[];
    editor?: string;
    publisher?: string;
    published?: string;
    description?: string;
    subject?: string[];
    identifier?: string;
  };
  dir: string;
  toc?: Array<TOCItem>;
  sections?: Array<SectionItem>;
  transformTarget?: EventTarget;
  splitTOCHref(href: string): Array<string | number>;
  getCover(): Promise<Blob | null>;
}

type TTSGranularity = 'sentence' | 'word';


type BookNoteType = 'bookmark' | 'annotation' | 'excerpt';
type HighlightStyle = 'highlight' | 'underline' | 'squiggly';
type HighlightColor = 'red' | 'yellow' | 'green' | 'blue' | 'violet';

interface PageInfo {
  current: number;
  next?: number;
  total: number;
}

// Remaining time of the book in minutes
interface TimeInfo {
  section: number;
  total: number;
}

interface BookNote {
  bookHash?: string;
  id: string;
  type: BookNoteType;
  cfi: string;
  text?: string;
  style?: HighlightStyle;
  color?: HighlightColor;
  note: string;

  createdAt: number;
  updatedAt: number;
  deletedAt?: number | null;
}

interface BookSearchConfig {
  scope: 'book' | 'section';
  matchCase: boolean;
  matchWholeWords: boolean;
  matchDiacritics: boolean;
  index?: number;
  query?: string;
  acceptNode?: (node: Node) => number;
}

interface SearchExcerpt {
  pre: string;
  match: string;
  post: string;
}

interface BookSearchMatch {
  cfi: string;
  excerpt: SearchExcerpt;
}

interface BookSearchResult {
  label: string;
  subitems: BookSearchMatch[];
  progress?: number;
}

export interface FoliateView extends HTMLElement {
  open: (book: BookDoc | string) => Promise<void>;
  close: () => void;
  init: (options: { lastLocation: string }) => void;
  goTo: (cfi: string) => void;
  goToFraction: (fraction: number) => void;
  prev: (distance?: number) => void;
  next: (distance?: number) => void;
  goLeft: () => void;
  goRight: () => void;
  getCFI: (index: number, range: Range) => string;
  resolveCFI: (cfi: string) => { index: number; anchor: (doc: Document) => Range };
  addAnnotation: (note: BookNote, remove?: boolean) => { index: number; label: string };
  search: (config: BookSearchConfig) => AsyncGenerator<BookSearchResult | string, void, void>;
  clearSearch: () => void;
  select: (target: string | number | { fraction: number }) => void;
  deselect: () => void;
  initTTS: (granularity?: TTSGranularity, highlight?: (range: Range) => void) => Promise<void>;
  book: BookDoc;
  tts: TTS | null;
  language: {
    locale?: string;
    isCJK?: boolean;
  };
  history: {
    canGoBack: boolean;
    canGoForward: boolean;
    back: () => void;
    forward: () => void;
    clear: () => void;
  };
  renderer: {
    scrolled?: boolean;
    size: number; // current page height
    viewSize: number; // whole document view height
    start: number;
    end: number;
    atStart: boolean;
    atEnd: boolean;
    containerPosition: number;
    sideProp: 'width' | 'height';
    setAttribute: (name: string, value: string | number) => void;
    removeAttribute: (name: string) => void;
    next: () => Promise<void>;
    prev: () => Promise<void>;
    nextSection?: () => Promise<void>;
    prevSection?: () => Promise<void>;
    goTo?: (params: { index: number; anchor: number }) => void;
    setStyles?: (css: string) => void;
    getContents: () => { doc: Document; index?: number; overlayer?: unknown }[];
    scrollToAnchor: (anchor: number | Range) => void;
    addEventListener: (
      type: string,
      listener: EventListener,
      option?: AddEventListenerOptions,
    ) => void;
    removeEventListener: (type: string, listener: EventListener) => void;
  };
}

export type LoadEvent = CustomEvent<{
  doc: HTMLDocument;
  index: number;
}>;

export type RelocateEvent = CustomEvent<{
  cfi: string;
  fraction: number;
  location: PageInfo
  pageItem: unknown;
  range: Range;
  section: PageInfo;
  time: TimeInfo
  tocItem: TOCItem;
}>;
