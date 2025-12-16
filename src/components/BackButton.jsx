import React from 'react'
import { useNavigate } from 'react-router-dom'

const BackButton = ({ to, label = 'Back to Previous Page' }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (to) {
      navigate(to)
    } else {
      navigate(-1)
    }
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-lg shadow-md hover:bg-blue-50 hover:shadow-lg transition-all duration-200 font-medium border border-blue-200 mb-4"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      {label}
    </button>
  )
}

export default BackButton

