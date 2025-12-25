import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  CalendarClock, 
  FileText, 
  CalendarDays, 
  LogOut, 
  Activity,
  ChevronRight
} from 'lucide-react'

const Sidebar = () => {
  const location = useLocation()

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Patients', path: '/patients', icon: Users },
    { name: 'Rendez-vous', path: '/rdv', icon: CalendarClock },
    { name: 'Consultations', path: '/consultations', icon: FileText },
    { name: 'Planning', path: '/planning', icon: CalendarDays },
  ]

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <aside className="group w-20 hover:w-64 bg-slate-900 text-white shadow-2xl flex flex-col min-h-screen z-20 transition-all duration-300 ease-in-out overflow-hidden sticky top-0 h-screen">
      {/* Logo Section */}
      <div className="p-4 flex items-center gap-3 border-b border-slate-800/50 h-20">
        <Link to="/dashboard" className="flex items-center gap-3 w-full">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shrink-0 transition-transform duration-300 group-hover:scale-100">
             <Activity className="w-6 h-6 text-white" />
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 whitespace-nowrap overflow-hidden">
            <h2 className="text-xl font-bold tracking-tight text-white">MedClinic</h2>
            <p className="text-xs text-slate-400 font-medium">Management System</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-3 rounded-xl transition-all duration-300 relative group/link ${
                active
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <div className="min-w-[24px] flex justify-center">
                 <Icon className={`w-6 h-6 transition-all duration-300 ${active ? 'text-white' : 'text-slate-400 group-hover/link:text-white'}`} />
              </div>
              
              <span className={`ml-4 font-medium text-sm tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 transform ${active && 'translate-x-0'} `}>
                {item.name}
              </span>
              
              {active && (
                 <ChevronRight className="w-4 h-4 text-blue-200 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-800/50 bg-slate-900/50">
        <Link
          to="/"
          className="flex items-center px-3 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <div className="min-w-[24px] flex justify-center">
             <LogOut className="w-6 h-6" />
          </div>
          <span className="ml-4 font-medium text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             Back to Home
          </span>
        </Link>
        
        <div className="mt-4 flex items-center gap-3 px-3">
           <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 border border-slate-600 shrink-0">
              DR
           </div>
           <div className="flex-1 min-w-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
              <p className="text-sm font-medium text-white truncate">Dr. Yassin</p>
              <p className="text-xs text-slate-500 truncate">Admin</p>
           </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
