import './App.css'
import React from 'react'
import { Routes, Route ,BrowserRouter } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import PatientsList from './pages/PatientsList'
import PatientDetails from './pages/PatientDetails'
import PatientForm from './pages/PatientForm'
import RDVList from './pages/RDVList'
import RDVForm from './pages/RDVForm'
import ConsultationsList from './pages/ConsultationsList'
import ConsultationForm from './pages/ConsultationForm'
import PlanningPage from './pages/PlanningPage'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patients" element={<PatientsList />} />
        <Route path="/patient/:id" element={<PatientDetails />} />
        <Route path="/patient/new" element={<PatientForm />} />
        <Route path="/patient/edit/:id" element={<PatientForm />} />
        <Route path="/rdv" element={<RDVList />} />
        <Route path="/rdv/new" element={<RDVForm />} />
        <Route path="/rdv/edit/:id" element={<RDVForm />} />
        <Route path="/consultations" element={<ConsultationsList />} />
        <Route path="/consultation/new" element={<ConsultationForm />} />
        <Route path="/consultation/edit/:id" element={<ConsultationForm />} />
        <Route path="/planning" element={<PlanningPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
