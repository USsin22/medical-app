export function generateId(prefix = '') {
  const rand = Math.random().toString(36).slice(2, 6)
  const time = Date.now().toString(36).slice(-4)
  return `${prefix}${rand}${time}`
}

export const createId = generateId
