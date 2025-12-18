import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchableSelect from '../SearchableSelect'

const options = [
  { value: 1, label: 'Alice Smith' },
  { value: 2, label: 'Bob Johnson' },
  { value: 3, label: 'Charlie Brown' },
]

describe('SearchableSelect', () => {
  it('filters options by search query', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SearchableSelect options={options} onChange={onChange} />)
    const toggle = screen.getByRole('button')
    await user.click(toggle)
    const search = screen.getByRole('textbox')
    await user.type(search, 'bob')
    expect(screen.getByText('Bob Johnson')).toBeTruthy()
    expect(screen.queryByText('Alice Smith')).toBeNull()
  })
})
