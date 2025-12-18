export function calculateAge(input, today = new Date()) {
  const d = typeof input === 'string' ? new Date(input) : input instanceof Date ? input : null
  if (!d || Number.isNaN(d.getTime())) return null
  const t = new Date(today)
  const years = t.getFullYear() - d.getFullYear()
  const m = t.getMonth() - d.getMonth()
  const adjust = m < 0 || (m === 0 && t.getDate() < d.getDate()) ? 1 : 0
  return years - adjust
}

export function formatAge(input, today = new Date()) {
  const age = calculateAge(input, today)
  return age == null ? '' : `${age}`
}
