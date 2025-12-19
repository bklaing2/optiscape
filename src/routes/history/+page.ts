import type { PageLoad } from './$types';
import { getHistory } from '$lib/db'

export const ssr = false

export const load: PageLoad = async () => {
  return {
    history: await getHistory()
  }
}
