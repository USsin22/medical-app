import React, { useEffect, useMemo, useRef, useState } from 'react'

const SearchableSelect = ({ options = [], value, onChange, placeholder = 'Select...', searchPlaceholder = 'Search...', disabled = false, ariaLabel }) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlight, setHighlight] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter(o => o.label.toLowerCase().includes(q))
  }, [options, query])

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 0) }, [open])

  useEffect(() => { setHighlight(0) }, [filtered.length])

  const selectedLabel = useMemo(() => options.find(o => String(o.value) === String(value))?.label || '', [options, value])

  const handleKey = (e) => {
    if (!open) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight(h => Math.min(h + 1, filtered.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight(h => Math.max(h - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); const choice = filtered[highlight]; if (choice) { onChange?.(choice.value); setOpen(false) } }
    else if (e.key === 'Escape') { setOpen(false) }
  }

  return (
    <div className="relative" aria-expanded={open} aria-haspopup="listbox">
      <button type="button" className={`w-full px-4 py-2 border rounded-lg text-left ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white'}`} onClick={() => !disabled && setOpen(o => !o)} aria-label={ariaLabel}>
        {selectedLabel || placeholder}
      </button>
      {open && (
        <div className="absolute z-20 mt-2 w-full bg-white border rounded-lg shadow-lg" role="listbox" aria-activedescendant={`opt-${highlight}`}>
          <div className="p-2">
            <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKey} placeholder={searchPlaceholder} className="w-full px-3 py-2 border rounded" aria-label="Search options" />
          </div>
          <ul ref={listRef} className="max-h-48 overflow-auto">
            {filtered.length === 0 && <li className="px-3 py-2 text-gray-500">No results</li>}
            {filtered.map((o, idx) => (
              <li id={`opt-${idx}`} key={o.value} role="option" aria-selected={String(o.value) === String(value)} className={`px-3 py-2 cursor-pointer ${idx === highlight ? 'bg-blue-50' : ''}`} onMouseEnter={() => setHighlight(idx)} onClick={() => { onChange?.(o.value); setOpen(false) }}>
                {o.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default SearchableSelect
