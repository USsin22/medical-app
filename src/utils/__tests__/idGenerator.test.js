import { describe, it, expect } from 'vitest'
import { generateId } from '../idGenerator'

describe('idGenerator', () => {
  it('generates unique ids', () => {
    const a = generateId()
    const b = generateId()
    expect(a).not.toBe(b)
    expect(typeof a).toBe('string')
  })
  it('supports prefix', () => {
    const id = generateId('x-')
    expect(id.startsWith('x-')).toBe(true)
  })
})
