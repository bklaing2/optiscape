import type { PageServerLoad } from './$types'
import { EntryToBook } from '$lib/util/misc'

export const load: PageServerLoad = async ({ locals }) => {
  const { fetchStandardEbooksEntries } = locals;

  const entries = await fetchStandardEbooksEntries('all')
  return { optiscapes: entries.slice(0, 10).map(EntryToBook) }
}
