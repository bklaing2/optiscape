import { loadSettings } from '$lib/util/storage';
import type { PageLoad } from './$types';

export const ssr = false
export const prerender = false

export const load: PageLoad = async () => {
  return { settings: loadSettings() }
}
