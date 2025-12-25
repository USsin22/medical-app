import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addConsultation, deleteConsultation, fetchConsultations, updateConsultation } from '../store/consultationsSlice'
import { fetchPatients } from '../store/patientSlice'
import { fetchModesPaiement} from '../store/optionsSlice'
import { motion, AnimatePresence } from 'motion/react' // Assuming motion/react is available as per previous files
import Modal from '../components/Modal' // Assuming updated Modal is available
import Toast from '../components/Toast'
import Layout from '../components/Layout'
import { 
  Search, 
  Plus, 
  Calendar, 
  User, 
  Phone, 
  FileText, 
  Activity, 
  CreditCard,
  Edit2, 
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

const emptyConsult = { patientId: '', date: '', diagnostic: '', traitement: '', tarif: '', paiement: 'Non Payé' }

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

const ConsultationsList = () => {
  const dispatch = useDispatch()
  const { consultations, status, error } = useSelector(state => state.consultation)
  const { patients } = useSelector(state => state.patient)
  const { modesPaiement } = useSelector(state => state.options)

  // State
  const [query, setQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  
  const [editing, setEditing] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  
  const [form, setForm] = useState(emptyConsult)
  const [errors, setErrors] = useState({})
  const [isFormValid, setIsFormValid] = useState(false)
  
  const [toast, setToast] = useState({ message: '', type: 'info' })
  const [patientSearch, setPatientSearch] = useState('')
  const [patientDropdownOpen, setPatientDropdownOpen] = useState(false)

  useEffect(() => {
    if (status === 'idle') dispatch(fetchConsultations())
    dispatch(fetchPatients())
    dispatch(fetchModesPaiement())
  }, [status, dispatch])

  // Validation
  useEffect(() => {
    const newErrors = {}
    if (!form.patientId) newErrors.patientId = 'Patient is required'
    if (!form.date) newErrors.date = 'Date is required'
    if (!form.diagnostic) newErrors.diagnostic = 'Diagnostic is required'
    // Traitement can be optional? Let's make it required as per general 'required' hint
    if (!form.traitement) newErrors.traitement = 'Treatment is required'
    if (form.tarif === '' || form.tarif < 0) newErrors.tarif = 'Valid tariff is required'
    if (!form.paiement) newErrors.paiement = 'Payment status is required'
    
    setErrors(newErrors)
    setIsFormValid(Object.keys(newErrors).length === 0)
  }, [form])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return consultations
    return consultations.filter(c => {
      const p = patients.find(pat => pat.id === c.patientId)
      const patientName = p ? `${p.nom} ${p.prenom}` : ''
      return `${c.diagnostic} ${c.traitement} ${patientName}`.toLowerCase().includes(q)
    })
  }, [consultations, query, patients])

  const openAdd = () => { setEditing(null); setForm(emptyConsult); setIsModalOpen(true); setErrors({}) }
  
  const openEdit = (c) => { 
    setEditing(c); 
    setForm({ 
      patientId: c.patientId || '', 
      date: c.date || '', 
      diagnostic: c.diagnostic || '', 
      traitement: c.traitement || '', 
      tarif: c.tarif ?? '', 
      paiement: c.paiement || 'Non Payé' 
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
      await dispatch(deleteConsultation(deletingId)).unwrap()
      setToast({ message: 'Consultation deleted successfully', type: 'success' }) 
    } catch { 
      setToast({ message: 'Delete failed', type: 'error' }) 
    }
    setIsDeleteModalOpen(false)
    setDeletingId(null)
  }

  const onSave = async (e) => {
    e?.preventDefault()
    if (!isFormValid) return

    try {
      if (editing) {
        await dispatch(updateConsultation({ id: editing.id, ...form })).unwrap()
        setToast({ message: 'Consultation updated successfully', type: 'success' })
      } else {
        await dispatch(addConsultation({ ...form, tarif: Number(form.tarif) || 0 })).unwrap()
        setToast({ message: 'Consultation added successfully', type: 'success' })
      }
      setIsModalOpen(false)
    } catch {
      setToast({ message: 'Operation failed', type: 'error' })
    }
  }
  
  const inputClass = (error) => `w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:bg-white focus:outline-none focus:ring-2 transition-all font-medium ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'}`


  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
             <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Consultations</h1>
             <p className="text-gray-500 mt-1">Track patient visits and diagnoses</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                  placeholder="Search diagnostic, patient..."
                  value={query} 
                  onChange={e => setQuery(e.target.value)}
                />
             </div>
             <button 
               onClick={openAdd}
               className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-medium"
             >
                <Plus className="w-5 h-5" />
                <span>Add Consultation</span>
             </button>
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

        {/* List */}
        <div className="space-y-4">
           {status === 'loading' ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
              </div>
           ) : (
             <AnimatePresence>
               {filtered.map(c => {
                 const patient = patients.find(p => p.id === c.patientId)
                 return (
                   <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      layout
                      className="group bg-white rounded-xl border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col md:flex-row gap-5 md:items-center"
                   >
                     {/* Patient */}
                     <div className="flex items-center gap-4 min-w-[220px]">
                        <PatientAvatar nom={patient?.nom} prenom={patient?.prenom} />
                        <div>
                           <div className="font-semibold text-gray-900 text-lg">
                             {patient ? `${patient.nom} ${patient.prenom}` : 'Unknown'}
                           </div>
                           <div className="text-sm text-gray-500 flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5" />
                              {patient?.telephone || 'No phone'}
                           </div>
                        </div>
                     </div>
                     
                     {/* Details */}
                     <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                        <div className="flex items-center gap-2 text-gray-600">
                           <Calendar className="w-4 h-4 text-gray-400" />
                           <span className="text-sm font-medium">{c.date}</span>
                        </div>
                        
                        <div className="col-span-1 sm:col-span-2 lg:col-span-2">
                           <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                             <Activity className="w-4 h-4 text-blue-500" />
                             {c.diagnostic}
                           </div>
                           <div className="text-xs text-gray-500 ml-6 truncate max-w-[200px]">
                              {c.traitement}
                           </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                           <span className="font-bold text-gray-900">{c.tarif} €</span>
                           <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${c.paiement === 'Payé' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                              {c.paiement}
                           </span>
                        </div>
                     </div>
                     
                     {/* Actions */}
                     <div className="flex items-center justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(c)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                           <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => promptDelete(c.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900">No consultations found</h3>
                <p className="text-gray-500">Add a new consultation to get started.</p>
             </div>
           )}
        </div>

        {/* Modal */}
        <Modal 
          isOpen={isModalOpen} 
          title={editing ? 'Edit Consultation' : 'New Consultation'} 
          onClose={() => setIsModalOpen(false)} 
          onConfirm={onSave}
          confirmText="Save Consultation"
          isConfirmDisabled={!isFormValid}
        >
          <form className="grid grid-cols-1 md:grid-cols-2 gap-5" onSubmit={(e) => e.preventDefault()}>
             <div className="col-span-full">
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
                    placeholder="Search patient..."
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tarif (€) <span className="text-red-500">*</span></label>
                <input 
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputClass(errors.tarif)}
                  value={form.tarif} 
                  onChange={e => setForm({ ...form, tarif: e.target.value })} 
                />
                 {errors.tarif && <p className="text-red-500 text-xs mt-1">{errors.tarif}</p>}
             </div>

             <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Diagnostic <span className="text-red-500">*</span></label>
                <input 
                  className={inputClass(errors.diagnostic)}
                  value={form.diagnostic || 'Examen clinique'} 
                  onChange={e => setForm({ ...form, diagnostic: e.target.value })} 
                  placeholder="e.g. Viral Infection"

                />
                {errors.diagnostic && <p className="text-red-500 text-xs mt-1">{errors.diagnostic}</p>}
             </div>
             
             <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Traitement <span className="text-red-500">*</span></label>
                <textarea 
                  rows={2}
                  className={`${inputClass(errors.traitement)} resize-none`}
                  value={form.traitement || 'Traitement non défini'} 
                  onChange={e => setForm({ ...form, traitement: e.target.value })} 
                  placeholder="Prescribed medication..."
                />
                 {errors.traitement && <p className="text-red-500 text-xs mt-1">{errors.traitement}</p>}
             </div>
             
             <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Status <span className="text-red-500">*</span></label>
                <select 
                  className={`${inputClass(errors.paiement)} appearance-none cursor-pointer`}
                  value={form.paiement} 
                  onChange={e => setForm({ ...form, paiement: e.target.value })}
                >
                  <option value="">Select Payment Status</option>
                  {modesPaiement.map((option, i) => (
                    <option key={i} value={typeof option === 'string' ? option : option.label}>
                      {typeof option === 'string' ? option : option.label}
                    </option>
                  ))}
                </select>
                {errors.paiement && <p className="text-red-500 text-xs mt-1">{errors.paiement}</p>}
             </div>
          </form>
        </Modal>
        
        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          title="Delete Consultation"
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          confirmText="Delete"
        >
           <div className="flex flex-col items-center justify-center p-4 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                 <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Are you sure?</h3>
              <p className="text-gray-500 mb-2">This action cannot be undone. This records will be permanently deleted.</p>
           </div>
        </Modal>

        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
      </div>
    </Layout>
  )
}

export default ConsultationsList
