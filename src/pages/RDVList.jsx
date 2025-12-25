import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { addRendezvous, deleteRendezvous, fetchRendezvous, updateRendezvous } from '../store/rdvSlice'
import { fetchPatients } from '../store/patientSlice'
import Modal from '../components/Modal'
import Toast from '../components/Toast'
import Layout from '../components/Layout'

const emptyRdv = { patientId: '', date: '', heure: '', motif: '', etat: 'En attente', notes: '' }

const RDVList = () => {
  const dispatch = useDispatch()
  const { appointments, status, error } = useSelector(state => state.rdv)
  const { patients } = useSelector(state => state.patient)

  const [query, setQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyRdv)
  const [toast, setToast] = useState({ message: '', type: 'info' })
  const [patientSearch, setPatientSearch] = useState('')
  const [patientDropdownOpen, setPatientDropdownOpen] = useState(false)

  useEffect(() => {
    if (status === 'idle') dispatch(fetchRendezvous())
    dispatch(fetchPatients())
  }, [status, dispatch])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return appointments
    return appointments.filter(a => `${a.motif} ${a.etat}`.toLowerCase().includes(q))
  }, [appointments, query])

  const openAdd = () => { setEditing(null); setForm(emptyRdv); setIsModalOpen(true) }
  const openEdit = (r) => { setEditing(r); setForm({ patientId: r.patientId || '', date: r.date || '', heure: r.heure || '', motif: r.motif || '', etat: r.etat || 'En attente', notes: r.notes || '' }); setIsModalOpen(true) }

  const onConfirm = async () => {
    try {
      if (editing) {
        await dispatch(updateRendezvous({ id: editing.id, ...form })).unwrap()
        setToast({ message: 'Rendez-vous mis à jour', type: 'success' })
      } else {
        await dispatch(addRendezvous(form)).unwrap()
        setToast({ message: 'Rendez-vous ajouté', type: 'success' })
      }
      setIsModalOpen(false)
    } catch {
      setToast({ message: 'Échec de l’opération', type: 'error' })
    }
  }

  const onDelete = async (id) => {
    try { await dispatch(deleteRendezvous(id)).unwrap(); setToast({ message: 'Rendez-vous supprimé', type: 'success' }) }
    catch { setToast({ message: 'Échec de la suppression', type: 'error' }) }
  }

  return (
    <Layout>
      <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Rendez-vous</h1>
        <div className="flex gap-3 w-full md:w-auto">
          <input className="flex-1 md:w-80 px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200" placeholder="Search by motif/etat..." value={query} onChange={e => setQuery(e.target.value)} aria-label="Search rendezvous" />
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={openAdd}>Quick Add</button>
          <Link to="/rdv/new" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
            Book Appointment
          </Link>
        </div>
      </div>

      {status === 'loading' && <div className="text-gray-600">Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Heure</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motif</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">État</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.map(r => {
              const patient = patients.find(p => p.id === r.patientId)
              return (
                <tr key={r.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{patient ? `${patient.nom} ${patient.prenom}` : 'N/A'}</div>
                    <div className="text-sm text-gray-500">{patient?.telephone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.date} à {r.heure}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.motif || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${r.etat === 'Confirmé' ? 'bg-green-100 text-green-800' : r.etat === 'Annulé' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {r.etat}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{r.notes || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onClick={() => openEdit(r)} className="text-indigo-600 hover:text-indigo-900">Modifier</button>
                    <button onClick={() => onDelete(r.id)} className="text-red-600 hover:text-red-900">Supprimer</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} title={editing ? 'Edit Rendez-vous' : 'Add Rendez-vous'} onClose={() => setIsModalOpen(false)} onConfirm={onConfirm}>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex flex-col text-sm relative">
            <span className="text-gray-700 font-medium mb-1">Patient</span>
            <input
              type="text"
              value={form.patientId ? patients.find(p => p.id === form.patientId)?.nom + ' ' + patients.find(p => p.id === form.patientId)?.prenom : patientSearch}
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
                {patients.filter(p => `${p.nom} ${p.prenom}`.toLowerCase().includes(patientSearch.toLowerCase())).map(p => (
                  <li key={p.id} onClick={() => { setForm({ ...form, patientId: p.id }); setPatientSearch(''); setPatientDropdownOpen(false) }} className="px-3 py-2 cursor-pointer hover:bg-gray-100">
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
          <label className="flex flex-col text-sm">
            <span className="text-gray-700">Heure</span>
            <input type="time" className="mt-1 px-3 py-2 border rounded" value={form.heure} onChange={e => setForm({ ...form, heure: e.target.value })} />
          </label>
          <label className="flex flex-col text-sm md:col-span-2">
            <span className="text-gray-700">Motif</span>
            <input className="mt-1 px-3 py-2 border rounded" value={form.motif} onChange={e => setForm({ ...form, motif: e.target.value })} />
          </label>
          <label className="flex flex-col text-sm">
            <span className="text-gray-700">État</span>
            <select className="mt-1 px-3 py-2 border rounded" value={form.etat} onChange={e => setForm({ ...form, etat: e.target.value })}>
              <option>En attente</option>
              <option>Confirmé</option>
              <option>Annulé</option>
            </select>
          </label>
          <label className="flex flex-col text-sm md:col-span-2">
            <span className="text-gray-700">Notes</span>
            <textarea className="mt-1 px-3 py-2 border rounded" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </label>
        </form>
      </Modal>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
      </div>
    </Layout>
  )
}

export default RDVList
