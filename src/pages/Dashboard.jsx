import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchPatients } from '../store/patientSlice'
import { fetchRendezvous } from '../store/rdvSlice'
import { fetchConsultations } from '../store/consultationsSlice'
import Layout from '../components/Layout'
import { 
  Users, 
  Calendar, 
  Activity, 
  DollarSign, 
  Plus, 
  Clock, 
  ChevronRight
} from 'lucide-react'

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

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    
    const todayAppointments = appointments.filter(apt => apt.date === today)
    const todayConsultations = consultations.filter(cons => cons.date === today)
    
    const totalRevenue = consultations.reduce((acc, curr) => acc + (Number(curr.tarif) || 0), 0)
    
    const now = new Date()
    const upcoming = appointments
      .filter(apt => {
        const aptDate = new Date(`${apt.date}T${apt.heure || '00:00'}`)
        return aptDate >= now
      })
      .sort((a, b) => new Date(`${a.date}T${a.heure || '00:00'}`) - new Date(`${b.date}T${b.heure || '00:00'}`))
      .slice(0, 5)

    const recentPatients = [...patients].reverse().slice(0, 5)

    return {
      totalPatients: patients.length,
      todayAppointmentsCount: todayAppointments.length,
      todayConsultationsCount: todayConsultations.length,
      totalRevenue,
      upcomingAppointments: upcoming,
      recentPatients
    }
  }, [patients, appointments, consultations])

  const metrics = [
    { 
      label: "Total Patients", 
      value: stats.totalPatients, 
      icon: Users, 
      color: "text-blue-600", 
      bg: "bg-blue-100",
      desc: "Registered patients"
    },
    { 
      label: "Appointments Today", 
      value: stats.todayAppointmentsCount, 
      icon: Calendar, 
      color: "text-purple-600", 
      bg: "bg-purple-100",
      desc: "Scheduled for today"
    },
    { 
      label: "Consultations Today", 
      value: stats.todayConsultationsCount, 
      icon: Activity, 
      color: "text-teal-600", 
      bg: "bg-teal-100",
      desc: "Completed visits"
    },
    { 
      label: "Total Revenue", 
      value: `${stats.totalRevenue.toLocaleString()} €`, 
      icon: DollarSign, 
      color: "text-emerald-600", 
      bg: "bg-emerald-100",
      desc: "Lifetime earnings"
    },
  ];

  return (
    <Layout showBackButton={false}>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-500 mt-1">Welcome to your medical practice management system.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/rdv/new" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
              <Plus size={18} />
              <span>New Appointment</span>
            </Link>
            <Link to="/patients" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium">
              <Users size={18} />
              <span>Patients</span>
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{m.label}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-2">{m.value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${m.bg}`}>
                  <m.icon className={`w-6 h-6 ${m.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-400">
                <span>{m.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Upcoming Appointments
              </h2>
              <Link to="/rdv" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                View all <ChevronRight size={16} />
              </Link>
            </div>
            <div className="divide-y divide-gray-50 flex-1">
              {stats.upcomingAppointments.length > 0 ? (
                stats.upcomingAppointments.map(apt => {
                  const patient = patients.find(p => p.id === apt.patientId)
                  return (
                    <div key={apt.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                          {patient ? patient.nom.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {patient ? `${patient.nom} ${patient.prenom}` : 'Unknown Patient'}
                          </p>
                          <p className="text-sm text-gray-500">{apt.motif || 'Consultation'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded text-xs inline-block mb-1">
                          {apt.heure}
                        </div>
                        <p className="text-xs text-gray-500">{apt.date}</p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="p-12 text-center text-gray-500 flex flex-col items-center gap-3">
                  <Calendar className="w-12 h-12 text-gray-300" />
                  <p>No upcoming appointments</p>
                  <Link to="/rdv/new" className="text-blue-600 text-sm hover:underline">Schedule one now</Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Patients */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-500" />
                New Patients
              </h2>
              <Link to="/patients" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                View all <ChevronRight size={16} />
              </Link>
            </div>
            <div className="divide-y divide-gray-50 flex-1">
              {stats.recentPatients.length > 0 ? (
                stats.recentPatients.map(p => (
                  <div key={p.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 text-sm font-bold">
                        {p.nom.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 group-hover:text-teal-600 transition-colors">
                          {p.nom} {p.prenom}
                        </p>
                        <p className="text-xs text-gray-500">{p.telephone || 'No phone'}</p>
                      </div>
                    </div>
                    <Link to={`/patients`} className="text-gray-300 hover:text-blue-600 transition-colors">
                      <ChevronRight size={18} />
                    </Link>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-gray-500 flex flex-col items-center gap-3">
                  <Users className="w-12 h-12 text-gray-300" />
                  <p>No patients found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;