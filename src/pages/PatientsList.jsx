import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPatients, addPatient, updatePatient, deletePatient } from '../store/patientSlice'
import Modal from '../components/Modal'
import Toast from '../components/Toast'

const emptyForm = { nom: '', prenom: '', telephone: '', email: '', adresse: '', groupe_sanguin: '', allergies: '', date_naissance: '' }

const PatientsList = () => {
  const dispatch = useDispatch()
  const { patients, status, error } = useSelector(state => state.patient)

  const [query, setQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [toast, setToast] = useState({ message: '', type: 'info' })

  useEffect(() => {
    if (status === 'idle') dispatch(fetchPatients())
  }, [status, dispatch])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return patients
    return patients.filter(p => `${p.nom} ${p.prenom}`.toLowerCase().includes(q))
  }, [patients, query])

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm)
    setIsModalOpen(true)
  }

  const openEdit = (p) => {
    setEditing(p)
    setForm({
      nom: p.nom || '', prenom: p.prenom || '', telephone: p.telephone || '', email: p.email || '',
      adresse: p.adresse || '', groupe_sanguin: p.groupe_sanguin || '', allergies: p.allergies || '',
      date_naissance: p.date_naissance || ''
    })
    setIsModalOpen(true)
  }

  const onConfirm = async () => {
    try {
      if (editing) {
        await dispatch(updatePatient({ id: editing.id, ...form })).unwrap()
        setToast({ message: 'Patient updated', type: 'success' })
      } else {
        await dispatch(addPatient(form)).unwrap()
        setToast({ message: 'Patient added', type: 'success' })
      }
      setIsModalOpen(false)
    } catch {
      setToast({ message: 'Operation failed', type: 'error' })
    }
  }

  const onDelete = async (id) => {
    try {
      await dispatch(deletePatient(id)).unwrap()
      setToast({ message: 'Patient deleted', type: 'success' })
    } catch {
      setToast({ message: 'Delete failed', type: 'error' })
    }
  }

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Patients</h1>
        <div className="flex gap-3 w-full md:w-auto">
          <input
            className="flex-1 md:w-80 px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Search by name..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search patients"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={openAdd}>Add</button>
        </div>
      </div>

      {status === 'loading' && <div className="text-gray-600">Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="bg-white rounded-lg shadow-sm border p-4 flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-gray-800">{p.nom} {p.prenom}</div>
                <div className="text-sm text-gray-500">{p.email || 'No email'} · {p.telephone || 'No phone'}</div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100" onClick={() => openEdit(p)}>Edit</button>
                <button className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100" onClick={() => onDelete(p.id)}>Delete</button>
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <div>Address: {p.adresse || '—'}</div>
              <div>Blood: {p.groupe_sanguin || '—'} · Allergies: {p.allergies || '—'}</div>
              <div>DOB: {p.date_naissance || '—'}</div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        title={editing ? 'Edit Patient' : 'Add Patient'}
        onClose={() => setIsModalOpen(false)}
        onConfirm={onConfirm}
      >
        <form className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex flex-col text-sm">
            <span className="text-gray-700">Nom</span>
            <input className="mt-1 px-3 py-2 border rounded" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} />
          </label>
          <label className="flex flex-col text-sm">
            <span className="text-gray-700">Prénom</span>
            <input className="mt-1 px-3 py-2 border rounded" value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} />
          </label>
          <label className="flex flex-col text-sm">
            <span className="text-gray-700">Téléphone</span>
            <input className="mt-1 px-3 py-2 border rounded" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} />
          </label>
          <label className="flex flex-col text-sm">
            <span className="text-gray-700">Email</span>
            <input type="email" className="mt-1 px-3 py-2 border rounded" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </label>
          <label className="flex flex-col text-sm md:col-span-2">
            <span className="text-gray-700">Adresse</span>
            <input className="mt-1 px-3 py-2 border rounded" value={form.adresse} onChange={e => setForm({ ...form, adresse: e.target.value })} />
          </label>
          <label className="flex flex-col text-sm">
            <span className="text-gray-700">Groupe sanguin</span>
            <input className="mt-1 px-3 py-2 border rounded" value={form.groupe_sanguin} onChange={e => setForm({ ...form, groupe_sanguin: e.target.value })} />
          </label>
          <label className="flex flex-col text-sm">
            <span className="text-gray-700">Allergies</span>
            <input className="mt-1 px-3 py-2 border rounded" value={form.allergies} onChange={e => setForm({ ...form, allergies: e.target.value })} />
          </label>
          <label className="flex flex-col text-sm md:col-span-2">
            <span className="text-gray-700">Date de naissance</span>
            <input type="date" className="mt-1 px-3 py-2 border rounded" value={form.date_naissance} onChange={e => setForm({ ...form, date_naissance: e.target.value })} />
          </label>
        </form>
      </Modal>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
    </div>
  )
}

export default PatientsList
