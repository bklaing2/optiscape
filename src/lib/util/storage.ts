import type { Book } from '$lib/types/types';
import RollingAverage, { type IRollingAverage } from './rollingAverage'

const STORAGE_KEYS = {
  HISTORY: 'history',
  EDIT_HISTORY: 'editHistory',
  READING_RATE: 'readingRate'
} as const;

// History ///////////////////////////////////////
export function loadHistory(): Book[] {
  const history = localStorage.getItem(STORAGE_KEYS.HISTORY)
  return history ? JSON.parse(history) : []
}


export function updateHistory(book: Book, location: Book['location'], percentage: Book['percentage']) {
  if (!percentage || percentage < 0.01) return

  const history = loadHistory()
  const index = history.findIndex(b => b.id === book.id)

  if (index >= 0) history.splice(index, 1)
  history.unshift({ ...book, location, percentage })

  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history))
}

export function loadEditHistory(): Record<Book['id'], Book['location']> {
  const editHistory = localStorage.getItem(STORAGE_KEYS.EDIT_HISTORY)
  return editHistory ? JSON.parse(editHistory) : {}
}


export function updateEditHistory(id: Book['id'], location: Book['location']) {
  const editHistory = loadEditHistory()
  editHistory[id] = location

  localStorage.setItem(STORAGE_KEYS.EDIT_HISTORY, JSON.stringify(editHistory))
}

// Reading Rate //////////////////////////////////
export function loadReadingRate(): RollingAverage {
  const cpm = localStorage.getItem(STORAGE_KEYS.READING_RATE)
  if (!cpm) return new RollingAverage()

  const { data, windowSize, outlierCount } = JSON.parse(cpm) as IRollingAverage
  return new RollingAverage(data, windowSize, outlierCount)
}


export function updateReadingRate(readingRate: RollingAverage) {
  localStorage.setItem(STORAGE_KEYS.READING_RATE, JSON.stringify(readingRate))
}

const storage = {
  updateHistory,
  loadHistory,
  updateEditHistory,
  loadEditHistory,
  loadReadingRate,
  updateReadingRate
}

export default storage
