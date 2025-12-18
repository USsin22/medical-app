import { describe, it, expect } from 'vitest'
import { hasConflict, availableSlots } from '../checkConflicts'

const appointments = [
  { id: 1, date: '2025-01-10', heure: '10:30' },
  { id: 2, date: '2025-01-10', heure: '11:00' }
]

describe('checkConflicts', () => {
  it('detects conflict', () => {
    expect(hasConflict(appointments, '2025-01-10', '10:30')).toBe(true)
  })
  it('ignores excluded id', () => {
    expect(hasConflict(appointments, '2025-01-10', '10:30', 1)).toBe(false)
  })
  it('filters available slots', () => {
    const slots = ['10:30', '11:00', '11:30']
    expect(availableSlots(appointments, '2025-01-10', slots)).toEqual(['11:30'])
  })
})
