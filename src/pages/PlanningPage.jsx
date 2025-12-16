import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRendezvous } from '../store/rdvSlice'
import Layout from '../components/Layout'

const PlanningPage = () => {
  const dispatch = useDispatch()
  const { appointments, status } = useSelector(state => state.rdv)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [viewMode, setViewMode] = useState('day') // 'day' or 'week'

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchRendezvous())
    }
  }, [status, dispatch])

  const timeSlots = useMemo(() => {
    const slots = []
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push(time)
      }
    }
    return slots
  }, [])

  const getAppointmentsForDate = (date) => {
    return appointments.filter(apt => apt.date === date)
  }

  const getAppointmentAtTime = (date, time) => {
    return appointments.find(apt => apt.date === date && apt.heure === time)
  }

  const getWeekDates = () => {
    const dates = []
    const selected = new Date(selectedDate)
    const startOfWeek = new Date(selected)
    startOfWeek.setDate(selected.getDate() - selected.getDay())
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      dates.push(date.toISOString().split('T')[0])
    }
    return dates
  }

  const weekDates = viewMode === 'week' ? getWeekDates() : [selectedDate]

  const getStatusColor = (etat) => {
    switch (etat) {
      case 'Confirmé': return 'bg-green-100 border-green-500 text-green-800'
      case 'En attente': return 'bg-yellow-100 border-yellow-500 text-yellow-800'
      case 'Annulé': return 'bg-red-100 border-red-500 text-red-800'
      default: return 'bg-gray-100 border-gray-500 text-gray-800'
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-blue-900">Planning & Schedule</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setViewMode('day')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'day'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Day View
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'week'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Week View
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6 flex items-center gap-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => {
                const date = new Date(selectedDate)
                date.setDate(date.getDate() - 1)
                setSelectedDate(date.toISOString().split('T')[0])
              }}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              ← Previous
            </button>
            <button
              onClick={() => {
                const date = new Date(selectedDate)
                date.setDate(date.getDate() + 1)
                setSelectedDate(date.toISOString().split('T')[0])
              }}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Next →
            </button>
            <button
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Today
            </button>
          </div>

          {viewMode === 'day' ? (
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 mb-4 pb-2 border-b font-semibold text-gray-700">
                <div className="col-span-2">Time</div>
                <div className="col-span-10">Appointments</div>
              </div>
              {timeSlots.map((time) => {
                const appointment = getAppointmentAtTime(selectedDate, time)
                return (
                  <div key={time} className="grid grid-cols-12 gap-2 items-center py-2 hover:bg-gray-50 rounded">
                    <div className="col-span-2 text-sm font-medium text-gray-600">{time}</div>
                    <div className="col-span-10">
                      {appointment ? (
                        <div className={`p-3 rounded-lg border-l-4 ${getStatusColor(appointment.etat)}`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold">{appointment.motif || 'No motif'}</div>
                              <div className="text-sm mt-1">Patient ID: {appointment.patientId || 'N/A'}</div>
                              {appointment.notes && (
                                <div className="text-sm mt-1 italic">{appointment.notes}</div>
                              )}
                            </div>
                            <span className="px-2 py-1 rounded text-xs font-medium bg-white/50">
                              {appointment.etat}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-400 text-sm">Available</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="grid grid-cols-8 gap-2 min-w-[800px]">
                <div className="font-semibold text-gray-700 p-2">Time</div>
                {weekDates.map((date) => (
                  <div key={date} className="font-semibold text-gray-700 p-2 text-center border-b">
                    <div className="text-sm">{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div className="text-xs text-gray-500">{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  </div>
                ))}
                {timeSlots.map((time) => (
                  <React.Fragment key={time}>
                    <div className="text-sm font-medium text-gray-600 p-2 border-r">{time}</div>
                    {weekDates.map((date) => {
                      const appointment = getAppointmentAtTime(date, time)
                      return (
                        <div key={`${date}-${time}`} className="p-1 min-h-[60px] border-b border-r">
                          {appointment ? (
                            <div className={`p-2 rounded text-xs border-l-2 ${getStatusColor(appointment.etat)}`}>
                              <div className="font-semibold truncate">{appointment.motif || 'Appointment'}</div>
                              <div className="text-xs mt-1">{appointment.etat}</div>
                            </div>
                          ) : (
                            <div className="text-gray-300 text-xs">—</div>
                          )}
                        </div>
                      )
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>

        {status === 'loading' && (
          <div className="text-center text-gray-600 py-8">Loading appointments...</div>
        )}
      </div>
    </Layout>
  )
}

export default PlanningPage

