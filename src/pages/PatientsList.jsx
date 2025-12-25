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

const PatientsList = () => {
  const dispatch = useDispatch();
  const { patients, status, error } = useSelector((state) => state.patient);
  const groupesSanguins = useSelector((state) => state.options.groupesSanguins);
  console.log(groupesSanguins)

  const [query, setQuery] = useState("");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
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
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
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

  const onConfirm = async () => {
    try {
      if (editing) {
        await dispatch(updatePatient({ id: editing.id, ...form })).unwrap();
        setToast({ message: "Patient updated", type: "success" });
      } else {
        await dispatch(addPatient(form)).unwrap();
        setToast({ message: "Patient added", type: "success" });
      }
      setIsModalOpen(false);
    } catch {
      setToast({ message: "Operation failed", type: "error" });
    }
  };

  const onDelete = async (id) => {
    try {
      await dispatch(deletePatient(id)).unwrap();
      setToast({ message: "Patient deleted", type: "success" });
    } catch {
      setToast({ message: "Delete failed", type: "error" });
    }
  };

  return (
    <Layout>
      <div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <h1 className="text-2xl font-bold text-blue-700">Patients</h1>
          <div className="flex gap-3 w-full md:w-auto">
            <input
              className="flex-1 md:w-80 px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Search by name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search patients"
            />
            <select
              className="px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200 bg-white"
              value={bloodGroupFilter}
              onChange={(e) => setBloodGroupFilter(e.target.value)}
            >
              <option value="">All Blood Groups</option>
              {groupesSanguins.map((bg,i) => (
                <option key={i} value={bg.label}>{bg.label}</option>
              ))}
            </select>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={openAdd}
            >
              Add
            </button>
          </div>
        </div>

        {status === "loading" && (
          <div className="text-gray-600">
            {" "}
            <img
              src="https://media.giphy.com/media/y1ZBcOGOOtlpC/giphy.gif"
              alt="Loading..."
              width="80"
            />
          </div>
        )}
        {error && <div className="text-red-600">{error}</div>}

        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medical Info</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOB</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{p.nom} {p.prenom}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{p.email || '—'}</div>
                    <div className="text-sm text-gray-500">{p.telephone || '—'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {p.adresse || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>Blood: {p.groupe_sanguin || '—'}</div>
                    <div className="text-xs text-gray-400">Allergies: {p.allergies || '—'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {p.date_naissance || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onClick={() => openEdit(p)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                    <button onClick={() => onDelete(p.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal
          isOpen={isModalOpen}
          title={editing ? "Edit Patient" : "Add Patient"}
          onClose={() => setIsModalOpen(false)}
          onConfirm={onConfirm}
        >
          <form className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="flex flex-col text-sm">
              <span className="text-gray-700">Nom</span>
              <input
                className="mt-1 px-3 py-2 border rounded"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
              />
            </label>
            <label className="flex flex-col text-sm">
              <span className="text-gray-700">Prénom</span>
              <input
                className="mt-1 px-3 py-2 border rounded"
                value={form.prenom}
                onChange={(e) => setForm({ ...form, prenom: e.target.value })}
              />
            </label>
            <label className="flex flex-col text-sm">
              <span className="text-gray-700">Téléphone</span>
              <input
                className="mt-1 px-3 py-2 border rounded"
                value={form.telephone}
                onChange={(e) =>
                  setForm({ ...form, telephone: e.target.value })
                }
              />
            </label>
            <label className="flex flex-col text-sm">
              <span className="text-gray-700">Email</span>
              <input
                type="email"
                className="mt-1 px-3 py-2 border rounded"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
            <label className="flex flex-col text-sm md:col-span-2">
              <span className="text-gray-700">Adresse</span>
              <input
                className="mt-1 px-3 py-2 border rounded"
                value={form.adresse}
                onChange={(e) => setForm({ ...form, adresse: e.target.value })}
              />
            </label>
            <label className="flex flex-col text-sm">
              <span className="text-gray-700">Groupe sanguin</span>
              <select
                className="mt-1 px-3 py-2 border rounded bg-white"
                value={form.groupe_sanguin}
                onChange={(e) =>
                  setForm({ ...form, groupe_sanguin: e.target.value })
                }
              >
                <option value="">Select Group</option>
                {groupesSanguins.map((bg,i) => (
                  <option key={i} value={bg.value}>{bg.label}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col text-sm">
              <span className="text-gray-700">Allergies</span>
              <input
                className="mt-1 px-3 py-2 border rounded"
                value={form.allergies}
                onChange={(e) =>
                  setForm({ ...form, allergies: e.target.value })
                }
              />
            </label>
            <label className="flex flex-col text-sm md:col-span-2">
              <span className="text-gray-700">Date de naissance</span>
              <input
                type="date"
                className="mt-1 px-3 py-2 border rounded"
                value={form.date_naissance}
                onChange={(e) =>
                  setForm({ ...form, date_naissance: e.target.value })
                }
              />
            </label>
          </form>
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
