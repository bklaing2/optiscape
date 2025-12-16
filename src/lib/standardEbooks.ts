import { STANDARD_EBOOKS_KEY } from '$env/static/private'

const STANDARD_EBOOKS_URL = 'https://standardebooks.org/feeds/opds'
const STANDARD_EBOOKS_OPTIONS = { headers: { 'User-Agent': STANDARD_EBOOKS_KEY } }

const fetchBooks = (feed = "") => fetch(`${STANDARD_EBOOKS_URL}/${feed}`, STANDARD_EBOOKS_OPTIONS)

export default fetchBooks
