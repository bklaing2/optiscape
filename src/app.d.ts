import 'unplugin-icons/types/svelte'

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      fetchBooks: (feed?: string) => Promise<Response>;
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
