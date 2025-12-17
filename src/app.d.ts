import 'unplugin-icons/types/svelte'
import { fetchStandardEbooksEntries } from '$lib/server/standardEbooks'

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      fetchStandardEbooksEntries: typeof fetchStandardEbooksEntries
    }
    // interface PageData {}
    // interface Platform {}
  }
}

declare namespace svelteHTML {
  interface HTMLAttributes<T> {
    'on:readerMouseDown'?: (event: any) => any;
  }
}

export { };
