import { describe, it, expect } from 'vitest'
import { calculateAge, formatAge } from '../ageCalculator'

describe('ageCalculator', () => {
  it('calculates age correctly before birthday', () => {
    const age = calculateAge('2000-12-31', new Date('2025-06-01'))
    expect(age).toBe(24)
  })
  it('calculates age correctly after birthday', () => {
    const age = calculateAge('2000-01-01', new Date('2025-06-01'))
    expect(age).toBe(25)
  })
  it('returns null for invalid date', () => {
    expect(calculateAge('invalid')).toBeNull()
  })
  it('formats age', () => {
    expect(formatAge('2000-01-01', new Date('2025-06-01'))).toBe('25')
  })
})
