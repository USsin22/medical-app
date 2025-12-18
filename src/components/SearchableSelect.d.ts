import * as React from 'react'

export interface OptionItem {
  value: string | number
  label: string
}

export interface SearchableSelectProps {
  options: OptionItem[]
  value?: string | number
  onChange?: (value: string | number) => void
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  ariaLabel?: string
}

declare const SearchableSelect: React.FC<SearchableSelectProps>
export default SearchableSelect
