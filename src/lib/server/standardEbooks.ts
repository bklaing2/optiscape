import { STANDARD_EBOOKS_KEY } from '$env/static/private'
import xmldom from "xmldom";
import { XML } from 'r2-utils-js/dist/es8-es2017/src/_utils/xml-js-mapper'
import { OPDS } from 'r2-opds-js/dist/es8-es2017/src/opds/opds1/opds'
import { error } from '@sveltejs/kit';

const STANDARD_EBOOKS_URL = 'https://standardebooks.org/feeds/opds'
const STANDARD_EBOOKS_OPTIONS = { headers: { 'User-Agent': STANDARD_EBOOKS_KEY } }

const fetchStandardEbooksFeed = (feed = "", fetchFn = fetch) => fetchFn(`${STANDARD_EBOOKS_URL}/${feed}`, STANDARD_EBOOKS_OPTIONS)

const parseEntriesFromFeed = (text: string) => {
  const xmlDom = new xmldom.DOMParser().parseFromString(text)
  if (!xmlDom || !xmlDom.documentElement) throw new Error('Error parsing XML')
  return XML.deserialize<OPDS>(xmlDom, OPDS).Entries
}

export const fetchStandardEbooksEntries = async (feed = "", fetchFun = fetch) => {
  const response = await fetchStandardEbooksFeed(feed, fetchFun)
  if (response.status !== 200) error(response.status, response.statusText)
  return parseEntriesFromFeed(await response.text())
}

export default fetchStandardEbooksFeed
