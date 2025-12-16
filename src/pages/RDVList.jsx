import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { addRendezvous, deleteRendezvous, fetchRendezvous, updateRendezvous } from '../store/rdvSlice'
import Modal from '../components/Modal'
import Toast from '../components/Toast'
import Layout from '../components/Layout'

const emptyRdv = { patientId: '', date: '', heure: '', motif: '', etat: 'En attente', notes: '' }

const RDVList = () => {
  const dispatch = useDispatch()
  const { appointments, status, error } = useSelector(state => state.rdv)

  const [query, setQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyRdv)
  const [toast, setToast] = useState({ message: '', type: 'info' })

  useEffect(() => {
    if (status === 'idle') dispatch(fetchRendezvous())
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(r => (
          <div key={r.id} className="bg-white rounded-lg shadow-sm border p-4 flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-gray-800">{r.date} · {r.heure}</div>
                <div className="text-sm text-gray-500">Motif: {r.motif || '—'} · État: {r.etat}</div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100" onClick={() => openEdit(r)}>Edit</button>
                <button className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100" onClick={() => onDelete(r.id)}>Delete</button>
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-600">Notes: {r.notes || '—'}</div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} title={editing ? 'Edit Rendez-vous' : 'Add Rendez-vous'} onClose={() => setIsModalOpen(false)} onConfirm={onConfirm}>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex flex-col text-sm">
            <span className="text-gray-700">Patient ID</span>
            <input className="mt-1 px-3 py-2 border rounded" value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })} />
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
