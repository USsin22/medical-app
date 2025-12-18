import React, { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { addRendezvous, updateRendezvous, fetchRendezvous } from '../store/rdvSlice'
import { fetchPatients } from '../store/patientSlice'
import { fetchMotifsRdv, fetchStatutsRdv } from '../store/optionsSlice'
import SearchableSelect from '../components/SearchableSelect'
import { hasConflict } from '../utils/checkConflicts'
import Layout from '../components/Layout'
import Toast from '../components/Toast'

const RDVForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = !!id

  const { appointments } = useSelector(state => state.rdv)
  const { patients } = useSelector(state => state.patient)
  const { motifsRdv, statutsRdv, status: optionsStatus, error: optionsError } = useSelector(state => state.options)

  const [form, setForm] = useState({
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    heure: '',
    motif: '',
    etat: 'En attente',
    notes: ''
  })

  const [toast, setToast] = useState({ message: '', type: 'info' })
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('')

  useEffect(() => {
    // optimize API calls: fetch only when idle/empty
    if (patients.length === 0) dispatch(fetchPatients())
    if (appointments.length === 0) dispatch(fetchRendezvous())
    if (motifsRdv.length === 0) dispatch(fetchMotifsRdv())
    if (statutsRdv.length === 0) dispatch(fetchStatutsRdv())
  }, [dispatch])

  useEffect(() => {
    if (isEditing && appointments.length > 0) {
      const appointment = appointments.find(a => a.id === parseInt(id))
      if (appointment) {
        setForm({
          patientId: appointment.patientId || '',
          date: appointment.date || new Date().toISOString().split('T')[0],
          heure: appointment.heure || '',
          motif: appointment.motif || '',
          etat: appointment.etat || 'En attente',
          notes: appointment.notes || ''
        })
        setSelectedTimeSlot(appointment.heure || '')
      }
    }
  }, [id, isEditing, appointments])

  // Generate time slots (8 AM to 6 PM, 30-minute intervals)
  const timeSlots = useMemo(() => {
    const slots = []
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push(time)
      }
    }
    return slots
  }, [])

  // Get booked time slots for selected date
  const isSlotAvailable = (time) => {
    return !hasConflict(appointments, form.date, time, id ? parseInt(id) : undefined)
  }

  const handleTimeSlotClick = (time) => {
    if (isSlotAvailable(time)) {
      setSelectedTimeSlot(time)
      setForm({ ...form, heure: time })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!form.patientId || !form.date || !form.heure) {
      setToast({ message: 'Please fill in all required fields', type: 'error' })
      return
    }

    if (!isSlotAvailable(form.heure)) {
      setToast({ message: 'This time slot is already booked', type: 'error' })
      return
    }

    try {
      if (isEditing) {
        await dispatch(updateRendezvous({ id: parseInt(id), ...form })).unwrap()
        setToast({ message: 'Appointment updated successfully', type: 'success' })
      } else {
        await dispatch(addRendezvous(form)).unwrap()
        setToast({ message: 'Appointment created successfully', type: 'success' })
      }
      setTimeout(() => navigate('/rdv'), 1500)
    } catch (error) {
      setToast({ message: 'Failed to save appointment', type: 'error' })
    }
  }

  const patientOptions = useMemo(() => patients.map(p => ({
    value: p.id,
    label: `${p.nom} ${p.prenom} - ${p.email || p.telephone || ''}`.trim()
  })), [patients])

  const selectedPatient = useMemo(() => patients.find(p => String(p.id) === String(form.patientId)), [patients, form.patientId])

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-6">
            {isEditing ? 'Edit Appointment' : 'Book New Appointment'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Patient <span className="text-red-500">*</span>
              </label>
              <SearchableSelect
                options={patientOptions}
                value={form.patientId}
                onChange={(val) => setForm({ ...form, patientId: val })}
                placeholder="Choose a patient..."
                searchPlaceholder="Search patients..."
                ariaLabel="Select patient"
              />
              {patients.length === 0 && (
                <div className="mt-2 text-xs text-gray-500">Loading patients…</div>
              )}
              {selectedPatient && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold">Selected:</span> {selectedPatient.nom} {selectedPatient.prenom}
                    {selectedPatient.telephone && ` • ${selectedPatient.telephone}`}
                  </div>
                </div>
              )}
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Appointment Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => {
                  setForm({ ...form, date: e.target.value, heure: '' })
                  setSelectedTimeSlot('')
                }}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Time Slot Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Time Slot <span className="text-red-500">*</span>
              </label>
              {form.date ? (
                <>
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                    {timeSlots.map((time) => {
                      const isBooked = !isSlotAvailable(time)
                      const isSelected = selectedTimeSlot === time
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => handleTimeSlotClick(time)}
                          disabled={isBooked}
                          className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-lg scale-105'
                              : isBooked
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed line-through'
                              : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:border-blue-300 border border-gray-200'
                          }`}
                        >
                          {time}
                        </button>
                      )
                    })}
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-600 rounded"></div>
                      <span>Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-200 rounded"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-200 rounded line-through"></div>
                      <span>Booked</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-sm">Please select a date first</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for Visit</label>
              <select
                value={form.motif}
                onChange={(e) => setForm({ ...form, motif: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a motif...</option>
                {motifsRdv.map(m => (
                  <option key={m.id} value={m.label}>{m.label}</option>
                ))}
              </select>
              {optionsStatus === 'loading' && <div className="text-xs text-gray-500 mt-1">Loading motifs…</div>}
              {optionsError && <div className="text-xs text-red-600 mt-1">{optionsError}</div>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={form.etat}
                onChange={(e) => setForm({ ...form, etat: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statutsRdv.map(s => (
                  <option key={s.id} value={s.label}>{s.label}</option>
                ))}
              </select>
              {optionsStatus === 'loading' && <div className="text-xs text-gray-500 mt-1">Loading status…</div>}
              {optionsError && <div className="text-xs text-red-600 mt-1">{optionsError}</div>}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Any additional information..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
              >
                {isEditing ? 'Update Appointment' : 'Book Appointment'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/rdv')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: 'info' })}
        />
      </div>
    </Layout>
  )
}

export default RDVForm
