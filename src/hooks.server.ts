import { STANDARD_EBOOKS_KEY } from '$env/static/private'
import type { Handle } from '@sveltejs/kit'

const STANDARD_EBOOKS_URL = 'https://standardebooks.org/feeds/opds'
const STANDARD_EBOOKS_OPTIONS = { headers: { 'User-Agent': STANDARD_EBOOKS_KEY } }

export const handle: Handle = async ({ event, resolve }) => {
  const fetchBooks = (feed = "") =>
    event.fetch(`${STANDARD_EBOOKS_URL}/${feed}`, STANDARD_EBOOKS_OPTIONS)

  event.locals = { fetchBooks }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range'
    }
  })
}
