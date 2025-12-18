export function hasConflict(appointments, date, time, excludeId) {
  if (!date || !time) return false
  const d = String(date)
  const t = String(time)
  return appointments.some(a => {
    const idMatch = excludeId != null && (a.id === excludeId || String(a.id) === String(excludeId))
    if (idMatch) return false
    return (a.date === d) && (a.heure === t)
  })
}

export function availableSlots(appointments, date, slots, excludeId) {
  if (!date || !Array.isArray(slots)) return []
  return slots.filter(s => !hasConflict(appointments, date, s, excludeId))
}
