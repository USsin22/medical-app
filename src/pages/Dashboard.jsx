import React from "react";

const metrics = [
  { label: "Total Patients", value: 120 },
  { label: "Upcoming Appointments", value: 15 },
  { label: "Consultations Today", value: 7 },
];

const navLinks = [
  { name: "Patients", href: "/patients" },
  { name: "Appointments", href: "/rdv" },
  { name: "Consultations", href: "/consultations" },
  { name: "Planning", href: "/planning" },
];

const Dashboard = () => (
  <div className="min-h-screen flex bg-gray-50">
    <aside className="w-64 bg-white shadow flex flex-col p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-8">MedClinic</h2>
      <nav className="flex-1">
        {navLinks.map(link => (
          <a key={link.name} href={link.href} className="block py-2 px-4 rounded hover:bg-blue-100 text-gray-700 mb-2">{link.name}</a>
        ))}
      </nav>
    </aside>
    <main className="flex-1 p-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {metrics.map(m => (
          <div key={m.label} className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{m.value}</div>
            <div className="text-gray-700">{m.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow p-6">Welcome to your medical dashboard. Select a section from the sidebar to get started.</div>
    </main>
  </div>
);

export default Dashboard;