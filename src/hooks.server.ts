import type { Handle } from '@sveltejs/kit'
import { fetchStandardEbooksEntries } from '$lib/server/standardEbooks'

export const handle: Handle = async ({ event, resolve }) => {
  event.locals = {
    fetchStandardEbooksEntries: (feed = "") => fetchStandardEbooksEntries(feed, event.fetch)
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range'
    }
  })
}
