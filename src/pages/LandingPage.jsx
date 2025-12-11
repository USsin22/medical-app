import React from "react";

const LandingPage = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">
      <span className="text-2xl font-bold text-blue-600">MedClinic</span>
      <div>
        <a href="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Dashboard</a>
      </div>
    </nav>
    <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold mb-4 text-blue-700">Welcome to MedClinic</h1>
      <p className="text-lg text-gray-700 mb-6">Modern medical practice management made easy.</p>
      <a href="/dashboard" className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">Go to Dashboard</a>
    </main>
    <footer className="bg-white text-gray-500 text-center py-4 mt-auto">© 2024 MedClinic. All rights reserved.</footer>
  </div>
);

export default LandingPage;