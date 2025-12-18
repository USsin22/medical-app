import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addConsultation } from '../store/consultationsSlice'
import { fetchPatients } from '../store/patientSlice'
import { fetchMotifsRdv, fetchModesPaiement } from '../store/optionsSlice'
import Layout from '../components/Layout'
import SearchableSelect from '../components/SearchableSelect'

const ConsultationForm = () => {
  const dispatch = useDispatch()
  const { patients } = useSelector(state => state.patient)
  const { motifsRdv, modesPaiement, status: optionsStatus, error: optionsError } = useSelector(state => state.options)

  const [form, setForm] = useState({
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    diagnostic: '',
    traitement: '',
    tarif: '',
    motif: '',
    paiement: ''
  })

  useEffect(() => {
    if (patients.length === 0) dispatch(fetchPatients())
    if (motifsRdv.length === 0) dispatch(fetchMotifsRdv())
    if (modesPaiement.length === 0) dispatch(fetchModesPaiement())
  }, [dispatch])

  const patientOptions = useMemo(() => patients.map(p => ({
    value: p.id,
    label: `${p.nom} ${p.prenom} - ${p.email || p.telephone || ''}`.trim()
  })), [patients])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.patientId || !form.date) return
    const payload = { ...form, tarif: Number(form.tarif) || 0 }
    payload.paiement = form.paiement
    payload.mode_paiement = form.paiement
    try {
      await dispatch(addConsultation(payload)).unwrap()
      setForm({ patientId: '', date: new Date().toISOString().split('T')[0], diagnostic: '', traitement: '', tarif: '', motif: '', paiement: '' })
    } catch {}
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg space-y-4">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">Consultation Form</h2>
          <div>
            <label className="block text-gray-700 mb-2">Patient</label>
            <SearchableSelect
              options={patientOptions}
              value={form.patientId}
              onChange={(val) => setForm({ ...form, patientId: val })}
              placeholder="Choose a patient..."
              searchPlaceholder="Search patients..."
              ariaLabel="Select patient"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Consultation Date</label>
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Motif</label>
            <select value={form.motif} onChange={e => setForm({ ...form, motif: e.target.value })} className="w-full px-3 py-2 border rounded">
              <option value="">Choose a motif...</option>
              {motifsRdv.map(m => <option key={m.id} value={m.label}>{m.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Diagnostic</label>
            <input value={form.diagnostic} onChange={e => setForm({ ...form, diagnostic: e.target.value })} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Traitement</label>
            <input value={form.traitement} onChange={e => setForm({ ...form, traitement: e.target.value })} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Tarif</label>
            <input type="number" value={form.tarif} onChange={e => setForm({ ...form, tarif: e.target.value })} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Mode de paiement</label>
            <select value={form.paiement} onChange={e => setForm({ ...form, paiement: e.target.value })} className="w-full px-3 py-2 border rounded">
              <option value="">Choose a mode…</option>
              {modesPaiement.map(mp => <option key={mp.id} value={mp.label}>{mp.label}</option>)}
            </select>
            {optionsStatus === 'loading' && <div className="text-xs text-gray-500 mt-1">Loading options…</div>}
            {optionsError && <div className="text-xs text-red-600 mt-1">{optionsError}</div>}
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Submit</button>
        </form>
      </div>
    </Layout>
  )
}

export default ConsultationForm
