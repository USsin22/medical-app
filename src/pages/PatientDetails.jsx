import React from "react";

const patient = {
  name: "John Doe",
  age: 34,
  gender: "Male",
  consultations: [
    { date: "2024-06-01", doctor: "Dr. Smith", notes: "Routine checkup" },
  ],
  appointments: [
    { date: "2024-06-10", time: "10:00", type: "Follow-up" },
  ],
};

const PatientDetails = () => (
  <div className="p-8 bg-gray-50 min-h-screen">
    <div className="bg-white rounded shadow p-6 mb-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">{patient.name}</h1>
      <div className="text-gray-700 mb-2">Age: {patient.age}</div>
      <div className="text-gray-700 mb-2">Gender: {patient.gender}</div>
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
);

export default PatientDetails;