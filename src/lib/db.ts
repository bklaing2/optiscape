import Dexie, { type EntityTable } from 'dexie'
import type { Book } from './types/types'

// Setup
const db = new Dexie('optiscape') as Dexie & {
  books: EntityTable<Book, 'id'>
}

db.version(1).stores({
  books: 'id, percentage, updatedAt'
})

export default db


// Queries

// Fetch
export const getCurrentlyReading = () => db.books.where('percentage').between(0.01, 0.98).reverse().sortBy('updatedAt')
export const getHistory = () => db.books.where('percentage').aboveOrEqual(0.98).reverse().sortBy('updatedAt')

// Update
export const updateBook = (book: Book) => db.books.put({ updatedAt: new Date(), ...book })

