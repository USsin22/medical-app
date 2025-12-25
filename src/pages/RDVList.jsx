import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { addRendezvous, deleteRendezvous, fetchRendezvous, updateRendezvous } from '../store/rdvSlice'
import { fetchPatients } from '../store/patientSlice'
import { fetchMotifsRdv, fetchStatutsRdv } from '../store/optionsSlice'
import { motion, AnimatePresence } from 'motion/react'
import Modal from '../components/Modal'
import Toast from '../components/Toast'
import Layout from '../components/Layout'
import { 
  Search, 
  Plus, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Edit2, 
  Trash2, 
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  AlertTriangle,
  MoreHorizontal
} from 'lucide-react'

const emptyRdv = { patientId: '', date: '', heure: '', motif: '', etat: 'En attente', notes: '' }

const PatientAvatar = ({ nom, prenom, size = "md" }) => {
  const initials = `${nom?.[0] || ""}${prenom?.[0] || ""}`.toUpperCase();
  const colors = [
    "bg-red-100 text-red-700",
    "bg-green-100 text-green-700",
    "bg-blue-100 text-blue-700",
    "bg-yellow-100 text-yellow-700",
    "bg-purple-100 text-purple-700",
    "bg-indigo-100 text-indigo-700",
    "bg-pink-100 text-pink-700",
  ];
  const charCode = (nom?.[0] || "A").charCodeAt(0);
  const colorClass = colors[charCode % colors.length];
  
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-xl",
    xl: "w-24 h-24 text-3xl"
  };

  return (
    <div className={`${sizeClasses[size]} ${colorClass} rounded-full flex items-center justify-center font-bold ring-2 ring-white shadow-sm shrink-0`}>
      {initials}
    </div>
  );
};

const SkeletonRow = () => (
   <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm animate-pulse flex items-center gap-4">
     <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
     <div className="flex-1 space-y-2">
       <div className="h-4 bg-gray-200 rounded w-1/3"></div>
       <div className="h-3 bg-gray-200 rounded w-1/4"></div>
     </div>
     <div className="w-24 h-8 bg-gray-200 rounded-lg"></div>
   </div>
)

const RDVList = () => {
  const dispatch = useDispatch()
  const { appointments, status, error } = useSelector(state => state.rdv)
  const { patients } = useSelector(state => state.patient)
  const { motifsRdv } = useSelector(state => state.options)
  const { statutsRdv } = useSelector(state => state.options)

  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  
  // State
  const [editing, setEditing] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [form, setForm] = useState(emptyRdv)
  const [errors, setErrors] = useState({})
  const [isFormValid, setIsFormValid] = useState(false)
  
  const [toast, setToast] = useState({ message: '', type: 'info' })
  const [patientSearch, setPatientSearch] = useState('')
  const [patientDropdownOpen, setPatientDropdownOpen] = useState(false)

  useEffect(() => {
    if (status === 'idle') dispatch(fetchRendezvous())
    dispatch(fetchPatients())
    dispatch(fetchMotifsRdv())
    dispatch(fetchStatutsRdv())
  }, [status, dispatch])

  // Validation Logic
  useEffect(() => {
    const newErrors = {}
    if (!form.patientId) newErrors.patientId = 'Patient is required'
    if (!form.date) newErrors.date = 'Date is required'
    if (!form.heure) newErrors.heure = 'Time is required'
    if (!form.motif) newErrors.motif = 'Reason (Motif) is required'
    if (!form.etat) newErrors.etat = 'Status is required'
    
    setErrors(newErrors)
    setIsFormValid(Object.keys(newErrors).length === 0)
  }, [form])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const s = statusFilter.trim().toLowerCase()
    
    return appointments.filter(a => {
       const matchesQuery = !q || `${a.motif}`.toLowerCase().includes(q) 
       const patient = patients.find(p => p.id === a.patientId)
       const patientName = patient ? `${patient.nom} ${patient.prenom}`.toLowerCase() : ''
       const matchesSearch = !q || patientName.includes(q) || `${a.motif}`.toLowerCase().includes(q)
       
       const matchesStatus = !s || a.etat.toLowerCase() === s
       return matchesSearch && matchesStatus
    })
  }, [appointments, query, statusFilter, patients])

  const openAdd = () => { setEditing(null); setForm(emptyRdv); setIsModalOpen(true); setErrors({}) }
  const openEdit = (r) => { 
    setEditing(r); 
    setForm({ 
      patientId: r.patientId || '', 
      date: r.date || '', 
      heure: r.heure || '', 
      motif: r.motif || '', 
      etat: r.etat || 'En attente', 
      notes: r.notes || '' 
    }); 
    setIsModalOpen(true) 
    setErrors({})
  }

  const promptDelete = (id) => {
    setDeletingId(id)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!deletingId) return
    try { 
      await dispatch(deleteRendezvous(deletingId)).unwrap()
      setToast({ message: 'Appointment deleted successfully', type: 'success' }) 
    } catch { 
      setToast({ message: 'Failed to delete', type: 'error' }) 
    }
    setIsDeleteModalOpen(false)
    setDeletingId(null)
  }

  const onSave = async (e) => {
    e?.preventDefault()
    if (!isFormValid) return

    try {
      if (editing) {
        await dispatch(updateRendezvous({ id: editing.id, ...form })).unwrap()
        setToast({ message: 'Appointment updated successfully', type: 'success' })
      } else {
        await dispatch(addRendezvous(form)).unwrap()
        setToast({ message: 'Appointment booked successfully', type: 'success' })
      }
      setIsModalOpen(false)
    } catch {
      setToast({ message: 'Operation failed', type: 'error' })
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Confirmé': return 'bg-green-100 text-green-700 border-green-200';
      case 'Annulé': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  }

  const getStatusIcon = (status) => {
     switch(status) {
      case 'Confirmé': return <CheckCircle className="w-3.5 h-3.5" />;
      case 'Annulé': return <XCircle className="w-3.5 h-3.5" />;
      default: return <AlertCircle className="w-3.5 h-3.5" />;
    }
  }

  // Input styles helper
  const inputClass = (error) => `w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:bg-white focus:outline-none focus:ring-2 transition-all font-medium ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'}`

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Rendez-vous</h1>
            <p className="text-gray-500 mt-1">Manage appointments and scheduling</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                placeholder="Search patient, motif..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>

             <div className="relative sm:w-48">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                className="w-full pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none shadow-sm cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                 {statutsRdv.map((s, i) => (
                  <option key={i} value={typeof s === 'string' ? s : s.label}>
                    {typeof s === 'string' ? s : s.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={openAdd}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all font-medium border border-blue-200"
              >
                <Plus className="w-5 h-5" />
                <span>Quick Add</span>
              </button>
              <Link to="/rdv/new" className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg font-medium">
                <Calendar className="w-5 h-5" />
                <span>Book New</span>
              </Link>
            </div>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5" /> {error}
          </motion.div>
        )}

        {/* Appointment List */}
        <div className="space-y-4">
           {status === 'loading' ? (
             <div className="space-y-4">
               {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
             </div>
           ) : (
            <AnimatePresence>
              {filtered.map(r => {
                const patient = patients.find(p => p.id === r.patientId)
                return (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    layout
                    className="group bg-white rounded-xl border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-md transition-all p-4 md:p-5 flex flex-col md:flex-row gap-4 md:items-center"
                  >
                    {/* Patient Info */}
                    <div className="flex items-center gap-4 min-w-[240px]">
                      <PatientAvatar nom={patient?.nom} prenom={patient?.prenom} />
                      <div>
                        <div className="font-semibold text-gray-900 text-lg">
                          {patient ? `${patient.nom} ${patient.prenom}` : 'Unknown Patient'}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1.5">
                           <Phone className="w-3.5 h-3.5" />
                           {patient?.telephone || 'No phone'}
                        </div>
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-center gap-3 min-w-[180px]">
                       <div className="p-2.5 bg-gray-50 rounded-lg text-gray-500">
                          <Calendar className="w-5 h-5" />
                       </div>
                       <div>
                          <div className="font-medium text-gray-900">{r.date}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                             <Clock className="w-3.5 h-3.5" />
                             {r.heure}
                          </div>
                       </div>
                    </div>

                    {/* Motif & Notes */}
                    <div className="flex-1">
                       <div className="font-medium text-gray-900 mb-1">{r.motif || 'General Consultation'}</div>
                       <p className="text-sm text-gray-500 line-clamp-1">{r.notes || 'No additional notes'}</p>
                    </div>

                    {/* Status */}
                    <div className="min-w-[140px]">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(r.etat)}`}>
                          {getStatusIcon(r.etat)}
                          {r.etat}
                       </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEdit(r)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit Appointment"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                         onClick={() => promptDelete(r.id)}
                         className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                         title="Cancel Appointment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
           )}
           
           {!status === 'loading' && filtered.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-100 border-dashed">
                 <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                 <h3 className="text-lg font-medium text-gray-900">No appointments found</h3>
                 <p className="text-gray-500">Try adjusting your filters or search terms.</p>
              </div>
           )}
        </div>

        {/* Add/Edit Modal */}
        <Modal 
          isOpen={isModalOpen} 
          title={editing ? 'Edit Appointment' : 'New Appointment'} 
          onClose={() => setIsModalOpen(false)} 
          onConfirm={onSave}
          confirmText="Save Appointment"
          isConfirmDisabled={!isFormValid}
        >
          <form className="grid grid-cols-1 md:grid-cols-2 gap-5" onSubmit={(e) => e.preventDefault()}>
             <div className="col-span-full mb-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Patient <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={form.patientId ? patients.find(p => p.id === form.patientId)?.nom + ' ' + patients.find(p => p.id === form.patientId)?.prenom : patientSearch}
                    onChange={(e) => {
                      setPatientSearch(e.target.value)
                      setForm({ ...form, patientId: '' })
                      setPatientDropdownOpen(true)
                    }}
                    onFocus={() => setPatientDropdownOpen(true)}
                    placeholder="Search for a patient..."
                     className={inputClass(errors.patientId)}
                  />
                  {errors.patientId && <p className="text-red-500 text-xs mt-1">{errors.patientId}</p>}
                  
                  {patientDropdownOpen && (
                    <ul className="absolute z-20 top-full mt-1 w-full bg-white border border-gray-100 rounded-lg max-h-48 overflow-y-auto shadow-xl py-1">
                      {patients.filter(p => `${p.nom} ${p.prenom}`.toLowerCase().includes(patientSearch.toLowerCase())).map(p => (
                        <li key={p.id} 
                            onClick={() => { setForm({ ...form, patientId: p.id }); setPatientSearch(''); setPatientDropdownOpen(false) }} 
                            className="px-4 py-2.5 cursor-pointer hover:bg-blue-50 flex items-center gap-3 transition-colors"
                        >
                          <PatientAvatar nom={p.nom} prenom={p.prenom} size="sm" />
                          <div>
                             <div className="text-sm font-medium text-gray-900">{p.nom} {p.prenom}</div>
                             <div className="text-xs text-gray-500">{p.telephone || 'No phone'}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
             </div>

             <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date <span className="text-red-500">*</span></label>
                <input 
                  type="date" 
                  className={inputClass(errors.date)}
                  value={form.date} 
                  onChange={e => setForm({ ...form, date: e.target.value })} 
                />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}

             </div>
             
             <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Heure <span className="text-red-500">*</span></label>
                <input 
                  type="time" 
                  className={inputClass(errors.heure)}
                  value={form.heure} 
                  onChange={e => setForm({ ...form, heure: e.target.value })} 
                />
                {errors.heure && <p className="text-red-500 text-xs mt-1">{errors.heure}</p>}

             </div>

             <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Motif <span className="text-red-500">*</span></label>
                <select 
                  className={`${inputClass(errors.motif)} appearance-none cursor-pointer`}
                  value={form.motif} 
                  onChange={e => setForm({ ...form, motif: e.target.value })}
                >
                  <option value="">Select a reason...</option>
                  {motifsRdv.map((m, i) => (
                    <option key={i} value={typeof m === 'string' ? m : m.label}>{typeof m === 'string' ? m : m.label}</option>
                  ))}
                </select>
                {errors.motif && <p className="text-red-500 text-xs mt-1">{errors.motif}</p>}
             </div>

             <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status <span className="text-red-500">*</span></label>
                <select 
                  className={`${inputClass(errors.etat)} appearance-none cursor-pointer`}
                  value={form.etat} 
                  onChange={e => setForm({ ...form, etat: e.target.value })}
                >
                  {statutsRdv.map((s, i) => (
                    <option key={i} value={typeof s === 'string' ? s : s.label}>
                      {typeof s === 'string' ? s : s.label}
                    </option>
                  ))}
                </select>
                {errors.etat && <p className="text-red-500 text-xs mt-1">{errors.etat}</p>}
             </div>

             <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
                <textarea 
                  rows={3} 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none" 
                  value={form.notes} 
                  onChange={e => setForm({ ...form, notes: e.target.value })} 
                  placeholder="Add any additional notes here..."
                />
             </div>
          </form>
        </Modal>

        {/* Delete Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          title="Delete Appointment"
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          confirmText="Delete"
        >
           <div className="flex flex-col items-center justify-center p-4 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                 <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Are you sure?</h3>
              <p className="text-gray-500 mb-2">This action cannot be undone. This will permanently delete the appointment.</p>
           </div>
        </Modal>

        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
      </div>
    </Layout>
  )
}

export default RDVList
