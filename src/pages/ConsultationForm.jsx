import React from 'react'
import Layout from '../components/Layout'

const ConsultationForm = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
      <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Consultation Form</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Patient Name</label>
          <input type="text" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter patient name" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Consultation Date</label>
          <input type="date" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Notes</label>
          <textarea className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" rows={4} placeholder="Enter notes" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Submit</button>
      </form>
      </div>
    </Layout>
  )
}

export default ConsultationForm
