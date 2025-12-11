import React, { useEffect } from 'react'

const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(() => onClose?.(), 2500)
    return () => clearTimeout(t)
  }, [message, onClose])

  if (!message) return null

  const color = type === 'error' ? 'bg-red-600' : type === 'success' ? 'bg-green-600' : 'bg-slate-700'

  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 text-white ${color} px-4 py-2 rounded shadow-lg z-50`}> 
      {message}
    </div>
  )
}

export default Toast
