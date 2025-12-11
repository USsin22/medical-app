import React from 'react'

const StatsCard = ({ title, value, icon, description, colorClass = 'bg-blue-500' }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 m-2 flex flex-col justify-between w-full max-w-sm">
      <div className="flex items-center">
        <div className={`p-3 rounded-full text-white ${colorClass}`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
      {description && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      )}
    </div>
  )
}

export default StatsCard