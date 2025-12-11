import React from "react";

const RDVForm = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <form className="bg-white p-8 rounded shadow w-full max-w-lg">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Add/Edit Appointment</h1>
      <div className="mb-4">
        <label className="block mb-1 text-gray-700">Patient</label>
        <input className="w-full px-4 py-2 border rounded" type="text" placeholder="Patient Name" />
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-gray-700">Date</label>
        <input className="w-full px-4 py-2 border rounded" type="date" />
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-gray-700">Time</label>
        <input className="w-full px-4 py-2 border rounded" type="time" />
      </div>
      <button className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
    </form>
  </div>
);

export default RDVForm;