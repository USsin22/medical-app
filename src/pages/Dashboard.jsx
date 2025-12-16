import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { fetchPatients } from '../store/patientSlice'
import { fetchRendezvous } from '../store/rdvSlice'
import { fetchConsultations } from '../store/consultationsSlice'
import Layout from '../components/Layout'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { patients } = useSelector(state => state.patient)
  const { appointments } = useSelector(state => state.rdv)
  const { consultations } = useSelector(state => state.consultation)

  useEffect(() => {
    dispatch(fetchPatients())
    dispatch(fetchRendezvous())
    dispatch(fetchConsultations())
  }, [dispatch])

  const today = new Date().toISOString().split('T')[0]
  const todayAppointments = appointments.filter(apt => apt.date === today)
  const todayConsultations = consultations.filter(cons => cons.date === today)

  const metrics = [
    { label: "Total Patients", value: patients.length, icon: "👥", color: "bg-blue-500" },
    { label: "Upcoming Appointments", value: appointments.length, icon: "📅", color: "bg-green-500" },
    { label: "Consultations Today", value: todayConsultations.length, icon: "🏥", color: "bg-purple-500" },
    { label: "Appointments Today", value: todayAppointments.length, icon: "⏰", color: "bg-orange-500" },
  ];

  return (
    <Layout showBackButton={false}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-blue-900">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map(m => (
            <div key={m.label} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-800">{m.value}</div>
                  <div className="text-gray-600 mt-1">{m.label}</div>
                </div>
                <div className={`${m.color} w-12 h-12 rounded-full flex items-center justify-center text-2xl`}>
                  {m.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-4">Welcome to MedClinic</h2>
          <p className="text-gray-700">Your comprehensive medical practice management system. Use the sidebar to navigate to different sections and manage your patients, appointments, consultations, and planning.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;