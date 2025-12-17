import type { LayoutLoad } from './$types';
import { SEARCH_PARAMS } from '$lib/constants';
import type { Fn } from '$lib/types';

const { COLLECTION, SHELF, FILTER_SHELVES } = SEARCH_PARAMS

export const ssr = false

export const load: LayoutLoad = async ({ data, url }) => {
  const searchParams = {
    [COLLECTION]: url.searchParams.get(COLLECTION),
    [SHELF]: url.searchParams.get(SHELF),
    [FILTER_SHELVES]: url.searchParams.get(FILTER_SHELVES)
  } as const

  // List of collections
  const collections = data.collections.map(WithSearchParams(c => ({ [COLLECTION]: c.id })))

  // List of shelves for the selected collection
  const shelves = (
    collections.find(c => searchParams[COLLECTION] === c.id) ??
    data.collections[0]
  ).subsections
    .filter(
      shelf =>
        !searchParams[FILTER_SHELVES] ||
        shelf.text
          .toLowerCase()
          .includes(searchParams[FILTER_SHELVES].toLowerCase())
    )
    .map(
      WithSearchParams(s => ({
        [COLLECTION]: searchParams[COLLECTION],
        [SHELF]: s.id === searchParams[SHELF] ? null : s.id,
        [FILTER_SHELVES]: searchParams[FILTER_SHELVES]
      }))
    )

  return { collections, shelves, searchParams }
}

function WithSearchParams<T extends object>(
  buildSearchParams: Fn<T, Record<string, string | null>>
) {
  return (obj: T) => {
    const searchParams = new URLSearchParams(
      CleanObject(buildSearchParams(obj))
    ).toString()

    return {
      ...obj,
      searchParams: `${searchParams ? '?' : ''}${searchParams}`
    }
  }
}

function CleanObject<T extends object>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v != null && v !== '')
  ) as Record<keyof T, string>
}
