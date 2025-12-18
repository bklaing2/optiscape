import type { PageLoad } from './$types';
import { SEARCH_PARAMS } from '$lib/constants';

const { COLLECTION, SHELF, FILTER_BOOKS } = SEARCH_PARAMS

export const ssr = false

export const load: PageLoad = async ({ parent, url }) => {
  const data = await parent()
  const searchParams = { ...data.searchParams, [FILTER_BOOKS]: url.searchParams.get(FILTER_BOOKS) }

  const collection = data.collections.find(c => searchParams[COLLECTION] === c.id)
  const shelf = collection?.subsections.find(s => searchParams[SHELF] === s.id)
  const books = [...(collection?.books ?? []), ...(shelf?.books ?? [])].filter(
    b =>
      !searchParams[FILTER_BOOKS] ||
      b.title
        .toLowerCase()
        .includes(searchParams[FILTER_BOOKS].toLowerCase()) ||
      b.author
        .toLowerCase()
        .includes(searchParams[FILTER_BOOKS].toLowerCase())
  )

  return { books, searchParams }
}
