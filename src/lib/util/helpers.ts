export function deepEqual(a: any, b: any) {
  if (a === b) return true

  // Handle NaN (special case)
  if (typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b))
    return true

  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null)
    return false

  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)

  if (aKeys.length !== bKeys.length) return false

  for (const key of aKeys) {
    if (!bKeys.includes(key) || !deepEqual(a[key], b[key])) {
      return false
    }
  }

  return true
}
