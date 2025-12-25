const SearchableSelect = ({ patients = [], value, onChange, placeholder = "Search patient...", className = "" }) => {
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  const selectedPatient = patients.find(p => p.id === value)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredPatients = patients.filter(p =>
    `${p.nom || ''} ${p.prenom || ''}`.toLowerCase().includes(search.toLowerCase()) ||
    p.telephone?.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (patient) => {
    onChange(patient.id)
    setOpen(false)
    setSearch("")
  }

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <input
        type="text"
        value={selectedPatient ? `${selectedPatient.nom} ${selectedPatient.prenom}` : search}
        onChange={(e) => {
          setSearch(e.target.value)
          if (!e.target.value) onChange('')
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder={placeholder}
      />
      
      {selectedPatient && (
        <button
          type="button"
          onClick={() => {
            onChange('')
            setSearch("")
          }}
          className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      )}

      {open && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
          {filteredPatients.length > 0 ? (
            filteredPatients.map(patient => (
              <li
                key={patient.id}
                onClick={() => handleSelect(patient)}
                className="px-3 py-2 cursor-pointer hover:bg-blue-50 hover:text-blue-700"
              >
                {patient.nom} {patient.prenom} {patient.telephone && `- ${patient.telephone}`}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-gray-500 italic">No patients found</li>
          )}
        </ul>
      )}
    </div>
  )
}