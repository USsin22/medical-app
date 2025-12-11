import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addConsultation, deleteConsultation, fetchConsultations, updateConsultation } from '../store/consultationsSlice'
import Modal from '../components/Modal'
import Toast from '../components/Toast'

const emptyConsult = { patientId: '', date: '', diagnostic: '', traitement: '', tarif: '', paiement: '' }

const ConsultationsList = () => {
  const dispatch = useDispatch()
  const { consultations, status, error } = useSelector(state => state.consultation)

  const [query, setQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyConsult)
  const [toast, setToast] = useState({ message: '', type: 'info' })

  useEffect(() => {
    if (status === 'idle') dispatch(fetchConsultations())
  }, [status, dispatch])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return consultations
    return consultations.filter(c => `${c.diagnostic} ${c.traitement}`.toLowerCase().includes(q))
  }, [consultations, query])

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
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Consultations</h1>
        <div className="flex gap-3 w-full md:w-auto">
          <input className="flex-1 md:w-80 px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200" placeholder="Search by diagnostic/traitement..." value={query} onChange={e => setQuery(e.target.value)} aria-label="Search consultations" />
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={openAdd}>Add</button>
        </div>
      </div>

      {status === 'loading' && <div className="text-gray-600">Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(c => (
          <div key={c.id} className="bg-white rounded-lg shadow-sm border p-4 flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-gray-800">{c.date}</div>
                <div className="text-sm text-gray-500">Diagnostic: {c.diagnostic || '—'} · Traitement: {c.traitement || '—'}</div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100" onClick={() => openEdit(c)}>Edit</button>
                <button className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100" onClick={() => onDelete(c.id)}>Delete</button>
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-600">Tarif: {c.tarif ?? 0} · Paiement: {c.paiement || '—'}</div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} title={editing ? 'Edit Consultation' : 'Add Consultation'} onClose={() => setIsModalOpen(false)} onConfirm={onConfirm}>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex flex-col text-sm">
            <span className="text-gray-700">Patient ID</span>
            <input className="mt-1 px-3 py-2 border rounded" value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })} />
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
  )
}

export default ConsultationsList
