import type { PageLoad } from './$types';
import { getCurrentlyReading, getHistory } from '$lib/db'

export const ssr = false

export const load: PageLoad = async ({ data }) => {
  return {
    ...data,
    currentlyReading: await getCurrentlyReading(),
    history: await getHistory()
  }
}
