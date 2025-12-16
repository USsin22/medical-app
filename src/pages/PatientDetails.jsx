import React from "react";
import Layout from '../components/Layout'



const PatientDetails = () => (
  <Layout>
    <div>
    <div className="bg-white rounded shadow p-6 mb-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">Patient Details</h1>
      <div className="text-gray-700 mb-2">Age: </div>
      <div className="text-gray-700 mb-2">Gender: </div>
    </div>
    <div className="bg-white rounded shadow p-6 mb-6">
      <h2 className="text-xl font-bold text-blue-600 mb-4">Consultation History</h2>
      <ul>
        {patient.consultations.map((c, i) => (
          <li key={i} className="mb-2">
            <span className="font-semibold">{c.date}</span> - {c.doctor}: {c.notes}
          </li>
        ))}
      </ul>
    </div>
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-xl font-bold text-blue-600 mb-4">Appointments</h2>
      <ul>
        {patient.appointments.map((a, i) => (
          <li key={i} className="mb-2">
            <span className="font-semibold">{a.date} {a.time}</span> - {a.type}
          </li>
        ))}
      </ul>
    </div>
    </div>
  </Layout>
);

export default PatientDetails;