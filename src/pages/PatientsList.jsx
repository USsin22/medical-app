import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPatients,
  addPatient,
  updatePatient,
  deletePatient,
} from "../store/patientSlice";
import { fetchGroupesSanguins } from "../store/optionsSlice";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import Layout from "../components/Layout";
import { formatAge } from "../utils/ageCalculator";
import { 
  Search, 
  Plus, 
  Filter, 
  Edit2, 
  Trash2, 
  Eye, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Heart,
  Mail
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const emptyForm = {
  nom: "",
  prenom: "",
  telephone: "",
  email: "",
  adresse: "",
  groupe_sanguin: "",
  allergies: "",
  date_naissance: "",
};

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
    <div className={`${sizeClasses[size]} ${colorClass} rounded-full flex items-center justify-center font-bold ring-2 ring-white shadow-sm`}>
      {initials}
    </div>
  );
};

const SkeletonRow = () => (
  <div className="flex items-center p-4 border-b border-gray-50 bg-white animate-pulse">
    <div className="w-10 h-10 bg-gray-200 rounded-full mr-4"></div>
    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
  </div>
);

const PatientsList = () => {
  const dispatch = useDispatch();
  const { patients, status, error } = useSelector((state) => state.patient);
  const groupesSanguins = useSelector((state) => state.options.groupesSanguins);

  const [query, setQuery] = useState("");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState({ message: "", type: "info" });

  useEffect(() => {
    if (status === "idle") dispatch(fetchPatients());
    dispatch(fetchGroupesSanguins());
  }, [status, dispatch]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return patients.filter((p) => {
      const matchesQuery = !q || `${p.nom} ${p.prenom}`.toLowerCase().includes(q);
      const matchesFilter = !bloodGroupFilter || p.groupe_sanguin === bloodGroupFilter;
      return matchesQuery && matchesFilter;
    });
  }, [patients, query, bloodGroupFilter]);

  const openAdd = () => {
    setEditing(null);
    setViewing(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setViewing(null);
    setForm({
      nom: p.nom || "",
      prenom: p.prenom || "",
      telephone: p.telephone || "",
      email: p.email || "",
      adresse: p.adresse || "",
      groupe_sanguin: p.groupe_sanguin || "",
      allergies: p.allergies || "",
      date_naissance: p.date_naissance || "",
    });
    setIsModalOpen(true);
  };

  const openDetails = (p) => {
    setViewing(p);
    setEditing(null);
    setIsModalOpen(true);
  };

  const onConfirm = async (e) => {
    e?.preventDefault();
    try {
      if (editing) {
        await dispatch(updatePatient({ id: editing.id, ...form })).unwrap();
        setToast({ message: "Patient updated successfully", type: "success" });
      } else {
        await dispatch(addPatient(form)).unwrap();
        setToast({ message: "Patient added successfully", type: "success" });
      }
      setIsModalOpen(false);
    } catch {
      setToast({ message: "Operation failed", type: "error" });
    }
  };

  const onDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      await dispatch(deletePatient(id)).unwrap();
      setToast({ message: "Patient deleted", type: "success" });
    } catch {
      setToast({ message: "Delete failed", type: "error" });
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Patients</h1>
            <p className="text-gray-500 mt-1">Manage your patient records and information</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                placeholder="Search patients..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            
            <div className="relative sm:w-48">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                className="w-full pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none shadow-sm cursor-pointer"
                value={bloodGroupFilter}
                onChange={(e) => setBloodGroupFilter(e.target.value)}
              >
                <option value="">All Blood Groups</option>
                {groupesSanguins.map((bg,i) => (
                  <option key={i} value={bg.value || bg.label}>{bg.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={openAdd}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all shadow-md hover:shadow-lg font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Add Patient</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Content Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {status === "loading" ? (
             <div className="divide-y divide-gray-50">
               {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
             </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Medical</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Age</th>
                    <th scope="col" className="relative px-6 py-4">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  <AnimatePresence>
                    {filtered.map((p) => (
                      <motion.tr 
                        key={p.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="group hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 flex items-center gap-4">
                          <PatientAvatar nom={p.nom} prenom={p.prenom} />
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{p.nom} {p.prenom}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" />
                              {p.adresse || 'No address'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            {p.email && (
                              <div className="text-sm text-gray-600 flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5 text-gray-400" />
                                {p.email}
                              </div>
                            )}
                            {p.telephone && (
                              <div className="text-sm text-gray-600 flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5 text-gray-400" />
                                {p.telephone}
                              </div>
                            )}
                            {!p.email && !p.telephone && <span className="text-gray-400 text-sm">—</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                           <div className="flex items-center gap-3">
                              {p.groupe_sanguin ? (
                                <span className={`px-2.5 py-1 inline-flex text-xs leading-4 font-semibold rounded-full 
                                  ${['A+', 'A-'].includes(p.groupe_sanguin) ? 'bg-blue-100 text-blue-800' : 
                                    ['B+', 'B-'].includes(p.groupe_sanguin) ? 'bg-purple-100 text-purple-800' :
                                    ['AB+', 'AB-'].includes(p.groupe_sanguin) ? 'bg-indigo-100 text-indigo-800' :
                                    'bg-green-100 text-green-800'}`}>
                                  {p.groupe_sanguin}
                                </span>
                              ) : (
                                <span className="text-gray-400 text-xs">—</span>
                              )}
                              {p.allergies && (
                                <div className="group relative">
                                  <span className="cursor-help text-red-500 bg-red-50 px-2 py-0.5 rounded text-xs font-medium">Allergies</span>
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                                    {p.allergies}
                                  </div>
                                </div>
                              )}
                           </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatAge(p.date_naissance) ? (
                            <div className="font-medium text-gray-900">{formatAge(p.date_naissance)} <span className="text-gray-500 font-normal">years</span></div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openDetails(p)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button onClick={() => openEdit(p)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => onDelete(p.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                           <User className="w-12 h-12 text-gray-300" />
                           <p>No patients found matching your search.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Improved Modal */}
        <Modal
          isOpen={isModalOpen}
          title={viewing ? "Patient Information" : editing ? "Edit Information" : "New Patient"}
          onClose={() => { setIsModalOpen(false); setViewing(null); }}
          onConfirm={viewing ? () => { setIsModalOpen(false); setViewing(null); } : onConfirm}
        >
          {viewing ? (
            <div className="space-y-8 animate-in fade-in duration-300">
               <div className="flex flex-col items-center justify-center pb-6 border-b border-gray-100">
                  <PatientAvatar nom={viewing.nom} prenom={viewing.prenom} size="xl" />
                  <h2 className="mt-4 text-2xl font-bold text-gray-900">{viewing.nom} {viewing.prenom}</h2>
                  <div className="flex items-center gap-2 text-gray-500 mt-1">
                    <Calendar className="w-4 h-4" />
                    <span>{viewing.date_naissance ? `${formatAge(viewing.date_naissance)} years old` : 'Age unknown'}</span>
                  </div>
               </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                 <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Contact Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="text-gray-900 font-medium">{viewing.telephone || "—"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-gray-900 font-medium">{viewing.email || "—"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Address</p>
                          <p className="text-gray-900 font-medium">{viewing.adresse || "—"}</p>
                        </div>
                      </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Medical Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                           <Heart className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Blood Group</p>
                          <p className="text-gray-900 font-medium">{viewing.groupe_sanguin || "—"}</p>
                        </div>
                      </div>
                       <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600 shrink-0">
                           <span className="text-xs font-bold">⚠</span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Allergies</p>
                          <p className="text-gray-900 font-medium">{viewing.allergies || "None"}</p>
                        </div>
                      </div>
                    </div>
                 </div>
              </div>
              
              <div className="flex justify-end pt-6 border-t border-gray-100">
                 <button 
                  onClick={() => openEdit(viewing)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm transition-all flex items-center gap-2"
                 >
                   <Edit2 className="w-4 h-4" />
                   Edit Details
                 </button>
              </div>
            </div>
          ) : (
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
             <div className="col-span-full flex items-center gap-4 mb-2">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                  <User className="w-8 h-8" />
                </div>
                <div>
                   <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                   <p className="text-sm text-gray-500">Please fill in the patient's basic details.</p>
                </div>
             </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-gray-700">Last Name</span>
              <input
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                placeholder="Doe"
                required
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-gray-700">First Name</span>
              <input
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={form.prenom}
                onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                 placeholder="John"
                 required
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-gray-700">Phone Number</span>
              <input
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={form.telephone}
                onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                placeholder="+1 234 567 890"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-gray-700">Email Address</span>
              <input
                type="email"
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="john@example.com"
              />
            </label>
            <label className="flex flex-col gap-1.5 md:col-span-2">
              <span className="text-sm font-semibold text-gray-700">Address</span>
              <input
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={form.adresse}
                onChange={(e) => setForm({ ...form, adresse: e.target.value })}
                placeholder="123 Main St, City, Country"
              />
            </label>
            
            <div className="col-span-full h-px bg-gray-100 my-2"></div>
            
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-gray-700">Blood Group</span>
              <select
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                value={form.groupe_sanguin}
                onChange={(e) => setForm({ ...form, groupe_sanguin: e.target.value })}
              >
                <option value="">Select Group</option>
                {groupesSanguins.map((bg,i) => (
                  <option key={i} value={bg.value || bg.label}>{bg.label}</option>
                ))}
              </select>
            </label>
             <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-gray-700">Date of Birth</span>
              <input
                type="date"
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                value={form.date_naissance}
                onChange={(e) => setForm({ ...form, date_naissance: e.target.value })}
              />
            </label>
            <label className="flex flex-col gap-1.5 md:col-span-2">
              <span className="text-sm font-semibold text-gray-700">Allergies (Optional)</span>
              <textarea
                rows={2}
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                value={form.allergies}
                onChange={(e) => setForm({ ...form, allergies: e.target.value })}
                placeholder="Peanuts, Penicillin..."
              />
            </label>
          </form>
          )}
        </Modal>

        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "info" })}
        />
      </div>
    </Layout>
  );
};

export default PatientsList;
