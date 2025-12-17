import type { LayoutServerLoad } from './$types';

import type { Entry } from 'r2-opds-js/dist/es8-es2017/src/opds/opds1/opds-entry';
import { EntryToBook } from '$lib/util/misc';
import type { ID } from '$lib/types';

const Id = (e: Entry) => e.Id.split('/').pop() || e.Id
const Text = (e: Entry) => Id(e).replace(/-/g, ' ').toUpperCase()

const IsSubsection = (e: Entry) => e.Links.find(l => l.Rel === 'subsection')
const IsNotSubsection = (e: Entry) => !IsSubsection(e)

export const load: LayoutServerLoad = async ({ locals }) => {
  const { fetchStandardEbooksEntries } = locals

  // Fetch top-level collections (new releases, subjects, etc.) and populate all their subsections/books
  const collections = (await Promise.all((await fetchStandardEbooksEntries())
    .map(e => ({ id: Id(e), text: Text(e) }))
    .sort((a, b) => a.id.localeCompare(b.id))
    .map(PopulateEntries)
  )
  ).map(c => c.id === 'all' ? { ...c, id: null } : c)
  return { collections }

  async function PopulateEntries<T extends ID<string>>(collection: T) {
    // Fetch all entries (books or subsections) for this collection
    const entries = await fetchStandardEbooksEntries(collection.id)
    const books = entries.filter(IsNotSubsection).map(EntryToBook)
    const subsections = await Promise.all(entries
      .filter(IsSubsection)
      .map(e => ({ id: Id(e), text: e.Title }))
      .map(PopulateBooks)
    )
    return { ...collection, books, subsections }

    async function PopulateBooks<T extends ID<string>>(subsection: T) {
      const books = (await fetchStandardEbooksEntries(`${collection.id}/${subsection.id}`))
        .map(EntryToBook)
      return { ...subsection, books }
    }
  }
}
