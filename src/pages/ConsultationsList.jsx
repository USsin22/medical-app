import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addConsultation, deleteConsultation, fetchConsultations, updateConsultation } from '../store/consultationsSlice'
import { fetchPatients } from '../store/patientSlice'
import Modal from '../components/Modal'
import Toast from '../components/Toast'
import Layout from '../components/Layout'
// import { SearchableSelect } from '../components/SearchableSelect'

const emptyConsult = { patientId: '', date: '', diagnostic: '', traitement: '', tarif: '', paiement: '' }

const ConsultationsList = () => {
  const dispatch = useDispatch()
  const { consultations, status, error } = useSelector(state => state.consultation)
  const { patients } = useSelector(state => state.patient)

  const [query, setQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyConsult)
  const [toast, setToast] = useState({ message: '', type: 'info' })
  const [patientSearch, setPatientSearch] = useState('')
const [patientDropdownOpen, setPatientDropdownOpen] = useState(false)


  useEffect(() => {
    if (status === 'idle') dispatch(fetchConsultations())
    dispatch(fetchPatients())
  }, [status, dispatch])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return consultations
    return consultations.filter(c => {
      const p = patients.find(pat => pat.id === c.patientId)
      const patientName = p ? `${p.nom} ${p.prenom}` : ''
      return `${c.diagnostic} ${c.traitement} ${patientName}`.toLowerCase().includes(q)
    })
  }, [consultations, query, patients])

  const openAdd = () => { setEditing(null); setForm(emptyConsult); setIsModalOpen(true) }
  const openEdit = (c) => { setEditing(c); setForm({ patientId: c.patientId || '', date: c.date || '', diagnostic: c.diagnostic || '', traitement: c.traitement || '', tarif: c.tarif ?? '', paiement: c.paiement || '' }); setIsModalOpen(true) }

  const onConfirm = async () => {
    try {
      if (editing) {
        await dispatch(updateConsultation({ id: editing.id, ...form })).unwrap()
        setToast({ message: 'Consultation mise à jour', type: 'success' })
      } else {
        await dispatch(addConsultation({ ...form, tarif: Number(form.tarif) || 0 })).unwrap()
        setToast({ message: 'Consultation ajoutée', type: 'success' })
      }
      setIsModalOpen(false)
    } catch {
      setToast({ message: 'Échec de l’opération', type: 'error' })
    }
  }

  const onDelete = async (id) => {
    try { await dispatch(deleteConsultation(id)).unwrap(); setToast({ message: 'Consultation supprimée', type: 'success' }) }
    catch { setToast({ message: 'Échec de la suppression', type: 'error' }) }
  }

  return (
    <Layout>
      <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Consultations</h1>
        <div className="flex gap-3 w-full md:w-auto">
          <input className="flex-1 md:w-80 px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200" placeholder="Search by diagnostic, patient..." value={query} onChange={e => setQuery(e.target.value)} aria-label="Search consultations" />
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={openAdd}>Add</button>
        </div>
      </div>

      {status === 'loading' && <div className="text-gray-600">Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnostic</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Traitement</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarif</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paiement</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.map(c => {
              const patient = patients.find(p => p.id === c.patientId)
              return (
                <tr key={c.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{patient ? `${patient.nom} ${patient.prenom}` : 'N/A'}</div>
                    <div className="text-sm text-gray-500">{patient?.telephone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{c.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{c.diagnostic || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{c.traitement || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{c.tarif ?? 0} €</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${c.paiement === 'Payé' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {c.paiement || 'Non Payé'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onClick={() => openEdit(c)} className="text-indigo-600 hover:text-indigo-900">Modifier</button>
                    <button onClick={() => onDelete(c.id)} className="text-red-600 hover:text-red-900">Supprimer</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} title={editing ? 'Edit Consultation' : 'Add Consultation'} onClose={() => setIsModalOpen(false)} onConfirm={onConfirm}>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* <label className="flex flex-col text-sm">
  <span className="text-gray-700 font-medium mb-1">Patient</span>
  <SearchableSelect
    patients={patients}
    value={form.patientId}
    onChange={(patientId) => setForm({ ...form, patientId })}
    placeholder="Search patient..."
    className="mt-1"
  />
</label> */}
<label className="flex flex-col text-sm relative">
  <span className="text-gray-700 font-medium mb-1">Patient</span>

  <input
    type="text"
    value={
      form.patientId
        ? patients.find(p => p.id === form.patientId)?.nom + ' ' +
          patients.find(p => p.id === form.patientId)?.prenom
        : patientSearch
    }
    onChange={(e) => {
      setPatientSearch(e.target.value)
      setForm({ ...form, patientId: '' })
      setPatientDropdownOpen(true)
    }}
    onFocus={() => setPatientDropdownOpen(true)}
    placeholder="Search patient..."
    className="mt-1 px-3 py-2 border rounded"
  />

  {patientDropdownOpen && (
    <ul className="absolute z-20 top-full mt-1 w-full bg-white border rounded max-h-40 overflow-y-auto shadow">
      {patients
        .filter(p =>
          `${p.nom} ${p.prenom}`
            .toLowerCase()
            .includes(patientSearch.toLowerCase())
        )
        .map(p => (
          <li
            key={p.id}
            onClick={() => {
              setForm({ ...form, patientId: p.id })
              setPatientSearch('')
              setPatientDropdownOpen(false)
            }}
            className="px-3 py-2 cursor-pointer hover:bg-gray-100"
          >
            {p.nom} {p.prenom} - {p.telephone}
          </li>

        ))}
    </ul>
  )}
</label>

          <label className="flex flex-col text-sm">
            <span className="text-gray-700">Date</span>
            <input type="date" className="mt-1 px-3 py-2 border rounded" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          </label>
          <label className="flex flex-col text-sm md:col-span-2">
            <span className="text-gray-700">Diagnostic</span>
            <input className="mt-1 px-3 py-2 border rounded" value={form.diagnostic} onChange={e => setForm({ ...form, diagnostic: e.target.value })} />
          </label>
          <label className="flex flex-col text-sm md:col-span-2">
            <span className="text-gray-700">Traitement</span>
            <input className="mt-1 px-3 py-2 border rounded" value={form.traitement} onChange={e => setForm({ ...form, traitement: e.target.value })} />
          </label>
          <label className="flex flex-col text-sm">
            <span className="text-gray-700">Tarif</span>
            <input type="number" className="mt-1 px-3 py-2 border rounded" value={form.tarif} onChange={e => setForm({ ...form, tarif: e.target.value })} />
          </label>
          <label className="flex flex-col text-sm">
            <span className="text-gray-700">Paiement</span>
            <input className="mt-1 px-3 py-2 border rounded" value={form.paiement} onChange={e => setForm({ ...form, paiement: e.target.value })} />
          </label>
        </form>
      </Modal>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
      </div>
    </Layout>
  )
}

export default ConsultationsList
