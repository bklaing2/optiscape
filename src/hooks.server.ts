import { STANDARD_EBOOKS_KEY } from '$env/static/private'
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  const fetchBooks = (url: string) => event.fetch(url, { headers: { 'User-Agent': STANDARD_EBOOKS_KEY } })

  event.locals = { fetchBooks }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range'
    }
  })
}
